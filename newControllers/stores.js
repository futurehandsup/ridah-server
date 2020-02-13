let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 사용자 리스트
exports.getStoreList = function(req, res, next) {
  let { page, storeName } = req.query; // 조건 작성
  let query = "SELECT SQL_CALC_FOUND_ROWS * FROM Store "

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
  query += "; SELECT FOUND_ROWS() AS rows;"

  console.log(query)
  connection.query(query, function (err, results) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "승마장 리스트",
        success : true,
        message : '메시지',
        stores : results[0],
        rows: results[1][0].rows
      }
      common.setResult(req, result);
      next();
    }
  })
}
