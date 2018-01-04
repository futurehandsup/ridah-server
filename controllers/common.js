
exports.setResponse = function(req, res, next){
  if(req.query != undefined){
    req.result.query =  req.query;
  }
  res.json(req.result);
}
exports.redirect = function(page){
  return function(req, res, next){
    res.redirect(page);
  }
}
exports.renderPage = function(page){
  return function(req, res, next){
    if(req.query != undefined){
      req.result.query =  req.query;
    }
    res.render(page, req.result);
  }
}
exports.notImplementedError = function(req, res, next) {
  next(new Error('not implemented'));
}
exports.setAuthHeaders = function(req, res, next){
  if(req.cookies != undefined  && req.cookies.authToken != undefined){
    const authToken = req.cookies.authToken;
    if(authToken != undefined){
      req.headers['x-access-token'] = authToken;
    }
  }
  return next();
}

exports.isAuthenticated = function (req, res, next) {

  if (req.isAuthenticated()){
    return next();
  }
  else{
    var result = {
      success : false,
      messages : "Not Authenticated Error. Please Log in or Sign up."
    }
    if(req.result == undefined){
      req.result = result;
    }
    else{
      req.result = Object.assign(req.result, result);
    }
    res.json(req.result);
  }
};
