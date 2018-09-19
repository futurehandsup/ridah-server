var CalculationInfo = require('mongoose').model('CalculationInfo');
var Store = require('mongoose').model('Store');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'StoreID already exists';
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
  var schema = CalculationInfo.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  CalculationInfo.find()
  .exec(function(err, calculationInfos) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        calculationInfos : calculationInfos
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
  var calculationInfo = new CalculationInfo(req.body);
  var message = null;

  calculationInfo.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        calculationInfo : calculationInfo
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/stores/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Calculation.findByIdAndUpdate(req.result.calculationInfo._id, req.body, function(err, calculationInfo) {
    if (err) {
      return next(err);
    } else {
      calculationInfo.updated_at = Date.now();
      var result = {
        title : "Calculation Update",
        success : true,
        messages : req.flash('error'),
        calculationInfo : calculationInfo
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/stores/detail/'+req.store._id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Calculation.findOne({
    _id: id
  })
  .exec(function(err, calculationInfo) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Calculation List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        calculationInfo : calculationInfo
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
  Calculation.findByIdAndUpdate(req.result.calculationInfo._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, calculationInfo) {
    if (err) {
      return next(err);
    } else {
      calculationInfo.updated_at = date;
      var result = {
        title : "Calculation Delete",
        success : true,
        messages : req.flash('error'),
        calculationInfo: calculationInfo
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/stores/detail/'+req.store._id);
    }
  });
};
