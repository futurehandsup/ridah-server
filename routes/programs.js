var express = require('express');
var router = express.Router();

var programs = require('../controllers/programs');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(programs.getList, common.setResponse)        // 승마장 리스트 출력
.post(programs.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:programId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(programs.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(programs.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('programId', programs.getOne);

module.exports = router;
