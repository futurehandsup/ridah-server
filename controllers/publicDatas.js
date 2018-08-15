var PublicData = require('mongoose').model('PublicData');
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
  var schema = PublicData.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  PublicData.find()
  .populate('publicDataWriter')
  .exec(function(err, publicDatas) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "공공데이터",
        success : true,
        messages : req.flash('error'),
        publicDatas : publicDatas
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
    }
  })
}
exports.registerOne = function(req, res, next) {
  var publicData = new PublicData(req.body);
  var message = null;

  publicData.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        publicData : publicData
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
exports.registerOneFromArg = function(pd) {
  var publicData = new PublicData(pd);
  var message = null;

  publicData.save(function(err) {
    if (err) {
      return next(err);
    } else {
      console.log("saved")
      // var result = {
      //   title : "publicData",
      //   //page : 'stores/list2',
      //   success : true,
      //   messages : req.flash('error'),
      //   publicData : publicData
      // }
      // if(req.result == undefined){
      //   req.result = result;
      // }
      // else{
      //   req.result = Object.assign(req.result, result);
      // }
      // next();
      //return res.redirect('/stores/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  PublicData.findByIdAndUpdate(req.result.publicData._id, req.body, function(err, publicData) {
    if (err) {
      return next(err);
    } else {
      publicData.updated_at = Date.now();
      var result = {
        title : "PublicData Update",
        success : true,
        messages : req.flash('error'),
        publicData : publicData
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
  PublicData.findOne({
    _id: id
  })
  .populate('publicDataWriter')
  .exec(function(err, publicData) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "PublicData List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        publicData : publicData
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
  PublicData.findByIdAndUpdate(req.result.publicData._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, publicData) {
    if (err) {
      return next(err);
    } else {
      publicData.updated_at = date;
      var result = {
        title : "PublicData Delete",
        success : true,
        messages : req.flash('error'),
        publicData : publicData
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
