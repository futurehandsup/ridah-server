let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 예약 리스트
exports.getReservationList = function(req, res, next) {
  let { page, userName, reservationName, programName, reservationCode,
    reservationPhoneNumber, reservationStatus,scheduleDateMin, scheduleDateMax, scheduleDate,
    createDateMin, createDateMax, createDate, scheduleTime, scheduleTimeMin, scheduleTimeMax } = req.query; // 조건 작성
  // console.log(req.query);
  let query = "SELECT Program.programName, Schedule.scheduleDate, Schedule.scheduleTime, "
  query += " Reservation.reservationNo, Reservation.reservationCode, Reservation.reservationName, Reservation.createDate, Reservation.reservationStatus, Reservation.checkYn, Reservation.checkDate "
  query += " FROM Reservation  "
  query += " LEFT JOIN Program ON Reservation.programNo = Program.programNo "
  query += " LEFT JOIN Schedule ON Reservation.scheduleNo = Schedule.scheduleNo "
  query += " WHERE "

  //예약날짜 검색 예시
  // if(createDateMin != null && createDateMin != ""){
  //   query  += ` date_format(createDate, '%Y-%m-%d') >= '${createDateMin}' AND`
  // }
  // if(createDateMax != null && createDateMax != ""){
  //   query  += ` date_format(createDate, '%Y-%m-%d') <= '${createDateMax}' AND`
  // }
  //이용예정일 검색 예시

  // 스케줄날짜 검색 예시
  if(scheduleDateMin != null && scheduleDateMin != ""){
    query  += ` date_format(scheduleDate, '%Y-%m-%d') >= '${scheduleDateMin}' AND`
  }
  if(scheduleDateMax != null && scheduleDateMax != ""){
    query  += ` date_format(scheduleDate, '%Y-%m-%d') <= '${scheduleDateMax}' AND`
  }

  // 스케줄시간
  if(scheduleTimeMin != null && scheduleTimeMin != ""){
    query  += ` scheduleTime >= '${scheduleTimeMin}' AND`
  }
  if(scheduleTimeMax != null && scheduleTimeMax != ""){
    query  += ` scheduleTime <= '${scheduleTimeMax}' AND`
  }

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }
  //예약자 이름 검색
  if(reservationName != null && reservationName != ""){
    query += ` reservationName LIKE '%${reservationName}%' AND`
  }
  //프로그램 이름 검색
  if(programName != null && programName != ""){
    query += ` programName LIKE '%${programName}%' AND`
  }

  //예약 번호 검색
  if(reservationCode != null && reservationCode != ""){
    query += ` reservationCode LIKE '%${reservationCode}%' AND`
  }
  //예약자 핸드폰 번호 검색
  if(reservationPhoneNumber!= null && reservationPhoneNumber != ""){
    query += ` reservationPhoneNumber LIKE '%${reservationPhoneNumber}%' AND`
  }
  //예약 상태 검색
  if(reservationStatus != null && reservationStatus != ""){
    query += ` reservationStatus = '${reservationStatus}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY reservationNo DESC `;
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

  query = ` SELECT Reservation.* , Program.programName, Schedule.scheduleDate, Schedule.scheduleTime `

  query += ` FROM Reservation`

  query += ` LEFT JOIN Program ON Reservation.programNo = Program.programNo `
  query += ` LEFT JOIN Schedule ON Reservation.scheduleNo = Schedule.scheduleNo `

  query += ` WHERE reservationNo = '${reservationNo}';`

  console.log(query);
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
  let { reservationNo } = req.params;
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
  let {userNo} = req.params
  var query = `UPDATE Reservation SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

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
        reservationNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}

exports.createReservationCode = function(req, res, next) {
  let reservation = req.body; //request의 내용을 가지고 옴.
  let {reservationNo} = req.result;

  let today = new Date();
  var year = today.getFullYear();
  year = year.toString().substring(2,4);
  var month = (1 + today.getMonth());          //M
  month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
  var day = today.getDate();                   //d
  day = day >= 10 ? day : '0' + day;          //day 두자리로 저장

  var { storeNo } = reservation ;
  if(storeNo < 100){
    if(storeNo < 10)
      storeNo = '00'+ storeNo;
    else
      storeNo = '0'+ storeNo;
  }

  var newReservationNo = reservationNo.toString().slice(-3);

  // if(newReservationNo.length == 1){
  //   newReservationNo = '0'+ newReservationNo;
  // }
  // if(newReservationNo.length == 2){
  //   newReservationNo = '0'+ newReservationNo;
  // }

  while(newReservationNo.length < 3){
    newReservationNo = '0' + newReservationNo;
  }

  let reservationCode = `${year}${month}${day}${storeNo}${newReservationNo}`

  let query = " UPDATE Reservation "
  query += ` SET reservationCode = '${reservationCode}'`
  query += ` WHERE reservationNo = ${reservationNo}`


  console.log(query);


  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "예약 성공",
        success: true,
        message: '메시지',
        reservationNo: reservationNo
      }
      common.setResult(req, result);
      next();
    }
  })
}
