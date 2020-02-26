var express = require('express');
var router = express.Router();
var common = require('../newControllers/common');

//컨트롤러 파일 추가!
var members = require('../newControllers/mobile/members');
var programs = require('../newControllers/mobile/programs');
var stores = require('../newControllers/mobile/stores');
var reservations = require('../newControllers/mobile/reservations');
var reviews = require('../newControllers/mobile/reviews');
var etcs = require('../newControllers/mobile/etcs');

router.use(function(req,res,next){
  console.log(req.session)
  if(req.session==null) req.session = {};
  if (process.env.NODE_ENV === 'production') {
    if(req.session.cookie != null) req.session.cookie.secure = true // serve
  }
  next()
})

/* ========================================== /
  * POST /member/*
  * : 회원가입, 로그인 등 Auth 기능과
  *   회원정보 조회 기능 포함
/ =========================================== */

// 회원체크 - 카카오   -	  member/checkMemberKakao
router.route('/member/checkMemberKakao')
.all(function(req, res, next) {  next();})
.post(members.checkMemberKakao, common.setResponse)

// 회원체크-휴대폰번호   -	  member/checkMemberPhoneNumber
router.route('/member/checkMemberPhoneNumber')
.all(function(req, res, next) {  next();})
.post(members.checkMemberPhoneNumber, common.setResponse)

// 회원로그인-카카오    -	  member/loginKakao
router.route('/member/loginKakao')
.all(function(req, res, next) {  next();})
.post(members.checkMemberKakao, members.login, common.setResponse)

// 회원로그인-휴대폰번호  -	  member/loginPhoneNumber
router.route('/member/loginPhoneNumber')
.all(function(req, res, next) {  next();})
.post(members.checkMemberPhoneNumber, members.login, common.setResponse)

// 회원가입	          C	  member/addMember
router.route('/member/addMember')
.all(function(req, res, next) {  next();})
.post(members.addMember, common.setResponse)

// 회원정보 상세        R	  member/getMemberDetail
router.route('/member/getMemberDetail')
.all(function(req, res, next) {  next();})
.post(members.getMemberDetail, common.setResponse)

// 내 후기목록	        R	  member/getReviewList
router.route('/member/getReviewList')
.all(function(req, res, next) {  next();})
.post(members.getReviewList, common.setResponse)

// 내 예약목록	        R	  member/getReservationList
router.route('/member/getReservationList')
.all(function(req, res, next) {  next();})
.post(members.getReservationList, common.setResponse)

// 내정보 수정	        U	  member/updateMember
router.route('/member/updateMember')
.all(function(req, res, next) {  next();})
.post(members.updateMember, common.setResponse)

// 내정보 수정	        U	  member/updatePassword
router.route('/member/updatePassword')
.all(function(req, res, next) {  next();})
.post(members.updatePassword, common.setResponse)

// 내 찜목록 - 승마장	R	member/getZzimStoreList
router.route('/member/getZzimStoreList')
.all(function(req, res, next) {  next();})
.post(members.getZzimStoreList, common.setResponse)

// 내 찜목록 - 프로그램	R	member/getZzimProgramList
router.route('/member/getZzimProgramList')
.all(function(req, res, next) {  next();})
.post(members.getZzimProgramList, common.setResponse)

/* ========================================== /
  * POST /program/*
  * : 프로그램 조회
  *   및 프로그램 하위의 스케줄 조회 포함
/ =========================================== */

// 프로그램 List	 R	  program/getProgramList
router.route('/program/getProgramList')
.all(function(req, res, next) {  next();})
.post(programs.getProgramList, common.setResponse)

// 프로그램 상세	   R	  program/getProgramDetail
router.route('/program/getProgramDetail')
.all(function(req, res, next) {  next();})
.post(programs.getProgramDetail, common.setResponse)

// 스케줄 list	    R	  program/getScheduleList
router.route('/program/getScheduleList')
.all(function(req, res, next) {  next();})
.post(programs.getScheduleList, common.setResponse)

// 스케줄 상세(?)  R	  program/getScheduleDetail
router.route('/program/getScheduleDetail')
.all(function(req, res, next) {  next();})
.post(programs.getScheduleDetail, common.setResponse)

/* ========================================== /
  * POST /store/*
  * : 승마장 조회
  *   및 승마장 하위의 프로그램, 후기 조회 포함
/ =========================================== */
// 상점 목록	     R	store/getStoreList
router.route('/store/getStoreList')
.all(function(req, res, next) {  next();})
.post(stores.getStoreList, common.setResponse)

// 상점 상세	     R	store/getStoreDetail
router.route('/store/getStoreDetail')
.all(function(req, res, next) {  next();})
.post(stores.getStoreDetail, common.setResponse)

// 프로그램 목록	  R	 store/getProgramList
router.route('/store/getProgramList')
.all(function(req, res, next) {  next();})
.post(stores.getProgramList, common.setResponse)

// 후기 목록	     R	store/getReviewList
router.route('/store/getReviewList')
.all(function(req, res, next) {  next();})
.post(stores.getReviewList, common.setResponse)

/* ========================================== /
  * POST /reservation/*
  * : 예약하기 및 예약 상세정보 조회, 수정
/ =========================================== */
// 예약하기	  C	  reservation/addReservation
router.route('/reservation/addReservation')
.all(function(req, res, next) {  next();})
.post(reservations.addReservation, common.setResponse)

// 예약 수정	U	 reservation/updateReservation
router.route('/reservation/updateReservation')
.all(function(req, res, next) {  next();})
.post(reservations.updateReservation, common.setResponse)

// 예약상세	  R	  reservation/getReservationDetail
router.route('/reservation/getReservationDetail')
.all(function(req, res, next) {  next();})
.post(reservations.getReservationDetail, common.setResponse)

/* ========================================== /
  * POST /review/*
  * : 리뷰 조회 및 생성 수정 삭제
/ =========================================== */
// 리뷰상세	  R	  review/getReviewDetail
router.route('/review/getReviewDetail')
.all(function(req, res, next) {  next();})
.post(reviews.getReviewDetail, common.setResponse)

// 리뷰업로드	C	 review/addReview
router.route('/review/addReview')
.all(function(req, res, next) {  next();})
.post(reviews.addReview, common.setResponse)

// 리뷰수정	  U	  review/updateReview
router.route('/review/updateReview')
.all(function(req, res, next) {  next();})
.post(reviews.updateReview, common.setResponse)

// 리뷰삭제	  D	  review/deleteReview
router.route('/review/deleteReview')
.all(function(req, res, next) {  next();})
.post(reviews.deleteReview, common.setResponse)

/* ========================================== /
  * POST /etc/*
  * : 기타기능
/ =========================================== */
// 공지리스트 조회	R	etc/getNoticeList
router.route('/etc/getNoticeList')
.all(function(req, res, next) {  next();})
.post(etcs.getNoticeList, common.setResponse)

// 공지사항 상세	R	etc/getNoticeDetail
router.route('/etc/getNoticeDetail')
.all(function(req, res, next) {  next();})
.post(etcs.getNoticeDetail, common.setResponse)

// FAQ 리스트 조회	R	etc/getFaqList
router.route('/etc/getFaqList')
.all(function(req, res, next) {  next();})
.post(etcs.getFaqList, common.setResponse)

// FAQ 상세	R	etc/getFaqDetail
router.route('/etc/getFaqDetail')
.all(function(req, res, next) {  next();})
.post(etcs.getFaqDetail, common.setResponse)

// 배너리스트 조회	R	etc/getBannerList
router.route('/etc/getBannerList')
.all(function(req, res, next) {  next();})
.post(etcs.getBannerList, common.setResponse)

// 찜하기	C	etc/addZzim
router.route('/etc/addZzim')
.all(function(req, res, next) {  next();})
.post(etcs.addZzim, common.setResponse)

// 찜취소	D	etc/deleteZzim
router.route('/etc/deleteZzim')
.all(function(req, res, next) {  next();})
.post(etcs.deleteZzim, common.setResponse)

//sql handler
router.use(function(err, req, res, next){
  if(err.code != null){
    console.log(err.code)
  }
  next(err);
})

// 사진업로드	etc/uploadImage
var multer = require('multer')
var memorystorage = multer.memoryStorage()
var upload = multer({ storage: memorystorage })

// 이미지업로드 	C	etc/uploadImage
router.route('/etc/uploadImage')
.all(function(req, res, next) {  next();})
.post(upload.single("images"), etcs.uploadImage, common.setResponse)

//맨 마지막줄
module.exports = router;
