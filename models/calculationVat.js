var mongoose = require('mongoose'),
     Schema = mongoose.Schema;
/*
  table coupon
  타입: 체험(일반) / 체험(고급) / 자유
  가격 : 체험(50000), 고급(70000), 자유(50000)으로 책정
  사용 가능 횟수 : (n 회 이용권)
  유효기간 : 기본 90일?
*/
var CalculationVatSchema = new Schema({
    store : {
       type : Schema.ObjectId,
       ref : 'Store'
    },
    vatPeriod : {
      type : Date,
      default : Date.now,
      get: function(date){
        return date.toLocaleDateString("ko-KR")
      }
    },
    overVat : {
      type : Number,
      default : 0
    },
    underVat : {
      type : Number,
      default : 0
    },
    creditcard : {
      type : Number,
      default : 0
    },
    deduction : {
      type : Number,
      default : 0
    },
    expenditure : {
      type : Number,
      default : 0
    },
    etc : {
      type : Number,
      default : 0
    }
    /*
    // 예약한 코스 정보, 예약 인원 등등
    options : {

    },*/
    /*
    위 코드처럼 post 의 author 속성에 user 인스턴스를 대입해 사용한다.
    하지만 DBRef 는 실제 값이 들어간 것이 아니고 외래키 형식으로 해당 값을 참조하는 것이다.
    이에 데이터를 채워 넣기위해서는 populate() 라는 함수를 사용해야 한다.
    예를 들어 find() 메소드는 다음 코드 처럼 author 속성을 채워넣는다.

    Post.find().populate('author').exec(function(err, posts) {
     .......
    });
    위 처럼 코드를 작성하면 find 함수를 이용하여 검색할 때 posts 컬렉션에 있는 모든 데이터를 인출해 author 필드를 채워 넣을 것 이다.
    */
});
CalculationVatSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

// CalculationVatSchema.virtual('idpass').get(function() {     // 가상 속성, CalculationVatSchema 의 set 옵션에 virtuals 옵션을 true 로 설정해야 작동
//     return this.userid + ' ' + this.password;
// });
// CalculationVatSchema.pre('save', function(next){
//   /*
//   사용자의 비밀번호를 해시하기 위해 pre-save 미들웨어를 생성했다.
//   pre 미들웨어는 해당요청이 실행되기전에 먼저 실행되는 메소드를 지정할 수 있다.  예를 들어 기존에 만들었던
//   신규 사용자 등록을 위해 post 로 데이터를 보냈을 시 데이터를 등록하기 전 pre 미들웨어가 있다면
//   pre 미들웨어를 먼저 실행하고 데이터를 등록할 것 이다.
//   */
//   if(this.password) {
//       this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),
//       'base64');
//   this.password = this.hashPassword(this.password);
//   }
//   next();
// });
//
// CalculationVatSchema.methods.hashPassword = function(password) {
//     /*
//     hashPassword() 메소드는 노드의 crypto 모듈을 활용해 비밀번호를 암호화 하기 위해 사용되며 ,
//     authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
//     */
//     return crypto.pbkdf2Sync(password, this.salt, 10000, 64).
//     toString('base64');
// };
//
// CalculationVatSchema.methods.authenticate = function(password) {
//   //authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
//   return this.password === this.hashPassword(password);
// };
//
// CalculationVatSchema.statics.findUniqueCalculationVatid = function(userid, suffix, callback) {
//     /*
//     새로운 사용자가 선택 가능한 유일한 이름을 찾기 위해 쓰이는 findUniqueUserId() 정적 메소드를 추가 하였다.
//     니중에 OAuth (트위터, 페이스북 연동 로그인) 인증을 다룰 때, 이 메소드를 사용할 것
//     */
//     var _this = this;
//     var possibleUserid = userid + (suffix || '');
//
//     _this.findOne({
//         userid : possibleUserid
//     }, function(err,user) {
//         if(!err) {
//             if(!user) {
//                 callback(possibleUserid);
//             }else{
//                 return _this.findUniqueUserid(userid, (suffix || 0) + 1, callback);
//             }
//         }else{
//             callback(null);
//         }
//     });
// };

CalculationVatSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('CalculationVat', CalculationVatSchema);
