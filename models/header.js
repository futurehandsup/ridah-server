var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var HeaderSchema = new Schema({
    headerTitle : {
      type: String,
      index : true,         // 보조 index
      required : 'headerTitle is required'   // 검증
    },
    headerText : {
      type : String,
      default : "",
      required : 'headerText is required'
    },
    headerWriter : {
       type : Schema.ObjectId,
       ref : 'User'
     },
    headerStore : {
       type : Schema.ObjectId,
       ref : 'Store'
     },
     headerType : {
       type : String,
       default : 'header',
       enum : ['header', 'reply']
     },
     replies : [
       {
         type: Schema.ObjectId,
         ref: 'Header'
       }
     ],
     parent : {
       type : Schema.ObjectId,
       ref: 'Header'
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
HeaderSchema.post('save', function(result){
  if(result.headerType =="reply"){
    mongoose.model('Header').findById(result.parent, function(err, header){
      //console.log(result.id);
      header.replies.push(result.id);
      header.save();
    });
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
