process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const path = require('path');

const FileService = require('../services/file-service.js');

const { ERROR_TYPE } = require('../constants/errors');
const { STORAGE_PATH } = require('../settings');

const testUserDir = {
  user: 'Jonh Doe',
  path: '',
};

const testFolder = {
  user: testUserDir.user,
  path: path.join(testUserDir.path, 'test folder'),
};

const testFile = {
  user: testUserDir.user,
  path: path.join(testUserDir.path, 'test file'),
};

const touch = (file) => {
  const filePath = path.join(STORAGE_PATH, file.user, file.path);
  fs.closeSync(fs.openSync(filePath, 'w'));
};

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
    it('it should create a new dir', (done) => {
      FileService.createDir(testUserDir)
        .then((res) => {
          res.should.be.a('object');
          res.should.have.property('message');
          res.message.should.be.eql('File was created');
          done();
        })
        .catch((err) => done(err));
    });

    it('it should reject creating is already existed dir', (done) => {
      FileService.createDir(testUserDir)
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

  describe('Test deletefile', () => {
    before(async () => {
      await FileService.createDir(testFolder);
      touch(testFile);
    });

    it('it should remove testFolder', (done) => {
      FileService.deleteFile(testFolder)
        .then((res) => {
          res.should.be.a('object');
          res.should.have.property('message');
          res.message.should.be.eql('File was removed');
          done();
        })
        .catch((err) => done(err));
    });

    it('it should remove testFile', (done) => {
      FileService.deleteFile(testFile)
        .then((res) => {
          res.should.be.a('object');
          res.should.have.property('message');
          res.message.should.be.eql('File was removed');
          done();
        })
        .catch((err) => done(err));
    });

    it('it should reject removing is not existed folder', (done) => {
      FileService.deleteFile(testFolder)
        .then()
        .catch((err) => {
          err.should.be.a('object');
          err.should.have.property('name');
          err.name.should.be.eql(ERROR_TYPE.notFound);
          done();
        });
    });
  });
});
