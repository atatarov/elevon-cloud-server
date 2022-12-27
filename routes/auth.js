const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  activateAccount,
  login,
  logout,
  registration,
  refreshAccessToken,
} = require('../controllers/auth');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  registration
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.post('/signout', logout);

router.get('/activate/:link', activateAccount);

router.get('/refresh', refreshAccessToken);

module.exports = router;
