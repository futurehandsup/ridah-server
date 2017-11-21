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
    params.owner = req.result.user.id
  }
  if(req.result != undefined && req.result.store != undefined){
    params.store = req.result.store.id
  }
  Reservation.find(params, function(err, reservations) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "예약 현황",
        success : true,
        messages : req.flash('error'),
        reservations : reservations
      }
      req.result = result;
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
      req.result = result;
      next();
      //return res.redirect('/reservations/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Reservation.findByIdAndUpdate(req.result.reservation.id, req.body, function(err, reservation) {
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
      req.result = result;
      next();
      //return res.redirect('/reservations/detail/'+req.reservation.id);
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
      req.result = result;

      return next();
    }
  })
}
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  Reservation.findByIdAndUpdate(req.result.reservation.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, reservation) {
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
      req.result = result;
      next();
      //return res.redirect('/reservations/detail/'+req.reservation.id);
    }
  });
};
