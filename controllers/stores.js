var Store = require('mongoose').model('Store');
var User = require('mongoose').model('User');
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

exports.getList = function(req, res, next){
  Store.find(function(err, stores) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "승마장 현황",
        //page : 'stores/list',
        success : true,
        messages : req.flash('error'),
        stores : stores
      }
      req.result = result;
      next();
    }
  })
}
// 임시로 생성
exports.registerOne = function(req, res, next) {
  //  if (req.body=="") {
  var store = new Store({
    storename: "승마장 " + Math.random() % 100
  });
  var message = null;

  store.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        store : store
      }
      req.result = result;
      next();
      //return res.redirect('/stores/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Store.findByIdAndUpdate(req.result.store.id, req.body, function(err, store) {
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
exports.getOne = function(req, res, next, id) {
  Store.findOne({
    _id: id
  }, function(err, store) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Store List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        store : store
      }
      req.result = result;

      return next();
    }
  })
}
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  Store.findByIdAndUpdate(req.result.store.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, store) {
    if (err) {
      return next(err);
    } else {
      store.updated_at = date;
      var result = {
        title : "Store Delete",
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

// 임시
exports.getList2 = function(req, res, next){
  User.find(function(err, users) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        users : users
      }
      req.result = result;
      next();
    }
  })
}
