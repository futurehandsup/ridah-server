var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var HeaderSchema = new Schema({
    headerImg : {
      type: String,
      index : true,         // 보조 index
      required : 'headerImg is required'   // 검증
    },
    headerUrl : {
      type : String ,
      default: "",
      /*
       기존에 website 속성이 없는 데이터들:
       get 방식으로 website 속성을 기존 데이터를 질의하는 시점에 강제적으로 website 필드를 붙여서 결과가 나오도록
       website 가 존재하는 데이터는 website 를 포함해서 나오고, 아니라면 website 필드가 나오지 않는대
      */
      get : function(url) {
        if(!url) {
          return url;
        } else {
          if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
            url = 'http://' + url;
          }
          return url;
        }
      }
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
