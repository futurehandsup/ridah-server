var express = require('express');
var router = express.Router();

var common = require('../controllers/common');
var stores = require('../controllers/stores');
var users = require('../controllers/users');
  //passport = require('passport');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/admin/login');
};

// render 될 페이지 모음
router.get('/', isAuthenticated);
router.get('/login', common.renderPage('admin/login'));

// stores
router.get('/stores/list', stores.getList, stores.getSchemas, common.renderPage('admin/stores/list'));
router.get('/stores/edit', stores.getList, stores.getSchemas, common.renderPage('admin/stores/edit')); // 필요없음
router.get('/stores/edit/:storeId', stores.getSchemas, common.renderPage('admin/stores/edit'));

router.param('storeId', stores.getOne);

//users
router.get('/users/list', users.getList, users.getSchemas, common.renderPage('admin/users/list'));
router.get('/users/edit', users.getList, users.getSchemas, common.renderPage('admin/users/edit')); // 필요없음
router.get('/users/edit/:userId', users.getSchemas, common.renderPage('admin/users/edit'));
router.param('userId', users.getOne);



//밑에는 임시
//router.get('/stores/list2', stores.getList2, common.renderPage('admin/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('admin/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('admin/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('admin/stores/list'));



module.exports = router;
