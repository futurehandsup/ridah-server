var express = require('express');
var router = express.Router();

var qnas = require('../controllers/qnas');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(qnas.getList, common.setResponse)        // 승마장 리스트 출력
.post(qnas.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:qnaId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(qnas.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(qnas.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('qnaId', qnas.getOne);

module.exports = router;
