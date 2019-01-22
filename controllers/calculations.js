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

  var params = {};
  if(req.result != undefined && req.result.user != undefined){
    params.owner = req.result.user._id
  }
  if(req.result != undefined && req.result.store != undefined){
    params.store = req.result.store._id
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

  Calculation
  .aggregate({$match: params})
  //
  .lookup({ from: 'carrotusagelogs', localField: 'carrotUsageLogs', foreignField: '_id', as: 'carrotUsageLogs' })
  .lookup({ from: 'stores', localField: 'store', foreignField: '_id', as: 'store'})
  .unwind('store')
  .project({
    store: { _id: '$store._id', storename: '$store.storename'},
    carrotUsageLogs: 1,
    calculationYear:1,
    calculationMonth:1,
    calculateDue_at: 1,
    calculate_at: 1,
    carrots: {
      $reduce: {
        input: "$carrotUsageLogs",
        initialValue: 0,
        in: { $add: [ "$$value", "$$this.carrots" ] }
      }
    },
  })
  //.find()
  // .populate("carrotUsageLogs")
  // .populate({ path: 'store', select: 'storename' })
  .exec(function(err, calculations) {
    if (err) {
      return next(err);
    } else {
      /*console.log(calculations)*/
     /* console.log(calculations[0].carrotUsageLogs)*/
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
  .populate('store')
  .populate({
    path: 'carrotUsageLogs',
    populate: { path: 'reservation', populate: {path:'program'} }
  })
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
