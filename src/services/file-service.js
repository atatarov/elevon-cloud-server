const fs = require('fs');
const path = require('path');

const { STORAGE_PATH } = require('../../settings');
const { ERROR_TYPE } = require('../constants/errors');

const getFilePath = (file) => {
  return path.join(STORAGE_PATH, `${file.user}`, file.path);
};

const createDir = (file) => {
  const filePath = getFilePath(file);

  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        return resolve({ message: 'File was created' });
      } else {
        return reject({
          name: ERROR_TYPE.fileExist,
        });
      }
    } catch (error) {
      return reject({ name: ERROR_TYPE.internal });
    }
  });
};

const deleteFile = (file) => {
  const filePath = getFilePath(file);

  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        return reject({
          name: ERROR_TYPE.notFound,
        });
      }
      fs.rmSync(filePath, { recursive: true, force: true });
      return resolve({ message: 'File was removed' });
    } catch (error) {
      return reject({ name: ERROR_TYPE.internal });
    }
  });
};

module.exports = { createDir, deleteFile };
