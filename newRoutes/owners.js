var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

// 컨트롤러 변수 선언
let dashboard = require('../newControllers/owners/dashboard');
let stores = require('../newControllers/owners/stores');
let banners = require('../newControllers/owners/banners');
let calculations = require('../newControllers/owners/calculations');
let faqs = require('../newControllers/owners/faqs');
let members = require('../newControllers/owners/members');
let notices = require('../newControllers/owners/notices');
let payments = require('../newControllers/owners/payments');
let programs = require('../newControllers/owners/programs');
let reservations = require('../newControllers/owners/reservations');
let reviews = require('../newControllers/owners/reviews');
let schedules = require('../newControllers/owners/schedules');
let zzims = require('../newControllers/owners/zzims');

//let members = require('../newControllers/owners/members');



//로그인 대신 사용하는 라인
router.all('*', function(req, res, next){
  // 데모용, 임시 페이지
  if(req.params['storeNo'] == null){
    req.params.storeNo = 1;
  }
  next();
}, stores.getStoreDetail);

// render 될 페이지 모음
router.get('/', stores.getStoreList, common.renderPage('newowners/index'));
// 로그인 아직 덜 만듬
router.get('/login', common.renderPage('newowners/login'));

router.get('/dashboard', reservations.getReservationList, reviews.getReviewList, schedules.getSchedulesList, notices.getNoticeList, common.setTitle('대시보드'), common.renderPage('newowners/dashboard/index'));

router.get('/reservations/list', reservations.getReservationList, common.setTitle('예약내역'), common.renderPage('newowners/reservations/list'));
router.get('/reservations/detail/:reservationNo', reservations.getReservationDetail, common.setTitle('예약내역 상세'), common.renderPage('newowners/reservations/detail'));
router.get('/reservations/add', common.setTitle('예약내역 추가'), common.renderPage('newowners/reservations/add'));


router.get('/programs/list', programs.getProgramList, common.setTitle('프로그램'), common.renderPage('newowners/programs/list'));
router.get('/programs/add', common.setTitle('프로그램 추가'), common.renderPage('newowners/programs/add'));
router.get('/programs/detail/:programNo', programs.getProgramDetail, common.setTitle('프로그램 상세'), common.renderPage('newowners/programs/detail'));
router.get('/programs/schedule', schedules.getSchedulesList, common.setTitle('스케줄'), common.renderPage('newowners/programs/schedule'));

router.get('/stores/detail', stores.getStoreList, common.setTitle('승마장 정보 관리'), common.renderPage('newowners/stores/detail'));

router.get('/reviews/list', reviews.getReviewList, common.setTitle('이용후기 관리'), common.renderPage('newowners/reviews/list'));
router.get('/reviews/detail/:reviewNo', reviews.getReviewDetail, common.setTitle('이용후기 상세'), common.renderPage('newowners/reviews/detail'));

router.get('/calculations/list', calculations.getCalculationList, common.setTitle('정산 내역'), common.renderPage('newowners/calculations/list'));
router.get('/calculations/detail/:calculationNo', calculations.getCalculationDetail, common.setTitle('정산 내역 상세'), common.renderPage('newowners/calculations/detail'));

router.get('/notices/list', notices.getNoticeNormalList, common.setTitle('전체 공지'), common.renderPage('newowners/notices/list'));
router.get('/notices/detail/:noticeNo', notices.getNoticeDetail, common.setTitle('공지 상세'), common.renderPage('newowners/notices/detail'));

router.get('/noticeOwners/list',notices.getNoticeOwnerList, common.setTitle('가맹점 공지'), common.renderPage('newowners/noticeOwners/list'));
router.get('/noticeOwners/detail/:noticeNo', notices.getNoticeDetail, common.setTitle('공지 상세'), common.renderPage('newowners/noticeOwners/detail'));

// 이런식으로 아래에 계속 이어서 작성해 주세요



//마지막 줄에 작성
module.exports = router;
