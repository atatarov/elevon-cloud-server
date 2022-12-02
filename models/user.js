const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { isEmail } = require('validator');

const NotFoundError = require('../errors/not-found-error');

const { HTTP_RESPONSE } = require('../constants/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return isEmail(value);
      },
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  diskSpace: {
    type: Number,
    default: 1024 * 7 * 10,
  },
  usedSpace: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: '',
  },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'file' }],
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotFoundError(HTTP_RESPONSE.notFound.message)
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotFoundError(HTTP_RESPONSE.notFound.message)
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
