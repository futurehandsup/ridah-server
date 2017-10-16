var dbinfo = require('./_db.js')
/* 개발자용 옵션 */
module.exports = {
  db : 'mongodb://'+dbinfo.database_id+':'+dbinfo.database_pw+'@localhost/database',
  sessionSecret : 'thisissessionSecret'
}
