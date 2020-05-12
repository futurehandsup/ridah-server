let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 결제 리스트
exports.getPaymentList = function(req, res, next) {
  let { page, userName, reservationCode, paymentType, paymentDateMin, paymentDateMax } = req.query; // 조건 작성
  let query = "SELECT * FROM Payment "

  query += "LEFT JOIN Member ON Payment.userNo = Member.userNo "
  query += "LEFT JOIN Reservation ON Payment.reservationNo = Reservation.reservationNo"
  query += "WHERE "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }
  //예약코드 검색
  if(reservationCode != null && reservationCode != ""){
    query += ` reservationCode LIKE '%${reservationCode}%' AND`
  }
  //결제일자
  if(paymentDateMin != null && paymentDateMin != ""){
    query  += ` paymentDate >= '${paymentDateMin}' AND`
  }
  if(paymentDateMax != null && paymentDateMax != ""){
    query  += ` paymentDate <= '${paymentDateMax}' AND`
  }

  //타입
  if(paymentType != null && paymentType != ""){
    query += ` paymentType = '${paymentType}' AND`
  }

  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY paymentNo DESC `;
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
        title : "사용자 리스트",
        success : true,
        message : '메시지',
        payments : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 결제 내용 상세 불러오기
exports.getPaymentDetail = function(req, res, next) {
  let { paymentNo } = req.params;
  query = ` SELECT * FROM Payment`;

  query += ` LEFT JOIN Member ON Payment.userNo = Member.userNo`
  query += ` LEFT JOIN Reservation ON Payment.reservationNo = Reservation.reservationNo`
  query += ` LEFT JOIN Store ON Reservation.storeNo = Store.storeNo`
  query += ` LEFT JOIN Program ON Reservation.programNo = Program.programNo`

  query += ` WHERE paymentNo = '${paymentNo}';`

  console.log(query);

  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "회원 상세 조회",
        success : true,
        message : '메시지',
        payment : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//결제 수정
exports.updatePayment = function(req, res, next) {
  let { userNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Payment SET `;
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
        title: "회원정보 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 결제 삭제
exports.deletePayment = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Payment SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "사용자 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 결제 만들기
exports.addPayment = function(req, res, next) {
  let payment = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in payment){
    queryKeys += `${item}, `
    queryValues += `'${payment[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Payment(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "회원 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
