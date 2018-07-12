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
   require('../models/coupon.js');
   require('../models/couponPurchaseLog.js');
   require('../models/carrotUsageLog.js');
   require('../models/notice.js');
   require('../models/header.js');
   require('../models/recommend.js');
   require('../models/event.js');
   require('../models/faq.js');
   
   return db;
}
