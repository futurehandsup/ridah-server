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
  Header.find(function(err, events) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "이벤트",
        success : true,
        messages : req.flash('error'),
        events : events
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
  var event = new Header(req.body);
  var message = null;

  event.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "이벤트",
        //page : 'events/list2',
        success : true,
        messages : req.flash('error'),
        event : event
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/events/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Header.findByIdAndUpdate(req.result.event.id, req.body, function(err, event) {
    if (err) {
      return next(err);
    } else {
      event.updated_at = Date.now();
      var result = {
        title : "Header Update",
        success : true,
        messages : req.flash('error'),
        event : event
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/events/detail/'+req.event.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Header.findOne({
    _id: id
  }, function(err, event) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Header List",
        //page : 'events/detail',
        success : true,
        messages : req.flash('error'),
        event : event
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
  Header.findByIdAndUpdate(req.result.event.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, event) {
    if (err) {
      return next(err);
    } else {
      event.updated_at = date;
      var result = {
        title : "Header Delete",
        success : true,
        messages : req.flash('error'),
        event : event
      }
      if(req.result == undefined){
        req.result = result;
      }
      else{
        req.result = Object.assign(req.result, result);
      }
      next();
      //return res.redirect('/events/detail/'+req.event.id);
    }
  });
};
