
$(document).ready(function () {
    CorpInfoModify.init();
});
var CorpInfoModify = {
    //存储图片的数组
    imageArr: [],
    imageId: 0,
    oldImage: "",
    init: function () {
        var that = this;
        that.bindEvent();
        that.bindData();
    },
    bindData: function () {
        var that = this;
        that.getData(function () {
            that.uploadImg();
        });
    },
    getData: function (callback) {
        var that = this;
        top.AJAX.ajax({
            src: "CompanyExtendIndo/GetCompanyExtendInfo",
            type: "get",
            callback: function(data) {
                $("input,select").each(function() {
                    var itemName = $(this).attr("name");
                    $(this).val(data[itemName]);
                });
                if (data.CorpLogoId != null) {
                    that.imageId = data.CorpLogoId;
                }
                if (data.CorpLogUrl != null && data.CorpLogUrl != "") {
                    that.imageArr.push(data.CorpLogUrl);
                    that.oldImage = data.CorpLogUrl;
                }
                if ($.type(callback) != "undefined" && $.isFunction(callback)) callback();
            }
        });
    },
    //将传入的图片转化成对象
    getImageData: function () {
        var that = this;
        var oParent = $("#div__CorpLogoIdList"), data = {};
        oParent.find("img").each(function() {
            data.UploadPath = $(this).attr("src");
            data.UploadOldPath = that.oldImage;
            data.UploadID = data.UploadPath == data.UploadOldPath ? that.imageId : 0;
            data.UploadPageUrl = document.URL;
        });
        return data;
    },
    //生成上传图片控件
    uploadImg: function () {
        var that = this;
        window.abc = new $.uploadFile({
            id: "txtfile_CorpLogoId",                  //input[type='file']的 id   @param:str
            formId: "form_CorpLogoId",              //表单id                     @param:str
            types: "jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber: 1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc: top.AJAX.fileUploadUrl,
            showImageWrapId: "div__CorpLogoIdList",      //图片上传完后显示区域id        @param:str
            imgs: that.imageArr                     //已存在的图片                 @param:array
        });
    },
    bindEvent: function () {
        var that = this;
        $(".btn-submit").click(function (e) {
            e.preventDefault();
            var data = $("input,select,textarea").not(":file").serializeObject();
            data.UploadModel = that.getImageData();
            top.AJAX.ajax({
                src: "CompanyExtendIndo/CreateCompanyExtendInfo",
                type: "post",
                data: data,
                callback: function () {
                    alert("保存店铺信息成功！");
                }
            });
        });
    }
};