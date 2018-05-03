var Review = require('mongoose').model('Review');
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
  var schema = Review.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = {};
  if(req.result != undefined && req.result.store != undefined){
    params.reviewStore = req.result.store._id
  }
  if(req.query.reviewType != undefined && req.query.reviewType != "all"){
    params.reviewType = req.query.reviewType;
  }

  let query = Review.find(params)
  if(req.originalUrl.includes("detail")){ //store 요약본에는 최대 3개까지만 출력
    query.limit(3)
  }
  query.populate({
    path: 'replies',
    populate : {
      path: 'reviewWriter',
      model: 'User'
    }
  })
  .populate('reviewStore')
  .populate('reviewWriter')
  .sort({created_at : 1}) //최신순
  .exec(function(err, reviews) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 후기",
        success : true,
        messages : req.flash('error'),
        reviews : reviews
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
  var review = new Review(req.body);
  var message = null;
  review.save(function(err) {
    if (err) {
      return next(err);
    } else {
        console.log('aa');
      var result = {
        title : "사용자 후기",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        review : review
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
  Review.findByIdAndUpdate(req.result.review._id, req.body, function(err, review) {
    if (err) {
      return next(err);
    } else {
      review.updated_at = Date.now();
      var result = {
        title : "Review Update",
        success : true,
        messages : req.flash('error'),
        review : review
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
  Review.findOne({
    _id: id
  }, function(err, review) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Review List",
        //page : 'stores/detail',
        success : true,
        messages : req.flash('error'),
        review : review
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
  Review.findByIdAndUpdate(req.result.review._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, review) {
    if (err) {
      return next(err);
    } else {
      review.updated_at = date;
      var result = {
        title : "Review Delete",
        success : true,
        messages : req.flash('error'),
        review : review
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
