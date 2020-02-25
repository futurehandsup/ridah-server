let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * POST /program/*
  * : 프로그램 조회
  *   및 프로그램 하위의 스케줄 조회 포함
/ =========================================== */

// 프로그램 List	 R	  program/getProgramList
exports.getProgramList = function(req, res, next){
  let { userNo, page } = req.body;
  var query = ""
  query = `SELECT * FROM  Program `;
  //query += ` WHERE userNo = '${userNo}' `
  query += ` ORDER BY programNo DESC `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  console.log(query);
  connection.query(query, function (err, programs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        programs : programs
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 상세	   R	  program/getProgramDetail
exports.getProgramDetail = function(req, res, next){
  let { userNo, programNo } = req.body;
  var query = ""
  query = `SELECT * FROM  Program `;
  query += ` WHERE programNo = '${programNo}' `
  query += ` LIMIT 1 `

  console.log(query);
  connection.query(query, function (err, program) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        program : program
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 스케줄 list	    R	  program/getScheduleList
exports.getScheduleList = function(req, res, next){
  let { userNo, programNo } = req.body;
  var query = ""
  query = `SELECT * FROM Schedule `;
  query += ` WHERE programNo = '${programNo}' `

  console.log(query);
  connection.query(query, function (err, schedules) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        schedules : schedules
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 스케줄 상세(?)  R	  program/getScheduleDetail
exports.getScheduleDetail = function(req, res, next){
  let { userNo, scheduleNo } = req.body;
  var query = ""
  query = `SELECT * FROM  Schedule `;
  query += ` WHERE scheduleNo = '${scheduleNo}' `
  query += ` LIMIT 1 `

  console.log(query);
  connection.query(query, function (err, schedule) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        schedule : schedule
      }
      common.setResult(req, result);
      next();
    }
  })
}
