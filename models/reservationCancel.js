var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var ReservationCancelSchema = new Schema({
    reservationNum : {
      type : Number,
      default : 0,
      },
    reservationDate : {
      type : String,
      validate : {
        validator: function(date) {
          return (new Date(date) > Date.now())
        },
        message: "예약할 수 없는 시간입니다."
      },
      // get: function(date){
      //   return new Date(date)
      // }
    },
    cancelDate : {
      type : Date,
      default : "0000-00-00"
    },
    cancelState : {
      type: String,
      enum: ["취소요청", "취소중", "취소완료", "취소철회"],
      default: "취소요청"
    },
    programName : {
      type : String,
      default : ""
    },
    personnel : {
      type : String ,
      default : "",
      require : "personnel is required"
    },
    reserver : {
      type : String,
      default : ""
    },
    reserverPhone : {
      type : Number,
      default : ""
    },
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
    // 추가로 결제정보도. 언제 뭘로 결제했는지.
});
ReservationCancelSchema.pre('save', function(next){
  //console.log(this);
  let reservation = this;

  mongoose.model('ReservationCancel').find({reservationDate : this.reservationDate, program: this.program }, function(err, reservations){
    console.log(reservations)
    if(err) return next(err);
    if(reservations.length > 0){
      var err = new Error('이미 예약이 존재하여 예약 불가능합니다.');
      return next(err);
    }
  });

  mongoose.model('User').findById({_id: this.owner}, function(err, user){
    if(err) return next(err);
    if(user.coupons < reservation.carrots){
      var err = new Error('캐럿이 부족합니다.');
      return next(err);
    }
  })
  this.populate('program').populate('coupon', function(error, reservation){
    if(error) return next(error)
    else next();
  });
});
ReservationCancelSchema.post('save', function(reservation){
  mongoose.model('User').findOneAndUpdate({
      _id : reservation.owner,
    },
    {
      '$inc': { 'coupons' : (-reservation.carrots) },
      //'$push': { 'coupons.$.coupon.reservation' : reservation }
    },
    function(err, user){
      if(err) {
        return next(err)
      }
      let schema = {
        user : reservation.owner,
        usageType: 'reservation',
        reservation: reservation._id,
        carrots: -(reservation.carrots),
        remained: (user.coupons-reservation.carrots), //콜백인데 왜..?
      }
      mongoose.model('CarrotUsageLog').create(schema, function (err, small) {
        if (err) return handleError(err);
        //saved
      });
    });
});
ReservationCancelSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

ReservationCancelSchema.methods.setChecked = function(cb){ //입장완료 요쳥
  if(this.status != "예약완료"){
    cb(Error("취소된 예약이거나 이미 입장완료 처리된 예약입니다."));
  }else{
    let date =  new Date();
    this.status = "입장완료";
    this.checked_at = date;

    this.update({$set: {
      status : "입장완료",
      checked_at :date,
    }}, null, ()=>cb(null,this));
  }
}
ReservationCancelSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('ReservationCancel', ReservationCancelSchema);
