var CouponPurchaseLog = require('mongoose').model('CouponPurchaseLog');
var Coupon = require('mongoose').model('Coupon');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'CouponPurchaseLogID already exists';
        break;
      default:
        message = 'Something went Wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].
      message;
    }
  }
  return message;
};

exports.getSchemas = function(req, res, next){
  var schema = CouponPurchaseLog.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.user != undefined){
    params.user = req.result.user.id
  }

  CouponPurchaseLog.find(params)
  .populate('user')
  .populate('coupon')
  .exec(function(err, couponPurchaseLogs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "이용권 구매 현황",
        success : true,
        messages : req.flash('error'),
        couponPurchaseLogs : couponPurchaseLogs
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
    }
  })
}
exports.registerOne = function(req, res, next) {
  var validFor = parseInt(req.body.validFor);
  req.body.validFor = undefined;
  var couponPurchaseLog = new CouponPurchaseLog(req.body);
  var message = null;
  var today = new Date();
  today.setDate(today.getDate() + validFor);
  couponPurchaseLog.expireAt = today;
  console.log(couponPurchaseLog.expireAt)

  couponPurchaseLog.save(function(err, cpl) {
    if (err) {
      return next(err);
    } else {
      CouponPurchaseLog.findById(cpl.id)
      .populate('coupon')
      .exec(function(err, log){
        if(err){return next(err);}
        else{
          var query = {
            $inc : {
              coupons: log.coupon.carrots,
            }
          }
          User.findByIdAndUpdate(couponPurchaseLog.user, query, function(err, user){
            if(err){
                return next(err);
            } else {
              var result = {
                title : "이용권 현황",
                //page : 'couponPurchaseLogs/list2',
                success : true,
                messages : req.flash('error'),
                couponPurchaseLog : couponPurchaseLog
              }
              if(req.result == undefined){
                req.result = result;
              }
              else{
                req.result = Object.assign(req.result, result);
              }
              next();
              //return res.redirect('/couponPurchaseLogs/list');
            }
          });
        }
      });
    }
  });
};
exports.updateOne = function(req, res, next) {
  CouponPurchaseLog.findByIdAndUpdate(req.result.couponPurchaseLog.id, req.body, function(err, couponPurchaseLog) {
    if (err) {
      return next(err);
    } else {
      couponPurchaseLog.updated_at = Date.now();
      var result = {
        title : "CouponPurchaseLog Update",
        success : true,
        messages : req.flash('error'),
        couponPurchaseLog : couponPurchaseLog
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/couponPurchaseLogs/detail/'+req.couponPurchaseLog.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  CouponPurchaseLog.findOne({
    _id: id
  }, function(err, couponPurchaseLog) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "CouponPurchaseLog List",
        //page : 'couponPurchaseLogs/detail',
        success : true,
        messages : req.flash('error'),
        couponPurchaseLog : couponPurchaseLog
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }

      return next();
    }
  })
}
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  CouponPurchaseLog.findByIdAndUpdate(req.result.couponPurchaseLog.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, couponPurchaseLog) {
    if (err) {
      return next(err);
    } else {
      couponPurchaseLog.updated_at = date;
      var result = {
        title : "CouponPurchaseLog Delete",
        success : true,
        messages : req.flash('error'),
        couponPurchaseLog : couponPurchaseLog
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/couponPurchaseLogs/detail/'+req.couponPurchaseLog.id);
    }
  });
};
