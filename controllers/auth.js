const bcrypt = require('bcrypt');

const User = require('../models/user')

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
