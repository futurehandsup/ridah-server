let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 프로그램 일정 리스트
exports.getSchedulesList = function(req, res, next) {
  let { page, userName } = req.query; // 조건 작성
  let query = "SELECT SQL_CALC_FOUND_ROWS * FROM Schedules "

  query += "WHERE "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY userNo DESC `;
  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  query += "; SELECT FOUND_ROWS() AS rows;"

  console.log(query)
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "프로그램 운영 날짜 리스트",
        success : true,
        message : '메시지',
        scheduless : results[0],
        rows: results[1][0].rows
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
