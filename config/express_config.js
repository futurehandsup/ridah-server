var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    config = require('./config'),              //세션 사용
    session = require('express-session'),       //세션 사용
    passport = require('passport'),
    flash = require('connect-flash'),
    multer = require('multer')    ;

const COOKIE_HOUR = 6* 60 * 60 * 1000;//6*60분  = 6시간
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

    app.use(bodyParser.json({ limit: '50MB' } ));
    app.use(methodOverride());
    app.use(cookieParser());

    // app.use(session({                        // 세션 사용
    //     saveUninitialized : true,         //초기화되지 않은 세션정보도 저장되는지
    //     resave : true,                    //같은 세션정보라도 다시 저장할건지
    //     secret : config.sessionSecret     //비밀키 설정.
    // }));
    var MySQLStore = require('express-mysql-session')(session);
    var common = require('../newControllers/common')
    var connection = common.initDatabase(); // or mysql.createPool(options);
    var sessionStore = new MySQLStore({ expiration: COOKIE_HOUR }/* session store options */, connection);

    app.use(session({                        // 세션 사용
        saveUninitialized : true,         //초기화되지 않은 세션정보도 저장되는지
        resave : true,                    //같은 세션정보라도 다시 저장할건지
        secret : config.sessionSecret,     //비밀키 설정.
        key: 'anymal',
        store: sessionStore,
    }));

    // view engine setup
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'ejs');

    // app.set('jwt-secret', config.sessionSecret);
    // app.set('jwt-refresh-secret', config.refreshSecret);

    app.use(flash());
    // app.use(passport.initialize());    // 추가
    // app.use(passport.session());       // 추가

    var common = require('../newControllers/common');
    app.use(common.setPage);

    app.locals.filterItems = require('./filterItems');
    app.locals.moment = require('moment');
    app.locals.moment.locale('ko')
    require('moment-timezone');

    var index = require('../newRoutes/index');

    var webapi = require('../newRoutes/webapi');
    var adminapi = require('../newRoutes/adminapi');
    var mobileapi = require('../newRoutes/mobileapi');

    var newOwners = require('../newRoutes/owners'); // 업주용 페이지 -->개발 예정
    var newAdmin = require('../newRoutes/admin'); // 관리자 페이지 --> 개발 예정


    app.use('/', index);
    app.use('/apis/web', webapi);
    app.use('/apis/admin', adminapi);
    app.use('/apis/mobile', mobileapi);

    //API Route : view 없음.

    app.use('/newowners', newOwners);
    app.use('/newadmin', newAdmin);

    //owners Route : /views/customers/* view 사용

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
      next(err);
    });

    // view ejs 페이지 에러 핸들링
    app.use(['/admin', '/customers', '/owners'], function(err, req, res, next){
      res.render('error');
    })

    // api 에러 핸들링
    app.use(function(err, req, res, next){
      res.json({ error: {
        status : err.status,
        message: err.message,
        stack : err.stack
      } });
    })
    return app;
}
