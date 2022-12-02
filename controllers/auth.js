const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const SECRET_KEY = 'secret-key';

const generateAccessToken = (_id) => {
  const payload = { _id };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: 36000,
  });
};

module.exports.registation = (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
    })
      .then((user) =>
        res.send({
          _id: user._id,
          email: user.email,
        })
      )
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateAccessToken(user._id);
      res.send({ token });
    })
    .catch((err) => console.log(err));
};
