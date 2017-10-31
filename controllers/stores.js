var Store = require('mongoose').model('Store');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'StoreID already exists';
        break;
      default:
        message = 'Something went Wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].
      message;
    }
  }
  return message;
};

exports.findStore = function(req, res, next, id) {
  Store.findOne({
    _id: id
  }, function(err, store) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Store List",
        page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        store : store
      }
      req.result = result;

      return next();
    }
  })
}
exports.getList = function(req, res, next){
  Store.find(function(err, stores) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "승마장 현황",
        page : 'stores/list',
        success : true,
        messages : req.flash('error'),
        stores : stores
      }
      req.result = result;
      next();
    }
  })
}

exports.update = function(req, res, next) {
  Store.findByIdAndUpdate(req.store.id, req.body, function(err, store) {
    if (err) {
      return next(err);
    } else {
      store.updated_at = Date.now();
      var result = {
        title : "Store Update",
        success : true,
        messages : req.flash('error'),
        store : store
      }
      req.result = result;
      next();
      //return res.redirect('/stores/detail/'+req.store.id);
    }
  });
};


// 임시로 생성
exports.registerStore = function(req, res, next) {
  //  if (req.body=="") {
  var store = new Store({
    storename: "승마장 " + Math.random() % 100
  });
  var message = null;

  //store.provider = 'local';

  store.save(function(err) {
    if (err) {
      return next(err);
    } else {
      res.json(store);
      next();
      //return res.redirect('/stores/list');
    }
  });

  //  } else {
  //      return res.redirect('/stores/list');
  //  }
};
exports.renderDetail = function(req, res, next) {
  res.render('stores/detail', {
    title: 'Store List',
    messages: req.flash('error'),
    store: req.store
  });
};
exports.update = function(req, res, next) {
  Store.findByIdAndUpdate(req.store.id, req.body, function(err, store) {
    if (err) {
      return next(err);
    } else {
      store.updated_at = Date.now();
      res.json(store);
      //return res.redirect('/stores/detail/'+req.store.id);
    }
  });
};
//
// exports.renderSignup = function(req,res,next) {
//     if (!req.store) {
//         res.render('stores/signup', {
//             title : 'Sign-up Form',
//             messages : req.flash('error')
//         });
//     } else {
//         return res.redirect('/');
//     }
// };
//

//
// exports.signout = function(req,res) {
//     req.logout();
//     res.redirect('/');
// };
// var Store = require('mongoose').model('Store');
// exports.create = function(req,res,next) {
//   var store = new Store(req.body);
//   store.save(function(err){
//     if(err) {
//       return next(err);
//     } else {
//       res.json(store);
//     }
//   });
// };
// exports.list = function(req,res,next) {
//     Store.find(function(err,stores) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(stores)
//         }
//     })
// };
// exports.read = function(req,res) {
//     res.json(req.store);
// };
// exports.storeByID = function(req,res,next,id) {
//     Store.findOne({
//         _id : id
//     }, function(err, store) {
//         if(err) {
//             return next(err);
//         }else{
//             req.store = store;
//             next();
//         }
//     })
// };
// exports.update = function(req,res,next) {
//     Store.findByIdAndUpdate(req.store.id, req.body, function(err, store) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(store);
//         }
//     });
// };
// exports.delete = function(req,res,next) {
//     req.store.remove(function(err) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(req.store);
//         }
//     })
// };
