const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');
const commonError = require('./middlewares/common-error');

const { errors } = require('celebrate');

const { PORT = 5000, DBHost } = config;

const app = express();

mongoose.connect(DBHost, (error) => {
  if (error) throw error.message;

  console.log(`Connected to elevon cloud server ${DBHost}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', authRouter);
app.use(auth);
app.use('/', fileRouter);

app.use(errors());
app.use(commonError);

if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'));
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
