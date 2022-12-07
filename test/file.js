process.env.NODE_ENV = 'test';
require('./auth');

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require('../index');
const should = chai.should();

const { HTTP_RESPONSE } = require('../constants/errors');
const { TOKEN_TYPE } = require('../constants/constants');
const { STORAGE_PATH } = require('../settings');
const File = require('../models/file');
const User = require('../models/user');

const userEmail = 'anothertestmail@gmail.com';
const userPassword = '1234567890';
let token = '';
let secondFolderId = '';

chai.use(chaiHttp);

describe('File', () => {
  // Clear test files before starting
  before(async () => {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.rmSync(STORAGE_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(STORAGE_PATH);
    await User.deleteMany({});
    await File.deleteMany({});
  });

  before((done) => {
    const user = {
      email: userEmail,
      password: userPassword,
    };
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
        token = res.body.token;
        done();
      });
  });

  describe('POST /mkdir', () => {
    it('It should create a folder', (done) => {
      const file = {
        name: 'My first folder',
        type: 'dir',
      };
      chai
        .request(server)
        .post('/mkdir')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .send(file)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('type');
          res.body.should.have.property('size');
          res.body.should.have.property('path');
          res.body.should.have.property('user');
          res.body.should.have.property('childs');
          done();
        });
    });
  });

  describe('POST /mkdir', () => {
    it('It should return a conflict error', (done) => {
      const file = {
        name: 'My first folder',
        type: 'dir',
      };
      chai
        .request(server)
        .post('/mkdir')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .send(file)
        .end((err, res) => {
          res.should.have.status(HTTP_RESPONSE.conflict.status);
          done();
        });
    });
  });

  describe('POST /mkdir', () => {
    it('It should create a second folder', (done) => {
      const file = {
        name: 'My second folder',
        type: 'dir',
      };
      chai
        .request(server)
        .post('/mkdir')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .send(file)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('type');
          res.body.should.have.property('size');
          res.body.should.have.property('path');
          res.body.should.have.property('user');
          res.body.should.have.property('childs');
          secondFolderId = res.body._id;
          done();
        });
    });
  });

  describe('POST /mkdir', () => {
    it('It should create a subfolder in the second folder', (done) => {
      const file = {
        name: 'My subfolder',
        type: 'dir',
        parent: secondFolderId,
      };
      chai
        .request(server)
        .post('/mkdir')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .send(file)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('type');
          res.body.should.have.property('size');
          res.body.should.have.property('path');
          res.body.should.have.property('user');
          res.body.should.have.property('childs');
          res.body.should.have.property('parent');
          done();
        });
    });
  });

  describe('GET /files', () => {
    it('It should get files without parent, e.g. root folder list', (done) => {
      chai
        .request(server)
        .get('/files')
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });

  describe('GET /files', () => {
    it('It should get subfolder from the second folder', (done) => {
      chai
        .request(server)
        .get('/files')
        .query({ parent: secondFolderId })
        .set('authorization', `${TOKEN_TYPE}${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(1);
          done();
        });
    });
  });
});
