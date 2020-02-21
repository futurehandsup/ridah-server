var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

// 컨트롤러 변수 선언
let stores = require('../newControllers/stores');
//let members = require('../newControllers/members');



//로그인 대신 사용하는 라인
router.all('*', function(req, res, next){
  // 데모용, 임시 페이지
  if(req.params['storeNo'] == null){
    req.params.storeNo = 1;
  }
  next();
}, stores.getStoreDetail);

// render 될 페이지 모음
router.get('/', stores.getStoreList, common.renderPage('newowners/index'));
// 로그인 아직 덜 만듬
router.get('/login', common.renderPage('newowners/login'));

router.get('/dashboard', common.renderPage('newowners/dashboard/index'));

// 이런식으로 아래에 계속 이어서 작성해 주세요



//마지막 줄에 작성
module.exports = router;
