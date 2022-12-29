process.env.NODE_ENV = 'test';
require('./auth-service');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const should = chai.should();

const { HTTP_RESPONSE } = require('../src/constants/errors');
const { STORAGE_PATH } = require('../settings');
const File = require('../src/models/file');
const server = require('../src/app');
const { TEST_USER_EMAIL } = require('config');
const Token = require('../src/models/token');
const User = require('../src/models/user');

const testUser = {
  name: 'Vasya',
  email: TEST_USER_EMAIL,
  password: 'test-password',
  activationLink: '',
  cookies: null,
};

chai.use(chaiHttp);

describe('Auth', () => {
  // Clear test files before starting
  before(async () => {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.rmSync(STORAGE_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(STORAGE_PATH);
    await User.deleteMany({});
    await File.deleteMany({});
    await Token.deleteMany({});
  });

  describe('POST /signup', () => {
    it('it should POST a user', (done) => {
      const user = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.not.have.property('accessToken');
          res.body.should.not.have.property('refreshToken');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(false);
          done();
        });
    });
  });

  describe('POST /signup', () => {
    it('it should return internal error', (done) => {
      const user = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.conflict.status);
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('It should return forbidden error', (done) => {
      const user = {
        email: testUser.email,
        password: testUser.password,
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.forbidden.status);
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('it should return not found error', (done) => {
      const user = {
        email: testUser.email,
        password: 'random password',
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.notFound.status);
          done();
        });
    });
  });

  describe('GET /activate/link', () => {
    it('it should activate account', (done) => {
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
  });

  describe('POST /signin', () => {
    it('it should login', (done) => {
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
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.have.property('diskSpace');
          res.body.should.have.property('usedSpace');
          res.body.should.have.property('avatar');
          res.body.should.have.property('accessToken');
          res.body.should.not.have.property('refreshToken');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(true);
          testUser.accessToken = res.body.accessToken;
          testUser.refreshToken = res.header['set-cookie'].pop().split(';')[0];
          done();
        });
    });
  });

  describe('GET /refresh', () => {
    it('it should refresh token', (done) => {
      chai
        .request(server)
        .get('/refresh')
        .set('Cookie', testUser.refreshToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('isActivated');
          res.body.should.have.property('diskSpace');
          res.body.should.have.property('usedSpace');
          res.body.should.have.property('avatar');
          res.body.should.have.property('accessToken');
          res.body.should.not.have.property('refreshToken');
          res.body.should.not.have.property('password');
          res.body.isActivated.should.be.eql(true);
          res.body.accessToken.should.not.be.eql(testUser.accessToken);
          testUser.refreshToken = res.header['set-cookie'].pop().split(';')[0];
          done();
        });
    });
  });

  describe('GET /signout', () => {
    it('it should sign out', (done) => {
      chai
        .request(server)
        .post('/signout')
        .set('Cookie', testUser.refreshToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET /refresh', () => {
    it('it should return unauthorized there is trying to refresh token after logout', (done) => {
      chai
        .request(server)
        .get('/refresh')
        .set('Cookie', testUser.refreshToken)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.unauthorized.status);
          done();
        });
    });
  });
});
