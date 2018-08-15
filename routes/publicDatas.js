var express = require('express');
var router = express.Router();

var publicDatas = require('../controllers/publicDatas');
var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(publicDatas.getList, common.setResponse)        // 승마장 리스트 출력
.post(publicDatas.registerOne, common.setResponse)   // 승마장 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);
//
// router.route('/addAll')
// .all(function(req,res,next){
//   let data = require("../data.json");
//   data.forEach((e, i)=>{
//   //  if(i!=0) return;
//     publicDatas.registerOneFromArg(e);
//     console.log("adding "+e.BSSH_NM);
//   })
//   next();
// })
// .get(publicDatas.getList, common.setResponse);

router.route('/:publicDataId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                          //승마장 정보 출력
.put(publicDatas.updateOne, common.setResponse)        //승마장 정보 가져오기
.delete(publicDatas.deleteOne, common.setResponse)     //승마장 삭제
.post(common.notImplementedError);

router.param('publicDataId', publicDatas.getOne);

module.exports = router;
