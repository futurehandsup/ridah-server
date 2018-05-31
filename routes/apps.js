var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
var reviews = require('../controllers/reviews');
var qnas = require('../controllers/qnas');
var programs = require('../controllers/programs');
var reservations = require('../controllers/reservations');
var coupons = require('../controllers/coupons');
var couponPurchaseLogs = require('../controllers/couponPurchaseLogs');

var headers = require('../controllers/headers')
var events = require('../controllers/events')
var recommends = require('../controllers/recommends')

router.all('*', function(req, res, next){
  // 데모용, 임시 페이지
  if(req.result.info != null){
    return users.getOne(req, res, next, req.result.info._id);
  }
  else{
    //return users.getOne(req, res, next);
    req.result.user = null;
    return next()
  }
});

//앱에만 필요한 부분
router.get('/homescreen', headers.getList, events.getList, recommends.getList, common.setResponse);
router.get('/mypage', reservations.getList, couponPurchaseLogs.getList, common.setResponse);
router.get('/couponscreen', coupons.getList, couponPurchaseLogs.getList, common.setResponse);

module.exports = router;
