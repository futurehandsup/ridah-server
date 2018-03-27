var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var programs = require('../controllers/programs');
var reservations = require('../controllers/reservations');
var coupons = require('../controllers/coupons');
var couponPurchaseLogs = require('../controllers/couponPurchaseLogs');
//passport = require('passport');

router.all('*', function(req, res, next){
  // 데모용, 임시 페이지
  if(req.query.userId != undefined){
    return users.getOne(req, res, next, req.query.userId);
  }
  else{
    return users.getOne(req, res, next);
  }
});

// render 될 페이지 모음
router.get('/', users.getList, stores.getList, common.renderPage('customers/index'));
router.get('/login', common.renderPage('customers/login'));

// stores
router.get('/stores/list', stores.getList,  common.renderPage('customers/stores/list'));
router.get('/stores/:storeId', programs.getReservationsList, reviews.getList, qnas.getList,  common.renderPage('customers/stores/detail'));
router.get('/stores/:storeId/reviews/list', reviews.getList, reviews.getSchemas, common.renderPage('customers/reviews/list'));
router.get('/stores/:storeId/qnas/list', qnas.getList, reviews.getSchemas, common.renderPage('customers/qnas/list'));
router.param('storeId', stores.getOne);

// programs
router.get('/programs/:programId', common.renderPage('customers/programs/index'));
router.param('programId', programs.getOne);

// reservations
router.get('/reservations/list', reservations.getList, common.renderPage('customers/reservations/list'));
router.get('/reservations/detail/:reservationId', common.renderPage('customers/reservations/detail'));
router.param('reservationId', reservations.getOne);

// coupons
router.get('/coupons/list', coupons.getList, coupons.getSchemas, common.renderPage('customers/coupons/list'));
router.get('/coupons/edit', coupons.getList, coupons.getSchemas, common.renderPage('customers/coupons/edit')); // 필요없음
router.get('/coupons/edit/:couponId', coupons.getSchemas, common.renderPage('customers/coupons/edit'));

router.param('couponId', coupons.getOne);

// review
router.get('/reviews/list', reviews.getList, reviews.getSchemas, common.renderPage('customers/reviews/list'));
router.get('/reviews/edit', reviews.getList, reviews.getSchemas, common.renderPage('customers/reviews/edit')); // 필요없음
router.get('/reviews/edit/:reviewId', reviews.getSchemas, common.renderPage('customers/reviews/edit'));

router.param('reviewId', reviews.getOne);

//users
router.get('/users/mypage', reservations.getList, couponPurchaseLogs.getList, common.renderPage('customers/users/mypage'));
router.get('/users/reservations/list', reservations.getList, common.renderPage('customers/users/reservations/list'));
router.get('/users/coupons/list', coupons.getList, common.renderPage('customers/users/coupons/list'));

router.get('/users/list', users.getList, users.getSchemas, common.renderPage('customers/users/list'));
router.get('/users/edit', users.getList, users.getSchemas, common.renderPage('customers/users/edit')); // 필요없음
router.get('/users/edit/:userId', users.getSchemas, common.renderPage('customers/users/edit'));
router.param('userId', users.getOne);

//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('customers/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('customers/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('customers/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('customers/stores/list'));



module.exports = router;
