let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * POST /reservation/*
  * : 예약하기 및 예약 상세정보 조회, 수정
/ =========================================== */
// 예약하기	  C	  reservation/addReservation
exports.addReservation = function(req, res, next) {
  let reservation = req.body;
  reservation.reservationCode = common.makeReservationCode();

  let queryKeys = "";
  let queryValues = "";

  for (let item in reservation) {
    queryKeys += `${item}, `
    queryValues += `'${reservation[item]}', `
  }
  queryKeys = queryKeys.trim();
  if (queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1); //마지막 AND
  queryValues = queryValues.trim();
  if (queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1); //마지막 AND

  var query = `INSERT INTO Reservation(${queryKeys}) `
  query += `VALUES(${queryValues})`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "예약 등록 성공",
        success: true,
        message: '메시지',
        reservationNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();

    }
  })
}

// 예약 수정	U	 reservation/updateReservation
exports.updateReservation = function(req, res, next) {
  let { reservationNo, userNo, checkYn, reservationStatus } = req.body;
  var query = `UPDATE Reservation SET `

  if(checkYn != null){
    query += ` checkYn = '${checkYn}' , checkDate = CURRENT_TIMESTAMP, `
  }
  if(reservationStatus != null){
    query += ` reservationStatus = '${reservationStatus}' `
  }
  if(query.trim().endsWith(',')) query = query.trim().slice(0, -1);  //마지막

  query += ` WHERE reservationNo = '${reservationNo}' `

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

// 예약상세	  R	  reservation/getReservationDetail
exports.getReservationDetail = function(req, res, next) {
  let {reservationNo, userNo} = req.body;
  let query = ""
  query += ` SELECT * FROM Reservation `;

  query += ` WHERE reservationNo = '${reservationNo}'`
  query += ` LIMIT 1 `

  console.log(query);
  connection.query(query, function (err, reservation) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "게시물 상세 조회",
        success : true,
        message : '메시지',
        reservation : reservation[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}
