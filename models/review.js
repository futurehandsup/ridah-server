var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    reviewTitle : {
      type: String,
      index : true,         // 보조 index
      required : 'reviewTitle is required'   // 검증
    },
    reviewText : {
      type : String,
      default : "",
      required : 'reviewText is required'
    },
    reviewWriter : {
       type : Schema.ObjectId,
       ref : 'User'
    },
    reviewScore : {
      // 평점
      type : Number,
      min: 0,
      max: 10,
      default : 10,
      get: function(v){
        //if(typeof v == "Number")
          return v.toFixed(1)
      }
    },
    reviewStore : {
       type : Schema.ObjectId,
       ref : 'Store'
    },
    //program, reservation 도 추가!
    reviewProgram : {
       type : Schema.ObjectId,
       ref : 'Program'
    },
    reviewReservation : {
       type : Schema.ObjectId,
       ref : 'Reservation'
    },
    reviewType : {
      type : String,
      default : 'review',
      enum : ['review', 'reply']
    },
    replies : [
      {
        type: Schema.ObjectId,
        ref: 'Review'
      }
    ],
    parent : {
      type : Schema.ObjectId,
      ref: 'Review'
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
ReviewSchema.post('save', function(result){
  if(result.reviewType == "reply"){
    mongoose.model('Review').findById(result.parent, function(err, review){
      //console.log(result.id);
      review.replies.push(result.id);
      review.save();
    });
  }
  else if(result.reviewScore != null){
    mongoose.model('Review')
      .aggregate([
        { $match: { reviewStore : result.reviewStore, reviewType: 'review'}},
        { $group: { _id : "$reviewStore",avgScore : { $avg: "$reviewScore"} }}
      ]).exec(function(err, review){
        console.log(review)
        mongoose.model('Store').findById(result.reviewStore, function(err, store){
          store.score = review[0].avgScore;
          store.save();
        })
      })
  }
});
ReviewSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

ReviewSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('Review', ReviewSchema);
