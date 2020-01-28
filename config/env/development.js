var dbinfo = require('./_db.js')
/* 개발자용 옵션 */
module.exports = {
  // db : 'mongodb://'+dbinfo.database_id+':'+dbinfo.database_pw+'@localhost/database',
  db : 'mongodb://'+dbinfo.database_id+':'+dbinfo.database_pw+'@13.125.183.104/database',
  sessionSecret : 'thisissessionSecret',
  refreshSecret : 'thisisrefreshsessionSecret',
}
