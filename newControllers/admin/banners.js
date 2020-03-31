let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 배너 리스트
exports.getBannerList = function(req, res, next) {
  let { page, userName } = req.query; // 조건 작성
  let query = "SELECT * FROM Banner "

  query += "WHERE "

  //배너 조건 검색 예시
  if(userName != null && userName != ""){
    query += ` userName = '${userName}' AND`
  }
  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY bannerNo DESC `;
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
        title : "배너 리스트",
        success : true,
        message : '메시지',
        banners : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 배너 상세 불러오기
exports.getBannerDetail = function(req, res, next) {
  let { userNo } = req.params;
  query += ` SELECT * `;

  query += ` FROM Banner `

  query += ` WHERE userNo = '${userNo}';`

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "배너 상세 조회",
        success : true,
        message : '메시지',
        banner : results[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

//배너 수정
exports.updateBanner = function(req, res, next) {
  let { userNo } = req.params;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Banner SET `;
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
        title: "배너 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 배너 삭제
exports.deleteBanner = function(req, res, next) {
  let {userNo} = req.params
  var query = `UPDATE Banner SET leaveYn = 1, leaveDate = CURRENT_TIMESTAMP`
  query += ` WHERE userNo = '${userNo}'`

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "배너 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 배너 만들기
exports.addBanner = function(req, res, next) {
  let banner = req.body; //request의 내용을 가지고 옴.

  let queryKeys = "";
  let queryValues = "";
  for(let item in banner){
    queryKeys += `${item}, `
    queryValues += `'${banner[item]}', `
  }
  queryKeys = queryKeys.trim();
  if(queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1);  //마지막 AND
  queryValues = queryValues.trim();
  if(queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1);  //마지막 AND

  var query = `INSERT INTO Banner(${queryKeys}) `
  query += `VALUES(${queryValues})`;
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "배너 등록 성공",
        success: true,
        message: '메시지',
        recipeNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}
