var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var programs = require('../controllers/programs');
var reservations = require('../controllers/reservations');
//passport = require('passport');

router.all('*', function(req, res, next){
  return stores.getOne(req, res, next, "59f170c855d4f2874f14dbe5");
});
// render 될 페이지 모음
router.get('/', common.renderPage('owners/index'));
router.get('/login', common.renderPage('owners/login'));

// 예약 내역
router.get('/reservations', programs.getReservationsList, reviews.getList, common.setResponse);
router.get('/reservations/daily', programs.getReservationsList, common.renderPage('owners/reservations/daily'));
router.get('/reservations/weekly', programs.getList, reservations.getSchemas, common.renderPage('owners/reservations/weekly'));
router.get('/reservations/monthly', programs.getList, reservations.getSchemas, common.renderPage('owners/reservations/monthly'));

// stores
router.get('/stores/detail', programs.getReservationsList, reviews.getList, qnas.getList, common.renderPage('owners/stores/detail'));
router.get('/stores/edit', common.renderPage('owners/stores/edit')); // 필요없음
router.get('/stores/edit/:storeId', stores.getSchemas, common.renderPage('owners/stores/edit'));

router.param('storeId', stores.getOne);

// review
router.get('/reviews/list', reviews.getList, reviews.getSchemas, common.renderPage('owners/reviews/list'));
router.get('/reviews/edit', reviews.getList, reviews.getSchemas, common.renderPage('owners/reviews/edit')); // 필요없음
router.get('/reviews/edit/:reviewId', reviews.getSchemas, common.renderPage('owners/reviews/edit'));

router.param('reviewId', reviews.getOne);

// review
router.get('/qnas/list', qnas.getList, qnas.getSchemas, common.renderPage('owners/qnas/list'));
router.get('/qnas/edit', qnas.getList, qnas.getSchemas, common.renderPage('owners/qnas/edit')); // 필요없음
router.get('/qnas/edit/:qnaId', qnas.getSchemas, common.renderPage('owners/qnas/edit'));

router.param('qnaId', qnas.getOne);


//users
router.get('/programs', programs.getList, common.setResponse);
router.get('/programs/list', programs.getList, programs.getSchemas, common.renderPage('owners/programs/list'));
router.get('/programs/edit', programs.getList, programs.getSchemas, common.renderPage('owners/programs/edit')); // 필요없음
router.get('/programs/edit/:programId', programs.getSchemas, common.renderPage('owners/progrmas/edit'));
router.param('programId', programs.getOne);



//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('owners/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('owners/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('owners/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('owners/stores/list'));



module.exports = router;
