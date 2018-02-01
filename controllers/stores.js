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

exports.getSchemas = function(req, res, next){
  var schema = Store.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = [];
  var geoParams = {};
  var keywordParams = {};
  var q = Store;

  if(req.query.gps != undefined){
    let coord = req.query.gps.split(',')
    geoParams = {
      $geoNear : {
        near: { type: "Point", coordinates: [ Number(coord[1]), Number(coord[0]) ] },
        distanceField: "distance",
        distanceMultiplier: 0.001,
        spherical: true
      }
    };
    params.push(geoParams)
  }
  if(req.query.keyword != undefined ){
    keywordParams = { $match : {storename : {$regex : req.query.keyword} }}
  }
  else{
    keywordParams = { $match : {storename : {$regex : ""}}}
  }
  params.push(keywordParams)

  q.aggregate(params).exec(function(err, stores) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "승마장 현황",
        success : true,
        messages : req.flash('error'),
        stores : stores
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
exports.registerOne = function(req, res, next) {
  var store = new Store(req.body);
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
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
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
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/stores/detail/'+req.store.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  // 데모용 코드
  var params = {};
  if(id != undefined){
    params = {
      _id : id
    }
  };
  Store.findOne(params, function(err, store) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Store",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        store : store
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
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/stores/detail/'+req.store.id);
    }
  });
};
