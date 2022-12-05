const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const { createDir } = require('../controllers/file');

router.post(
  '/mkdir',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      type: Joi.string().required(),
      parent: Joi.string().hex().length(24),
    }),
  }),
  createDir
);

module.exports = router;
