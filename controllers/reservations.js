var Reservation = require('mongoose').model('Reservation');
var Program = require('mongoose').model('Program');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'ReservationID already exists';
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
  var schema = Reservation.schema.paths;

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
  Reservation.find(params)
  .populate('store')
  .populate('owner')
  .populate('program')
  .exec(function(err, reservations) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "예약 현황",
        success : true,
        messages : req.flash('error'),
        reservations : reservations
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
  var reservation = new Reservation(req.body);
  var message = null;

  reservation.save(function(err) {
    if (err) {
      return next(err);
    } else {
      Program.findById(reservation.program, function (err, program){
        if(err) return next(err);
        program.reservations.push(reservation);
        program.save();
      });
      var result = {
        title : "사용자 현황",
        //page : 'reservations/list2',
        success : true,
        messages : req.flash('error'),
        reservation : reservation
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/reservations/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Reservation.findByIdAndUpdate(req.result.reservation._id, req.body, function(err, reservation) {
    if (err) {
      return next(err);
    } else {
      reservation.updated_at = Date.now();
      var result = {
        title : "Reservation Update",
        success : true,
        messages : req.flash('error'),
        reservation : reservation
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/reservations/detail/'+req.reservation._id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Reservation.findOne({
    _id: id
  }, function(err, reservation) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Reservation List",
        //page : 'reservations/detail',
        success : true,
        messages : req.flash('error'),
        reservation : reservation
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
  Reservation.findByIdAndUpdate(req.result.reservation._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, reservation) {
    if (err) {
      return next(err);
    } else {
      reservation.updated_at = date;
      var result = {
        title : "Reservation Delete",
        success : true,
        messages : req.flash('error'),
        reservation : reservation
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/reservations/detail/'+req.reservation._id);
    }
  });
};
