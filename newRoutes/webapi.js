var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

//컨트롤러 파일 추가!
var members = require('../newControllers/owners/members');
var zzims = require('../newControllers/owners/zzims');
var reservations = require('../newControllers/owners/reservations');
var reviews = require('../newControllers/owners/reviews');
var stores = require('../newControllers/owners/stores');
var programs = require('../newControllers/owners/programs');
var notices = require('../newControllers/owners/notices');
var banners = require('../newControllers/owners/banners');
var schedules = require('../newControllers/owners/schedules');
var faqs = require('../newControllers/owners/faqs');
var payments = require('../newControllers/owners/payments');
var calculations = require('../newControllers/owners/calculations');
// var stores = require('../newControllers/owners/stores');
// ...

// members
router.route('/member')
.all(function(req, res, next)  {next();})
.get(members.getMemberList, common.setResponse) // 사용자 리스트 출력
.post(members.addMember, common.setResponse)    // 사용자 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/member/:userNo')
.all(function(req, res, next) {next();})
.get(members.getMemberDetail, common.setResponse)     //사용자 정보 출력
.put(members.updateMember, common.setResponse)        //사용자 정보 가져오기
.delete(members.deleteMember, common.setResponse)     //사용자 삭제
.post(common.notImplementedError);

// zzims
router.route('/zzim')
.all(function(req, res, next)  {next();})
.get(zzims.getZzimList, common.setResponse) // 찜 리스트 출력
.post(zzims.addZzim, common.setResponse)    // 찜 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/zzim/:zzimNo')
.all(function(req, res, next) {next();})
.get(zzims.getZzimDetail, common.setResponse)     //찜 정보 출력
.put(zzims.updateZzim, common.setResponse)        //찜 정보 가져오기
.delete(zzims.deleteZzim, common.setResponse)     //찜 삭제
.post(common.notImplementedError);

// reservations
router.route('/reservation')
.all(function(req, res, next)  {next();})
.get(reservations.getReservationList, common.setResponse) //예약 리스트 출력
.post(reservations.addReservation, reservations.createReservationCode, common.setResponse)    //예약 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/reservation/:reservationNo')
.all(function(req, res, next) {next();})
.get(reservations.getReservationDetail, common.setResponse)     //예약 정보 출력
.put(reservations.updateReservation, common.setResponse)        //예약 정보 가져오기
.delete(reservations.deleteReservation, common.setResponse)     //예약 삭제
.post(common.notImplementedError);

// reviews
router.route('/review')
.all(function(req, res, next)  {next();})
.get(reviews.getReviewList, common.setResponse) //후기 리스트 출력
.post(reviews.addReview, common.setResponse)    //후기 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/review/:reviewNo')
.all(function(req, res, next) {next();})
.get(reviews.getReviewDetail, common.setResponse)     //후기 정보 출력
.put(reviews.updateReview, common.setResponse)        //후기 정보 가져오기
.delete(reviews.deleteReview, common.setResponse)     //후기 삭제
.post(common.notImplementedError);

// stores
router.route('/store')
.all(function(req, res, next)  {next();})
.get(stores.getStoreList, common.setResponse) //가맹점 리스트 출력
.post(stores.addStore, common.setResponse)    //가맹점 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/store/:storeNo')
.all(function(req, res, next) {next();})
.get(stores.getStoreDetail, common.setResponse)     //가맹점 정보 출력
.put(stores.updateStore, common.setResponse)        //가맹점 정보 가져오기
.delete(stores.deleteStore, common.setResponse)     //가맹점 삭제
.post(common.notImplementedError);

// programs
router.route('/program')
.all(function(req, res, next)  {next();})
.get(programs.getProgramList, common.setResponse) //프로그램 리스트 출력
.post(programs.addProgram, common.setResponse)    //프로그램 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/program/:programNo')
.all(function(req, res, next) {next();})
.get(programs.getProgramDetail, common.setResponse)     //프로그램 정보 출력
.put(programs.updateProgram, common.setResponse)        //프로그램 정보 가져오기
.delete(programs.deleteProgram, common.setResponse)     //프로그램 삭제
.post(common.notImplementedError);

// notices
router.route('/notice')
.all(function(req, res, next)  {next();})
.get(notices.getNoticeList, common.setResponse) //공지사항 리스트 출력
.post(notices.addNotice, common.setResponse)    //공지사항 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/notice/:noticeNo')
.all(function(req, res, next) {next();})
.get(notices.getNoticeDetail, common.setResponse)     //공지사항 정보 출력
.put(notices.updateNotice, common.setResponse)        //공지사항 정보 가져오기
.delete(notices.deleteNotice, common.setResponse)     //공지사항 삭제
.post(common.notImplementedError);

// banners
router.route('/banner')
.all(function(req, res, next)  {next();})
.get(banners.getBannerList, common.setResponse) //배너 리스트 출력
.post(banners.addBanner, common.setResponse)    //배너 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/banner/:bannerNo')
.all(function(req, res, next) {next();})
.get(banners.getBannerDetail, common.setResponse)     //배너 정보 출력
.put(banners.updateBanner, common.setResponse)        //배너 정보 가져오기
.delete(banners.deleteBanner, common.setResponse)     //배너 삭제
.post(common.notImplementedError);

// schedules
router.route('/program')
.all(function(req, res, next)  {next();})
.get(programs.getProgramList, common.setResponse) //프로그램 리스트 출력
.post(programs.addProgram, common.setResponse)    //프로그램 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/program/:programNo')
.all(function(req, res, next) {next();})
.get(programs.getProgramDetail, common.setResponse)     //프로그램 정보 출력
.put(programs.updateProgram, common.setResponse)        //프로그램 정보 가져오기
.delete(programs.deleteProgram, common.setResponse)     //프로그램 삭제
.post(common.notImplementedError);

router.route('/program/schedule')
.all(function(req, res, next)  {next();})
.get(schedules.getSchedulesList, common.setResponse) //스케줄 리스트 출력
.post(schedules.addSchedules, common.setResponse)    //스케줄 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

// faqs
router.route('/faq')
.all(function(req, res, next)  {next();})
.get(faqs.getFaqList, common.setResponse) //faq 리스트 출력
.post(faqs.addFaq, common.setResponse)    //faq 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/faq/:faqNo')
.all(function(req, res, next) {next();})
.get(faqs.getFaqDetail, common.setResponse)     //faq 정보 출력
.put(faqs.updateFaq, common.setResponse)        //faq 정보 가져오기
.delete(faqs.deleteFaq, common.setResponse)     //faq 삭제
.post(common.notImplementedError);

// payments
router.route('/payment')
.all(function(req, res, next)  {next();})
.get(payments.getPaymentList, common.setResponse) // 결제리스트 출력
.post(payments.addPayment, common.setResponse)    // 결제 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/payment/:paymentNo')
.all(function(req, res, next) {next();})
.get(payments.getPaymentDetail, common.setResponse)     //결제 정보 출력
.put(payments.updatePayment, common.setResponse)        //결제 정보 가져오기
.delete(payments.deletePayment, common.setResponse)     //결제 삭제
.post(common.notImplementedError);

// calculation
router.route('/calculation')
.all(function(req, res, next)  {next();})
.get(calculations.getCalculationList, common.setResponse) // 정산 리스트 출력
.post(calculations.addCalculation, common.setResponse)    // 정산 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/calculation/:calculationNo')
.all(function(req, res, next) {next();})
.get(calculations.getCalculationDetail, common.setResponse)     //정산 정보 출력
.put(calculations.updateCalculation, common.setResponse)        //정산 정보 가져오기
.delete(calculations.deleteCalculation, common.setResponse)     //정산 삭제
.post(common.notImplementedError);


// 원래 코드 참고
/*router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(users.getList, common.setResponse)        // 사용자 리스트 출력
.post(users.registerOne, common.setResponse)   // 사용자 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:userId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                         //사용자 정보 출력
.put(users.updateOne, common.setResponse)        //사용자 정보 가져오기
.delete(users.deleteOne, common.setResponse)     //사용자 삭제
.post(common.notImplementedError);
*/



//맨 마지막줄
module.exports = router;
