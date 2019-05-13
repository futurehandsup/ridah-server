var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var QnaSchema = new Schema({
    qnaTitle : {
      type: String,
      index : true,         // 보조 index
    //  required : 'qnaTitle is required'   // 검증
    },
    qnaText : {
      type : String,
      default : "",
      required : 'qnaText is required'
    },
    qnaWriter : {
       type : Schema.ObjectId,
       ref : 'User'
    },
    // 고객센터에 문의하는걸로 변경
    // qnaStore : {
    //    type : Schema.ObjectId,
    //    ref : 'Store'
    //  },
     qnaType : {
       type : String,
       default : 'qna',
       enum : ['qna', 'reply']
     },
     replies : [
       {
         type: Schema.ObjectId,
         ref: 'Qna'
       }
     ],
     parent : {
       type : Schema.ObjectId,
       ref: 'Qna'
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
QnaSchema.post('save', function(result){
  if(result.qnaType =="reply"){
    mongoose.model('Qna').findById(result.parent, function(err, qna){
      //console.log(result.id);
      qna.replies.push(result.id);
      qna.save();
    });
  }
});
QnaSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

QnaSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('Qna', QnaSchema);
