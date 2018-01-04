var express = require('express');
var router = express.Router();

var reservations = require('../controllers/reservations');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(reservations.getList, common.setResponse)        // 승마장 리스트 출력
.post(reservations.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:reservationId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(reservations.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(reservations.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('reservationId', reservations.getOne);

module.exports = router;
