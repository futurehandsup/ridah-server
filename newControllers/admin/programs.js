let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 프로그램 리스트
exports.getProgramList = function(req, res, next) {
  let { page, userName, programName, storeName, programTimeMin, programTimeMax, showYn} = req.query; // 조건 작성
  let query = "SELECT Program.*, Store.storeName FROM Program "
  query += "LEFT JOIN Store ON Program.storeNo = Store.storeNo "

  query += "WHERE "

  // 프로그램명 검색
  if(programName != null && programName != ""){
    query  +=  ` programName LIKE '%${programName}%' AND`
  }
  // 승마장명 검색
  if(storeName != null && storeName != ""){
    query  +=  ` storeName LIKE '%${storeName}%' AND`
  }
  // 가격 최소 검색
  if(programTimeMin != null && programTimeMin != ""){
    query  +=  ` programTime >= '${programTimeMin}' AND`
  }
  // 가격 최대 검색
  if(programTimeMax != null && programTimeMax != ""){
    query  +=  ` programTime <= '${programTimeMax}' AND`
  }
  // 노출여부 검색
  if(showYn == "노출"){
    query  +=  ` showYn = 1 AND`
  }
  if(showYn == "노출안함"){
    query  +=  ` showYn = 0 AND`
  }
  //프로그램 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }

  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY programNo ASC `;
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
        title : "프로그램 리스트",
        success : true,
        message : '메시지',
        programs : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 프로그램 상세 불러오기
exports.getProgramDetail = function(req, res, next) {
  let { programNo } = req.params;

  let query = ` SELECT Program.*, Store.storeName FROM Program `
  query += ` LEFT JOIN Store ON Program.storeNo = Store.storeNo `

  query += ` WHERE programNo = '${programNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "프로그램 상세 조회",
        success : true,
        message : '메시지',
        program : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//프로그램 수정
exports.updateProgram = function(req, res, next) {
  let { programNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Program SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "programNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE programNo = '${programNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 수정 성공",
        success: true,
        message: '메시지',
        programNo: programNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 삭제
exports.deleteProgram = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Program SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 프로그램 만들기
exports.addProgram = function(req, res, next) {

  let { page, storeNo } = req.query; // 조건 작성
  let program = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in program){
    queryKeys += `${item}, `
    queryValues += `'${program[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Program(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "프로그램 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
