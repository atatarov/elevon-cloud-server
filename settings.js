const config = require('config');
const path = require('path');

const { STORAGE_NAME, STATIC_DIR_NAME } = config;

const STATIC_PATH = path.join(__dirname, STATIC_DIR_NAME);

const STORAGE_PATH = path.join(__dirname, STORAGE_NAME);

module.exports = { STORAGE_PATH, STATIC_PATH };
