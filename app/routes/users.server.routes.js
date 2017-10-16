var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/signup')
    .post(users.signup)
    .get(users.renderSignup);

    app.route('/signin')
    .get(users.renderSignin)
    .post(passport.authenticate('local', {
      /*
      successRedirect : 이 속성은 패스포트에게 성공적으로 사용자를 인증한 다음에 요청을 전환할 위치를 알려준다.
      failureRedirect : 이 속성은 패스포트에게 사용자가 인증에 실해한 다음에 요청을 전환 할 위치를 알려준다.
      failureFlash : 이 속성은 패스포트에게 flash 메시지를 사용할 지 말지를 알려준다.
      */
      successRedirect : '/',
      failureRedirect : '/signin',
      failureFlash : true
    }));

    app.get('/signout', users.signout);

};

// var users = require('../../app/controllers/users.server.controller');
//
// module.exports = function(app) {
//     app.route('/users')
//     .post(users.create)
//     .get(users.list);
//
//     app.route('/users/:userId')
//     .get(users.read)
//     .put(users.update)
//     .delete(users.delete);
//
//     app.param('userId', users.userByID);
// };
