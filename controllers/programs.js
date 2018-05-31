var Program = require('mongoose').model('Program');
var Reservation = require('mongoose').model('Reservation');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'ProgramID already exists';
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
  var schema = Program.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.store != undefined){
    params.store = req.result.store._id
  }
  else if(req.result.info.role != "Admin"){
    params.store = null;
  }
  var populateParams = {};
  if(req.query.start != undefined){
    populateParams.$gte = new Date(req.query.start);
  }else{
    populateParams.$gte = new Date();
  }
  if(req.query.end != undefined){
    populateParams.$lte = new Date(req.query.end);
  }else{
    populateParams.$lte = new Date();
  }

  Program.find(params)
  .sort({'time' : 1})
  .populate({
    path: 'reservations',
    match: { reservationDate : populateParams},
  })
  .exec(function(err, programs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "프로그램 현황",
        success : true,
        messages : req.flash('error'),
        programs : programs
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
    }
  });
}
exports.getReservationsList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.store != undefined){
    params.store = req.result.store._id;
  }
  var type = (req.query.type != undefined) ? req.query.type : "daily";
  var dateStringToday = (new Date()).toLocaleDateString("ko-KR")
  var date = (req.query.date != undefined) ? new Date(req.query.date) : new Date(dateStringToday) ; //오늘로

  var populateParams = {};
  var date_start, date_end;
  date_start = new Date(date);
  date_end = new Date(date);
  var n = 1;

  if(type == "daily"){
    //date_start.setDate(date.getDate());
    date_end.setDate(date_end.getDate()+1)
    date_end.setTime(date_end.getTime()-1);
  }else if(type=="weekly"){
    n = 7;
    var diff = date.getDay();
    date_start.setDate(date.getDate()-diff+1);
    date_end.setDate(date_start.getDate()+(n-1));
  }else if(type=="monthly"){
    var tmp_date = new Date(date);
    tmp_date.setDate(1);
    tmp_date.setMonth(tmp_date.getMonth()+1);
    tmp_date.setDate(tmp_date.getDate()-1);
    n = tmp_date.getDate();

    var diff = date.getDate()-1;
    date_start.setDate(date.getDate()-diff);
    date_end.setDate(date_start.getDate()+(n-1));
  }

  populateParams.$gte = date_start;
  populateParams.$lte = date_end;

  var calendar = {
    type : type,
    date : date,
    schedules : new Array()
  }
  Program.find(params) // Program.find({store: ($StoreID) })
  .sort({'time' : 1})
  .select('programname time carrots created_at updated_at')
  .exec(function(err, programs) {
    if (err) {
      return next(err);
    } else {
      params.reservationDate = {
        $gte : date_start,
        $lte : date_end
      };

      Reservation.aggregate([
        {
          $group: {
            _id : { date: "$reservationDate" , store: '$store' },
            store : { $first : "$store"},
            reservationDate : { $first : "$reservationDate"},
            //reservations : {$push: "$$ROOT"},
            programs: { $push : "$program" }
          }
        },
        { $sort: { _id: -1 } },
        {
          $match : {
            $and : [
              { reservationDate : { $gte : date_start.toLocaleDateString("ko-KR"), $lte : date_end.toLocaleDateString("ko-KR") } },
              { store : require('mongoose').Types.ObjectId(params.store) }
            ]
          }
        }
      ])
      .exec(function(err, results){
        var reservations = results;
        reservations = reservations.slice(0); //배열의 shallow copy 반환

        var reservation;
        if(reservations.length != 0){
          reservation = reservations.pop();
          console.log(reservations.length)
        }
        for(var i=0; i<n; i++){
          var p = JSON.parse(JSON.stringify( programs ));
          var today = new Date(date_start);
          today.setDate(date_start.getDate()+i);
          //console.log()
          //console.log("today: "+today)

          var reservationDate;
          if(reservation != null) reservationDate = new Date(reservation.reservationDate);
          //console.log("reservation: "+reservationDate)

          if(reservation!=null && (reservationDate.getDate() == today.getDate())){
            for(var j=0; j<programs.length; j++){
              if(reservation.programs.findIndex(x => x.toString() === p[j]._id.toString()) > -1){ //같은 id값 있으면 reserved = true
                p[j].isReserved = true;
                //console.log(p[j])
              }
            }
            if(reservations.length != 0){
              reservation = reservations.pop();
            }
          }
          var schedule = {
            date : today,
            programs : p
          }
          calendar.schedules.push(schedule);
        }
        var result = {
          title : "예약 현황",
          success : true,
          messages : req.flash('error'),
          //store : req.result.store,
          reservations : results,
          calendar : calendar
        }
        if(req.result == undefined){
          req.result = result;
        }
        else{
          req.result = Object.assign(req.result, result);
        }
        next();
      });
    }
  });


}
exports.registerOne = function(req, res, next) {
  var program = new Program(req.body);
  var message = null;

  program.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        //page : 'programs/list2',
        success : true,
        messages : req.flash('error'),
        program : program,
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/programs/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Program.findByIdAndUpdate(req.result.program._id, req.body, function(err, program) {
    if (err) {
      return next(err);
    } else {
      program.updated_at = Date.now();
      var result = {
        title : "Program Update",
        success : true,
        messages : req.flash('error'),
        program : program
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/programs/detail/'+req.program._id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Program.findOne({
    _id: id
  })
  .populate('store')
  .exec(function(err, program) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Program List",
        //page : 'programs/detail',
        success : true,
        messages : req.flash('error'),
        program : program
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
  Program.findByIdAndUpdate(req.result.program._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, program) {
    if (err) {
      return next(err);
    } else {
      program.updated_at = date;
      var result = {
        title : "Program Delete",
        success : true,
        messages : req.flash('error'),
        store : req.result.store,
        program : program
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/programs/detail/'+req.program._id);
    }
  });
};
