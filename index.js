const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
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

app.use(errors());
app.use(commonError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
