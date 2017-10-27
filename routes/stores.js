var express = require('express');
var router = express.Router();

var stores = require('../controllers/stores');
    //passport = require('passport');


/* GET stores listing. */
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
});

router.get('/list', stores.renderList);

router.get('/registerStore', stores.registerStore);
router.post('/registerStore', stores.registerStore);

router.get('/detail/:storeId', stores.renderDetail);

router.get('/update/:storeId', stores.update);
router.post('/update/:storeId', stores.update);
//router.post('/users/delete/:storeId', stores.delete);

router.param('storeId', stores.findStore);

module.exports = router;
