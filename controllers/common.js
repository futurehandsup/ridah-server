exports.setResponse = function(req, res, next){
  if(req.query != undefined){
    req.result.query =  req.query;
  }
  res.json(req.result);
}
exports.redirect = function(page){
  return function(req, res, next){
    res.redirect(page);
  }
}
exports.renderPage = function(page){
  return function(req, res, next){
    if(req.query != undefined){
      req.result.query =  req.query;
    }
    res.render(page, req.result);
  }
}
exports.notImplementedError = function(req, res, next) {
  next(new Error('not implemented'));
}
exports.setAuthHeaders = function(req, res, next){
  if(req.cookies != undefined  && req.cookies.authToken != undefined){
    const authToken = req.cookies.authToken;
    if(authToken != undefined){
      req.headers['x-access-token'] = authToken;
    }
  }
  return next();
}

exports.isAuthenticated = function (req, res, next) {

  if (req.isAuthenticated()){
    return next();
  }
  else{
    var result = {
      success : false,
      messages : "Not Authenticated Error. Please Log in or Sign up."
    }
    if(req.result == undefined){
      req.result = result;
    }
    else{
      req.result = Object.assign(req.result, result);
    }
    res.json(req.result);
  }
};

exports.uploadFileToS3 = function(req, res, next){

  var AWS = require('aws-sdk');

  const keys = require('../config/env/aws-credential.json');
  AWS.config.update({ accessKeyId : keys.accessKeyId,
                      secretAccessKey : keys.secretAccessKey,
                      region : keys.region});

  var fileObj = req.file;

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
  var s3_params = {
    Bucket: 'ridahonhill',
    Key: date+"_"+fileObj.originalname,
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
