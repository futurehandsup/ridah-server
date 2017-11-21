var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var reservations = require('../controllers/reservations');
var programs = require('../controllers/programs');
var coupons = require('../controllers/coupons');
var couponPurchaseLogs = require('../controllers/couponPurchaseLogs');
//passport = require('passport');

// render 될 페이지 모음
router.get('/', common.isAuthenticated, common.redirect('admin/stores/list'));
router.get('/login', common.renderPage('admin/login'));

// stores
router.get('/stores/list', stores.getList, stores.getSchemas, common.renderPage('admin/stores/list'));
router.get('/stores/edit', stores.getList, stores.getSchemas, common.renderPage('admin/stores/edit')); // 필요없음
router.get('/stores/edit/:storeId', stores.getSchemas, common.renderPage('admin/stores/edit'));

router.param('storeId', stores.getOne);

// review
router.get('/reviews/list', reviews.getList, reviews.getSchemas, common.renderPage('admin/reviews/list'));
router.get('/reviews/edit', reviews.getList, reviews.getSchemas, common.renderPage('admin/reviews/edit')); // 필요없음
router.get('/reviews/edit/:reviewId', reviews.getSchemas, common.renderPage('admin/reviews/edit'));

router.param('reviewId', reviews.getOne);

// qna
router.get('/qnas/list', qnas.getList, qnas.getSchemas, common.renderPage('admin/qnas/list'));
router.get('/qnas/edit', qnas.getList, qnas.getSchemas, common.renderPage('admin/qnas/edit')); // 필요없음
router.get('/qnas/edit/:qnaId', qnas.getSchemas, common.renderPage('admin/qnas/edit'));

router.param('qnaId', qnas.getOne);

//users
router.get('/users/list', users.getList, users.getSchemas, common.renderPage('admin/users/list'));
router.get('/users/edit', users.getList, users.getSchemas, common.renderPage('admin/users/edit')); // 필요없음
router.get('/users/edit/:userId', users.getSchemas, common.renderPage('admin/users/edit'));
router.param('userId', users.getOne);

// reservations
router.get('/reservations/list', reservations.getList, reservations.getSchemas, common.renderPage('admin/reservations/list'));
router.get('/reservations/edit', reservations.getList, reservations.getSchemas, common.renderPage('admin/reservations/edit')); // 필요없음
router.get('/reservations/edit/:reservationId', reservations.getSchemas, common.renderPage('admin/reservations/edit'));

router.param('reservationId', reservations.getOne);

// program
router.get('/programs/list', programs.getList, programs.getSchemas, common.renderPage('admin/programs/list'));
router.get('/programs/edit', programs.getList, programs.getSchemas, common.renderPage('admin/programs/edit')); // 필요없음
router.get('/programs/edit/:programId', programs.getSchemas, common.renderPage('admin/programs/edit'));

router.param('programId', programs.getOne);

// coupon
router.get('/coupons/list', coupons.getList, coupons.getSchemas, common.renderPage('admin/coupons/list'));
router.get('/coupons/edit', coupons.getList, coupons.getSchemas, common.renderPage('admin/coupons/edit')); // 필요없음
router.get('/coupons/edit/:couponId', coupons.getSchemas, common.renderPage('admin/coupons/edit'));

router.param('couponId', coupons.getOne);

// couponPurchaseLog
router.get('/couponPurchaseLogs/list', couponPurchaseLogs.getList, couponPurchaseLogs.getSchemas, common.renderPage('admin/couponPurchaseLogs/list'));
router.get('/couponPurchaseLogs/edit', couponPurchaseLogs.getList, couponPurchaseLogs.getSchemas, common.renderPage('admin/couponPurchaseLogs/edit')); // 필요없음
router.get('/couponPurchaseLogs/edit/:couponPurchaseLogId', couponPurchaseLogs.getSchemas, common.renderPage('admin/couponPurchaseLogs/edit'));

router.param('couponPurchaseLogId', couponPurchaseLogs.getOne);


//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('admin/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('admin/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('admin/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('admin/stores/list'));



module.exports = router;
