var Header = require('mongoose').model('Header');
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
  var schema = Header.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.store != undefined){
    params.headerStore = req.result.store.id
  }
  if(req.query.headerType != undefined && req.query.headerType != "all"){
    params.headerType = req.query.headerType;
  }

  Header.find(params)
  .populate({
    path: 'replies',
    populate : {
      path: 'headerWriter',
      model: 'User'
    }
  })
  .populate('headerWriter')
  .exec(function(err, headers) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        success : true,
        messages : req.flash('error'),
        headers : headers
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
  var header = new Header(req.body);
  var message = null;

  header.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        header : header
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
  Header.findByIdAndUpdate(req.result.header.id, req.body, function(err, header) {
    if (err) {
      return next(err);
    } else {
      header.updated_at = Date.now();
      var result = {
        title : "Header Update",
        success : true,
        messages : req.flash('error'),
        header : header
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
  Header.findOne({
    _id: id
  }, function(err, header) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Header List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        header : header
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
  Header.findByIdAndUpdate(req.result.header.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, header) {
    if (err) {
      return next(err);
    } else {
      header.updated_at = date;
      var result = {
        title : "Header Delete",
        success : true,
        messages : req.flash('error'),
        header : header
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
