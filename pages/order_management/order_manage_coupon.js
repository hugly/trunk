/**
 * Created by Aaron on 14-7-16.
 */
$(document).ready(function(){

    ORDER_MANAGE_COUPON.init();
});


ORDER_MANAGE_COUPON = {
    //���
    data: null,
    //�ؼ���
    rehref: "",
    //��ʼ��
    init: function () {
        var _this = this;
        //�¼���
        this.bindEvent();
        if (window.location.href.indexOf("=") != -1) {
            var href="";
            href=window.location.href.substring(window.location.href.indexOf("=") + 1);
            this.rehref = decodeURIComponent(href.substring(href.indexOf("=") + 1));
        }
        this.initValue();
        $.scrollLoadInterval({
            runIn: this,                               //�Ӹ��ص�ִ�ж���
            mainDiv: $(".list_coupon_info"),                        //@param:jqobj     �б���Ҫ�����obj
            buttonLength: 200,                         //@param:int       ����ײ����ٿ�ʼ�������,Ĭ��200
            getDataApiName: "getCouponList",          //@param:str       ���õ�api�ӿ���
            bindDataFn:this.bindData,                  //@param:function ��ݰ󶨺���
            scrollForKey: "CouponId",                 //@param:str       ����������Ҫ��key
            searchData: {
                searchKey: _this.rehref                          //@param:str        //��ѯ���������
            }
        });
    },
    //��ʼ���������ֵ
    initValue: function () {
        $(".input_list").attr({ "value": this.rehref });
    },
    //����ݰ󶨵�DOM��
    bindData:function(data) {
        var parentDOM = $(".list_coupon_info");//�б?��
        var sourcecloneItem = $("#div_clonedata");//��Ҫ�������б�Item
        for (var i = 0; i < data.length; i++) {
            this.createDetail(data[i], parentDOM, sourcecloneItem);
        }
    },
    //�����б����
    createDetail: function (data, oParent, oTem) {
        //��¡��ǰ���
        var oTar = oTem.clone(true);
        $(oTar).removeAttr("id");
        //�Ե�ǰ�ṹ���ݽ������
        this.fillData(oTar, data);
        //���뵽��Ӧλ��
        oTar.show().appendTo(oParent);
       
    },
    //������Item����������Ӧ��DOMԪ��
    fillData: function (obj, data) {
        for (var i = 0; i < $(obj).children().length; i++) {
            var childdom = $(obj).children(":eq(" + i + ")");
            this.formatGridCell(childdom, data);
        }
    },
    formatGridCell: function (obj, data) {
        var fieldtype = $(obj).attr("fieldtype");//�������������
        var fieldname = $(obj).attr("fieldname");//��ݶ�Ӧ���ֶ����
        var fieldformat = $(obj).attr("fieldformat");//��ݶ�Ӧ������ַ�
        var fielddisplayname = $(obj).attr("fielddisplayname");//��ʾ����ݶ�Ӧ���ֶ����
        var fieldvalue = "";
        if (fieldtype != undefined) {
            switch (fieldtype) {
                case "link":
                    fieldvalue = "<a target='_blank' href='" + top.AJAX.tgogoSiteUrl + fieldformat.replace("{" + fieldname + "}", data[fieldname]) + "'>" + data[fielddisplayname] + "</a>";
                    break;
                case "datetime":
                    fieldvalue = $.stamp2date(data[fieldname]);
                    break;
                case "bool":
                    fieldvalue = data[fieldname] == "0" ? "δʹ��" : "��ʹ��";
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
        //ɾ���¼���
         oDel.click(function () {
             _this.delaction(this);
         });
        //�����¼���
         oSearch.click(function () {
             _this.search();
         });
    },
    //ɾ���¼�
    delaction: function (obj) {
        //alert($(obj).parent().parent().find("input").val());
        top.AJAX.delCoupon({
            data: {
                couponId: $(obj).parent().parent().find("input").val()
            },
            callback: function () {      //@param:fn    ��ȡ��ݳɹ�ִ��
                if (confirm("ȷ��Ҫɾ�������")) {
                    $(obj).parent().parent().remove();
                }
            }
        });
    },
    //��ѯ�¼�
    search: function () {
        this.rehref = $(".input_list").attr("value");
        window.location.href = "order_manage_coupon.html?mainid=4&searchKey=" + encodeURIComponent(this.rehref);
    }
};

