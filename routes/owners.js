var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var programs = require('../controllers/programs');
var reservations = require('../controllers/reservations');
var notices = require('../controllers/notices');
var noticeOwners = require('../controllers/noticeOwners');
var calculations = require('../controllers/calculations');
var calculationTaxs = require('../controllers/calculationTaxs');
var calculationVats = require('../controllers/calculationVats');
var calculationInfos = require('../controllers/calculationInfos');

//passport = require('passport');

router.all('*', function(req, res, next){
  // 데모용, 임시 페이지
  if(req.query.storeId != undefined){
    return stores.getOne(req, res, next, req.query.storeId);
  }
  else{
    return stores.getOne(req, res, next);
  }
}, function(req, res, next){
  // if(req.query.userId != undefined){
  //   return users.getOne(req, res, next, req.query.userId);
  // }
  // else{
  //   return users.getOne(req, res, next);
  // }
  next()
});
// render 될 페이지 모음
router.get('/', stores.getList, common.renderPage('owners/index'));
// 로그인 아직 덜 만듬
router.get('/login', common.renderPage('owners/login'));

router.get('/dashboard', common.renderPage('owners/dashboard/index'));

// 예약 달력
router.get('/reservations', programs.getReservationsList, reviews.getList, common.setResponse);
router.get('/reservations/daily', programs.getReservationsList, common.setTitle('예약 달력'), common.renderPage('owners/reservations/daily'));
router.get('/reservations/weekly', programs.getList, reservations.getSchemas, common.renderPage('owners/reservations/weekly'));
router.get('/reservations/monthly', programs.getList, reservations.getSchemas, common.renderPage('owners/reservations/monthly'));

// 예약 내역
router.get('/reservations/list', reservations.getList, reservations.getSchemas, common.setTitle('예약 내역'), common.renderPage('owners/reservations/list'));

// 이용 내역
router.get('/reservations/usage', reservations.getList, reservations.getSchemas, common.setTitle('이용 내역'), common.renderPage('owners/reservations/usage'));

// 취소 내역
router.get('/reservations/cancel', reservations.getList, reservations.getSchemas, common.setTitle('취소 내역'),common.renderPage('owners/reservations/cancel'));

//filters
router.get('/filters/edit', common.renderPage('owners/filters/edit')); // 필요없음
router.get('/filters/edit/:storeId', stores.getSchemas, common.renderPage('owners/filters/edit'));
router.param('storeId', stores.getOne);
// stores
router.get('/stores/detail', programs.getReservationsList, reviews.getList, qnas.getList, common.setTitle('승마장 정보'), common.renderPage('owners/stores/detail'));
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


// programs
router.get('/programs', programs.getList, common.setResponse);
router.get('/programs/list', programs.getList, programs.getSchemas, common.setTitle('프로그램 관리'), common.renderPage('owners/programs/list'));
router.get('/programs/edit', programs.getList, programs.getSchemas, common.setTitle('프로그램 수정'), common.renderPage('owners/programs/edit')); // 필요없음
router.get('/programs/edit/:programId', programs.getSchemas, common.setTitle('프로그램 수정'), common.renderPage('owners/progrmas/edit'));
router.param('programId', programs.getOne);

//통계
router.get('/statistics', programs.getList, programs.getSchemas, common.setTitle('통계'), common.renderPage('owners/statistics/index'));
router.get('/statistics/reservations', programs.getList, programs.getSchemas, common.renderPage('owners/statistics/reservations'));
router.get('/statistics/customers', programs.getList, programs.getSchemas, common.renderPage('owners/statistics/customers'));

//정산 내역
router.get('/calculations', calculations.getList, calculations.getSchemas, common.setTitle('정산내역 조회'), common.renderPage('owners/calculations/index'));
router.get('/calculations/vat', calculationVats.getList, calculationVats.getSchemas, common.setTitle('부가세 신고 내역'), common.renderPage('owners/calculations/vat'));
router.get('/calculations/tax', calculationTaxs.getList, calculationTaxs.getSchemas, common.setTitle('세금 계산서 조회'), common.renderPage('owners/calculations/tax'));
router.get('/calculations/info', calculationInfos.getList, calculationInfos.getSchemas, common.setTitle('정산 정보'), common.renderPage('owners/calculations/info'));

//관리자 공지사항
router.get('/notices/list', notices.getList, notices.getSchemas, common.setTitle('전체 공지사항'), common.renderPage('owners/notices/list'));
router.get('/notices/detail/:noticeId', notices.getSchemas, common.setTitle('전체 공지사항 상세'), common.renderPage('owners/notices/detail'));
router.param('noticeId', notices.getOne);

//가맹점주 공지사항
router.get('/noticeOwners/list', noticeOwners.getList, noticeOwners.getSchemas, common.setTitle('가맹점 공지'), common.renderPage('owners/noticeOwners/list'));
router.get('/noticeOwners/detail/:noticeOwnerId', noticeOwners.getSchemas, common.setTitle('가맹점 공지'), common.renderPage('owners/noticeOwners/detail'));
router.param('noticeOwnerId', noticeOwners.getOne);

//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('owners/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('owners/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('owners/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('owners/stores/list'));



module.exports = router;
