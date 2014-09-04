/**
 * Created by Aaron on 14-7-16.
 */
$(document).ready(function () {

    ORDER_MANAGE_DISCOUNT.init();
});


ORDER_MANAGE_DISCOUNT = {
    //数据
    data: null,
    //关键字
    rehref: "",
    //初始化
    init: function () {
        var _this = this;
        //事件绑定
        this.bindEvent();
        if (window.location.href.indexOf("=") != -1) {
            this.rehref = decodeURIComponent(window.location.href.substring(window.location.href.indexOf("=") + 1));
        }
        this.initValue();
        $.scrollLoadInterval({
            runIn: this,                               //加个回调执行对象
            mainDiv: $(".list_discount_info"),                        //@param:jqobj     列表需要插入的obj
            buttonLength: 200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName: "getDiscountCodeList",          //@param:str       调用的api接口名
            bindDataFn: this.bindData,                  //@param:function 数据绑定函数
            scrollForKey: "DiscountId",                 //@param:str       滚动加载需要的key
            searchData: {
                searchKey: _this.rehref                          //@param:str        //查询输入的文字
            }
        });
    },
    //初始化搜索框的值
    initValue: function () {
        $(".input_list").attr({ "value": this.rehref });
    },
    //将数据绑定到DOM上
    bindData: function (data) {
        var parentDOM = $(".list_discount_info");//列表父级
        var sourcecloneItem = $("#div_clonedata");//需要拷贝的列表Item
        for (var i = 0; i < data.length; i++) {
            this.createDetail(data[i], parentDOM, sourcecloneItem);
        }
    },
    //创建列表数据
    createDetail: function (data, oParent, oTem) {
        //克隆当前数据
        var oTar = oTem.clone(true);
        $(oTar).removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar, data);
        //插入到相应位置
        oTar.show().appendTo(oParent);
    },
    //将单条Item数据填充至对应的DOM元素
    fillData: function (obj, data) {
        for (var i = 0; i < $(obj).children().length; i++) {
            var childdom = $(obj).children(":eq(" + i + ")");
            this.formatGridCell(childdom, data);
        }
    },
    formatGridCell: function (obj, data) {
        var fieldtype = $(obj).attr("fieldtype");//数据声明的类型
        var fieldname = $(obj).attr("fieldname");//数据对应的字段名称
        var fieldformat = $(obj).attr("fieldformat");//数据对应的输出字符串
        var fielddisplayname = $(obj).attr("fielddisplayname");//显示的数据对应的字段名称
        var fieldvalue = "";
        if (fieldtype != undefined) {
            switch (fieldtype) {
                case "link":
                    fieldvalue = "<a target='_blank'  href='" + fieldformat.replace("{" + fieldname + "}", data[fieldname]) + "'>" + data[fielddisplayname] + "</a>";
                    break;
                case "datetime":
                    fieldvalue = $.stamp2date(data[fieldname]);
                    break;
                case "bool":
                    fieldvalue = data[fieldname] == "0" ? "未使用" : "已使用";
                    break;
                default:
            }
        } else {
            fieldvalue = data[fieldname];
        }
        if ($(obj).is("input")) {
            $(obj).val(fieldvalue);
        } else {
            $(obj).html(fieldvalue);
        }
    },
    bindEvent: function () {
        var _this = this;
        var oDel = $(".list_detail_del");
        var oSearch = $(".input_search");
        //删除事件绑定
        oDel.click(function () {
            _this.delaction(this);
        });
        //搜索事件绑定
        oSearch.click(function () {
            _this.search();
        });
    },
    //删除事件
    delaction: function (obj) {
        //alert($(obj).parent().parent().find("input").val());
        top.AJAX.delDiscountCode({
            data: {
                discountId: $(obj).parent().parent().find("input").val()
            },
            callback: function () {      //@param:fn    获取数据成功执行
                if (confirm("确定要删除数据吗？")) {
                    $(obj).parent().parent().remove();
                }
            }
        });
    },
    //查询事件
    search: function () {
        this.rehref = $(".input_list").attr("value");
        window.location.href = "order_manage_discount.html?searchKey=" + encodeURIComponent(this.rehref);
    }
};

