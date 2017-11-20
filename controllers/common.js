exports.setResponse = function(req, res, next){
  res.json(req.result);
}
exports.redirect = function(page){
  return function(req, res, next){
    res.render(page);
  }
}
exports.renderPage = function(page){
  return function(req, res, next){
    res.render(page, req.result);
  }
}
exports.notImplementedError = function(req, res, next) {
  next(new Error('not implemented'));
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
    req.result = result;
    res.json(req.result);
  }
};
