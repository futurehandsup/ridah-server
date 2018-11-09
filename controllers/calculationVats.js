var CalculationVat = require('mongoose').model('CalculationVat');
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
  var schema = CalculationVat.schema.paths;

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

  CalculationVat.find()
  .exec(function(err, calculationVats) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        calculationVats : calculationVats
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
  var calculationVat = new CalculationVat(req.body);
  var message = null;

  calculationVat.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        calculationVat : calculationVat
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
  CalculationVat.findByIdAndUpdate(req.result.calculationVat._id, req.body, function(err, calculationVat) {
    if (err) {
      return next(err);
    } else {
      calculationVat.updated_at = Date.now();
      var result = {
        title : "CalculationVat Update",
        success : true,
        messages : req.flash('error'),
        calculationVat : calculationVat
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
  CalculationVat.findOne({
    _id: id
  })
  .populate('calculationVatWriter')
  .exec(function(err, calculationVat) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "CalculationVat List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        calculationVat : calculationVat
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
  CalculationVat.findByIdAndUpdate(req.result.calculationVat._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, calculationVat) {
    if (err) {
      return next(err);
    } else {
      calculationVat.updated_at = date;
      var result = {
        title : "CalculationVat Delete",
        success : true,
        messages : req.flash('error'),
        calculationVat : calculationVat
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
