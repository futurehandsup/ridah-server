var Header = require('mongoose').model('Header');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'HeaderID already exists';
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
  Header.find(function(err, headers) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
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
        title : "메인 헤더",
        //page : 'headers/list2',
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
      //return res.redirect('/headers/list');
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
      //return res.redirect('/headers/detail/'+req.header.id);
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
        //page : 'headers/detail',
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
      //return res.redirect('/headers/detail/'+req.header.id);
    }
  });
};
