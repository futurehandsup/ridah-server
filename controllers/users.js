var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function(err) {
    var message = '';
    if(err.code) {
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
        if(err.errors[errName].message) message = err.errors[errName].message;
      }
    }
    return message;
};
exports.getSchemas = function(req, res, next){
  var schema = User.schema.paths;

  req.result.schema = schema;
  next();
}

//사용자 리스트 불러오기
exports.getList = function(req, res, next){
  User.find(function(err, users) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        success : true,
        messages : req.flash('error'),
        users : users
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
    }
  });
}
//사용자 등록
exports.registerOne = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body.user);
    var message = null;

    user.provider = 'local';

    user.save(function(err) {
      //console.log('save');
      if(err) {
        message = getErrorMessage(err);
        req.flash('error', message);
        return next(err);
      }
      else{
        var result = {
          title : "사용자 등록",
          //page : 'users/list2',
          success : true,
          messages : req.flash('error'),
          user : user
        }
        if(req.result == undefined){
          req.result = result;
        }
        else{
          req.result = Object.assign(req.result, result);
        }
        next();
      }
    });
  }
};
exports.updateOne = function(req, res, next) {
  User.findByIdAndUpdate(req.result.user._id, req.body, function(err, user) {
    if (err) {
      return next(err);
    } else {
      user.updated_at = Date.now();
      var result = {
        title : "User Update",
        success : true,
        messages : req.flash('error'),
        user : user
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/users/detail/'+req.user._id);
    }
  });
};
//사용자 불러오기 -- 관리자용
exports.getOne = function(req, res, next, id) {
  var params = {};
  if(id != undefined){
    params = {
      _id : id
    }
  };
  User.findOne(params)
  .select('-salt -provider -password')
  .exec(function(err, user) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "User List",
        //page : 'users/detail',
        success : true,
        messages : req.flash('error'),
        user : user
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }

      return next();
    }
  })
}
//사용자 삭제
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  User.findByIdAndUpdate(req.result.user._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, user) {
    if (err) {
      return next(err);
    } else {
      user.updated_at = date;
      var result = {
        title : "User Delete",
        success : true,
        messages : req.flash('error'),
        user : user
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/users/detail/'+req.user._id);
    }
  });
};

//로그인
exports.login = function(req, res, next) {
  var user = req.body.user;
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash("user 없음 ")
    }
    req.login(user, function(err) {
      if (err) { return next(err); }
      var result = {
        title : "User login",
        success : true,
        messages : req.flash('error'),
        user : user
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
    });
  })(req, res, next);
};
//로그아웃
exports.signout = function(req,res) {
  req.logout();
  next();
};

exports.addZzimStore = function(req, res, next){
  let user = req.result.user;
  if(user == null){
    req.flash("user 없음 ");
  }
  else{
    user.zzim(req.query.zzimStoreId)
    //user.save()
    var result = {
      title : "Zzim store",
      success : true,
      messages : req.flash('error'),
      user : user
    }
    if(req.result == undefined){
      req.result = result;
    }
    else{
      req.result = Object.assign(req.result, result);
    }
    next();
  }
}
exports.deleteZzimStore = function(req, res, next){
  let user = req.result.user;
  if(user == null){
    req.flash("user 없음 ");
  }
  else{
    user.unzzim(req.query.zzimStoreId)
  //  user.save()
    var result = {
      title : "Unzzim store",
      success : true,
      messages : req.flash('error'),
      user : user
    }
    if(req.result == undefined){
      req.result = result;
    }
    else{
      req.result = Object.assign(req.result, result);
    }
    next();
  }
}


//회원가입 -- 안씀
// exports.signup = function(req,res,next) {
//     if (!req.user) {
//         var user = new User(req.body);
//         var message = null;
//
//         user.provider = 'local';
//
//         user.save(function(err) {
//             console.log('save');
//             if(err) {
//                 message = getErrorMessage(err);
//
//                 req.flash('error', message);
//                 return res.redirect('/signup');
//             }
//             req.login(user, function(err) {
//                 if (err) return next(err);
//                 return res.redirect('/');
//             });
//         });
//     } else {
//         return res.redirect('/');
//     }
// };
// exports.signout = function(req,res) {
//     req.logout();
//     res.redirect('/');
// };

exports.renderSignin = function(req, res, next) {
    if(!req.body.user) {
        res.render('users/signin', {
            title : 'Sign-in Form',
            messages : req.flash('error') || req.flash('info')
        });
    }else {
        return res.redirect('/');
    }
};

exports.renderSignup = function(req,res,next) {
    if (!req.body.user) {
        res.render('users/signup', {
            title : 'Sign-up Form',
            messages : req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};
// var User = require('mongoose').model('User');
// exports.create = function(req,res,next) {
//   var user = new User(req.body);
//   user.save(function(err){
//     if(err) {
//       return next(err);
//     } else {
//       res.json(user);
//     }
//   });
// };
// exports.list = function(req,res,next) {
//     User.find(function(err,users) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(users)
//         }
//     })
// };
// exports.read = function(req,res) {
//     res.json(req.user);
// };
// exports.userByID = function(req,res,next,id) {
//     User.findOne({
//         _id : id
//     }, function(err, user) {
//         if(err) {
//             return next(err);
//         }else{
//             req.user = user;
//             next();
//         }
//     })
// };
// exports.update = function(req,res,next) {
//     User.findByIdAndUpdate(req.user._id, req.body, function(err, user) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(user);
//         }
//     });
// };
// exports.delete = function(req,res,next) {
//     req.user.remove(function(err) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(req.user);
//         }
//     })
// };
