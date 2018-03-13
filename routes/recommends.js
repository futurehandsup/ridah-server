var express = require('express');
var router = express.Router();

var recommends = require('../controllers/recommends');
var stores = require('../controllers/stores')
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(recommends.getList, common.setResponse)        // 승마장 리스트 출력
.post(recommends.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:recommendId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(recommends.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(recommends.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('recommendId', recommends.getOne);

module.exports = router;
