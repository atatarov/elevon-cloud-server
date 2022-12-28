const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  accessLink: { type: String },
  size: {
    type: Number,
    default: 0,
  },
  path: {
    type: String,
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'file',
  },
  childs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'file',
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('file', fileSchema);
