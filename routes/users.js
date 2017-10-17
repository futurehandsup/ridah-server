var express = require('express');
var router = express.Router();

var users = require('../controllers/users'),
    passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup', users.signup);
router.get('/signup', users.renderSignup);

router.get('/signin', users.renderSignin);
router.post('/signin',passport.authenticate('local', {
  /*
  successRedirect : 이 속성은 패스포트에게 성공적으로 사용자를 인증한 다음에 요청을 전환할 위치를 알려준다.
  failureRedirect : 이 속성은 패스포트에게 사용자가 인증에 실해한 다음에 요청을 전환 할 위치를 알려준다.
  failureFlash : 이 속성은 패스포트에게 flash 메시지를 사용할 지 말지를 알려준다.
  */
  successRedirect : '/',
  failureRedirect : '/signin',
  failureFlash : true
}));

router.get('/signout', users.signout);

module.exports = router;
