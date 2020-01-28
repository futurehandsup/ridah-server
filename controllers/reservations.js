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
  //검색조건 설정
  


  //검색조건 설정 (예약일)
  if(req.query.reserved_date_from != null && req.query.reserved_date_from != ""){ // 날짜 시작
  
    if(params.created_at == null) params.created_at = {}
    params.created_at.$gte = req.query.reserved_date_from //최소값
  }

  //검색조건 설정
  if(req.query.reserved_date_until != null && req.query.reserved_date_until != ""){ // 날짜 끝
    if(params.created_at == null) params.created_at = {}
    params.created_at.$lte = req.query.reserved_date_until 
  }


  //검색조건 설정 (이용예정일)
  if(req.query.usage_date_from != null && req.query.usage_date_from != ""){ // 날짜 시작
  
    if(params.reservationDate == null) params.reservationDate = {}
    params.reservationDate.$gte = req.query.usage_date_from //최소값
  }

  //검색조건 설정
  if(req.query.usage_date_until != null && req.query.usage_date_until != ""){ // 날짜 끝
    if(params.reservationDate == null) params.reservationDate = {}
    params.reservationDate.$lte = req.query.usage_date_until 
  }

  //검색조건 설정 _ 오늘, 3일, 1주일, 1개월, 3개월
/*  if(fixed_days!=""){
    if(req.query.fixed_days == '오늘'){

    }
    if(req.query.fixed_days == '3일'){

    }
    if(req.query.fixed_days == '1주일'){

    }
    if(req.query.fixed_days == '1개월'){

    }
    if(req.query.fixed_days == '3개월'){
      
    }
  }*/
  
    if(req.query.ownerName != null && req.query.ownerName != ""){ // 검색조건 예약자명
        params.ownerName = req.query.ownerName
      }

    if(req.query.programname != null && req.query.programname != ""){
        params.programname = req.query.programname
      }

    if(req.query._id != null && req.query._id != ""){ // 검색조건 예약번호
        params._id= req.query._id
      }

    if(req.query.telephone != null && req.query.telephone != ""){ // 검색조건 전화번호 
        params.telephone = req.query.telephone
      }
     /* if(req.query.search_condition == '프로그램명'){ // 검색조건 프로그램명
        let keyword = new RegExp( req.query.search_key) 
        params.program = keyword
      }
      외래키 */ 
      if(req.query.search_condition == '취소요청'){
        params.status = '취소요청'
      }
      if(req.query.search_condition == '취소진행'){
        params.status = '취소진행'
      }
      if(req.query.search_condition == '취소완료'){
        params.status = '취소완료'
      }
      if(req.query.search_condition == '취소철회'){
        params.status = '취소철회'
      }
  

  /*
  populate({
    path: 'program',
    match: { name: search_condition },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    //select: 'name -_id',
  })
  */
  console.log(params)
// params = {
//   reservationDate: ~~,
//   reservationNo: ~~,
//   ownerName : ~~,

// }
  Reservation.find(params)
  .populate('store')
  .populate({
    path: 'owner'
  })
  .populate({
    path: 'program',
  })
  .populate('review')
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

  let date = new Date(reservation.reservationDate);
  date = date.toLocaleDateString("ko-KR")
  reservation.reservationDate = date;

  reservation.save(function(err) {
    if (err) {
      return next(err);
    } else {
      Program.findById(reservation.program, function (err, program){
        if(err) return next(err);
        //program.reservations.push(reservation);
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
        title : "Reservation",
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
exports.setChecked = function(req, res, next){
  let reservation = req.result.reservation;
  if(reservation == null){
    let error = new Error("잘못된 요청입니다.");
    return next(error);
  }
  reservation.setChecked(function(err, r) {
    if(err) return next(err);
    Reservation.find(r)
    .populate('store')
    .populate('owner')
    .populate('program')
    .populate('review')
    .exec(function(err, re) {
      if(err) return next(err);
      var result = {
        title : "Reservation Check In",
        success : true,
        messages : req.flash('error'),
        reservation : re
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      return next()
    });

  });

}
