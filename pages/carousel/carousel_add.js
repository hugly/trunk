/**
 * Created by Jerry Shaw on 14-7-28.
 */
/// <reference path="../../js/jquery-1.6.2.min.js" />
/// <reference path="../../js/jq.extend.js" />
/// <reference path="../../js/jquery.deserialize.js" />
$(document).ready(function () {
    CAROUSEL.init();
});
var CAROUSEL = {
    //存储图片的数组
    imageArr: [],
    imageId: 0,
    oldImage:"",
    //轮换id
    id: 0,
    // 父窗口的 Id
    mainid: 0,
    //修改还是添加数据   默认是添加轮换数据
    operType: "add",
    init: function () {
        var that = this;
        that.id = $.getNumber(decodeURIComponent($.getUrlParam("id")));
        that.mainid = $.getNumber($.getUrlParam("mainid"));
        that.operType = that.id > 0 ? "mdf" : "add";
        that.bindEvent();
        that.bindData();
    },
    bindData: function () {
        var that = this;
        if (that.operType.toLowerCase() == "mdf") {
            that.getCarouselType(function () {
                that.getCarouselData(function () {
                    that.uploadImg();
                    $.formLoad();
                });
            });
        }
        else {
            that.getCarouselType(function () {
                that.uploadImg();
                $.formLoad();
            });
        }
    },
    getCarouselData: function (callback) {
        var that = this, $from = $("input,select,textarea", ".form");
        top.AJAX.ajax({
            src: "CarouselMgt/GetModel",
            type: "get",
            data: { CarouselId: that.id },
            callback: function (data) {
                $from.json2form(data);
                if (data != null && data.upload != null) {
                    that.oldImage = data.upload.UploadPath;
                    that.imageId = data.upload.UploadID;
                    if (data.upload.UploadPath != null && $.trim(data.upload.UploadPath).length > 0) that.imageArr.push(data.upload.UploadPath);
                }
                if ($.type(callback) != "undefined" && $.isFunction(callback)) callback();
            }
        });
    },
    getCarouselType: function (callback) {
        var $ddl = $("[name='CarouselType']");
        top.AJAX.ajax({
            src: "CarouselMgt/GetCorpCarouselType",
            type: "get",
            callback: function (data) {
                var html = "";
                if (data != null && data.length > 0) {
                    $(data).each(function (index, item) {
                        html += "<option value=\"" + item.SwitchPositionId + "\">" + item.SwitchPostitionName + "</option>";
                    });
                    $ddl.append(html);
                }
                if ($.type(callback) != "undefined" && $.isFunction(callback)) callback();
            }
        });
    },
    //生成上传图片控件
    uploadImg: function () {
        var that = this;
        window.abc = new $.uploadFile({
            id: "carouselIcon_file",                  //input[type='file']的 id   @param:str
            formId: "carouselIcon_form",              //表单id                     @param:str
            types: "jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber: 1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc: top.AJAX.fileUploadUrl,
            showImageWrapId: "carouselIcon_list",      //图片上传完后显示区域id        @param:str
            imgs: that.imageArr                     //已存在的图片                 @param:array
        });
    },
    //将传入的图片转化成对象
    getImageData: function () {
        var that = this;
        var oParent = $("#carouselIcon_list"), data = {};
        oParent.find("img").each(function () {
            data.UploadID = that.imageId;
            data.UploadPath = $(this).attr("src");
            data.UploadOldPath = that.oldImage;
            data.UploadPageUrl = document.URL;
        });
        return data;
    },
    bindEvent: function () {
        var that = this;
        $(".btn-submit").click(function (e) {
            e.preventDefault();
            var data = $("input,select,textarea", ".form").not(":file").serializeObject();
            data = $.convertStamp(data, "CarouselStartTime,CarouselEndTime");
            data = $.convertNumber(data, "CarouselType,CarouselOrder");
            data.upload = that.getImageData();
            data.CarouselID = that.id;
            top.AJAX.ajax({
                src: that.id > 0 ? "CarouselMgt/UpdateCarouselMgt" : "CarouselMgt/AddCarouselMgt",
                type: "post",
                data: data,
                callback: function (rs) {
                    alert((that.id > 0 ? "编辑" : "添加") + "轮换信息成功！");
                    that.closeWindow();
                }
            });
        });
    },
    closeWindow: function () {
        top.O2O.refreshWindow(this.mainid);
        top.O2O.closeWindow(window.name.substr(5));
    }
};