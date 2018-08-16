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
  var filterParams = {};
  var q = Store;

  if(req.query.gps != undefined){
    let coord = req.query.gps.split(',')
    let maxDistance = (req.query.maxDistance!=null)? req.query.maxDistance : 50;
    geoParams = {
      $geoNear : {
        near: { type: "Point", coordinates: [ Number(coord[1]), Number(coord[0]) ] },
        distanceField: "distance",
        distanceMultiplier: 0.001,
        spherical: true,
        maxDistance: maxDistance*1000, // 최대치 설정할수있게*/
      }
    };
    params.push(geoParams)
  }
  if(req.query.keyword != undefined ){
    keywordParams = { $match :
      {$or : [
        {storename : {$regex : req.query.keyword} },
        {address : {$regex : req.query.keyword} }
      ]}
    }
  }
  else{
    keywordParams = { $match : {storename : {$regex : ""}}}
  }
  params.push(keywordParams)

  let filterQueries = Object.keys(req.query).filter((item)=>{
     return (item.includes('filter_', 0)) ? true : false
  });
  if(filterQueries.length > 0){
    let f = {}
    for(var item of filterQueries){
      var filter = req.query[item].split(',').map((x)=>parseInt(x))
      f[item]= { $in : filter } // filter_age : { $in : [ ]}
    }
    filterParams = { $match : f }
  }
  else if(req.query.filter != undefined ){
    var filter = req.query.filter.split(',')
    var f = {}
    filter.map((i)=> (f[i]=true))
    filterParams = { $match : f }
    //console.log(filterParams)
  }
  else{
    filterParams = { $match : {}}
  }
  params.push(filterParams)

  q.aggregate(params).exec(function(err, s) {
    if (err) {
      return next(err);
    } else {
      Store.populate(s, {path: "programs" }, function(err, stores){
        if (err) {
          return next(err);
        } else {
          if(req.result.user != null){
            stores.map((item)=>{
              item.isZzimed = (req.result.user.isZzimed(item._id))
            });
          }
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
  });
}
exports.registerOne = function(req, res, next) {
  if(req.body.tag != null){
    req.body.tag = req.body.tag.split(',').map((i)=>i.trim());
  }
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
  if(req.body.tag != null){
    req.body.tag = req.body.tag.split(',').map((i)=>i.trim());
  }
  Store.findByIdAndUpdate(req.result.store._id, req.body, function(err, store) {
    if (err) {
      return next(err);
    } else {
      store.updated_at = Date.now(); //?????
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
      //return res.redirect('/stores/detail/'+req.store._id);
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
  Store.findOne(params)
  .populate('publicData')
  .exec(function(err, store) {
    if (err) {
      return next(err);
    } else {
      if(req.result != null && req.result.user != null && store != null){
        store = store.toObject();
        //  store.set({isZzimed : req.result.user.isZzimed(store._id)});
        store.isZzimed = req.result.user.isZzimed(store._id)
      }
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
  Store.findByIdAndUpdate(req.result.store._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, store) {
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
      //return res.redirect('/stores/detail/'+req.store._id);
    }
  });
};
