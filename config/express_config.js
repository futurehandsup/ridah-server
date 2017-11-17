var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    config = require('./config'),              //세션 사용
    session = require('express-session')       //세션 사용
    passport = require('passport')
    flash = require('connect-flash')
    ;

module.exports = function() {
    var app = express();

    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended : true
    }));
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({                        // 세션 사용
        saveUninitialized : true,         //초기화되지 않은 세션정보도 저장되는지
        resave : true,                    //같은 세션정보라도 다시 저장할건지
        secret : config.sessionSecret     //비밀키 설정.
    }));

    // view engine setup
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());    // 추가
    app.use(passport.session());       // 추가

    var index = require('../routes/index');
    var users = require('../routes/users');
    var stores = require('../routes/stores');
    var reviews = require('../routes/reviews');
    var qnas = require('../routes/qnas');
    var admin = require('../routes/admin'); // 관리자 페이지

    app.use('/', index);
    //API Route : view 없음.
    app.use('/users', users);
    app.use('/stores', stores);
    app.use('/reviews', reviews);
    app.use('/qnas', qnas);

    //admin Route : /views/admin/* view 사용
    app.use('/admin', admin);

    //app.use(express.static('./static'));        // 정적 폴더 설정
    app.use(express.static(path.resolve(__dirname, '../public')));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    return app;
}
