const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const { registation } = require('../controllers/auth');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  registation
);

module.exports = router;
