const path = require('path');
const config = require('config');

const { STORAGE_NAME } = config;

const STORAGE_PATH = path.join(__dirname, STORAGE_NAME);

module.exports = { STORAGE_PATH };
