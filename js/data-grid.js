/// <reference path="jquery-1.6.2.min.js" />
$(document).ready(function () {
    $(".data-grid").each(function () {
        GRID.init($(this));
    });
});
var GRID = {
    grid: null,
    //关键字
    rehref: "",
    dataRow: null,
    mainid:0,
    searchKey:"searchKey",
    init: function ($this) {
        var _this = this;
        this.grid = $this;
        var data_row = $(".data-row", this.grid);
        //事件绑定
        this.bingEvent(data_row);
        this.dataRow = data_row.clone(true);
        data_row.remove();
        _this.searchKey = encodeURIComponent($(".search-box").attr("name"));
        if (window.location.href.indexOf(_this.searchKey) > -1) {
            this.rehref = decodeURIComponent($.getUrlParam(_this.searchKey));
        }
        _this.mainid = parseInt($.getUrlParam("mainid"));
        $.extend(top.AJAX, {
            getListData: function (opt) {
                var url = $this.attr("data-ajax-url"),
                success = $.getFunction(opt.success),
                error = $.getFunction(opt.error),
                postData = opt.data,
                add_key = opt.scrollKey,
                add_val = opt.scrollId;
                postData[add_key] = add_val;
                postData.pageSize = this.pageSize;
                this.ajaxForScrollLoad({
                    src: url,
                    success: success,
                    error: error,
                    type: $this.attr("data-method"),
                    data: postData
                });
            }
        });
        this.initValue();
        //事件绑定
        //this.bingEvent();
        //数据加载
        $.scrollLoadInterval({
            runIn: this,
            mainDiv: this.grid.find(".data-header"),                        //@param:jqobj     列表需要插入的obj
            buttonLength: 200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName: "getListData",         //@param:str       调用的api接口名
            bindDataFn: this.bingData,                  //@param:function 数据绑定函数
            scrollForKey: this.grid.attr("data-key"),                 //@param:str       滚动加载需要的key
            searchData: {
                queryKey: _this.rehref                          //@param:str        //查询输入的文字
            }
        });
    },
    //初始化搜索框的值
    initValue: function () {
        $(".search-box").val(this.rehref);
    },
    bingData: function (data) {
        var $that = this, oParent = $(".data-table", this.grid), oTem = this.dataRow;
        if ((data == null || data.length == 0) && $(".data-row", oParent).length == 0) {
            oParent.append("<div class=\"data-empty-row\"><sapn>暂无相关数据！</sapn></div>");
        }
        else {
            $.each(data, function (index, item) {
                $that.createDetail(item, oParent, oTem);
            });
        }
    },
    //创建文档结构
    createDetail: function (data, oParent, oTem) {
        //克隆当前数据
        var oTar = oTem.clone(true);
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar, data);
        //插入到相应位置
        oTar.appendTo(oParent);
    },
    getFiledValue: function (data, field) {
        var value = data;
        $.each(field.split("."), function (index, item) {
            value = value[item];
        });
        return value;
    },
    //数据内容填充
    fillData: function ($this, data) {
        var $that = this;
        $this.data("value", data);
        $this.children().each(function () {
            var me = $(this), field = me.attr("data-field"), type = me.attr("data-type");
            if (typeof (field) == "undefined" || field == null || $.trim(field).length == 0) {
                me.html($that.formatModel(me.html(), data));
            } else {
                if (typeof (type) == "undefined" || type == null || $.trim(type).length == 0) type = "text";
                var value = $that.getFiledValue(data, field), html;
                switch (type.toLowerCase()) {
                    case "checkbox":
                        html = "<input type=\"checkbox\" title=\"" + value + "\" value=\"" + value + "\">";
                        break;
                    case "link":
                        html = "<a href=\"" + $that.formatModel(me.attr("data-url"), data) + "\" title=\"" + value + "\">" + value + "</a>";
                        break;
                    case "image":
                        html = "<div class=\"img\"><span></span><img src=\"" + value + "\" /></div>";
                        break;
                    case "boolean":
                        html = "<span>" + (value ? "是" : "否") + "</span>";
                        break;
                    case "date":
                        value = new Date(data[field]).format(me.attr("data-format") || "yyyy-MM-dd hh:mm:ss");
                        html = "<span title=\"" + value + "\">" + value + "</span>";
                        break;
                    default:
                        html = "<span title=\"" + value + "\">" + value + "</span>";
                        break;
                }
                me.html(html);
            }
            me.removeAttr("data-field").removeAttr("data-type").removeAttr("data-url").removeAttr("data-format");
        });
    },
    bingEvent: function ($this) {
        var that = this;
        $(".btn-search").click(function (e) {
            that.search(e);
        });
        $("[ajax-window='true']", that.grid).live("click", function (e) {
            that.window($(this), e);
        });
        $this.find("[ajax-delete='true']").live("click", function (e) {
            var $that = $(this);
            e.preventDefault();
            if (confirm("确定要删除数据吗？")) {
                top.AJAX.ajax({
                    src: $that.attr("data-url"),
                    type: $that.attr("ajax-method"),
                    callback: function () {
                        var $table = $that.closest(".data-table");
                        $that.closest(".data-row").remove();
                        if ($(".data-row", $table).length == 0) {
                            $table.append("<div class=\"data-empty-row\"><sapn>暂无相关数据！</sapn></div>");
                        }
                    }
                });
            }
        });
    },
    window:function($this,e){
        e.preventDefault();
        var _url = $this.attr("data-url"), _this = this;
        _url += (_url.indexOf("?") > -1 ? "&" : "?");
        _url += "mainid=" + _this.mainid;
        top.O2O.openNewWindow({
            title: $this.attr("title"),        //@param,  str
            url: _url,          //@param,  str
            width: $this.attr("data-width"),        //@param,  int
            height: $this.attr("data-height")        //@param,  int
        });
    },
    formatModel: function (str, model) {
        for (var k in model) {
            var re = new RegExp("{" + k + "}", "g");
            str = str.replace(re, model[k]);
        }
        return str;
    },
    //查询事件
    search: function (e) {
        e.preventDefault();
        this.rehref = $(".search-box").val();
        window.location = document.URL.split("?")[0] + "?" + this.searchKey + "=" + encodeURIComponent(this.rehref) + "&mainid=" + this.mainid;
    }
};