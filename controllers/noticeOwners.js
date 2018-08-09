var NoticeOwner = require('mongoose').model('NoticeOwner');
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
  var schema = NoticeOwner.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  NoticeOwner.find()
  .populate('noticeWriter')
  .exec(function(err, noticeOwners) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        noticeOwners : noticeOwners
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
  var noticeOwner = new NoticeOwner(req.body);
  var message = null;

  noticeOwner.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        noticeOwner : noticeOwner
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
  NoticeOwner.findByIdAndUpdate(req.result.noticeOwner._id, req.body, function(err, noticeOwner) {
    if (err) {
      return next(err);
    } else {
      noticeOwner.updated_at = Date.now();
      var result = {
        title : "NoticeOwner Update",
        success : true,
        messages : req.flash('error'),
        noticeOwner : noticeOwner
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
  NoticeOwner.findOne({
    _id: id
  })
  .populate('noticeWriter')
  .exec(function(err, noticeOwner) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "NoticeOwner List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        noticeOwner : noticeOwner
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
  NoticeOwner.findByIdAndUpdate(req.result.noticeOwner._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, noticeOwner) {
    if (err) {
      return next(err);
    } else {
      noticeOwner.updated_at = date;
      var result = {
        title : "NoticeOwner Delete",
        success : true,
        messages : req.flash('error'),
        noticeOwner : noticeOwner
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
