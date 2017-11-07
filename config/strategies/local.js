var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
  passport.use(new LocalStrategy({ // or whatever you want to use
    usernameField: 'userid',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
  }, function(userid, password, done) {
    User.findOne({
      userid : userid
    }, function(err, user){
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, {
            message : 'Unknown user'
        });
      }
      if(!user.authenticate(password)) {
        return done(null, false, {
          message : 'Invalid password'
        });
      }
      return done(null, user);
    });
  }));
};
