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

exports.getList = function(req, res, next){
  Notice.find()
  .populate('faqWriter')
  .exec(function(err, faqs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "메인 헤더",
        success : true,
        messages : req.flash('error'),
        faqs : faqs
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
  var faq = new Notice(req.body);
  var message = null;

  faq.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        faq : faq
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
  Notice.findByIdAndUpdate(req.result.faq._id, req.body, function(err, faq) {
    if (err) {
      return next(err);
    } else {
      faq.updated_at = Date.now();
      var result = {
        title : "Notice Update",
        success : true,
        messages : req.flash('error'),
        faq : faq
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
  }, function(err, faq) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Notice List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        faq : faq
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
  Notice.findByIdAndUpdate(req.result.faq._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, faq) {
    if (err) {
      return next(err);
    } else {
      faq.updated_at = date;
      var result = {
        title : "Notice Delete",
        success : true,
        messages : req.flash('error'),
        faq : faq
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
