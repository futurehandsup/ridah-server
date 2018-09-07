var Calculation = require('mongoose').model('Calculation');
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
  var schema = Calculation.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){

  var param = {};

   if(req.result != undefined && req.result.store==undefined && req.result.user==undefined){
    if(req.result.info == null || req.result.info.role != "Admin"){
      params.store = null;
      params.owner = null;
    }
  }

  //검색조건 설정
  if(req.query.date_from != null && req.query.date_from != ""){ // 날짜 시작
  
    if(params.reservationDate == null) params.reservationDate = {}
    params.reservationDate.$gte = req.query.date_from //최소값
  }

  //검색조건 설정
  if(req.query.until != null && req.query.date_until != ""){ // 날짜 끝
    if(params.reservationDate == null) params.reservationDate = {}
    params.reservationDate.$lte = req.query.date_until 
  }

  Calculation.find()
  .exec(function(err, calculations) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        calculations : calculations
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
  var calculation = new Calculation(req.body);
  var message = null;

  calculation.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        calculation : calculation
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
  Calculation.findByIdAndUpdate(req.result.calculation._id, req.body, function(err, calculation) {
    if (err) {
      return next(err);
    } else {
      calculation.updated_at = Date.now();
      var result = {
        title : "Calculation Update",
        success : true,
        messages : req.flash('error'),
        calculation : calculation
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
  .populate('calculationWriter')
  .exec(function(err, calculation) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Calculation List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        calculation : calculation
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
  Calculation.findByIdAndUpdate(req.result.calculation._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, calculation) {
    if (err) {
      return next(err);
    } else {
      calculation.updated_at = date;
      var result = {
        title : "Calculation Delete",
        success : true,
        messages : req.flash('error'),
        calculation : calculation
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
