var express = require('express');
var router = express.Router();

var stores = require('../controllers/stores');
var programs = require('../controllers/programs');
var reviews = require('../controllers/reviews');
var common = require('../controllers/common');
var users = require('../controllers/users');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  // 데모용으로 구성
  if(req.query.userId != undefined){
    return users.getOne(req, res, next, req.query.userId);
  }
  else{
    return users.getOne(req, res, next);
  }
  //next();
})
.get(stores.getList, common.setResponse)        // 승마장 리스트 출력
.post(stores.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:storeId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  // 데모용으로 구성
  if(req.query.userId != undefined){
    return users.getOne(req, res, next, req.query.userId);
  }
  else{
    return users.getOne(req, res, next);
  }
//  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(stores.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(stores.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.route('/:storeId/details').get(reviews.getList, programs.getReservationsList, common.setResponse);
router.param('storeId', stores.getOne);

var reservationRouter = require('./reservations');
router.use('/:storeId/reservations', reservationRouter);

var programRouter = require('./programs');
router.use('/:storeId/programs', programRouter);

module.exports = router;
