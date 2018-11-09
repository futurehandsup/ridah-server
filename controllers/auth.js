var User = require('mongoose').model('User'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  axios = require('axios');

const ROLES = ['Guest', 'User', 'Owner', 'Admin'];

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

// POST /users/token
exports.checkGrantType = function(req, res, next){
  const { grant_type } = req.body;
  let token;
  //console.log(grant_type)
  switch (grant_type) {
    case "id_pw":
      //아이디 비밀번호 체크후 오류 없으면 올바른 user 객체를 req.user에
      checkGeneralUser(req, res, next);
      break;
    case "kakao_token":
      //카카오 토큰 체크후 오류 없으면 올바른 user 객체를 req.user에
      checkKakaoToken(req, res, next);
      break;
    case "refresh_token":
      // refresh token 검증 후 오류 없으면 올바른 user 객체를 req.user에
      checkRefreshToken(req, res, next);
      break;
    default:
      next(new Error("Proper grant type required"));
    /**
    * 1. grant type 체크
    - general : id, password 값 검증
    - kakao_token : 카카오 토큰 검증 후 문제 없으면..?
    - refresh_token: refresh_token 검증
      2.
    */
  }
}
let checkGeneralUser = function(req, res, next){
  const { userid, password } = req.body;
  let {userRole} = req.params;
  if(userRole == "" || userRole == undefined || userRole==null){
    if(req.params.userRole == undefined) userRole = 'User';
    //else userRole = req.params.userRole;
  }
  User.findOneByUsername(userid)
    .then((user)=>{
      if (!user) {
        // user does not exist
        throw new Error('아이디가 존재하지 않습니다.');
      } else if(ROLES.indexOf(user.role) < ROLES.indexOf(userRole)){
        throw new Error('권한이 없습니다.')
      }else {
        // user exists, check the password
        if (user.authenticate(password)){
          req.user = user;
          next();
        }else{
          throw new Error('잘못된 패스워드입니다.');
        }
      }
    })
    .catch(e=>next(e))
}
let checkKakaoToken = function(req, res, next){
  const { kakao_token } = req.body;
    // GET /v1/user/access_token_info HTTP/1.1
    // Host: kapi.kakao.com
    // Authorization: Bearer {access_token}
    // Content-type: application/x-www-form-urlencoded;charset=utf-8
  axios.get('https://kapi.kakao.com/v1/user/access_token_info',{
    headers: { 'Authorization': `Bearer ${kakao_token}`}
  }).then(function(response) {
    if(response.status!="200" || response.data.id == null){ //에러
      throw new Error(JSON.stringify(response.data))
    }
    else{ // 정상
      let userKakaoId = response.data.id
      User.findOneByKakaoId(userKakaoId)
        .then((user)=>{
          if (!user) {
            // user does not exist
            throw new Error('가입되지 않은 카카오 계정입니다.');
          // } else if(ROLES.indexOf(user.role) < ROLES.indexOf(userRole)){
          //   throw new Error('권한이 없습니다.')
          }else {
            // user exists
            req.user = user;
            next();
          }
        })
        .catch(e=>next(e));
    }
    /*
    //정상
    "id": 899282277, //사용자 아이디
    "expiresInMillis": 42947013,
    "appId": 207442 //앱 아이디
    //에러
    "msg": "this access token does not exist",
    "code": -401
    */
  }).catch((e)=>{next(e)})
}
let checkRefreshToken = function(req, res, next){
  //const secret = req.app.get('jwt-secret');
  const { refresh_token } = req.body
  const refresh_secret = req.app.get('jwt-refresh-secret');

  jwt.verify(refresh_token, refresh_secret, (err, decoded) => {
    if (err){
      res.clearCookie('authToken');
      res.clearCookie('refreshToken');
      return next( new Error('토큰 검증 실패') );
    }
    //에러 없으면
    const { userid } = decoded;
    User.findOneByUsername(userid)
      .then((user)=>{
        if(!user){
          throw new Error('잘못된 토큰입니다.')
        }
        else {
          req.user = user;
          return next();
        }
      })
      .catch(e=>next(e))
  })
}

exports.generateToken = function(req, res, next){
  let user = req.user;
  generateTokenFromUser(user, req)
    .then(tokens =>{

      res.cookie('accessToken', tokens.accessToken);
      res.cookie('refreshToken', tokens.refreshToken);
      var result = {
        title : "로그인",
        success : true,
        messages : 'logged in successfully',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      return next();
    })
    .catch(e=>next(e))
}
let generateTokenFromUser = function(user, req){
  return new Promise((resolve, reject)=>{
    let userInfo = {
        _id: user._id,
        userid: user.userid,
        username: user.username,
        role: user.role
      };
    const secret = req.app.get('jwt-secret');
    const refresh_secret = req.app.get('jwt-refresh-secret');
    console.log(secret)
    let token = jwt.sign(userInfo, secret,
      { expiresIn: '7d', issuer: 'anymal.com', subject: 'userInfo'})
    let refreshToken = jwt.sign(userInfo, refresh_secret,
      { expiresIn: '30d', issuer: 'anymal.com', subject: 'userInfo'})

    if(token == null || refreshToken == null){
      reject(new Error("토큰 생성 실패"))
    }
    let tokens = {
      accessToken : token,
      refreshToken: refreshToken
    }
    resolve(tokens)
  });
}

//아이디, 비밀번호로 로그인 - 토큰 받음
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
          throw new Error('아이디가 존재하지 않습니다.')
        } else if(ROLES.indexOf(user.role) < ROLES.indexOf(userRole)){
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
                  username: user.username,
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

//토큰 체크
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
            throw new Error('토큰 검증 실패')
            //res.redirect(req.originalUrl);
            //reject(err)
          }
          resolve(decoded)
        })
      }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
      if(ROLES.indexOf(token.role) < ROLES.indexOf(userRole)){
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
    }

    // process the promise
    p.then(respond).catch(onError)
  }
}

// 토큰 유효성 체크 middleware
exports.authenticate = (req, res, next) => {
  let result = {
    title : "인증",
    //page : 'users/detail',
    success : true,
    messages : '사용자 인증 절차',
    info : null
  }
  //3) 권한 체크는 각 컨트롤러에서, 컨트롤러에 인증값 전달
  const respond = (token) => {
    result.info = token;

    if(req.result == undefined){
      req.result = result;
    }
    else{
      req.result = Object.assign(req.result, result);
    }
    return next();
  }
  const onError = (error) => {
    return next(error);
  }

  //1) Header에 x-access-token 검사
  const token = req.headers['x-access-token'] || req.query.token

  if(token == null || token == undefined || token == "null" || token == "undefined"){ //(1)토큰이 없으면 guest로 설정
    return respond(null)
  }

  // 2) token verify
  const verifyToken = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err){
          // (1) 실패: 에러
          res.clearCookie('authToken');
          throw new Error('토큰 검증 실패 : ' + err.message)
        }
        //(2) 성공 : 권한 체크 후 기능 실행
        resolve(decoded)
      })
    }
  )

  //실행
  verifyToken.then(respond).catch(onError);

}

// 권한 체크
exports.hasAuthority = (tobe, force) => {
  return (req, res, next) =>{
    if(tobe == null) tobe = ROLES[0]; //userRole : tobe
    let err = new Error('권한 없음');
    let hasAuth = true;

    let token = req.result.info;
    if(token == null){
      token = { role : ROLES[0] } //user = guest
    }

    if(ROLES.indexOf(token.role) < ROLES.indexOf(tobe)){
      hasAuth = false;
    }
    else{
      if(userRole == 'User'){
        if(token._id != req.result.user._id){
          hasAuth = false;
        }
      }
      else if(userRole == 'Owner'){
        if(token._id != req.result.store.owner){
          hasAuth = false;
        }
      }
    }
  }
}

exports.logout = (req, res, next) =>{
  // 쿠키 삭제
  res.clearCookie('authToken');

  // 헤더값 삭제
  req.headers['x-access-token']= "";

  return next();
}
