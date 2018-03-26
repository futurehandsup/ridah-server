var express = require('express');
var router = express.Router();

var multer = require('multer')
var memorystorage = multer.memoryStorage()
var upload = multer({ storage: memorystorage })

var common = require('../controllers/common');
    //passport = require('passport');

//RESTful API
router.route('/uploadImage')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.notImplementedError)
.post(upload.single("images"), common.uploadFileToS3, common.setResponse)
.put(common.notImplementedError)
.delete(common.notImplementedError); 

module.exports = router;
