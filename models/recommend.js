var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var RecommendSchema = new Schema({
    recommendID : {
      type : Schema.ObjectId,
      ref : 'Store',
      index:true,
      required : 'RecommendID is required'   // 검증
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
RecommendSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

RecommendSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('Recommend', RecommendSchema);
