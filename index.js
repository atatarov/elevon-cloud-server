const config = require('config');
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 5000, DBHost } = config;

const app = express();

mongoose.connect(DBHost, (error) => {
  if (error) throw error.message;

  console.log(`Connected to elevon cloud server ${DBHost}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
