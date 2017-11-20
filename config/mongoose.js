var config = require('./config'),
     mongoose = require('mongoose');

module.exports = function() {
   var db = mongoose.connect(config.db);

   require('../models/user.js');
   require('../models/store.js');
   require('../models/review.js');
   require('../models/qna.js');
   require('../models/program.js');
   require('../models/reservation.js');
   return db;
}
