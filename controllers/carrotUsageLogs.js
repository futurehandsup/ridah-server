var CarrotUsageLog = require('mongoose').model('CarrotUsageLog');
var Coupon = require('mongoose').model('Coupon');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'CarrotUsageLogID already exists';
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
  var schema = CarrotUsageLog.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.user != undefined){
    params.user = req.result.user._id
  }
  //req.result.user == null
  else if(req.result != undefined && req.result.info == null || req.result.info.role != "Admin"){
    params.user = null;
  }

  CarrotUsageLog.find(params)
  .populate('user', '-salt -provider -password -zzimStores')
  .populate('couponPurchaseLog')
  .populate('reservation')
  .populate({path:'reservation', populate:{ path: 'store', select: 'storename created_at updated_at score'}})
  .populate({path:'reservation', populate:{ path: 'program'}})
  .sort({created_at: -1})
  .exec(function(err, carrotUsageLogs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "이용권 구매 현황",
        success : true,
        messages : req.flash('error'),
        carrotUsageLogs : carrotUsageLogs
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
  var carrotUsageLog = new CarrotUsageLog(req.body);
  var message = null;
  var today = new Date();
  today.setDate(today.getDate() + validFor);
  carrotUsageLog.expireAt = today;
  //console.log(carrotUsageLog.expireAt)

  carrotUsageLog.save(function(err, cpl) {
    if (err) {
      return next(err);
    } else {
      CarrotUsageLog.findById(cpl._id)
      .populate('coupon')
      .exec(function(err, log){
        if(err){return next(err);}
        else{
          var query = {
            $inc : {
              coupons: log.coupon.carrots,
            }
          }
          User.findByIdAndUpdate(carrotUsageLog.user, query, function(err, user){
            if(err){
                return next(err);
            } else {
              var result = {
                title : "이용권 현황",
                //page : 'carrotUsageLogs/list2',
                success : true,
                messages : req.flash('error'),
                carrotUsageLog : carrotUsageLog
              }
              if(req.result == undefined){
                req.result = result;
              }
              else{
                req.result = Object.assign(req.result, result);
              }
              next();
              //return res.redirect('/carrotUsageLogs/list');
            }
          });
        }
      });
    }
  });
};
exports.updateOne = function(req, res, next) {
  CarrotUsageLog.findByIdAndUpdate(req.result.carrotUsageLog._id, req.body, function(err, carrotUsageLog) {
    if (err) {
      return next(err);
    } else {
      carrotUsageLog.updated_at = Date.now();
      var result = {
        title : "CarrotUsageLog Update",
        success : true,
        messages : req.flash('error'),
        carrotUsageLog : carrotUsageLog
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/carrotUsageLogs/detail/'+req.carrotUsageLog._id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  CarrotUsageLog.findOne({
    _id: id
  }, function(err, carrotUsageLog) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "CarrotUsageLog List",
        //page : 'carrotUsageLogs/detail',
        success : true,
        messages : req.flash('error'),
        carrotUsageLog : carrotUsageLog
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
  CarrotUsageLog.findByIdAndUpdate(req.result.carrotUsageLog._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, carrotUsageLog) {
    if (err) {
      return next(err);
    } else {
      carrotUsageLog.updated_at = date;
      var result = {
        title : "CarrotUsageLog Delete",
        success : true,
        messages : req.flash('error'),
        carrotUsageLog : carrotUsageLog
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/carrotUsageLogs/detail/'+req.carrotUsageLog._id);
    }
  });
};
