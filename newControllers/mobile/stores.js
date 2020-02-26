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
  let { userNo, page } = req.body;
  var query = ""
  query = `SELECT * FROM  Store `;
  query += ` WHERE showYn = 1 `
  query += ` ORDER BY storeNo DESC `

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
      common.setResult(req, result);
      next();
    }
  })
}

// 상점 상세	     R	store/getStoreDetail
exports.getStoreDetail = function(req, res, next){
  let { userNo, storeNo } = req.body;
  var query = ""
  query = `SELECT * FROM  Store `;
  query += ` WHERE storeNo = '${storeNo}' `
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
  query = `SELECT * FROM Program `;
  query += ` WHERE storeNo = '${storeNo}' `

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
  query = `SELECT * FROM Review `;
  query += ` WHERE storeNo = '${storeNo}' `

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
