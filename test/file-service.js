process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const fs = require('fs');

const FileService = require('../services/file-service.js');

const { ERROR_TYPE } = require('../constants/errors');
const { STORAGE_PATH } = require('../settings');

describe('File Service', () => {
  // Clear test files before starting
  before((done) => {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.rmSync(STORAGE_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(STORAGE_PATH);
    done();
  });

  describe('Test create dir', () => {
    const file = {
      user: 'Test user',
      path: '',
    };

    it('it should create a new dir', (done) => {
      FileService.createDir(file)
        .then((res) => {
          res.should.be.a('object');
          res.should.have.property('message');
          res.message.should.be.eql('File was created');
          done();
        })
        .catch((err) => done(err));
    });

    it('it should reject creating is already existed dir', (done) => {
      FileService.createDir(file)
        .then()
        .catch((err) => {
          err.should.be.a('object');
          err.should.have.property('name');
          err.name.should.be.eql(ERROR_TYPE.fileExist);
          done();
        });
    });

    it('it should reject creating incorrect dir', (done) => {
      const file = {
        user: 'Test user',
        path: `%#@?$=`,
      };
      FileService.createDir(file)
        .then()
        .catch((err) => {
          err.should.be.a('object');
          err.should.have.property('name');
          err.name.should.be.eql(ERROR_TYPE.internal);
          done();
        });
    });
  });
});
