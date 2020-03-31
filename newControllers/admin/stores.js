let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 가맹점 정보 리스트
exports.getStoreList = function(req, res, next) {
  let { page, storeName } = req.query; // 조건 작성
  let query = "SELECT * FROM Store "

  query += "WHERE "

  //조건 검색 예시
  if(storeName != null && storeName != ""){
    query += ` storeName = '${storeName}' AND`
  }

  //... so on


  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY storeNo DESC `;
  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  query += ";"

  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "승마장 리스트",
        success : true,
        message : '메시지',
        stores : results
      }
      console.log(results)
      common.setResult(req, result);
      next();
    }
  })
}

// 가맹점 상세 불러오기
exports.getStoreDetail = function(req, res, next) {
  let { storeNo } = req.params;
  let query = ` SELECT * `;

  query += ` FROM Store `

  query += ` WHERE storeNo = '${storeNo}';`

  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "가맹점 상세 조회",
        success : true,
        message : '메시지',
        store : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//가맹점 수정
exports.updateStore = function(req, res, next) {
  let { storeNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Store SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "storeNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE storeNo = '${storeNo}'`;

  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "가맹점정보 수정 성공",
        success: true,
        message: '메시지',
        storeNo: storeNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 가맹점 삭제
exports.deleteStore = function(req, res, next) {
  let {storeNo} = req.params
  var query = `UPDATE Store SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE storeNo = '${storeNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "가맹점 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 가맹점 만들기
exports.addStore = function(req, res, next) {
  let store = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in store){
    queryKeys += `${item}, `
    queryValues += `'${store[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Store(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "가맹점 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
