var Qna = require('mongoose').model('Qna');
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
  var schema = Qna.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.store != undefined){
    params.qnaStore = req.result.store.id
  }
  if(req.query.qnaType != undefined && req.query.qnaType != "all"){
    params.qnaType = req.query.qnaType;
  }

  Qna.find(params)
  .populate({
    path: 'replies',
    populate : {
      path: 'qnaWriter',
      model: 'User'
    }
  })
  .populate('qnaWriter')
  .populate('qnaStore')
  .exec(function(err, qnas) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        success : true,
        messages : req.flash('error'),
        qnas : qnas
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
  var qna = new Qna(req.body);
  var message = null;

  qna.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 문의",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        qna : qna
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
  Qna.findByIdAndUpdate(req.result.qna.id, req.body, function(err, qna) {
    if (err) {
      return next(err);
    } else {
      qna.updated_at = Date.now();
      var result = {
        title : "Qna Update",
        success : true,
        messages : req.flash('error'),
        qna : qna
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
  Qna.findOne({
    _id: id
  }, function(err, qna) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Qna List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        qna : qna
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
  Qna.findByIdAndUpdate(req.result.qna.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, qna) {
    if (err) {
      return next(err);
    } else {
      qna.updated_at = date;
      var result = {
        title : "Qna Delete",
        success : true,
        messages : req.flash('error'),
        qna : qna
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
