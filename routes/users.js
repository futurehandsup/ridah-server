var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var users = require('../controllers/users'),
    passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(users.getList, common.setResponse)        // 사용자 리스트 출력
.post(users.registerOne, common.setResponse)   // 사용자 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/token')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.post(users.login, common.setResponse)
.get(common.notImplementedError)
.delete(common.notImplementedError)
.put(common.notImplementedError);

router.route('/:userId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                         //사용자 정보 출력
.put(users.updateOne, common.setResponse)        //사용자 정보 가져오기
.delete(users.deleteOne, common.setResponse)     //사용자 삭제
.post(common.notImplementedError);

router.param('userId', users.getOne);

var reservations = require('./reservations');
router.use('/:userId/reservations', reservations);

/////////////////////////////
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//router.post('/signup', users.signup);
router.get('/signup', users.renderSignup);

router.get('/signin', users.renderSignin);
router.post('/signin', passport.authenticate('local', {
    /*
    successRedirect : 이 속성은 패스포트에게 성공적으로 사용자를 인증한 다음에 요청을 전환할 위치를 알려준다.
    failureRedirect : 이 속성은 패스포트에게 사용자가 인증에 실해한 다음에 요청을 전환 할 위치를 알려준다.
    failureFlash : 이 속성은 패스포트에게 flash 메시지를 사용할 지 말지를 알려준다.
    */
    //successRedirect : '/',
    //failureRedirect : '/signin',
    failureFlash : true
  }));

router.get('/signout', users.signout);

module.exports = router;
