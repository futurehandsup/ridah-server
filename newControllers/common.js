exports.setResponse = function(req, res, next){
  if(req.result == null){
    req.result = {}
  }
  if(Object.keys(req.query).length != 0 && req.query != null){
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
    if(req.result == null){
      req.result = {}
    }
    if(Object.keys(req.query).length != 0 && req.query != null){
      req.result.query = req.query;
    }else{
      req.result.query = {};
    }
    console.log(req.body)
    if(Object.keys(req.body).length != 0 && req.body != null){
      req.result.body = req.body;
    }else{
      req.result.body = {};
    }
    res.render(page, req.result);
  }
}
exports.notImplementedError = function(req, res, next) {
  next(new Error('This method is not implemented'));
}
exports.setPage = function(req, res, next){
  if(req.query == null){
    req.query = {
      page : 1
    }
  }
  else if(req.query.page == null || req.query.page ==""){
    req.query.page = 1;
  }
  next();
}
exports.setResult = function(req, result){
  if(req.result == undefined){
    req.result = result;
    req.result.ogmeta = {
      title: "애니말",
      description: "애니애니말말!",
    //  image: "",
    }
    req.result.userAgent = req.headers['user-agent'];
    req.result.needPopup = true;
  }
  else{
    req.result = Object.assign(req.result, result);
  }
}
exports.setTitle = function(title){
  return function(req, res, next){
    if(req.result == null){
      req.result = {}
    }
    req.result.title = title;
    next();
  }
}
exports.setBody = function(key, value){
  return function(req, res, next){
    if(req.body == null){
      req.body = {}
    }
    req.body[key] = value;
    next();
  }
}
exports.getErrorMessage = function(err) {
  var message = '';
  //요부분은 다시 작성해야할듯
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'id already exists';
        break;
      default:
        message = 'Something went Wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.initDatabase = function(){
  var mysql = require('mysql');
  var dbconfig = process.env.NODE_ENV == 'production' ? "real" : "dev"
  //console.log(dbconfig)
  var config = require('../config/env/db')[dbconfig];
  return mysql.createPool({
    multipleStatements: true,
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    charset : 'utf8mb4',
    connectionLimit: 40,
  })
}
exports.test = function (con) {
  con.connect(function (err) {
    if (err) {
      console.error('mysql connection error :' + err);
    } else {
      //console.info('mysql is connected successfully.');
    }
  })
}
exports.createSalt = function(){
  let crypto = require('crypto');
  let salt = crypto.randomBytes(64).toString ('base64');
  //console.log(salt)
  return salt;
}
// 비밀번호 암호화
exports.hashPassword = function(password, salt){
  let hashed;
  let crypto = require('crypto');
  //암호화 로직 작성
  // hashed = crypto.pbkdf2Sync(password, salt, 10392, 64).toString('base64');
  hashed = crypto.pbkdf2Sync(password, salt, 10392, 64, 'sha512').toString('base64');
  return hashed;
}
const CIPHER_KEY = "bBq!ChickeN!GoldeN!fRied!JMT!jmt";
const CIPHER_IV = new Buffer("goLdEn@olIVe$bBq");
exports.cipherPassword = function(password){
  let crypto = require('crypto');

  var cipher = crypto.createCipheriv('aes-256-cbc', CIPHER_KEY, CIPHER_IV);

  var cipheredOutput = cipher.update(password, "utf8", "base64"); // 암호형식 정리해주어야함
  cipheredOutput += cipher.final('base64');
  return cipheredOutput;
}
exports.decipherPassword = function(password, callback){
  let crypto = require('crypto');
  try{
    var decipher = crypto.createDecipheriv('aes-256-cbc', CIPHER_KEY, CIPHER_IV);

    var decipheredOutput = decipher.update(password, "base64", "utf8"); // 암호형식 정리해주어야함
    decipheredOutput += decipher.final('utf8');
    return decipheredOutput;
  }
  catch(e){
    return callback(e)
  }
}
