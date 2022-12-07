const path = require('path');

const Conflict = require('../errors/conflict-error');
const FileService = require('../services/file-service.js');
const File = require('../models/file');

const { ERROR_TYPE } = require('../constants/errors');

module.exports.createDir = async (req, res, next) => {
  try {
    const { name, type, parent } = req.body;
    const file = new File({ name, type, parent, user: req.user._id });
    const parentFile = await File.findOne({ _id: parent });
    if (!parentFile) {
      file.path = name;
      await FileService.createDir(file);
    } else {
      file.path = path.join(parentFile.path, file.name);
      await FileService.createDir(file);
      parentFile.childs.push(file._id);
      await parentFile.save();
    }
    await file.save();
    return res.send(file);
  } catch (error) {
    if (error.name && error.name === ERROR_TYPE.fileExist) {
      next(new Conflict());
      return;
    } else {
      next(error);
    }
  }
};

module.exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find({
      user: req.user._id,
      parent: req.query?.parent,
    });
    return res.send(files);
  } catch (error) {
    next(error);
  }
};
