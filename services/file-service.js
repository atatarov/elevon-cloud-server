const fs = require('fs');
const path = require('path');

const { STORAGE_PATH } = require('../settings');
const { ERROR_TYPE } = require('../constants/errors');

const createDir = (file) => {
  const filePath = path.join(STORAGE_PATH, `${file.user}`, file.path);
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

module.exports = { createDir };
