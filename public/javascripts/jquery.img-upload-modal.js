/**
 * --------------------------------------------
 * 연결된 스크립트나 다른 플러그인에서 스코프가
 * 제대로 닫혀져 있지 않을 경우를 대비하여 세미콜론을
 * 함수 호출 전에 작성하면 보다 안전해집니다.
 * -------------------------------------------- */
;
(function($, window, document, undefined) {
  /**
   * --------------------------------------------------------------
   * @param undefined
   * 글로벌 전역 변수인 undefined 사용합니다.
   * 단, ES3 에서는 다른 누군가에 의해서 전역 변수인 undefined 를
   * 변경할 수 있기 때문에 실제 undefined 인지 확신할 수 없습니다.
   * ES5 에서 undefined 는 더이상 값을 변경할 수 없습니다.
   * -------------------------------------------------------------- */
  /**
   * ----------------------------------------------------------------------
   * @param window, document
   * window, document 는 전역 스코프가 아니라 지역스코프에서 사용하도록 설정
   * 이는 프로세스를 조금 더 빠르게 해결하고 능률적으로 minified 할 수 있다.
   * (특히, 해당 플러그인이 자주 참조될 경우에)
   * ---------------------------------------------------------------------- */
  //* ------------------------------
  var modalElement = '<div id="imgModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
  modalElement +=     '<div class="modal-dialog">'
  modalElement +=     '      <div class="modal-content">'
  modalElement +=     '        <div class="modal-header">'
  modalElement +=     '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
  modalElement +=     '          <h4 class="modal-title">이미지 업로드</h4>'
  modalElement +=     '        </div>'
  modalElement +=     '        <div class="modal-body">'
  modalElement +=     '          <form>'
  modalElement +=     '            <div class="form-group">'
  modalElement +=     '              <p>기존 이미지</p>'
  modalElement +=     '              <img id="beforeImg" src="" style="width: 100px; height:auto;">'
  modalElement +=     '              <input id="beforeImgControl" name="fileUrl" value="" type="hidden">'
  modalElement +=     '            </div>'
  modalElement +=     '            <div class="form-group">'
  modalElement +=     '              <label>기존 이미지를 서버에서 삭제할까요?</label>'
  modalElement +=     '              <p><small>'
  modalElement +=     '                삭제 선택 시 <span class="text-danger">영구 삭제</span>되며 되돌릴 수 없습니다. 다른 페이지에서도 동일한 이미지를 사용하고 있다면, <b>삭제안함</b>을 선택하시기 바랍니다.<br>'
  modalElement +=     '                삭제 성공 시 자동으로 저장됩니다.'
  modalElement +=     '              </small></p>'
  modalElement +=     '            </div>'
  modalElement +=     '            <button type="button" class="btn btn-danger text-center btn-action btn-imgdelete">삭제</button>'
  modalElement +=     '            <button type="button" class="btn btn-default text-center btn-next">삭제안함</button>'
  modalElement +=     '          </form>'
  modalElement +=     '        </div>'
  modalElement +=     '        <div class="modal-body hidden">'
  modalElement +=     '          <form>'
  modalElement +=     '            <div class="form-group">'
  modalElement +=     '              <p>이미지 업로드 (한글이 포함되지 않게 파일명에 유의해주세요!)</p>'
  modalElement +=     '              <input type="file" name="images">'
  modalElement +=     '            </div>'
  // modalElement +=     '            <div class="form-group">'
  // modalElement +=     '              <label>s3 폴더명 지정</label>'
  // modalElement +=     '              <input id="form-img-folder" name="folder" class="form-control border-input">'
  // modalElement +=     '              <p class="">'
  // modalElement +=     '                <small><b>폴더명 예시)</b><br> 단일 폴더: <b>place</b> 와 같이, 슬래시 없이 폴더명만 입력</small><br>'
  // modalElement +=     '                <small>하위폴더가 있을 때: <b>place/seoulcity/0003</b> 과 같이, 하위폴더는 슬래시로 끊어서 입력해주시면 됩니다.</small></p>'
  // modalElement +=     '            </div>'
  modalElement +=     '            <button class="btn btn-primary text-center btn-action btn-imgupload" type="button">이미지 업로드</button>'
  modalElement +=     '            <button class="btn btn-default btn-action btn-dismissmodal" type="button">취소</button>'
  modalElement +=     '          </form>'
  modalElement +=     '          <p id="img-on-success"></p>'
  modalElement +=     '        </div>'
  modalElement +=     '      </div><!-- /.modal-content -->'
  modalElement +=     '    </div><!-- /.modal-dialog -->'
  modalElement +=     '  </div><!-- /.modal -->';

  //* defaults 는 한번만 생성합니다.
  var onUploadImage = function(_this, callback){
    var form = $(_this).closest('form')[0];
    var images = new FormData(form);

    $(form).find('input').attr('readonly', true);
    $(form).find('.btn').attr('disabled', true)
    //console.log(place);
    $.ajax({
      type:"POST",
      url:'/apis/mobile/etc/uploadImage',
      data:images,
      processData: false,
      contentType: false,
      dataType: 'json',
      success:function(args){
        alert("업로드 성공!");
      //  location.reload();
      $(form).find('input').attr('readonly', false);
      $(form).find('.btn').attr('disabled', false)
        callback(args.file)
      },
      error:function(e){
        alert(e.responseText);
        $(form).find('input').attr('readonly', false);
        $(form).find('.btn').attr('disabled', false)
      }
    });
  }
  var onDeleteImage = function(_this, callback){
    var images = $(_this).closest('form').serializeObject();
    //console.log(place);
    $.ajax({
      type:"POST",
      url:'/apis/mobile/etc/deleteImage',
      data:images,
      dataType: 'json',
      success:function(args){
      //  alert("성공했습니다.");
      //  location.reload();
        callback()
      },
      error:function(e){
        alert(e.responseText);
      }
    });
  }
  var onSuccessUploadImage = function(filename){
    console.log("onSuccessUploadImage:: ",this.element)
    $(this.element).val(filename).removeClass('unchanged');
    this.dismissModal();

  }
  var onSuccessDeleteImage = function(){
    console.log("onSuccessUploadImage:: ",this.element)
    $(this.element).val("").removeClass('unchanged');
    this.changeStep();
    $(this.element).closest('form').find('.btn-ok').click();
    $(this.element).closest('form').find('.btn-modify').click();
  }
  var pluginName = 'imgUploadModal',
    defaults = {
      modalId: '#imgModal',
      step: 1,
      onUploadImage: onUploadImage,
      onDeleteImage: onDeleteImage,
      onSuccessDeleteImage: onSuccessDeleteImage,
      onSuccessUploadImage: onSuccessUploadImage,
      folderName: "",
    };
  var isInit = false;
  // * ------------------------------
  // * 실제 플러그인 생성자
  function Plugin(element, options) {
    this.element = element;
    /**
     * ----------------------------------------------------------------
     * 제이쿼리는 두개 또는 그 이상의 객체들을 첫번째 객체에
     * 저장하여 병합,확장할 수 있는 $.extend 유틸리티를 소유하고 있습니다.
     * 일반적으로 첫번째 객체에 {}, 빈 객체를 설정하여
     * 플러그인 인스턴스에 대한 default option(기본옵션)을
     * 변경시키지 않도록 하기 위함입니다.
     * ----------------------------------------------------------------
    */
    this.options = $.extend({}, defaults, options);
    var folderName = $(element).data("foldername");
    if(folderName != null && folderName != ""){
      this.options.folderName = folderName;
    }
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  Plugin.prototype.init = function() { // 이곳에 초기화 로직을 작성합니다.
    /**
     * ------------------------------------------------------------------
     * 이곳에 초기화 로직을 작성합니다.
     * 여러분은 이미 인스턴스를 통해 DOM 요소, options 을 사용할 수 있습니다.
     * (예. this.element, this.options)
     * ------------------------------------------------------------------ */
     if(!isInit){
       $(document).find('body').append(modalElement);//모달삽입
       isInit=true;
     }

     this.options.imgurl =  $(this.element).val()
     $(this.element).on('click', this.openModal.bind(this))

     $(this.options.modalId).find('.btn-next').on('click', this.changeStep.bind(this))

     $(this.options.modalId).find('.btn-dismissmodal').on('click', function(){
       this.dismissModal()
       console.log("dismissmodal::" , this.element)
     }.bind(this))

  };

  Plugin.prototype.openModal = function(){
    console.log("openModal::" , this.element)
    this.changeStep(2)
    if(this.options.imgurl==""){
      this.changeStep(2)
    }else{
      $(this.options.modalId).find('#beforeImg').attr("src", this.options.imgurl)
      $(this.options.modalId).find('#beforeImgControl').val(this.options.imgurl)
    }
    $(this.options.modalId).find('#form-img-folder').val(this.options.folderName);
    var onUploadImage = this.options.onUploadImage;
    var onSuccessUploadImage = this.options.onSuccessUploadImage.bind(this);
    $(this.options.modalId).find('.btn-imgupload').on('click', function(){
      console.log("imgupload::",  this.element)
      return onUploadImage(this, onSuccessUploadImage)
    })

    var onDeleteImage = this.options.onDeleteImage;
    var onSuccessDeleteImage = this.options.onSuccessDeleteImage.bind(this);
    $(this.options.modalId).find('.btn-imgdelete').on('click', function(){
      console.log("imgdelete::" , this.element)
      return onDeleteImage(this, onSuccessDeleteImage)
    })

    $(this.options.modalId).modal()
  }
  Plugin.prototype.dismissModal = function(){
    $(this.options.modalId).find('input').val("");
     this.options.imgurl = $(this.element).val()
     this.options.step = 2;
     this.changeStep(2);
     $(this.options.modalId).find('.btn-imgupload').off();
     $(this.options.modalId).find('.btn-imgdelete').off()

    $(this.options.modalId).modal('hide')
  }
  Plugin.prototype.changeStep = function(step){
    if(step == null || typeof step != 'number') step = this.options.step + 1;
    this.options.step = step;
    this.setPage()
  }
  Plugin.prototype.setPage = function(){
    $(this.options.modalId).find('.modal-body').addClass('hidden').eq(this.options.step-1).removeClass('hidden')
  }
  /**
   * --------------------------------------------------------------------------
   * 생성자(예. new Plugin()) 주변에 여러개의 인스턴스 생성을 방지하기 위해
   * 가벼운 플러그인 래퍼를 설정합니다.
   * data 메소드를 이용하여 cache 해 두게 됩니다.
   * (한번 생성된 인스턴스는 더이상 같은 인스턴스를 생성하지 않도록 하기 위함입니다.)
   * -------------------------------------------------------------------------- */
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  }


})(jQuery, window, document);
