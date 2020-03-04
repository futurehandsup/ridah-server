var Notice = require('mongoose').model('Notice');
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
  var schema = Notice.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next, noticeNormalYn){
  Notice.find()
  .populate('noticeWriter')
  .exec(function(err, notices) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        notices : notices
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
  var notice = new Notice(req.body);
  var message = null;

  notice.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        notice : notice
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
  Notice.findByIdAndUpdate(req.result.notice._id, req.body, function(err, notice) {
    if (err) {
      return next(err);
    } else {
      notice.updated_at = Date.now();
      var result = {
        title : "Notice Update",
        success : true,
        messages : req.flash('error'),
        notice : notice
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
  Notice.findOne({
    _id: id
  })
  .populate('noticeWriter')
  .exec(function(err, notice) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Notice List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        notice : notice
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
  Notice.findByIdAndUpdate(req.result.notice._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, notice) {
    if (err) {
      return next(err);
    } else {
      notice.updated_at = date;
      var result = {
        title : "Notice Delete",
        success : true,
        messages : req.flash('error'),
        notice : notice
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
