var mongoose = require('mongoose'),
     Schema = mongoose.Schema;
/*
  table couponUsageLog 쿠폰 구매 기록
  사용자,
  쿠폰,
  결제금액
*/
var CarrotUsageLogSchema = new Schema({
    user : {
      type : Schema.ObjectId,
      ref : 'User'
    },
    usageType: {
      type: String,
      enum : ['purchase', 'reservation', 'expire'], //// TODO: 예약취소부분 반영
    },
    couponPurchaseLog: {
      type: Schema.ObjectId,
      ref: 'CouponPurchaseLog',
    },
    reservation: {
      type: Schema.ObjectId,
      ref: 'Reservation'
    },
    carrots: {
      type: Number,
    },
    remained: {
      type: Number,
    },

    created_at : {
      type : Date,
      default : Date.now,
      get: function(date){
        return date.toLocaleDateString("ko-KR")
      }
    },
    updated_at : {
      type : Date,
      default : Date.now,
      get: function(date){
        return date.toLocaleDateString("ko-KR")
      }
    },
    deleted : {
      is_deleted : Boolean,
      deleted_at : Date
    }
});
CarrotUsageLogSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});
CarrotUsageLogSchema.post('save', function(result) {
  if(result.usageType == "reservation"){
    let calculation =  mongoose.model('Calculation')
    result.populate('reservation', function(err, carrotUsageLog){
      console.log(carrotUsageLog)
      let calculationYear, calculationMonth, reservationDate;
      reservationDate = new Date(carrotUsageLog.reservation.reservationDate);
      calculationYear = reservationDate.getFullYear();
      calculationMonth = reservationDate.getMonth()+1;
      let calculateDue_at = reservationDate.setMonth(reservationDate.getMonth() + 1, 15);

      calculation.findOneAndUpdate({
          calculationYear: calculationYear,
          calculationMonth: calculationMonth,
          store: carrotUsageLog.reservation.store
        },
        {
          $set: {
            calculationYear: calculationYear,
            calculationMonth: calculationMonth,
            store: carrotUsageLog.reservation.store,
            calculateDue_at : calculateDue_at,
            //fee : carrotUsageLog.carrots,
          },
          $push: {carrotUsageLogs : carrotUsageLog._id  },
        },
        {upsert: true, new: true, runValidators: true},  //options
        function(err, calculation){
          if(err) {
          //  return next(err)
            carrotUsageLog.remove();
          }
          console.log(calculation)
          if(calculation==null){
            carrotUsageLog.remove();
            carrotUsageLog.reservation.remove();
            //throw new Error("실패")
          }
        }
      );
    })
  }
});
CarrotUsageLogSchema.post('remove', function(result) {
  let User = mongoose.model('User');
  let carrots = (result.remained - result.carrots);
  User.findOneAndUpdate({_id : result.user},
    {coupons : carrots} ,
    {new :true},
    function(err, user){

    });
});
// CarrotUsageLogSchema.virtual('idpass').get(function() {     // 가상 속성, CarrotUsageLogSchema 의 set 옵션에 virtuals 옵션을 true 로 설정해야 작동
//     return this.userid + ' ' + this.password;
// });
// CarrotUsageLogSchema.pre('save', function(next){
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
// CarrotUsageLogSchema.methods.hashPassword = function(password) {
//     /*
//     hashPassword() 메소드는 노드의 crypto 모듈을 활용해 비밀번호를 암호화 하기 위해 사용되며 ,
//     authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
//     */
//     return crypto.pbkdf2Sync(password, this.salt, 10000, 64).
//     toString('base64');
// };
//
// CarrotUsageLogSchema.methods.authenticate = function(password) {
//   //authenticate() 메소드는 문자열 인수를 받아들여 암호화하고 현재 사용자의 비밀번호와 비교한다.
//   return this.password === this.hashPassword(password);
// };
//
// CarrotUsageLogSchema.statics.findUniqueCarrotUsageLogid = function(userid, suffix, callback) {
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

CarrotUsageLogSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('CarrotUsageLog', CarrotUsageLogSchema);
