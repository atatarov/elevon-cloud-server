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

    const user = await User.findById(req.user.id);
    user.avatar = avatarName;
    await user.save();
    return res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      diskSpace: user.diskSpace,
      usedSpace: user.usedSpace,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  const { id } = req.user;
  User.findById(id)
    .then((user) => {
      res.send({
        id: user._id,
        name: user.name,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      });
    })
    .catch(next);
};
