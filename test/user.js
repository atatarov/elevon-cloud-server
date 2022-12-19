process.env.NODE_ENV = 'test';
require('./auth');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const should = chai.should();

const { TOKEN_TYPE } = require('../constants/constants');
const server = require('../index');
const { STORAGE_PATH, STATIC_PATH } = require('../settings');
const User = require('../models/user');

chai.use(chaiHttp);

const userEmail = 'anothertestmail@gmail.com';
const userPassword = '1234567890';
const testAvatarName = 'test-avatar.jpg';
const testAvatarPath = path.join(__dirname, 'src', testAvatarName);
let token = '';

const user = {
  email: userEmail,
  password: userPassword,
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
  });

  before((done) => {
    chai
      .request(server)
      .post('/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  before((done) => {
    chai
      .request(server)
      .post('/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.token;
        done();
      });
  });

  describe('GET /user/me', () => {
    it('It should get current user', (done) => {
      chai
        .request(server)
        .get('/user/me')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
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
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .attach('file', testAvatarPath)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
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
