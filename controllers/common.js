exports.setResponse = function(req, res, next){
  res.json(req.result);
}
// exports.renderPage = function(req, res, next){
//   res.render(req.result.page, req.result);
// }
exports.renderPage = function(page){
  return function(req, res, next){
    res.render(page, req.result);
  }
}
exports.notImplementedError = function(req, res, next) {
  next(new Error('not implemented'));
}
