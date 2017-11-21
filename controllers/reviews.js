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
  Review.find(function(err, reviews) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 후기",
        success : true,
        messages : req.flash('error'),
        reviews : reviews
      }
      req.result = result;
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
      var result = {
        title : "사용자 후기",
        //page : 'stores/list2',
        success : true,
        messages : req.flash('error'),
        review : review
      }
      req.result = result;
      next();
      //return res.redirect('/stores/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Review.findByIdAndUpdate(req.result.review.id, req.body, function(err, review) {
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
      req.result = result;
      next();
      //return res.redirect('/stores/detail/'+req.store.id);
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
      req.result = result;

      return next();
    }
  })
}
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  Review.findByIdAndUpdate(req.result.review.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, review) {
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
      req.result = result;
      next();
      //return res.redirect('/stores/detail/'+req.store.id);
    }
  });
};
