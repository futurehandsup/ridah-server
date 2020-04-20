let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * POST /etc/*
  * : 기타기능
/ =========================================== */
// 공지리스트 조회	R	etc/getNoticeList
exports.getNoticeList = function(req, res, next){
  let { userNo, page } = req.body;

  var query = `SELECT * FROM Notice WHERE showYn = 1 `
  query += `ORDER BY createDate DESC `
  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }

  console.log(query);

  connection.query(query, function (err, notices) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "공지사항 상세조회",
        success : true,
        message : '메시지',
        notices : notices
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 공지사항 상세	R	etc/getNoticeDetail
exports.getNoticeDetail = function(req, res, next){
  let { userNo, noticeNo } = req.body;

  var query = `SELECT * FROM Notice WHERE noticeNo = '${noticeNo}' `
  query += ` LIMIT 1 `

  console.log(query);

  connection.query(query, function (err, notice) {
    if (err) {
      return next(err);
    }else if(!notice[0].showYn){
      return next(new Error("삭제된 게시물입니다."));
    } else {
      var result = {
        title : "공지사항 상세조회",
        success : true,
        message : '메시지',
        notice : notice[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// faq 조회	R	etc/getFaqList
exports.getFaqList = function(req, res, next){
  let { userNo, page } = req.body;

  var query = `SELECT * FROM Faq WHERE showYn = 1 `
  query += `ORDER BY showSeq `
  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }

  console.log(query);

  connection.query(query, function (err, faqs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "자주묻는질문 상세조회",
        success : true,
        message : '메시지',
        faqs : faqs
      }
      common.setResult(req, result);
      next();
    }
  })
}

// faq 상세	R	etc/getFaqDetail
exports.getFaqDetail = function(req, res, next){
  let { userNo, faqNo } = req.body;

  var query = `SELECT * FROM Faq WHERE faqNo = '${faqNo}' `
  query += ` LIMIT 1 `

  console.log(query);

  connection.query(query, function (err, faq) {
    if (err) {
      return next(err);
    }else if(!faq[0].showYn){
      return next(new Error("삭제된 게시물입니다."));
    } else {
      var result = {
        title : "공지사항 상세조회",
        success : true,
        message : '메시지',
        faq : faq[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 배너리스트 조회	R	etc/getBannerList
exports.getBannerList = function(req, res, next){
  let { userNo } = req.body;

  var query = `SELECT * FROM Banner WHERE showYn = 1 `
  query += `ORDER BY showSeq `

  console.log(query);

  connection.query(query, function (err, banners) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "배너 목록 조회",
        success : true,
        message : '메시지',
        banners : banners
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 찜하기	C	etc/addZzim
exports.addZzim = function(req, res, next) {
  let { userNo, storeNo, programNo } = req.body; //request의 내용을 가지고 옴.
  if(req.session.member == null){
    return next(new Error("로그인 후 이용해 주세요"));
  }
  // 20190616 api 수정 - placeNo 추가
  if(storeNo != null && storeNo != ""){
    var query = 'INSERT INTO Zzim ( userNo, storeNo ) ';
    query += `VALUES (${userNo}, '${storeNo!=null?storeNo:""}' )`;
    query+= `;UPDATE Store SET zzimCount = zzimCount + 1 WHERE storeNo = '${storeNo}';`
  }
  else if(programNo != null && programNo != ""){
    var query = 'INSERT INTO Zzim ( userNo, programNo ) ';
    query += `VALUES (${userNo}, '${programNo!=null?programNo:""}' )`;
    query+= `;UPDATE Program SET zzimCount = zzimCount + 1 WHERE programNo = '${programNo}';`
  }
  console.log(query);

  connection.query(query, function (err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "좋아요 등록 완료",
        success : true,
        message : '메시지',
        zzimNo : sqlResult[0].insertId
      }
      common.setResult(req, result);
      next();
    }
  })
};

// 찜취소	D	etc/deleteZzim
exports.deleteZzim = function(req, res, next) {
  let { userNo, storeNo, programNo } = req.body; //request의 내용을 가지고 옴.
  var query = ""
  if(storeNo != null && storeNo != ""){
    query = `UPDATE Store SET zzimCount = (SELECT COUNT(zzimNo)-1 AS zzimCount FROM Zzim WHERE storeNo = '${storeNo}') WHERE storeNo = '${storeNo}';`
    query += `DELETE FROM Zzim WHERE userNo = '${userNo}' AND storeNo = '${storeNo}'`;
  }
  if(programNo != null && programNo != ""){
    query = `UPDATE Program SET zzimCount = (SELECT COUNT(zzimNo)-1 AS zzimCount FROM Zzim WHERE programNo = '${programNo}') WHERE programNo = '${programNo}';`
    query += `DELETE FROM Zzim WHERE userNo = '${userNo}' AND programNo = '${programNo}'`;
  }
  console.log(req.body)
  console.log(query)

  connection.query(query, function (err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "좋아요 삭제",
        success : true,
        message : '메시지'
      }
      common.setResult(req, result);
      next();
    }
  })
};

// 이미지업로드 	C	etc/uploadImage
exports.uploadImage = function(req, res, next){
  // 사진업로드	etc/uploadImage
  var AWS = require('aws-sdk');

  const keys = require('../../config/env/aws-credential.json');
  AWS.config.update({ accessKeyId : keys.accessKeyId,
                      secretAccessKey : keys.secretAccessKey,
                      region : keys.region});

  var fileObj = req.file;
  console.log(req.file)

  //req.files.forEach(function (fileObj, index) {
  //라우터에 Multer 객체를 연결하면 input name이 일치하는 파일 데이터를 자동으로 받아서 req.files를 통해 접근할 수 있게 처리해 줍니다.
  //메모리 버퍼에 저장하는 형태를 선택했으므로 fileObj는 다음과 같은 속성을 갖게 됩니다.
  // fileObj.buffer //예) Buffer 객체
  // fileObj.originalname //예) abc.jpg
  // fileObj.mimetype //예)'image/jpeg'

  //아마존 S3에 저장하려면 먼저 설정을 업데이트합니다.
  // aws.config.region = 'ap-northeast-2'; //Seoul
  // aws.config.update({
  //   accessKeyId: "*",
  //   secretAccessKey: "*"
  // });
  var date = Date.now().toString()
  var { folder} = req.body;
  if(folder == null || folder == "") folder = "mobileUpload/";
  else folder += "/";

  var s3_params = {
    Bucket: 'ridahonhill',
    Key: "anymal/"+folder+(folder=='mobileUpload/'?date+"_":"")+fileObj.originalname, //// TODO: 폴더경로도 추가해줍시다.
    ACL: 'public-read',
    ContentType: fileObj.mimetype
  };

  var s3obj = new AWS.S3({ params: s3_params });
  var options = {};

  s3_params.Body = fileObj.buffer;

  s3obj.upload(s3_params, options,
    //.on('httpUploadProgress', function (evt) { console.log(evt); })
    //.send(
    function (err, data) {
      //S3 File URL
      //어디에서나 브라우저를 통해 접근할 수 있는 파일 URL을 얻었습니다.
      if (err) {
        next(err);
      } else {
        var url = data.Location
        var result = {
          success : true,
          file: url
        }
        if(req.result == undefined){
          req.result = result;
        }
        else{
          req.result = Object.assign(req.result, result);
        }
        res.json(req.result);
      }//else
    })//send
  //})
}//upload
