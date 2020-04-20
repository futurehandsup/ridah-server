let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * POST /store/*
  * : 승마장 조회
  *   및 승마장 하위의 프로그램, 후기 조회 포함
/ =========================================== */
// 상점 목록	     R	store/getStoreList
exports.getStoreList = function(req, res, next){
  let { userNo, page, latitude, longitude, orderBy } = req.body;

  if(latitude ==null || latitude == "") latitude = "37.325941";
  if(longitude ==null || longitude == "") longitude = "126.952008";

  var query = ""
  query = `SELECT Store.* `
  if(orderBy == "distance"){
    query += ` , ST_DISTANCE_SPHERE(POINT(${longitude}, ${latitude}), storeGps)/1000 AS distance `
  }
  query += ` FROM  Store `;
  query += ` WHERE showYn = 1 `

  if(orderBy == "distance"){
    query += ` ORDER BY distance `
  }
  else{
    query += ` ORDER BY storeNo DESC `
  }

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 20 }, 20 `
  }
  console.log(query);
  connection.query(query, function (err, stores) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        stores : stores
      }
      console.log(stores)
      common.setResult(req, result);
      next();
    }
  })
}

// 상점 상세	     R	store/getStoreDetail
exports.getStoreDetail = function(req, res, next){
  let { userNo, storeNo } = req.body;
  var query = ""
  query = `SELECT Store.*, `;
  query += `(SELECT COUNT(programNo) from Program WHERE storeNo = '${storeNo}' AND showYn = 1) AS programCount `
  query += ` , COUNT(DISTINCT Zzim.storeNo) AS zzimYn `
  query += ` FROM  Store `;

  if(userNo != null && userNo != "") {
    query += ` LEFT JOIN Zzim ON Zzim.storeNo = Store.storeNo AND Zzim.userNo = '${userNo}' `;
  } else {
    query += ` LEFT JOIN Zzim ON Zzim.storeNo = Store.storeNo AND Zzim.userNo = '' `;
  }
  query += ` WHERE Store.storeNo = '${storeNo}' `
  query +=  ` GROUP BY Store.storeNo `

  query += ` LIMIT 1 `

  console.log(query);
  connection.query(query, function (err, store) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        store : store[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 목록	  R	 store/getProgramList
exports.getProgramList = function(req, res, next){
  let { userNo, storeNo } = req.body;
  var query = ""
  query = `SELECT Program.*, Store.storeName, Store.storeAddress1, Store.storeAddress2 `
  query += ` FROM  Program `;
  query += ` LEFT JOIN Store ON Store.storeNo = Program.storeNo `
  query += ` WHERE Program.storeNo = '${storeNo}' `

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
// 후기 목록	     R	store/getReviewList
exports.getReviewList = function(req, res, next){
  let { userNo, storeNo, page } = req.body;
  var query = ""
  query = `SELECT Review.*, Program.programName, Member.nickname FROM Review `;
  query += ` LEFT JOIN Program ON Program.programNo = Review.programNo `
  query += ` LEFT JOIN Member ON Member.userNo = Review.userNo `
  query += ` WHERE Review.storeNo = '${storeNo}' `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }

  console.log(query);
  connection.query(query, function (err, reviews) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        reviews : reviews
      }
      common.setResult(req, result);
      next();
    }
  })
}
