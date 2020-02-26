let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * POST /review/*
  * : 리뷰 조회 및 생성 수정 삭제
/ =========================================== */
// 리뷰상세	  R	  review/getReviewDetail
exports.getReviewDetail = function(req, res, next) {
  let {reviewNo, userNo} = req.body;
  //let query = ` UPDATE Review SET viewCount = viewCount+1 WHERE reviewNo = '${reviewNo}';`
  let query = "";
  query += ` SELECT *  `;
  query += ` FROM Review`
  query += ` WHERE reviewNo = '${reviewNo}';`

  console.log(query);
  connection.query(query, function (err, review) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "리뷰 상세 조회",
        success : true,
        message : '메시지',
        review : review
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 리뷰업로드	C	 review/addReview
exports.addReview = function(req, res, next) {
  let { reservationNo, programNo,  storeNo, scheduleNo, reviewContents, reviewScore, userNo,
    reviewPic1, reviewPic2, reviewPic3, reviewPic4, reviewPic5} = req.body;
  console.log(req.body)

  var query = 'INSERT INTO Review (reservationNo, programNo, storeNo, scheduleNo, reviewContents, reviewScore, userNo, reviewPic1, reviewPic2, reviewPic3, reviewPic4, reviewPic5 ) ';
  query +=  `VALUES ( '${reservationNo}', '${programNo}', '${storeNo}', '${scheduleNo}', '${reviewContents}', '${reviewScore}', '${userNo}', '${reviewPic1!=null?reviewPic1:""}', '${reviewPic2!=null?reviewPic2:""}', '${reviewPic3!=null?reviewPic3:""}', '${reviewPic4!=null?reviewPic4:""}', '${reviewPic5!=null?reviewPic5:""}') `;

  query += `;UPDATE Store, `
  query += `( SELECT AVG(reviewScore) AS reviewScore, COUNT(reviewNo) AS reviewCount FROM Review WHERE storeNo = '${storeNo}') T1 `;
  query += ` SET Store.reviewScore =  T1.reviewScore, Store.reviewCount =  T1.reviewCount  `;
  query += ` WHERE Store.storeNo = '${storeNo}'`

  query += `;UPDATE Program, `
  query += `( SELECT AVG(reviewScore) AS reviewScore, COUNT(reviewNo) AS reviewCount FROM Review WHERE programNo = '${programNo}') T2 `;
  query += ` SET Program.reviewScore =  T2.reviewScore, Program.reviewCount =  T2.reviewCount  `;
  query += ` WHERE Program.programNo = '${programNo}'`

  //한사람이 리뷰 2개 못올림/ 중복일시 삭제하고 새로올리거나 업데이트되게
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "리뷰 등록 성공",
        success: true,
        message: '메시지',
        reviewNo: sqlResult[0].insertId
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 리뷰수정	  U	  review/updateReview
exports.updateReview = function(req, res, next) {
  let {reviewNo, reviewContents, reviewPic1, reviewPic2, reviewPic3, reviewPic4, reviewPic5, showYn,
    reviewScore, storeNo, programNo} = req.body
  var query = `UPDATE Review SET `

  if(reviewContents != null){
    query += ` reviewContents = '${reviewContents}', `
  }
  if(reviewPic1 != null){
    query += ` reviewPic1 = '${reviewPic1}', `
  }
  if(reviewPic2 != null){
    query += ` reviewPic2 = '${reviewPic2}', `
  }
  if(reviewPic3 != null){
    query += ` reviewPic3 = '${reviewPic3}', `
  }
  if(reviewPic4 != null){
    query += ` reviewPic4 = '${reviewPic4}', `
  }
  if(reviewPic5 != null){
    query += ` reviewPic5 = '${reviewPic5}', `
  }
  if(reviewScore != null){
    query += ` reviewScore = '${reviewScore}', `
  }
  if(showYn != null){
    query += ` showYn = '${showYn}'`
  }
  query = query.trim();
  if (query.endsWith(',')) query = query.slice(0, -1); //마지막 AND

  query += ` WHERE reviewNo = '${reviewNo}'`

  if(reviewScore != null){
    query += `;UPDATE Store SET reviewScore =   `;
    query += ` ( SELECT AVG(reviewScore) AS reviewScore `
    query += ` FROM Review WHERE storeNo = '${storeNo}') `
    query += `WHERE storeNo = '${storeNo}'`

    query += `;UPDATE Program SET reviewScore =   `;
    query += ` ( SELECT AVG(reviewScore) AS reviewScore `
    query += ` FROM Review WHERE programNo = '${programNo}') `
    query += `WHERE programNo = '${programNo}'`
  }

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "리뷰 수정 성공",
        success: true,
        message: '메시지',
        reviewNo: reviewNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 리뷰삭제	  D	  review/deleteReview
exports.deleteReview = function(req, res, next) {
  let {reviewNo} = req.body
  var query = `UPDATE Review SET showYn = 0 WHERE reviewNo = '${reviewNo}'`
  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "리뷰 삭제 성공",
        success: true,
        message: '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
}
