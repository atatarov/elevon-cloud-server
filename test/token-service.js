process.env.NODE_ENV = 'test';
require('./file-service');

const chai = require('chai');
const fs = require('fs');
const should = chai.should();

const { STORAGE_PATH } = require('../src/settings');
const Token = require('../src/models/token');
const TokenService = require('../src/services/token-service');
const User = require('../src/models/user');

const testUser = {
  name: 'Vasya',
  email: 'somemail@mail.ru',
  password: 'random-password',
  refreshToken: null,
  accessToken: null,
};

describe('Token Service', () => {
  // Clear test files before starting
  before(async () => {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.rmSync(STORAGE_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(STORAGE_PATH);
    await User.deleteMany({});
    await Token.deleteMany({});

    const userData = await User.create({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    });

    testUser.id = userData._id;
  });

  it('it should generate tokens', (done) => {
    const tokens = TokenService.generateTokens({ id: testUser.id });
    testUser.accessToken = tokens.accessToken;
    testUser.refreshToken = tokens.refreshToken;
    done();
  });

  it('it should save refresh token', (done) => {
    TokenService.saveRefreshToken(testUser.id, testUser.refreshToken)
      .then(() => done())
      .catch((error) => done(error));
  });

  it('it should validate refresh token', (done) => {
    const userData = TokenService.validateRefreshToken(testUser.refreshToken);
    userData.id.should.be.eql(testUser.id.toString());
    done();
  });

  it('it should validate access token', (done) => {
    const userData = TokenService.validateAccessToken(testUser.accessToken);
    userData.id.should.be.eql(testUser.id.toString());
    done();
  });

  it('it should test find token', (done) => {
    TokenService.findToken(testUser.refreshToken)
      .then((tokenData) => {
        tokenData.user.should.be.eql(testUser.id);
        done();
      })
      .catch((error) => done(error));
  });
});
