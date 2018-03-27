var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var HeaderSchema = new Schema({
    headerTitle : {
      type: String,
      index : true,         // 보조 index
      required : 'headerImg is required'   // 검증
    },
    headerUrl : {
      type : String,
      default : "",
      required : 'headerText is required'
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
HeaderSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

HeaderSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('Header', HeaderSchema);
