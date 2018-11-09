var express = require('express');
var router = express.Router();

var calculations = require('../controllers/calculations');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(calculations.getList, common.setResponse)        // 승마장 리스트 출력
.post(calculations.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:calculationId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(calculations.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(calculations.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('calculationId', calculations.getOne);

module.exports = router;
