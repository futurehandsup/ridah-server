let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 후기 리스트
exports.getReviewList = function(req, res, next) {
  let { page, reservationCode, userName, storeName, programName, createDate, createDateMin, createDateMax,
  showYn } = req.query; // 조건 작성

  let query = "SELECT Review.*, Member.userName,  Program.programName, Reservation.reservationCode, Store.storeName FROM Review "
  query += " LEFT JOIN Member ON Review.userNo = Member.userNo "
  query += " LEFT JOIN Program ON Review.programNo = Program.programNo "
  query += " LEFT JOIN Reservation ON Review.reservationNo = Reservation.reservationNo "
  query += " LEFT JOIN Store ON Review.storeNo = Store.storeNo "
  query += " WHERE "

  // 에약코드 검색
  if(reservationCode != null && reservationCode != ""){
    query += ` reservationCode LIKE '%${reservationCode}%' AND`
  }
  // 작성자명
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }
  // 승마장명 검색
  if(storeName != null && storeName != ""){
   query += ` storeName = '${storeName}' AND`
  }
  // 프로그램명 검색
  if(programName != null && programName != ""){
   query += ` programName = '${programName}' AND`
  }
  //작성일 검색
  if(createDateMin != null && createDateMin != ""){
    query += ` date_format(review.createDate, '%Y-%m-%d') >= '${createDateMin}' AND`
  }
  if(createDateMax != null && createDateMax != ""){
    query += ` date_format(review.createDate, '%Y-%m-%d') <= '${createDateMax}' AND`
  }

  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY reviewNo ASC `;

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  query += ";"

  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "후기 리스트",
        success : true,
        message : '메시지',
        reviews : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 후기 상세 불러오기
exports.getReviewDetail = function(req, res, next) {
  let { reviewNo } = req.params;

  let query = ` SELECT * `;

  query += ` FROM Review `
  query += ` LEFT JOIN Member ON Review.userNo = Member.userNo `
  query += ` LEFT JOIN Program ON Review.programNo = Program.programNo `
  query += ` LEFT JOIN Reservation ON Review.reservationNo = Reservation.reservationNo `
  query += ` LEFT JOIN Schedule ON Review.scheduleNo = Schedule.scheduleNo`
  query += ` LEFT JOIN Store ON Reservation.storeNo = Store.storeNo`

  query += ` WHERE reviewNo = '${reviewNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "후기 상세 조회",
        success : true,
        message : '메시지',
        review : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 그런데 말입니다... 가맹점주가 후기를 수정, 삭제, 등록하여도 되는건가요..?
//후기 수정
exports.updateReview = function(req, res, next) {
  let { reviewNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Review SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "reviewNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE reviewNo = '${reviewNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "후기 수정 성공",
        success: true,
        message: '메시지',
        reviewNo: reviewNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 후기 삭제
exports.deleteReview = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Review SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "후기 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 후기 만들기
exports.addReview = function(req, res, next) {
  let review = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in review){
    queryKeys += `${item}, `
    queryValues += `'${review[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Review(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "후기 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
