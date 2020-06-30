process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express_config');

var app = express();

module.exports = app;
