var express = require('express');
var router = express.Router();

var stores = require('../controllers/stores');
var programs = require('../controllers/programs');
var reviews = require('../controllers/reviews');
var common = require('../controllers/common');
var users = require('../controllers/users');
var qnas = require('../controllers/qnas');
    //passport = require('passport');

router.use(function(req, res, next) {
  // if(req.result.info != null){
  //   return users.getOne(req, res, next, req.result.info._id);
  // }
  /*else*/ if(req.query.userId != null){
    return users.getOne(req, res, next, req.query.userId);
  }
  // else{
  //   return users.getOne(req, res, next);
  // }
  next();
});

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  // 데모용으로 구성
  // if(req.query.userId != undefined){
  //   return users.getOne(req, res, next, req.query.userId);
  // }
  // else{
  //   return users.getOne(req, res, next);
  // }
  next();
})
.get(stores.getList, common.setResponse)        // 승마장 리스트 출력  GET /stores
.post(stores.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:storeId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  // 데모용으로 구성
  // if(req.query.userId != undefined){
  //   return users.getOne(req, res, next, req.query.userId);
  // }
  // else{
  //   return users.getOne(req, res, next);
  // }
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(stores.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(stores.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.route('/:storeId/details').get(reviews.getList, programs.getReservationsList, common.setResponse);
router.route('/:storeId/calendar').get(programs.getReservationsList, common.setResponse);
router.param('storeId', stores.getOne);

var reservationRouter = require('./reservations');
router.use('/:storeId/reservations', reservationRouter);

var programRouter = require('./programs');
router.use('/:storeId/programs', programRouter);

var reviewRouter = require('./reviews');
router.use('/:storeId/reviews', reviewRouter);

var qnaRouter = require('./qnas');
router.use('/:storeId/qnas', qnaRouter);

module.exports = router;
