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
      default : ""
      required : 'reviewText is required'
    },
    reviewWriter : {
       type : Schema.ObjectId,
       ref : 'User'
     },
    reviewStore : {
       type : Schema.ObjectId,
       ref : 'Store'
     },

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
});
ReviewSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

ReviewSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('Review', ReviewSchema);
