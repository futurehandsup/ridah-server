var mongoose = require('mongoose'),
    crypto = require('crypto'),
     Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : String ,
    userid : {
      type : String ,
      trim : true ,     //자동으로 앞뒤공백 제거
      unique : true,     // primary key로 지정
      required : 'User ID is required'   // 검증
    },
    email : {
      type : String ,
      index : true,         // 보조 index
      match : [/.+\@.+\..+/, "pleas fill a valid e-mail address"]  // 형식 검증
    },
    // website : {
    //   type : String ,
    //   /*
    //    기존에 website 속성이 없는 데이터들:
    //    get 방식으로 website 속성을 기존 데이터를 질의하는 시점에 강제적으로 website 필드를 붙여서 결과가 나오도록
    //    website 가 존재하는 데이터는 website 를 포함해서 나오고, 아니라면 website 필드가 나오지 않는대
    //   */
    //   get : function(url) {
    //     if(!url) {
    //       return url;
    //     } else {
    //       if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
    //         url = 'http://' + url;
    //       }
    //       return url;
    //     }
    //   }
    // },
    role : {
      type : String ,
      enum : ['Admin', 'Owner', 'User'],
      default: 'User'
    },
    // 비밀번호 암호화 및 인증을 위해 필요한 부분
    password : {
      type : String ,
      validate : [
        function(password) {
          return password && password.length > 6;
        }, 'Password should be longer'
      ]
    },
    salt : {                                         // 암호를 해시하기 위한 salt 속성
        type : String
    },
    provider : {                                     // 사용자를 등록하기 위해 사용되는 전략을 지시하는 provider 속성
        type : String ,
        required : 'Provider is required'
    },
    providerId : String ,                            // 인증전략을 위한 사용자 식별자를 지시
    providerData : {} ,                              //OAuth 공급자로부터 인출한 사용자 객체를 저장하기 위해 나중에 사용 할 providerData 속성
    // 비밀번호 암호화 및 인증을 위해 필요한 부분 
    created_at : {
      type : Date,
      default : Date.now
    },
    updated_at : {
      type : Date,
      default : Date.now
    },
    deleted : {
      is_deleted : Boolean,
      deleted_at : Date
    }
}, {id: true});

// UserSchema.virtual('idpass').get(function() {     // 가상 속성, UserSchema 의 set 옵션에 virtuals 옵션을 true 로 설정해야 작동
//     return this.userid + ' ' + this.password;
// });
UserSchema.pre('save', function(next){
  /*
  사용자의 비밀번호를 해시하기 위해 pre-save 미들웨어를 생성했다.
  pre 미들웨어는 해당요청이 실행되기전에 먼저 실행되는 메소드를 지정할 수 있다.  예를 들어 기존에 만들었던
  신규 사용자 등록을 위해 post 로 데이터를 보냈을 시 데이터를 등록하기 전 pre 미들웨어가 있다면
  pre 미들웨어를 먼저 실행하고 데이터를 등록할 것 이다.
  */
  if(this.password) {
      this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),
      'base64');
  this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password) {
    /*
    hashPassword() 메소드는 노드의 crypto 모듈을 활용해 비밀번호를 암호화 하기 위해 사용되며 ,
    authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
    */
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).
    toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  //authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUserid = function(userid, suffix, callback) {
    /*
    새로운 사용자가 선택 가능한 유일한 이름을 찾기 위해 쓰이는 findUniqueUserId() 정적 메소드를 추가 하였다.
    니중에 OAuth (트위터, 페이스북 연동 로그인) 인증을 다룰 때, 이 메소드를 사용할 것
    */
    var _this = this;
    var possibleUserid = userid + (suffix || '');

    _this.findOne({
        userid : possibleUserid
    }, function(err,user) {
        if(!err) {
            if(!user) {
                callback(possibleUserid);
            }else{
                return _this.findUniqueUserid(userid, (suffix || 0) + 1, callback);
            }
        }else{
            callback(null);
        }
    });
};

UserSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('User', UserSchema);
