var Recommend = require('mongoose').model('Recommend');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'RecommendID already exists';
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
  var schema = Recommend.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  Recommend.find(function(err, recommends) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "추천 승마장",
        success : true,
        messages : req.flash('error'),
        recommends : recommends
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
  var recommend = new Recommend(req.body);
  var message = null;

  recommend.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "추천 승마장",
        //page : 'recommends/list2',
        success : true,
        messages : req.flash('error'),
        recommend : recommend
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/recommends/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Recommend.findByIdAndUpdate(req.result.recommend.id, req.body, function(err, recommend) {
    if (err) {
      return next(err);
    } else {
      recommend.updated_at = Date.now();
      var result = {
        title : "Recommend Update",
        success : true,
        messages : req.flash('error'),
        recommend : recommend
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/recommends/detail/'+req.recommend.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Recommend.findOne({
    _id: id
  }, function(err, recommend) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Recommend List",
        //page : 'recommends/detail',
        success : true,
        messages : req.flash('error'),
        recommend : recommend
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
  Recommend.findByIdAndUpdate(req.result.recommend.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, recommend) {
    if (err) {
      return next(err);
    } else {
      recommend.updated_at = date;
      var result = {
        title : "Recommend Delete",
        success : true,
        messages : req.flash('error'),
        recommend : recommend
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/recommends/detail/'+req.recommend.id);
    }
  });
};
