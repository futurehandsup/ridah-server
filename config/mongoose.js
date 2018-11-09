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
   require('../models/noticeOwner.js');
   require('../models/header.js');
   require('../models/recommend.js');
   require('../models/event.js');
   require('../models/faq.js');
   require('../models/calculation.js');
   require('../models/calculationInfo.js');
   require('../models/calculationTax.js');
   require('../models/calculationVat.js');
   require('../models/reservation.js');
   require('../models/reservationCancel.js');
   require('../models/reservationUsage.js');
   require('../models/publicData.js');
   
   return db;
}
