var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth');
var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var reservations = require('../controllers/reservations');
var programs = require('../controllers/programs');
var coupons = require('../controllers/coupons');
var couponPurchaseLogs = require('../controllers/couponPurchaseLogs');
var carrotUsageLogs = require('../controllers/carrotUsageLogs');
var notices = require('../controllers/notices');
var noticeOwners = require('../controllers/noticeOwners');
var headers = require('../controllers/headers');
var recommends = require('../controllers/recommends');
var events = require('../controllers/events');
var faqs = require('../controllers/faqs');
var calculations = require('../controllers/calculations');
var calculationTaxs = require('../controllers/calculationTaxs');
var calculationVats = require('../controllers/calculationVats');

//passport = require('passport');


router.get('/login', auth.check(), common.renderPage('admin/login'));
router.get('/logout', auth.logout, common.redirect('admin'));

// render 될 페이지 모음
router.get('*', common.setAuthHeaders, auth.check(), function(req, res, next){
  if(req.result.success) return next();
  else {
    res.redirect('/admin/login');
  }
});
router.get('/', /*common.isAuthenticated, */common.redirect('/admin/stores/list'));

// stores, tags
router.get('/stores/list', stores.getList, stores.getSchemas, common.renderPage('admin/stores/list'));
router.get('/stores/edit', stores.getList, stores.getSchemas, common.renderPage('admin/stores/edit')); // 필요없음
router.get('/stores/edit/:storeId', stores.getSchemas, common.renderPage('admin/stores/edit'));
router.get('/tags/list', stores.getList, stores.getSchemas, common.renderPage('admin/tags/list'));
router.get('/tags/edit/:storeId', stores.getSchemas, common.renderPage('admin/tags/edit'));

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

//faq
router.get('/faqs/list', faqs.getList, faqs.getSchemas, common.renderPage('admin/faqs/list'));
router.get('/faqs/edit', faqs.getList, faqs.getSchemas, common.renderPage('admin/faqs/edit')); // 필요없음
router.get('/faqs/edit/:faqId', faqs.getSchemas, common.renderPage('admin/faqs/edit'));

router.param('faqId', faqs.getOne);

//users
router.get('/users/list', users.getList, users.getSchemas, common.renderPage('admin/users/list'));
router.get('/users/state', users.getList, users.getSchemas, common.renderPage('admin/users/state'));
router.get('/users/edit', users.getList, users.getSchemas, common.renderPage('admin/users/edit')); // 필요없음
router.get('/users/edit/:userId', users.getSchemas, common.renderPage('admin/users/edit'));
router.param('userId', users.getOne);
router.get('/users/state', users.getList, users.getSchemas, common.renderPage('admin/users/state'));

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

// notices
router.get('/notices/list', notices.getList, notices.getSchemas, common.renderPage('admin/notices/list'));
router.get('/notices/edit', notices.getList, notices.getSchemas, common.renderPage('admin/notices/edit')); // 필요없음
router.get('/notices/edit/:noticeId', notices.getSchemas, common.renderPage('admin/notices/edit'));

router.param('noticeId', notices.getOne);

// noticeOwners
router.get('/noticeOwners/list', noticeOwners.getList, noticeOwners.getSchemas, common.renderPage('admin/noticeOwners/list'));
router.get('/noticeOwners/edit', noticeOwners.getList, noticeOwners.getSchemas, common.renderPage('admin/noticeOwners/edit')); // 필요없음
router.get('/noticeOwners/edit/:noticeOwnerId', noticeOwners.getSchemas, common.renderPage('admin/noticeOwners/edit'));

router.param('noticeOwnerId', noticeOwners.getOne);

// headers
router.get('/headers/list', headers.getList, headers.getSchemas, common.renderPage('admin/headers/list'));
router.get('/headers/edit', headers.getList, headers.getSchemas, common.renderPage('admin/headers/edit')); // 필요없음
router.get('/headers/edit/:headerId', headers.getSchemas, common.renderPage('admin/headers/edit'));

router.param('headerId', headers.getOne);

// recommends
router.get('/recommends/list', recommends.getList, recommends.getSchemas, stores.getList/*store 정보 불러오기*/, common.renderPage('admin/recommends/list'));
router.get('/recommends/edit', recommends.getList, recommends.getSchemas, common.renderPage('admin/recommends/edit')); // 필요없음
router.get('/recommends/edit/:recommendId', recommends.getSchemas, common.renderPage('admin/recommends/edit'));

router.param('recommendId', recommends.getOne);

// events
router.get('/events/list', events.getList, events.getSchemas, common.renderPage('admin/events/list'));
router.get('/events/edit', events.getList, events.getSchemas, common.renderPage('admin/events/edit')); // 필요없음
router.get('/events/edit/:eventId', events.getSchemas, common.renderPage('admin/events/edit'));

router.param('eventId', events.getOne);

//insertCals
//router.get('/insertCals/list', calculations.getList,calculations.getSchemas, common.renderPage('admin/insertCals/list'));
router.get('/insertCals/list', calculations.getList, calculations.getSchemas, common.renderPage('admin/insertCals/list0'));
router.get('/insertCals/edit', calculations.getList,calculations.getSchemas, common.renderPage('admin/insertCals/edit')); // 필요없음
router.get('/insertCals/detail/:calculationId', calculations.getSchemas, common.renderPage('admin/insertCals/detail'));
//router.get('/events/edit/:eventId', events.getSchemas, common.renderPage('admin/events/edit'));
router.param('calculationId', calculations.getOne);

//insertVats
router.get('/insertVats/list', calculationVats.getList, calculationVats.getSchemas, common.renderPage('admin/insertVats/list'));
router.get('/insertVats/edit', calculationVats.getList, calculationVats.getSchemas, common.renderPage('admin/insertVats/edit')); // 필요없음
//router.get('/events/edit/:eventId', events.getSchemas, common.renderPage('admin/events/edit'));

//insertTaxs
router.get('/insertTaxs/list', calculationTaxs.getList, calculationTaxs.getSchemas, common.renderPage('admin/insertTaxs/list'));
router.get('/insertTaxs/edit', calculationTaxs.getList,calculationTaxs.getSchemas, common.renderPage('admin/insertTaxs/edit')); // 필요없음
//router.get('/events/edit/:eventId', events.getSchemas, common.renderPage('admin/events/edit'));


//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('admin/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('admin/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('admin/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('admin/stores/list'));



module.exports = router;
