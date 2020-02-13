var express = require('express');
var router = express.Router();

var common = require('../newControllers/common');

//컨트롤러 파일 추가!
var members = require('../newControllers/members');
// var stores = require('../newControllers/stores');
// ...

router.route('/member')
.all(function(req, res, next)  {next();})
.get(members.getMemberList, common.setResponse) // 사용자 리스트 출력
.post(members.addMember, common.setResponse)    // 사용자 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/member/:userNo')
.all(function(req, res, next) {next();})
.get(members.getMemberDetail, common.setResponse)     //사용자 정보 출력
.put(members.updateMember, common.setResponse)        //사용자 정보 가져오기
.delete(members.deleteMember, common.setResponse)     //사용자 삭제
.post(common.notImplementedError);

// 원래 코드 참고
/*router.route('/')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(users.getList, common.setResponse)        // 사용자 리스트 출력
.post(users.registerOne, common.setResponse)   // 사용자 등록
.put(common.notImplementedError)
.delete(common.notImplementedError);

router.route('/:userId')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(common.setResponse)                         //사용자 정보 출력
.put(users.updateOne, common.setResponse)        //사용자 정보 가져오기
.delete(users.deleteOne, common.setResponse)     //사용자 삭제
.post(common.notImplementedError);
*/



//맨 마지막줄
module.exports = router;
