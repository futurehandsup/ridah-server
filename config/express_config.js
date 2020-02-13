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

    app.use(session({                        // 세션 사용
        saveUninitialized : true,         //초기화되지 않은 세션정보도 저장되는지
        resave : true,                    //같은 세션정보라도 다시 저장할건지
        secret : config.sessionSecret     //비밀키 설정.
    }));

    // view engine setup
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.set('jwt-secret', config.sessionSecret);
    app.set('jwt-refresh-secret', config.refreshSecret);

    app.use(flash());
    app.use(passport.initialize());    // 추가
    app.use(passport.session());       // 추가

    app.locals.filterItems = require('./filterItems');
    app.locals.moment = require('moment');

    var index = require('../routes/index');
    var users = require('../routes/users');
    var stores = require('../routes/stores');
    var reviews = require('../routes/reviews');
    var qnas = require('../routes/qnas');
    var programs = require('../routes/programs');
    var reservations = require('../routes/reservations');
    var coupons = require('../routes/coupons');
    var couponPurchaseLogs = require('../routes/couponPurchaseLogs');
    var carrotUsageLogs = require('../routes/carrotUsageLogs');
    var notices = require('../routes/notices');
    var noticeOwners = require('../routes/noticeOwners')
    var headers = require('../routes/headers');
    var recommends = require('../routes/recommends');
    var events = require('../routes/events');
    var apps = require('../routes/apps');
    var faqs = require('../routes/faqs');
    var publicDatas = require('../routes/publicDatas');
    var calculations = require('../routes/calculations');
    var calculationVats = require('../routes/calculationVats');
    var calculationTaxs = require('../routes/calculationTaxs');

    var webapi = require('../routes/webapi');

    var admin = require('../routes/admin'); // 관리자 페이지
    var customers = require('../routes/customers'); // 사용자용 페이지 --> 테스트용
    var owners = require('../routes/owners'); // 업주용 페이지 -->개발 예정

    var modules = require('../routes/modules'); // 기타 기능 -- 파일 업로드 등

    var authController = require('../controllers/auth')

    // 권한 체크 및 검증
    app.use(['/users','/stores','/reviews','/qnas','/programs','/reservations','/coupons','/couponPurchaseLogs','/carrotUsageLogs','/notices','/headers','/recommends','/events', '/apps']
            , authController.authenticate)

    app.use('/', index);
    app.use('/apis/web', webapi);
    
    //API Route : view 없음.
    app.use('/users', users);
    app.use('/stores', stores);
    app.use('/reviews', reviews);
    app.use('/qnas', qnas);
    app.use('/programs', programs);
    app.use('/reservations', reservations);
    app.use('/coupons', coupons);
    app.use('/couponPurchaseLogs', couponPurchaseLogs);
    app.use('/carrotUsageLogs', carrotUsageLogs);
    app.use('/notices',notices);
    app.use('/noticeOwners', noticeOwners);
    app.use('/headers', headers);
    app.use('/recommends', recommends);
    app.use('/events', events);
    app.use('/apps', apps);
    app.use('/faqs', faqs);
    app.use('/publicDatas', publicDatas);
    app.use('/calculations', calculations);
    app.use('/calculationVats', calculationVats);
    app.use('/calculationTaxs', calculationTaxs);

    //admin Route : /views/admin/* view 사용
    app.use('/admin', admin);
    //customers Route : /views/customers/* view 사용
    app.use('/customers', customers);
    //owners Route : /views/customers/* view 사용
    app.use('/owners', owners);

    //owners Route : /views/customers/* view 사용
    app.use('/modules', modules);

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
