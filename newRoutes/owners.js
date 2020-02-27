var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

// 컨트롤러 변수 선언
let stores = require('../newControllers/stores');
let banners = require('../newControllers/banners');
let calculations = require('../newControllers/calculations');
let faqs = require('../newControllers/faqs');
let members = require('../newControllers/members');
let notices = require('../newControllers/notices');
let payments = require('../newControllers/payments');
let programs = require('../newControllers/programs');
let reservations = require('../newControllers/reservations');
let reviews = require('../newControllers/reviews');
let schedules = require('../newControllers/schedules');
let zzims = require('../newControllers/zzims');

//let members = require('../newControllers/members');



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

router.get('/dashboard', common.setTitle('대시보드'), common.renderPage('newowners/dashboard/index'));

router.get('/reservations/list', reservations.getReservationList, common.setTitle('예약내역'), common.renderPage('newowners/reservations/list'));

router.get('/programs/list', programs.getProgramList, common.setTitle('프로그램'), common.renderPage('newowners/programs/list'));

router.get('/stores/detail', stores.getStoreDetail, common.setTitle('스케줄'), common.renderPage('newowners/stores/detail'));

router.get('/reviews/list', reviews.getReviewList, common.setTitle('후기관리'), common.renderPage('newowners/reviews/list'));

router.get('/calculations/list', calculations.getCalculationList, common.setTitle('정산내역'), common.renderPage('newowners/calculations/list'));

router.get('/notices/list', notices.getNoticeNormalList, common.setTitle('전체 공지'), common.renderPage('newowners/notices/list'));
router.get('/notices/detail', notices.getNoticeDetail, common.setTitle('전체 공지'), common.renderPage('newowners/notices/detail'));

router.get('/noticeOwners/list',notices.getNoticeOwnerList, common.setTitle('가맹점 공지'), common.renderPage('newowners/noticeOwners/list'));
router.get('/noticeOwners/detail', notices.getNoticeDetail, common.setTitle('가맹점 공지'), common.renderPage('newowners/noticeOwners/detail'));

// 이런식으로 아래에 계속 이어서 작성해 주세요



//마지막 줄에 작성
module.exports = router;
