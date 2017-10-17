exports.render = function(req,res,next) {
    res.render('index', {
        title : 'Hello World',
        username : req.user ? req.user.username : ''
    });
};
