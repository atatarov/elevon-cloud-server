const path = require('path');
const Uuid = require('uuid');

const User = require('../models/user');
const { STATIC_PATH } = require('../settings');

module.exports.uploadAvatar = async (req, res, next) => {
  try {
    const file = req.files.file;

    const mimeType = file.name.split('.').pop();
    const avatarName = `${Uuid.v4()}.${mimeType}`;
    const filePath = path.join(STATIC_PATH, avatarName);
    file.mv(filePath);

    const user = await User.findById(req.user._id);
    user.avatar = avatarName;
    await user.save();
    return res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
