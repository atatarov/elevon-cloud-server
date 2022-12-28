process.env.NODE_ENV = 'test';
require('./token-service');

const chai = require('chai');
const fs = require('fs');
const should = chai.should();

const AuthService = require('../src/services/auth-service');
const File = require('../src/models/file');
const { HTTP_RESPONSE } = require('../src/constants/errors');
const { STORAGE_PATH } = require('../src/settings');
const { TEST_USER_EMAIL } = require('config');
const Token = require('../src/models/token');
const User = require('../src/models/user');

const testUser = {
  name: 'Vasya',
  email: TEST_USER_EMAIL,
  password: 'test-password',
};

describe('Auth Service', () => {
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

  describe('Registration', () => {
    it('it should test registration', (done) => {
      AuthService.registration(testUser.name, testUser.email, testUser.password)
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.not.have.property('accessToken');
          userData.should.not.have.property('refreshToken');
          userData.should.not.have.property('password');
          userData.isActivated.should.be.eql(false);
          done();
        })
        .catch((err) => done(err));
    });

    it('it should return user exist error', (done) => {
      AuthService.registration(testUser.name, testUser.email, testUser.password)
        .then()
        .catch((error) => {
          error.message.should.be.eql(
            HTTP_RESPONSE.conflict.absentMessage.userExist
          );
          done();
        });
    });
  });

  describe('Activate account', () => {
    it('it should return error after trying signin without account activation', (done) => {
      AuthService.login(testUser.email, testUser.password)
        .then()
        .catch((error) => {
          error.message.should.be.eql(
            HTTP_RESPONSE.forbidden.absentMessage.noActivation
          );
          done();
        });
    });

    it('it should test activation link', async () => {
      const { activationLink } = await User.findOne({ email: testUser.email });

      const userData = await AuthService.activateAccount(activationLink);

      userData.should.have.property('isActivated');
      userData.isActivated.should.be.eql(true);
    });

    it('it should test the activation link was used', async () => {
      const { activationLink } = await User.findOne({ email: testUser.email });
      activationLink.should.be.eql('');
    });
  });

  describe('Login', () => {
    it('it should test login', (done) => {
      AuthService.login(testUser.email, testUser.password)
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.have.property('diskSpace');
          userData.should.have.property('usedSpace');
          userData.should.have.property('avatar');
          userData.should.have.property('accessToken');
          userData.should.have.property('refreshToken');
          userData.should.not.have.property('password');
          userData.isActivated.should.be.eql(true);
          testUser.refreshToken = userData.refreshToken;
          done();
        })
        .catch((err) => done(err));
    });

    it('it should return not found error', (done) => {
      AuthService.login('fakeemail@mail.ru', testUser.password)
        .then()
        .catch((error) => {
          error.message.should.be.eql(HTTP_RESPONSE.notFound.message);
          done();
        });
    });
  });

  describe('Refresh token', () => {
    it('it should test refresh token', (done) => {
      AuthService.refreshToken(testUser.refreshToken)
        .then((userData) => {
          userData.should.have.property('id');
          userData.should.have.property('name');
          userData.should.have.property('email');
          userData.should.have.property('isActivated');
          userData.should.have.property('diskSpace');
          userData.should.have.property('usedSpace');
          userData.should.have.property('avatar');
          userData.should.have.property('accessToken');
          userData.should.have.property('refreshToken');
          userData.should.not.have.property('password');
          done();
        })
        .catch((err) => done(err));
    });
  });
  describe('Logout', () => {
    it('it should test logout', (done) => {
      AuthService.logout(testUser.refreshToken)
        .then((isSuccess) => {
          isSuccess.should.be.eql(true);
          done();
        })
        .catch((err) => done(err));
    });
  });
  describe('Refresh token after logout', () => {
    it('it should return unauthorized error', (done) => {
      AuthService.refreshToken(testUser.refreshToken)
        .then()
        .catch((error) => {
          error.message.should.be.eql(HTTP_RESPONSE.unauthorized.message);
          done();
        });
    });
  });
});
