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

  var params = {};

  if(req.result != undefined && req.result.user != undefined){
    params.owner = req.result.user._id
  }
  if(req.result != undefined && req.result.store != undefined){
    params.store = req.result.store._id
  }
  //admin 일때만 전체 조회 가능
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
  if(req.query.until != null && req.query.date_until != ""){ // 날짜 시작
    if(params.reservationDate == null) params.reservationDate = {}
    params.reservationDate.$lte = req.query.date_until
  }

  if(req.query.issue_condition == '미발행'){
    params.status = '미발행'
  }
  if(req.query.issue_condition == '발행신청'){
    params.status = '발행신청'
  }
  if(req.query.issue_condition == '발행대기'){
    params.status = '발행대기'
  }
  if(req.query.issue_condition == '발행완료'){
    params.status = '발행완료'
  }

  if(req.query.report_condition == '미신고'){
    params.status = '미신고'
  }
  if(req.query.report_condition == '신고신청'){
    params.status = '신고신청'
  }
  if(req.query.report_condition == '신고대기'){
    params.status = '신고대기'
  }
  if(req.query.report_condition == '신고완료'){
    params.status = '신고완료'
  }
  CalculationTax.find(params)
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
