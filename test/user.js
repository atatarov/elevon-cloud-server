process.env.NODE_ENV = 'test';
require('./auth');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const should = chai.should();

const { TOKEN_TYPE } = require('../src/constants/constants');
const server = require('../app');
const { STORAGE_PATH, STATIC_PATH } = require('../settings');
const { TEST_USER_EMAIL } = require('config');
const Token = require('../src/models/token');
const User = require('../src/models/user');

chai.use(chaiHttp);

const testAvatarName = 'test-avatar.jpg';
const testAvatarPath = path.join(__dirname, 'src', testAvatarName);

const testUser = {
  name: 'Vasya',
  email: TEST_USER_EMAIL,
  password: 'test-password',
};

describe('User', () => {
  // Clear test files before starting
  before(async () => {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.rmSync(STORAGE_PATH, { recursive: true, force: true });
    }
    if (fs.existsSync(STATIC_PATH)) {
      fs.rmSync(STATIC_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(STORAGE_PATH);
    fs.mkdirSync(STATIC_PATH);
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  before((done) => {
    chai
      .request(server)
      .post('/signup')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  before((done) => {
    User.findOne({ email: testUser.email }).then((user) => {
      const { activationLink } = user;
      chai
        .request(server)
        .get(`/activate/${activationLink}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  before((done) => {
    const user = {
      email: testUser.email,
      password: testUser.password,
    };
    chai
      .request(server)
      .post('/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        testUser.accessToken = res.body.accessToken;
        done();
      });
  });

  describe('GET /user/me', () => {
    it('It should get current user', (done) => {
      chai
        .request(server)
        .get('/user/me')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
          res.body.should.have.property('diskSpace');
          res.body.should.have.property('usedSpace');
          res.body.should.have.property('avatar');
          done();
        });
    });
  });

  describe('POST /user/me/avatar', () => {
    it('It should test upload avatar', (done) => {
      chai
        .request(server)
        .post('/user/me/avatar')
        .set('authorization', `${TOKEN_TYPE}${testUser.accessToken}`)
        .attach('file', testAvatarPath)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
          res.body.should.have.property('diskSpace');
          res.body.should.have.property('usedSpace');
          res.body.should.have.property('avatar');
          done();
        });
    });
  });
});
