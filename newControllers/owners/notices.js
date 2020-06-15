let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 공지사항 리스트
exports.getNoticeList = function(req, res, next) {
  let { page, userName, noticeNormalYn, noticeNo } = req.query; // 조건 작성
  let query = "SELECT * FROM Notice "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY noticeNo DESC `;
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
        title : "공지사항 리스트",
        success : true,
        message : '메시지',
        notices : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 전체 공지사항 리스트
exports.getNoticeNormalList = function(req, res, next) {
  let { page, userName, noticeNo } = req.query; // 조건 작성
  let query = "SELECT * FROM Notice "

  query += " WHERE noticeNormalYn = 1 "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY noticeNo DESC `;
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
        title : "공지사항 리스트",
        success : true,
        message : '메시지',
        notices : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 가맹점 공지사항 리스트
exports.getNoticeOwnerList = function(req, res, next) {
  let { page, userName, noticeNo } = req.query; // 조건 작성
  let query = "SELECT * FROM Notice "

  query += " WHERE noticeOwnerYn = 1 "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY noticeNo DESC `;
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
        title : "공지사항 리스트",
        success : true,
        message : '메시지',
        notices : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 공지 상세 불러오기
exports.getNoticeDetail = function(req, res, next) {
  let { noticeNo } = req.params;

  let query = ` SELECT * `;

  query += ` FROM Notice `

  query += ` WHERE noticeNo = '${noticeNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "공지 상세 조회",
        success : true,
        message : '메시지',
        notice: results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//공지사항 수정
exports.updateNotice = function(req, res, next) {
  let { userNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Notice SET `;
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
        title: "공지사항 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 공지사항 삭제
exports.deleteNotice = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Notice SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "공지사항 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 공지사항 만들기
exports.addNotice = function(req, res, next) {
  let notice= req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in notice){
    queryKeys += `${item}, `
    queryValues += `'${notice[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Notice(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "공지사항 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
