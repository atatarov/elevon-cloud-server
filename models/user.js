const { isEmail } = require('validator');

const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);
