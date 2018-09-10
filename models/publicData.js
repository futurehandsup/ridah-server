var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

var PublicDataSchema = new Schema({
    BSSH_NM: {
      //"사업장명"
      type: String
    },
    BSSH_ADDR1: {
      //"사업장주소"
      type: String
    },
    BSSH_ADDR2: {
      //"사업장상세주소"
      type: String
    },
    BUS_YN: {
      //"셔틀버스보유여부"
      type: Boolean,
    },
    CHAP_YN: {
      //"챕보유여부"
      type: Boolean,
    },
    CLASSROOM_YN: {
      //"강의실보유여부"
      type: Boolean,
    },
    EASEHA_CNT: {
      //"간이마장칸수"
      type: Number,
    },
    EASEHA_YN: {
      //"간이마사보유여부"
      type: Boolean,
    },
    FITTINGROOM_YN: {
      //"탈의실락카보유여부"
      type: Boolean,
    },
    HA_CNT: {
      //"마사칸수"
      type: Number,
    },
    HA_YN: {
      //"마사보유여부"
      type: Boolean,
    },
    HELMET_CNT: {
      //"헬멧보유수"
      type: Number,
    },
    HELMET_YN: {
      //"헬멧보유여부"
      type: Boolean,
    },
    HOMEPAGE: {
      //"홈페이지"
      type: String,
    },
    PARK_POS_CNT: {
      //"주차가능대수"
      type: Number,
    },
    PCROOM_YN: {
      //"PC공간보유여부"
      type: Boolean,
    },
    PSTRG: {
      //"원형마장보유여부"
      type: Boolean,
    },
    PSTRG_CIRCLE_DIAMETER: {
      //"원형마장지름"
      type: Number,
    },
    PSTRG_CIRCLE_TYPE: {
      //"원형마장종류"
      type: String,
    },
    PSTRG_IN_CNT: {
      //"실내마장보유수"
      type: Boolean,
    },
    PSTRG_IN_HEIGHT: {
      //"실내마장사이즈세로"
      type: Number,
    },
    PSTRG_IN_WIDTH: {
      //"실내마장사이즈가로"
      type: Number,
    },
    PSTRG_IN_YN: {
      //"실내마장보유여부"
      type: Boolean,
    },
    PSTRG_OUT_CNT: {
      //"실외마장보유수"
      type: Boolean,
    },
    PSTRG_OUT_HEIGHT: {
      //"실외마장사이즈세로"
      type: Number,
    },
    PSTRG_OUT_WIDTH: {
      //"실외마장사이즈가로"
      type: Number,
    },
    PSTRG_OUT_YN: {
      //"실외마장보유여부"
      type: Boolean,
    },
    RESTROOM_YN: {
      //"휴게실보유여부"
      type: Boolean,
    },
    SAFETYVEST_CNT: {
      //"안전조끼보유수"
      type: Number,
    },
    SAFETYVEST_YN: {
      //"안전조끼보유여부"
      type: Boolean,
    },
    SHOWERROOM_YN: {
      //"샤워실보유여부"
      type: Boolean,
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
PublicDataSchema.post('save', function(result){
  let storeObj = {
    storename : result.BSSH_NM,
    address : result.BSSH_ADDR1+" "+result.BSSH_ADDR2,
    website : result.HOMEPAGE,
    publicData: result._id,
  }
  let Store = mongoose.model('Store');
  Store.findOne({storename : result.BSSH_NM })
  .exec(function (err, store) {
    if(err || store == null){
      Store.create(storeObj, function(err, s){
        if(err) console.log("err: "+err);
        //console.log("store: "+s)
      })
    }
    else {
      store.publicData = storeObj.publicData;
      store.address = storeObj.address;
      store.website = storeObj.website;
      store.save();
    }
  })
});
PublicDataSchema.post('update', function(result) {
  this.update({_id  : result.id },{ $set: { updated_at: new Date() } });
});

PublicDataSchema.set('toJSON',{ getters : true , virtuals : true});
/*res.json() 을 사용하여 다큐먼트 데이터를 출력 할 때 get 옵션으로 정의한 값이 JSON에 포함되게 할 것이다.
위 코드를 적지 않으면 JSON으로 데이터를 표현할 때 get 옵션을 무시하게 될 것 이다.
출처: http://alexband.tistory.com/23 [Front-end Rider] */
mongoose.model('PublicData', PublicDataSchema);
