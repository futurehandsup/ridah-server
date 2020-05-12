let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 사용자 리스트
exports.getMemberList = function(req, res, next) {
  let { page, userName, userRole, nickname, userPhoneNumber } = req.query; // 조건 작성
  let query = "SELECT * FROM Member "

  query += "WHERE "

  //조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }

  // 분류 검색
  if(userRole != null && userRole != ""){
    query += ` userRole = '${userRole}' AND`
  }

 // 별명 검색
  if(nickname != null && nickname != ""){
    query += ` nickname LIKE '%${nickname}%' AND`
  }

  // 전화번호 검색
  if(userPhoneNumber != null && userPhoneNumber != ""){
    query += ` userPhoneNumber LIKE '%${userPhoneNumber}%' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY userNo DESC `;
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
        members : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 사용자 상세 불러오기
exports.getMemberDetail = function(req, res, next) {
  let { userNo } = req.params;
  query = ` SELECT * `;

  query += ` FROM Member `

  query += ` WHERE userNo = '${userNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "회원 상세 조회",
        success : true,
        message : '메시지',
        member : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//회원 수정
exports.updateMember = function(req, res, next) {
  let { userNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Member SET `;
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

// 회원 삭제
exports.deleteMember = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Member SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
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

// 회원 만들기
exports.addMember = function(req, res, next) {
  let member = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in member){
    queryKeys += `${item}, `
    queryValues += `'${member[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Member(${queryKeys}) `
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
