var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
//passport = require('passport');

// render 될 페이지 모음
router.get('/', stores.getList, common.renderPage('owners/index'));
router.get('/login', common.renderPage('owners/login'));

// stores
router.get('/stores/:storeId', common.renderPage('owners/stores/detail'));
router.get('/stores/edit', stores.getList, stores.getSchemas, common.renderPage('owners/stores/edit')); // 필요없음
router.get('/stores/edit/:storeId', stores.getSchemas, common.renderPage('owners/stores/edit'));

router.param('storeId', stores.getOne);

// review
router.get('/reviews/list', reviews.getList, reviews.getSchemas, common.renderPage('owners/reviews/list'));
router.get('/reviews/edit', reviews.getList, reviews.getSchemas, common.renderPage('owners/reviews/edit')); // 필요없음
router.get('/reviews/edit/:reviewId', reviews.getSchemas, common.renderPage('owners/reviews/edit'));

router.param('reviewId', reviews.getOne);

//users
router.get('/users/list', users.getList, users.getSchemas, common.renderPage('owners/users/list'));
router.get('/users/edit', users.getList, users.getSchemas, common.renderPage('owners/users/edit')); // 필요없음
router.get('/users/edit/:userId', users.getSchemas, common.renderPage('owners/users/edit'));
router.param('userId', users.getOne);



//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('owners/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('owners/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('owners/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('owners/stores/list'));



module.exports = router;
