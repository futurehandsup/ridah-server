let common = require('./common')
let connection = common.initDatabase();
//common.test(connection);

// 공지사항 리스트
exports.getDashboardList = function(req, res, next) {
  let { page, noticeTitle, userName, showYn } = req.query; // 조건 작성
  let query = "SELECT * FROM Reservation "

  query += "WHERE "

  // 제목 검색
  if(noticeTitle != null && noticeTitle != ""){
    query += ` noticeTitle LIKE '%${noticeTitle}%' AND`
  }
  // 작성자 검색
  if(userName != null && userName != ""){
    query += ` userName LIKE '%${userName}%' AND`
  }
  // 노출여부 검색
  if(showYn != null && showYn != ""){
    query += ` showYn = '${showYn}' AND`
  }

  //... so on
  if(query.trim().endsWith('AND')) query = query.slice(0, -4);  //마지막 AND
  if(query.trim().endsWith('WHERE')) query = query.slice(0, -6);  //마지막 AND

  query += ` ORDER BY reservationNo ASC `;
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
        reservations : results
      }
      common.setResult(req, result);
      next();
    }
  })
}
