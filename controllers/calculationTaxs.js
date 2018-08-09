var CalculationTax = require('mongoose').model('CalculationTax');
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
  var schema = CalculationTax.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  CalculationTax.find()
  .exec(function(err, calculationTaxs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        calculationTaxs : calculationTaxs
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
  var calculationTax = new CalculationTax(req.body);
  var message = null;

  calculationTax.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        calculationTax : calculationTax
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
  Calculation.findByIdAndUpdate(req.result.calculationTax._id, req.body, function(err, calculationTax) {
    if (err) {
      return next(err);
    } else {
      calculationTax.updated_at = Date.now();
      var result = {
        title : "Calculation Update",
        success : true,
        messages : req.flash('error'),
        calculationTax : calculationTax
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
  .exec(function(err, calculationTax) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Calculation List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        calculationTax : calculationTax
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
  Calculation.findByIdAndUpdate(req.result.calculationTax._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, calculationTax) {
    if (err) {
      return next(err);
    } else {
      calculationTax.updated_at = date;
      var result = {
        title : "Calculation Delete",
        success : true,
        messages : req.flash('error'),
        calculationTax: calculationTax
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
