var config = require('./config'),
     mongoose = require('mongoose');

module.exports = function() {
   var db = mongoose.connect(config.db);

   require('../models/user.js');
   require('../models/store.js');
   require('../models/review.js');
   return db;
}
