var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

// 컨트롤러 변수 선언
let stores = require('../newControllers/admin/stores');
let banners = require('../newControllers/admin/banners');
let calculations = require('../newControllers/admin/calculations');
let faqs = require('../newControllers/admin/faqs');
let members = require('../newControllers/admin/members');
let notices = require('../newControllers/admin/notices');
let payments = require('../newControllers/admin/payments');
let programs = require('../newControllers/admin/programs');
let reservations = require('../newControllers/admin/reservations');
let reviews = require('../newControllers/admin/reviews');
let schedules = require('../newControllers/admin/schedules');
let zzims = require('../newControllers/admin/zzims');

//let members = require('../newControllers/admin/members');
//
//
// router.get('/login', common.renderPage('newadmin/login'));
// router.get('/logout', common.redirect('newadmin'));
//
// // render 될 페이지 모음
// router.get('*', common.setResult, function(req, res, next){
//   if(req.result.success) return next();
//   else {
//     res.redirect('/newadmin/login');
//   }
// });

// render first
router.get('/', /*common.isAuthenticated, */common.redirect('/newadmin/stores/list'));

// render 될 페이지 모음
router.get('/', stores.getStoreList, common.renderPage('newadmin/index'));

// 로그인 아직 덜 만듬
router.get('/login', common.renderPage('newadmin/login'));

// 새로 연결한 페이지
router.get('/stores/list', stores.getStoreList, common.setTitle('승마장'), common.renderPage('newadmin/stores/list'));
router.get('/stores/detail/:storeNo', stores.getStoreDetail, common.setTitle('승마장 상세'), common.renderPage('newadmin/stores/detail'));
router.get('/stores/add', common.setTitle('승마장 추가'), common.renderPage('newadmin/stores/add'));

router.get('/programs/list', programs.getProgramList, common.setTitle('프로그램'),common.renderPage('newadmin/programs/list'));
router.get('/programs/detail/:programNo', programs.getProgramDetail, common.setTitle('프로그램 상세'), common.renderPage('newadmin/programs/detail'));
router.get('/programs/add', common.setTitle('프로그램 추가'), common.renderPage('newadmin/programs/add'));

router.get('/schedules/list', schedules.getSchedulesList, common.setTitle('스케줄'), common.renderPage('newadmin/schedules/list'));
router.get('/schedules/detail/:scheduleNo', schedules.getSchedulesDetail, common.setTitle('스케줄 상세'), common.renderPage('newadmin/schedules/detail'));
router.get('/schedules/add', common.setTitle('스케줄 추가'), common.renderPage('newadmin/schedules/add'));

router.get('/reservations/list', reservations.getReservationList, common.setTitle('예약내역'), common.renderPage('newadmin/reservations/list'));
router.get('/reservations/detail/:reservationNo', reservations.getReservationDetail, common.setTitle('예약내역 상세'), common.renderPage('newadmin/reservations/detail'));
router.get('/reservations/add', common.setTitle('예약내역 추가'), common.renderPage('newadmin/reservations/add'));


router.get('/reviews/list', reviews.getReviewList, common.setTitle('이용후기'), common.renderPage('newadmin/reviews/list'));
router.get('/reviews/detail/:reviewNo', reviews.getReviewDetail, common.setTitle('이용후기 상세'), common.renderPage('newadmin/reviews/detail'));
router.get('/reviews/add', common.setTitle('이용후기 추가'), common.renderPage('newadmin/reviews/add'));

router.get('/calculations/list', calculations.getCalculationList, common.setTitle('정산내역'), common.renderPage('newadmin/calculations/list'));
router.get('/calculations/detail/:calculationNo', calculations.getCalculationDetail, common.setTitle('정산내역 상세'), common.renderPage('newadmin/calculations/detail'))
router.get('/calculations/add', common.setTitle('정산내역 추가'), common.renderPage('newadmin/calculations/add'));

router.get('/payments/list', payments.getPaymentList, common.setTitle('결제관리'), common.renderPage('newadmin/payments/list'));
router.get('/payments/detail/:paymentNo', payments.getPaymentDetail, common.setTitle('결제관리 상세'), common.renderPage('newadmin/payments/detail'));
router.get('/payments/add', common.setTitle('결제관리 추가'), common.renderPage('newadmin/payments/add'));

router.get('/members/list', members.getMemberList, common.setTitle('사용자'), common.renderPage('newadmin/members/list'));
router.get('/members/detail/:userNo', members.getMemberDetail, common.setTitle('사용자 상세'), common.renderPage('newadmin/members/detail'));
router.get('/members/add', common.setTitle('사용자 추가'), common.renderPage('newadmin/members/add'));

router.get('/banners/list', banners.getBannerList, common.setTitle('배너'), common.renderPage('newadmin/banners/list'));
router.get('/banners/detail/:bannerNo', banners.getBannerDetail, common.setTitle('배너 상세'), common.renderPage('newadmin/banners/detail'));
router.get('/banners/add', common.setTitle('배너 추가'), common.renderPage('newadmin/banners/add'));

router.get('/faqs/list', faqs.getFaqList, common.setTitle('자주묻는 질문'), common.renderPage('newadmin/faqs/list'));
router.get('/faqs/detail/:faqNo', faqs.getFaqDetail, common.setTitle('자주묻는 질문 상세'), common.renderPage('newadmin/faqs/detail'));
router.get('/faqs/add', common.setTitle('자주묻는 질문 추가'), common.renderPage('newadmin/faqs/add'));

router.get('/notices/list', notices.getNoticeList, common.setTitle('공지사항'), common.renderPage('newadmin/notices/list'));
router.get('/notices/detail/:noticeNo', notices.getNoticeDetail, common.setTitle('공지사항 상세'), common.renderPage('newadmin/notices/detail'));
router.get('/notices/add', common.setTitle('공지사항 추가'), common.renderPage('newadmin/notices/add'));

//마지막 줄에 작성
module.exports = router;
