let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 예약 리스트
exports.getReservationList = function(req, res, next) {
  let { page, reservationCode, userName, reservationName, storeName, programName,
    createDateMin, createDateMax, createDate, reservationStatus } = req.query; // 조건 작성
  // console.log(req.query);
  let query = "SELECT * FROM Reservation "
  query += " LEFT JOIN Program ON Reservation.programNo = Program.programNo "
  query += " LEFT JOIN Schedule ON Reservation.scheduleNo = Schedule.scheduleNo "
  query += " LEFT JOIN Member ON Reservation.userNo = Member.userNo "
  query += " LEFT JOIN Store ON Reservation.storeNo = Store.storeNo "
  query += " WHERE "

  //예약 번호 검색
  if(reservationCode != null && reservationCode != ""){
    query += ` reservationCode LIKE '%${reservationCode}%' AND`
  }
  //사용자 이름 검색
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }
  //예약자 이름 검색
  if(reservationName != null && reservationName != ""){
    query += ` reservationName LIKE '%${reservationName}%' AND`
  }
  //승마장 검색
  if(storeName != null && storeName != ""){
    query += ` storeName LIKE '%${storeName}%' AND`
  }
  //프로그램명 검색
  if(programName != null && programName != ""){
    query += ` programName LIKE '%${programName}%' AND`
  }

  // 예약날짜 검색
  if(createDateMin != null && createDateMin != ""){
    query  += ` createDate >= '${createDateMin}' AND`
  }
  if(createDateMax != null && createDateMax != ""){
    query  += ` createDate <= '${createDateMax}' AND`
  }
  
  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }

  //프로그램 이름 검색
  if(programName != null && programName != ""){
    query += ` programName LIKE '%${programName}%' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY reservationNo ASC `;

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
        title : "예약 리스트",
        success : true,
        message : '메시지',
        reservations : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 예약 상세 불러오기
exports.getReservationDetail = function(req, res, next) {
  let { reservationNo } = req.params;
  query = ` SELECT * FROM Reservation `
  query += " LEFT JOIN Program ON Reservation.programNo = Program.programNo "
  query += " LEFT JOIN Schedule ON Reservation.scheduleNo = Schedule.scheduleNo "
  query += " LEFT JOIN Member ON Reservation.userNo = Member.userNo "
  query += " LEFT JOIN Store ON Reservation.storeNo = Store.storeNo "

  query += ` WHERE reservationNo = '${reservationNo}';`

  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "예약 상세 조회",
        success : true,
        message : '메시지',
        reservation : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//예약 수정
exports.updateReservation = function(req, res, next) {
  let { reservationNo, reservationStatus, checkDate } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Reservation SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "reservationNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE reservationNo = '${reservationNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "예약 수정 성공",
        success: true,
        message: '메시지',
        reservationNo: reservationNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 예약 삭제
exports.deleteReservation = function(req, res, next) {
  let {reservationNo} = req.params
  var query = `UPDATE Reservation SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE reservationNo = '${reservationNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "예약 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 예약 하기
exports.addReservation = function(req, res, next) {
  let reservation = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in reservation){
    queryKeys += `${item}, `
    queryValues += `'${reservation[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Reservation(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "예약 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
