var express = require('express');
var router = express.Router();

var stores = require('../controllers/stores');
var common = require('../controllers/common');
    //passport = require('passport');


/* GET stores listing. */
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
});

//RESTful api
router.get('/getList', stores.getList, common.setResponse);
router.get('/getStore/:storeId', common.setResponse);
router.post('/update/:storeId', stores.update, common.setResponse);

// render 될 페이지 모음
router.get('/list', stores.getList, common.renderPage);
router.get('/detail/:storeId', common.renderPage);
router.get('/update/:storeId', stores.update, common.renderPage);




// 정리중
router.get('/registerStore', stores.registerStore);
router.post('/registerStore', stores.registerStore);



// router.get('/update/:storeId', stores.update);
// router.post('/update/:storeId', stores.update);
//router.post('/users/delete/:storeId', stores.delete);

router.param('storeId', stores.findStore);

module.exports = router;
