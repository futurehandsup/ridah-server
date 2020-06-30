var express = require('express');
var router = express.Router();

var index = require("../newControllers/index");

/* GET home page. */
router.get('/', index.render);

module.exports = router;
