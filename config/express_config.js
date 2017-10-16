var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
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

    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({                        // 세션 사용
        saveUninitialized : true,         //초기화되지 않은 세션정보도 저장되는지
        resave : true,                    //같은 세션정보라도 다시 저장할건지
        secret : config.sessionSecret     //비밀키 설정.
    }));

    app.set('views', './app/views');           // ejs 사용
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());    // 추가
    app.use(passport.session());       // 추가

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);

    app.use(express.static('./static'));        // 정적 폴더 설정

    return app;
}
