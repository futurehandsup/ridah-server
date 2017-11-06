var express = require('express');
var router = express.Router();

var stores = require('../controllers/stores');
var common = require('../controllers/common');
    //passport = require('passport');

// render 될 페이지 모음
// stores
router.get('/stores/list', stores.getList, common.renderPage('admin/stores/list'));
router.get('/stores/edit', stores.getList, common.renderPage('admin/stores/edit'));
router.get('/stores/edit/:storeId', common.renderPage('admin/stores/edit'));


router.get('/stores/list2', stores.getList2, common.renderPage('admin/stores/list2'));

router.get('/stores/detail2/:storeId', common.renderPage('admin/stores/detail2'));
router.get('/stores/detail/:storeId', common.renderPage('admin/stores/detail'));
router.get('/stores/update/:storeId', stores.updateOne, common.renderPage('admin/stores/list'));

router.param('storeId', stores.getOne);

module.exports = router;
