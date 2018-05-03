var Event = require('mongoose').model('Event');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'EventID already exists';
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
  var schema = Event.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  Event.find(function(err, events) {
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
  var event = new Event(req.body);
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
  Event.findByIdAndUpdate(req.result.event._id, req.body, function(err, event) {
    if (err) {
      return next(err);
    } else {
      event.updated_at = Date.now();
      var result = {
        title : "Event Update",
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
      //return res.redirect('/events/detail/'+req.event._id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Event.findOne({
    _id: id
  }, function(err, event) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Event List",
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
  Event.findByIdAndUpdate(req.result.event._id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, event) {
    if (err) {
      return next(err);
    } else {
      event.updated_at = date;
      var result = {
        title : "Event Delete",
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
      //return res.redirect('/events/detail/'+req.event._id);
    }
  });
};
