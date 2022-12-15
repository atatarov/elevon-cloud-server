const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  createDir,
  getFiles,
  uploadFile,
  download,
} = require('../controllers/file');

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

router.get(
  '/files',
  celebrate({
    query: Joi.object().keys({
      parent: Joi.string().hex().length(24),
    }),
  }),
  getFiles
);

router.post(
  '/files/upload',
  celebrate({
    body: Joi.object().keys({
      parent: Joi.string().hex().length(24),
    }),
  }),
  uploadFile
);

router.get(
  '/files/download/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  download
);

module.exports = router;
