var Coupon = require('mongoose').model('Coupon');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'CouponID already exists';
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
  var schema = Coupon.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  Coupon.find(function(err, coupons) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "이용권 현황",
        success : true,
        messages : req.flash('error'),
        coupons : coupons
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
  var coupon = new Coupon(req.body);
  var message = null;

  coupon.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        //page : 'coupons/list2',
        success : true,
        messages : req.flash('error'),
        coupon : coupon
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/coupons/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Coupon.findByIdAndUpdate(req.result.coupon.id, req.body, function(err, coupon) {
    if (err) {
      return next(err);
    } else {
      coupon.updated_at = Date.now();
      var result = {
        title : "Coupon Update",
        success : true,
        messages : req.flash('error'),
        coupon : coupon
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/coupons/detail/'+req.coupon.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Coupon.findOne({
    _id: id
  }, function(err, coupon) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Coupon List",
        //page : 'coupons/detail',
        success : true,
        messages : req.flash('error'),
        coupon : coupon
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
  Coupon.findByIdAndUpdate(req.result.coupon.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, coupon) {
    if (err) {
      return next(err);
    } else {
      coupon.updated_at = date;
      var result = {
        title : "Coupon Delete",
        success : true,
        messages : req.flash('error'),
        coupon : coupon
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/coupons/detail/'+req.coupon.id);
    }
  });
};
