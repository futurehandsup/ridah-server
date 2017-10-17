process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express_config'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(8080);
module.exports = app;

console.log('Server running at localhost');
