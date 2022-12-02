const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');

const { ERROR_TYPE } = require('../constants/errors');

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
        if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
          next(new BadRequestError());
          return;
        }
        next(err);
      })
      .catch(next);
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateAccessToken(user._id);
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError()));
};
