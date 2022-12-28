const bodyParser = require('body-parser');
const config = require('config');
const cookies = require("cookie-parser");
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const commonError = require('./middlewares/common-error');
const fileRouter = require('./routes/file');
const userRouter = require('./routes/user');

const { cors } = require('./middlewares/cors');
const { PORT = 5000, DBHost, STATIC_DIR_NAME } = config;
const { STORAGE_PATH } = require('./settings');

const initStorage = () => {
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH);
  }
  if (!fs.existsSync(STATIC_DIR_NAME)) {
    fs.mkdirSync(STATIC_DIR_NAME);
  }
};

const app = express();

mongoose.connect(DBHost, (error) => {
  if (error) throw error.message;

  console.log(`Connected to elevon cloud server ${DBHost}`);
});

initStorage();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookies());
app.use(fileUpload({}));
app.use(express.static(STATIC_DIR_NAME));
app.use(cors);
app.use('/', authRouter);
app.use(auth);
app.use('/', fileRouter);
app.use('/', userRouter);

app.use(errors());
app.use(commonError);

if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'));
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
