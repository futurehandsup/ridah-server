var User = require('mongoose').model('User'),
  jwt = require('jsonwebtoken'),
  passport = require('passport');

var roles = ['User', 'Owner', 'Admin'];

var getErrorMessage = function(err) {
  var message = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'UserID already exists';
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
exports.login = function(userRole){
  return function(req, res, next) {
      if(userRole == "" || userRole == undefined || userRole==null){
        if(req.params.userRole == undefined) userRole = 'User';
        else userRole = req.params.userRole;
      }
      const {
        userid,
        password
      } = req.body
      const {user} = req.body
      const secret = req.app.get('jwt-secret')

      // check the user info & generate the jwt
      const check = (user) => {
        if (!user) {
          // user does not exist
          throw new Error('login failed')
        } else if(roles.indexOf(user.role) < roles.indexOf(userRole)){
          throw new Error('권한이 없습니다.')
        }else {
          // user exists, check the password
          if (user.authenticate(password)) {
            // create a promise that generates jwt asynchronously
            // 토큰 발급.
            const p = new Promise((resolve, reject) => {
              jwt.sign({
                  _id: user._id,
                  userid: user.userid,
                  role: user.role
                },
                secret, {
                  expiresIn: '7d',
                  issuer: 'ridehigh.com',
                  subject: 'userInfo'
                }, (err, token) => {
                  if (err) reject(err)
                  resolve(token)
                })
            })
            return p
          } else {
            throw new Error('비밀번호가 틀려욤')
          }
        }
      }
      // respond the token
      const respond = (token) => {
        //성공 시 쿠키에 토큰 저장
        res.cookie('authToken', token);

        var result = {
          title : "로그인",
          //page : 'users/detail',
          success : true,
          messages : 'logged in successfully',
          token
        }
        if(req.result == undefined){
          req.result = result;
        }
        else{
          req.result = Object.assign(req.result, result);
        }
        return next();
      }

      // error occured
      const onError = (error) => {
        return next(error);
        // var result = {
        //   title : "로그인 실패",
        //   //page : 'users/detail',
        //   success : false,
        //   messages : error.message,
        // }
        // if(req.result == undefined){
        //   req.result = result;
        // }
        // else{
        //   req.result = Object.assign(req.result, result);
        // }
        // return next();
      }

      // find the user
      User.findOneByUsername(userid)
        .then(check)
        .then(respond)
        .catch(onError)
  }
}

exports.check = function(userRole){
  return function(req, res, next){// read the token from header or url
    if(userRole == "" || userRole == undefined || userRole==null){
      if(req.params.userRole == undefined) userRole = 'User';
      else userRole = req.params.userRole;
    }
    const token = req.headers['x-access-token'] || req.query.token
    // token does not exist
    if (!token) {
      // error occured
      var result = {
        title : "로그인 실패",
        success : false,
        messages : '로그인해 주세요.',
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      return next();
    }

    // create a promise that decodes the token
    const p = new Promise(
      (resolve, reject) => {
        jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
          if (err){
            res.clearCookie('authToken');
            res.redirect(req.originalUrl);
            //reject(err)
          }
          resolve(decoded)
        })
      }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
      if(roles.indexOf(token.role) < roles.indexOf(userRole)){
        throw new Error('권한이 없습니다.')
      }
      var result = {
        title : "로그인",
        //page : 'users/detail',
        success : true,
        messages : 'logged in successfully',
        info : token
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      return next();
    }

    // if it has failed to verify, it will return an error message
    // error occured
    const onError = (error) => {
      return next(error);
      // var result = {
      //   title : "로그인 실패",
      //   //page : 'users/detail',
      //   success : false,
      //   messages : error.message,
      // }
      // if(req.result == undefined){
      //   req.result = result;
      // }
      // else{
      //   req.result = Object.assign(req.result, result);
      // }
      // return next();
    }

    // process the promise
    p.then(respond).catch(onError)
  }
}

exports.logout = (req, res, next) =>{
  // 쿠키 삭제
  res.clearCookie('authToken');

  // 헤더값 삭제
  req.headers['x-access-token']= "";

  return next();
}
