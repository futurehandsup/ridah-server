let common = require('../common')
let connection = common.initDatabase();
//common.test(connection);

/* ========================================== /
  * Auth, 로그인 회원가입
  * : 회원가입, 로그인 등 Auth 기능과
  *   회원정보 조회 기능 포함
/ =========================================== */
// 회원체크 - 카카오	-	member/checkMemberKakao
exports.checkMemberKakao = function(req, res, next){
  let {userKakaoKey} = req.body;

  let decrypted = userKakaoKey;//common.decipherPassword(userKakaoKey, ()=>next(new Error("해독실패")));
  if(decrypted == null || decrypted == ""){
    return next(new Error("잘못된 카카오톡 사용자 id입니다."));
  }
  req.body.password = decrypted;
  //userPassword 암호화 필요!
  let query = `SELECT * FROM Member WHERE userKakaoKey='${decrypted}' AND leaveYn <> 1 LIMIT 1;`
  console.log(query);
  connection.query(query, function (err, member) {
    if (err) {
      return next(err);
    } else {
      //패스워드, 암호해시만이라도 가리기
      if(typeof member[0].password !="undefined"){
        delete member[0].password;
      }
      if(typeof member[0].salt !="undefined"){
        delete member[0].salt;
      }
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        member : member[0],
      }
      common.setResult(req, result);
      next();
    }
  })
}
// 회원체크 - 휴대폰번호	-	member/checkMemberPhoneNumber
exports.checkMemberPhoneNumber = function(req, res, next){
  let {userPhoneNumber, password} = req.body;
  console.log(password)

  //userPassword 암호화 체크
  checkPassword(null, userPhoneNumber, password)
    .then(function(result){
      if(result == false){
        //console.log(checkPassword(userNo, null, userPassword))
        console.log('불일치?')
        return next(new Error('비밀번호 불일치'));
      }
      //이상 없으면 user 반환
      let query = `SELECT *  FROM Member WHERE userPhoneNumber='${userPhoneNumber}' AND leaveYn <> 1 LIMIT 1;`
      connection.query(query, function (err, member) {
        if (err || member == null || member.length == 0) {
          return next(err);
        } else {
          //패스워드, 암호해시만이라도 가리기
          if(typeof member[0].password !="undefined"){
            delete member[0].password;
          }
          if(typeof member[0].salt !="undefined"){
            delete member[0].salt;
          }
          var result = {
            title : "사용",
            success : true,
            message : '메시지',
            member : member[0],
          }
          common.setResult(req, result);
          next();
        }
      })
    })
    .catch(function(err){
      next(err)
    })
}
var checkPassword = function(userNo, userPhoneNumber, password){
  return new Promise(function(res, rej){
    let query = `SELECT salt, password FROM Member `
    if(userPhoneNumber != null){
      query += `WHERE userPhoneNumber='${userPhoneNumber}' LIMIT 1;`
    }
    else if(userNo != null){
      query += `WHERE userNo='${userNo}' LIMIT 1;`
    }
    console.log(query)
    let flag = false;
    connection.query(query, function (err, members) {
        if (err || members == null || members.length == 0) {
        console.error(err)
        rej(err)
      }
      else {
        console.log(members)
        //flag = members[0].userPassword == password; //임시- 암호화 안 된 패스워드
        flag = members[0].password == common.hashPassword(password, members[0].salt ); //암호화된 거랑 비교

        // console.log(members[0].userPassword)
        // console.log(common.hashPassword(password, members[0].salt) )
        // console.log(flag)
        res(flag)
      }
    })
  })
}


// 회원 로그인
exports.login = function(req, res, next){
  let {member} = req.result;

  console.log(member)
  if(member == null){ //로그인 실패
    req.session.loginFailed = true;
    return next(new Error("해당하는 사용자가 없습니다."))
    //res.redirect('/members/login')
  }else{ //로그인 성공
    //req.session = null;)
    console.log(req.session)
    console.log("sessionid::::"+req.session.id)
    req.session.member = {
      userNo : member.userNo,
      userName : member.userName,
      userProfilePic : member.userProfilePic,
      nickname : member.nickname,
    }
    req.session.save();
    next();
    //req.session.member = member;
    //res.redirect('/');
  }

}

/* ========================================== /
  *  일반 API
  * : 내정보 조회 수정 기능
/ =========================================== */
// 회원가입	C	member/addMember
exports.addMember = function(req, res, next) {
  let user = req.body
  if(user.password == null){
    console.log(user)
    //user.password = common.decipherPassword(user.userKakaoKey, next);
    user.password = user.userKakaoKey;
  }
  console.log("유저패스워드 변환전" + user.password);
  //회원가입시 암호화 로직 2019.01.25 - 김미래
  //보안을 위해 salt 값 추가
  let password = user.password; // ???
  user.salt = common.createSalt()
  user.password = common.hashPassword(user.password, user.salt);

  console.log("유저패스워드 변환후" + user.password);

  let queryKeys = "";
  let queryValues = "";

  for (let item in user) {
    queryKeys += `${item}, `
    if(item =="userKakaoKey"){
      queryValues += `'${password}', `
    }else{
      queryValues += `'${user[item]}', `
    }
  }

  queryKeys = queryKeys.trim();
  if (queryKeys.endsWith(',')) queryKeys = queryKeys.slice(0, -1); //마지막 AND
  queryValues = queryValues.trim();
  if (queryValues.endsWith(',')) queryValues = queryValues.slice(0, -1); //마지막 AND

  var query = `INSERT INTO Member(${queryKeys}) `
  query += `VALUES(${queryValues})`;

  console.log(query);

  user.password = password;

  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "사용자 등록 완료",
        success: true,
        message: '메시지',
        userNo: sqlResult.insertId
      }
      common.setResult(req, result);
      next();
    }
  })
};

// 회원정보 상세	R	member/getMemberDetail
exports.getMemberDetail = function(req, res, next){
  let { userNo } = req.body;

  var query = ""
  if(userNo != null && userNo != ""){
    query = `SELECT * FROM Member WHERE userNo = '${userNo}' ;`
  }else{
    return next(new Error("사용자 키를 입력해주세요"))
  }
  console.log(query);
  connection.query(query, function (err, member) {
    if (err) {
      return next(err);
    } else {
      //패스워드, 암호해시만이라도 가리기
      if(typeof member[0].password !="undefined"){
        delete member[0].password;
      }
      if(typeof member[0].salt !="undefined"){
        delete member[0].salt;
      }
      // if(userinfo[0].adminMemo !=null){
      //   userinfo[0].adminMemo = undefined;
      // }
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        member : member[0]
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 내정보 수정	U	member/updateMember
exports.updateMember = function(req, res, next) {
  let { userNo } = req.body;
  if(!Object.keys(req.body)){
    return next(new Error("값이 없으므로 수정할 수 없습니다."));
  }
  let query = `UPDATE Member SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  for(let item in req.body){
    if(item == "userNo") continue;
    query += `${item} = '${req.body[item]}', `
  }
  query = query.trim();
  if(query.endsWith(',')) query = query.slice(0, -1);  //마지막 AND

  query += ` WHERE userNo = '${userNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "회원정보 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 패스워드 변경	U	member/updatePassword
exports.updatePassword = function(req, res, next) {
  let { userNo, password } = req.body;

  if(password == null){
    //user.password = common.decipherPassword(user.userKakaoKey, next);
    return next(new Error("비밀번호가 없습니다"));
  }
  console.log("유저패스워드 변환전" + password);
  //회원가입시 암호화 로직 2019.01.25 - 김미래
  //보안을 위해 salt 값 추가
  let pw = password; // ???
  salt = common.createSalt()
  pw = common.hashPassword( password, salt);

  console.log("유저패스워드 변환후" + pw);
  let query = `UPDATE Member SET `;
  query += ` updateDate = CURRENT_TIMESTAMP, `
  query += ` password = '${pw}', salt = '${salt}' `

  query += ` WHERE userNo = '${userNo}'`;

  console.log(query);
  connection.query(query, function(err, sqlResult) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title: "패스워드 수정 성공",
        success: true,
        message: '메시지',
        userNo: userNo
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 내 후기목록	R	member/getReviewList
exports.getReviewList = function(req, res, next){
  let { userNo, page } = req.body;
  if(userNo == null || userNo == ""){
    return next(new Error("사용자 키를 입력해주세요"))
  }
  var query = ""
  query = `SELECT * FROM Review `;
  query += ` WHERE userNo = '${userNo}' `
  query += ` ORDER BY reviewNo DESC `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  console.log(query);
  connection.query(query, function (err, reviews) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        reviews : reviews
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 내 예약목록	R	member/getReservationList
exports.getReservationList = function(req, res, next){
  let { userNo, page } = req.body;
  if(userNo == null || userNo == ""){
    return next(new Error("사용자 키를 입력해주세요"))
  }
  var query = ""
  query = `SELECT * FROM Reservation `;
  query += ` WHERE userNo = '${userNo}' `
  query += ` ORDER BY reservationNo DESC `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  console.log(query);
  connection.query(query, function (err, reservations) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        reservations : reservations
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 내 찜목록 - 승마장	R	member/getZzimStoreList
exports.getZzimStoreList = function(req, res, next){
  let { userNo, page } = req.body;
  if(userNo == null || userNo == ""){
    return next(new Error("사용자 키를 입력해주세요"))
  }
  var query = ""
  query = `SELECT Store.*, Zzim.* FROM Zzim `;
  query += ` LEFT JOIN Store ON Store.storeNo = Zzim.storeNo `
  query += ` WHERE Zzim.userNo = '${userNo}' AND Zzim.storeNO <> 0 `
  query += ` GROUP BY Store.storeNo `
  query += ` ORDER BY zzimNo DESC `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  console.log(query);
  connection.query(query, function (err, stores) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        stores : stores
      }
      common.setResult(req, result);
      next();
    }
  })
}

// 내 찜목록 - 프로그램	R	member/getZzimProgramList
exports.getZzimProgramList = function(req, res, next){
  let { userNo, page } = req.body;
  if(userNo == null || userNo == ""){
    return next(new Error("사용자 키를 입력해주세요"))
  }
  var query = ""
  query = `SELECT Program.*, Zzim.* FROM Zzim `;
  query += ` LEFT JOIN Program ON Program.programNo = Zzim.programNo `
  query += ` WHERE Zzim.userNo = '${userNo}' AND Zzim.programNo <> 0 `
  //query += ` GROUP BY Zzim.programNo `
  query += ` ORDER BY zzimNo DESC `

  if(page != null && page != ""){
    query += `LIMIT  ${(page-1) * 10 }, 10 `
  }
  console.log(query);
  connection.query(query, function (err, programs) {
    if (err) {
      return next(err);
    } else {
      var result = {
        title : "사용",
        success : true,
        message : '메시지',
        programs : programs
      }
      common.setResult(req, result);
      next();
    }
  })
}
