const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { isEmail } = require('validator');

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
        return Promise.reject('User not found');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject('User not found');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
