var express = require('express');
var router = express.Router();

var coupons = require('../controllers/coupons');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(coupons.getList, common.setResponse)        // 승마장 리스트 출력
.post(coupons.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:couponId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(coupons.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(coupons.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('couponId', coupons.getOne);

module.exports = router;
