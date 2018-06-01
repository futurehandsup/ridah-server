var express = require('express');
var router = express.Router();

var carrotUsageLogs = require('../controllers/carrotUsageLogs');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(carrotUsageLogs.getList, common.setResponse)        // 승마장 리스트 출력
.post(carrotUsageLogs.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:carrotUsageLogId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(carrotUsageLogs.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(carrotUsageLogs.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('carrotUsageLogId', carrotUsageLogs.getOne);

module.exports = router;
