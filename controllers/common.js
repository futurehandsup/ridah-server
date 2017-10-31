exports.setResponse = function(req, res, next){
  res.json(req.result);
}
exports.renderPage = function(req, res, next){
  res.render(req.result.page, req.result);
}
