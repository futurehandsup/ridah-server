let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 프로그램 일정 리스트
exports.getSchedulesList = function(req, res, next) {
  let { page, userName, scheduleDate, scheduleDateMin, scheduleDateMax, programName, amountNow,
   showSchedules, orderSchedule} = req.query; // 조건 작성

  let query = "SELECT * FROM Schedule "
  query += " LEFT JOIN Program ON Schedule.programNo = Program.programNo "

  query += " WHERE "

  //수업일 검색
  if(scheduleDateMin != null && scheduleDateMin != ""){
    query  += ` date_format(scheduleDate, '%Y-%m-%d') >= '${scheduleDateMin}' AND`
  }
  if(scheduleDateMax != null && scheduleDateMax != ""){
    query  += ` date_format(scheduleDate, '%Y-%m-%d') <= '${scheduleDateMax}' AND`
  }
  //프로그램명 검색
  if(programName != null && programName != ""){
    query  +=  ` programName LIKE '%${programName}%' AND`
  }
  //신청인원 검색
  if(amountNow != null && amountNow != ""){
    query +=  ` 'amountNow' = '${amountNow}' AND`
  }
  //보기
  if(showSchedules == "futureSchedule"){
    query += ` date_format(scheduleDate, '%Y-%m-%d') >= '${showSchedules}' AND`
  }
  if(showSchedules == "pastSchedule"){
    query += ` date_format(scheduleDate, '%Y-%m-%d') <= '${showSchedules}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY scheduleNo ASC `;

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  query += ";"

  console.log(query)
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "프로그램 운영 날짜 리스트",
        success : true,
        message : '메시지',
        schedules : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 프로그램 알정 상세 불러오기
exports.getSchedulesDetail = function(req, res, next) {
  let { userNo } = req.params;
  query += ` SELECT * `;

  query += ` FROM Schedules `

  query += ` WHERE userNo = '${userNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "프로그램 운영 날짜 상세 조회",
        success : true,
        message : '메시지',
        schedules : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 일정 수정
exports.updateSchedules = function(req, res, next) {
  let { userNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Schedules SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "userNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE userNo = '${userNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 운영 날짜 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 일정 삭제
exports.deleteSchedules = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Schedules SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 운영 날짜 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 일정 만들기
exports.addSchedules = function(req, res, next) {
  let schedules = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in schedules){
    queryKeys += `${item}, `
    queryValues += `'${schedules[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Schedules(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 운영 날짜 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
