var Program = require('mongoose').model('Program');
var User = require('mongoose').model('User');
//passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'ProgramID already exists';
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
  var schema = Program.schema.paths;

  req.result.schema = schema;
  next();
}

exports.getList = function(req, res, next){
  var params = null;
  if(result.store != undefined){
    params.store = result.store.id
  }
  Program.find(params, function(err, programs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "예약 현황",
        success : true,
        messages : req.flash('error'),
        programs : programs
      }
      req.result = result;
      next();
    }
  })
}
exports.registerOne = function(req, res, next) {
  var program = new Program(req.body);
  var message = null;

  program.save(function(err) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용자 현황",
        //page : 'programs/list2',
        success : true,
        messages : req.flash('error'),
        program : program
      }
      req.result = result;
      next();
      //return res.redirect('/programs/list');
    }
  });
};
exports.updateOne = function(req, res, next) {
  Program.findByIdAndUpdate(req.result.program.id, req.body, function(err, program) {
    if (err) {
      return next(err);
    } else {
      program.updated_at = Date.now();
      var result = {
        title : "Program Update",
        success : true,
        messages : req.flash('error'),
        program : program
      }
      req.result = result;
      next();
      //return res.redirect('/programs/detail/'+req.program.id);
    }
  });
};
exports.getOne = function(req, res, next, id) {
  Program.findOne({
    _id: id
  }, function(err, program) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "Program List",
        //page : 'programs/detail',
        success : true,
        messages : req.flash('error'),
        program : program
      }
      req.result = result;

      return next();
    }
  })
}
exports.deleteOne = function(req, res, next) {
  var date = Date.now();
  Program.findByIdAndUpdate(req.result.program.id, { $set: { deleted : { is_deleted: true, deleted_at: date } }}, function(err, program) {
    if (err) {
      return next(err);
    } else {
      program.updated_at = date;
      var result = {
        title : "Program Delete",
        success : true,
        messages : req.flash('error'),
        program : program
      }
      req.result = result;
      next();
      //return res.redirect('/programs/detail/'+req.program.id);
    }
  });
};
