process.env.NODE_ENV = 'test';
require('./file-service');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require('../app');
const should = chai.should();

const { HTTP_RESPONSE } = require('../constants/errors');
const { STORAGE_PATH } = require('../settings');
const File = require('../models/file');
const User = require('../models/user');

const userEmail = 'anothertestmail@gmail.com';
const userPassword = '1234567890';
const userName = 'Vasya';

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
  });

  describe('POST /signup', () => {
    it('it should POST a user', (done) => {
      const user = {
        name: userName,
        email: userEmail,
        password: userPassword,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.not.have.property('password');
          done();
        });
    });
  });

  describe('POST /signup', () => {
    it('it should return internal error', (done) => {
      const user = {
        email: userEmail,
        password: userPassword,
      };
      chai
        .request(server)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.internalError.status);
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('sign in', (done) => {
      const user = {
        email: userEmail,
        password: userPassword,
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.not.have.property('password');
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('it should return unauthorized error', (done) => {
      const user = {
        email: userEmail,
        password: 'random password',
      };
      chai
        .request(server)
        .post('/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.unauthorized.status);
          done();
        });
    });
  });
});
