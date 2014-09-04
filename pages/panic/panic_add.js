/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-7-14
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="../../js/jquery-1.6.2.min.js" />
$(document).ready(function () {
    PANIC_ADD.init();
});
PANIC_ADD = {
    id: 0,
    mainid: 0,
    type: "add",
    categoryId: 0,
    productId: 0,
    productName: "",
    subPointRule: "",
    addPointRule: "",
    guidEmpty: "00000000-0000-0000-0000-000000000000",
    init: function () {
        var _this = this;
        _this.id = $.getNumber(decodeURIComponent($.getUrlParam("id")));
        _this.mainid = $.getNumber($.getUrlParam("mainid"));
        _this.type = _this.id > 0 ? "mdf" : "add";
        _this.bindCountDown();
        //this.bindProduct();
        _this.bindEvent();
    },
    bindCountDown: function () {
        var that = this;
        $("[name='CountDownAddress']").val("限四川、重庆地区用户抢购、限时免费包邮！");
        $("[name='StartDate']").attr("readonly", "true");
        $("[name='EndDate']").attr("readonly", "true");
        $("[name='SetCouponOutDate']").attr("readonly", "true");
        if (that.type.toLowerCase() == "mdf") {
            top.AJAX.ajax({
                src: "CountDown/GetModel",
                type: "get",
                data: { CountDownId: that.id },
                callback: function (data) {
                    that.productId = data.ProductId;
                    that.productName = data.ProductName;
                    var start = new Date(data.StartDate), end = new Date(data.EndDate);
                    $("[name='StartDate']").val(start.format("yyyy-MM-dd"));
                    $("[name='StartHour']").val(start.getHours());
                    $("[name='StartMinute']").val(start.getMinutes());
                    $("[name='EndDate']").val(end.format("yyyy-MM-dd"));
                    $("[name='EndHour']").val(end.getHours());
                    $("[name='EndMinute']").val(end.getMinutes());
                    var IsDiscountCode = data.DiscountCode != null;
                    $("[name='IsDiscount'][value='" + (IsDiscountCode.toString().toLowerCase()) + "']").attr("checked", "checked");
                    $("[name='IsDiscount']:checked").change();
                    $(".panic_discount").hide();
                    if (IsDiscountCode) {
                        $(".panic_discount").show();
                        $("[name='DiscountType'][value='" + data.DiscountCode.DiscountType + "']").attr("checked", "checked");
                        $("[name='DiscountType']:checked").change();
                        $("[name='DiscountNumber']").val(data.DiscountCode.DiscountType == 0 ? (data.DiscountCode.DiscountNumber * 100) : data.DiscountCode.DiscountNumber);
                        $("[name='DiscountNum']").val(data.DiscountCode.DiscountNum);
                        $("[name='CouponOutType'][value='" + data.DiscountCode.CouponOutType + "']").attr("checked", "checked");
                        $("[name='CouponOutType']:checked").change();
                        $("[name='SetCouponOutDate']").val(new Date(data.DiscountCode.SetCouponOutDate).format("yyyy-MM-dd"));
                        $("[name='SetCouponOutDays']").val(data.DiscountCode.SetCouponOutDays);
                        $("[name='DiscountUrl']").val(data.DiscountCode.DiscountUrl);
                    }
                    $("[name='CountDownPrice']").val(data.CountDownPrice);
                    if (data.WithShippingFee)
                        $("[name='WithShippingFee']").attr("checked", "checked");
                    else
                        $("[name='WithShippingFee']").removeAttr("checked");
                    $("[name='ActivityStock']").val(data.ActivityStock);
                    $("[name='ActivityStock']").attr("disabled", "disabled");
                    $("[name='Stock4Display']").val(data.Stock4Display);
                    $("[name='Stock4Display']").attr("disabled", "disabled");
                    $("[name='RecoveryTime']").val(data.RecoveryTime);
                    $("[name='CountDownAddress']").val(data.CountDownAddress);
                    $("[name='Content']").val(data.Content);
                    that.subPointRule = data.SubPointRule != null ? data.SubPointRule : that.guidEmpty;
                    that.addPointRule = data.AddPointRule != null ? data.AddPointRule : that.guidEmpty;
                    that.bindCategory();
                }
            });
        }
        else {
            that.bindCategory();
        }
    },
    bindCategory: function () {
        var that = this;
        var ddlCategory = $(".panic_check select[name='Category']"), html = "";
        ddlCategory.empty();
        top.AJAX.ajax({
            src: "Categories/GetList",
            type: "get",
            data: {},
            callback: function (data) {
                html += "<option value=\"0\">--请选择商品类型--</option>";
                if (data != null && data.length > 0) {
                    $(data).each(function (index, item) {
                        html += "<option value=\"" + item.CategoryId + "\"" + (that.categoryId == item.CategoryId ? " selected=\"selected\"" : "") + ">" + item.Name + "</option>";
                    });
                }
                ddlCategory.html(html);
                that.bindProduct();
            }
        });
    },
    bindProduct: function (options) {
        var defaults = { productId: 0, productName: "", categoryId: 0, pagesize: 0 }, options = $.extend(defaults, options), dllProducts = $(".panic_data select[name='ProductId']"), html = "", that = this;
        top.AJAX.ajax({
            src: "Product/GetList",
            type: "get",
            data: options,
            callback: function (data) {
                var isExists = false;
                if (data != null && data.length > 0) {
                    $(data).each(function (index, item) {
                        if (that.productId != 0 && that.productId == item.ProductId) isExists = true;
                        html += "<option value=\"" + item.ProductId + "\"" + (that.productId == item.ProductId ? " selected=\"selected\"" : "") + ">" + item.ProductName + "</option>";
                    });
                }
                if (that.productId > 0 && (!isExists)) html = "<option value=\"" + that.productId + "\" selected=\"selected\">" + that.productName + "</option>" + html;
                html = "<option value=\"0\">--请选择商品--</option>" + html;
                dllProducts.html(html);
                that.bindSubPointRule();
            }
        });
    },
    bindSubPointRule: function () {
        var that = this;
        var ddlSubPointRule = $(".panic_add select[name='SubPointRule']"), html = "";
        ddlSubPointRule.empty();
        top.AJAX.ajax({
            src: "CountDown/GetSubRule",
            type: "get",
            data: {},
            callback: function (data) {
                html += "<option value=\"" + that.guidEmpty + "\">--请选择--</option>";
                if (data != null && data.length > 0) {
                    $(data).each(function (index, item) {
                        html += "<option value=\"" + item.PrimaryKeyGuid + "\"" + (that.subPointRule == item.PrimaryKeyGuid ? " selected=\"selected\"" : "") + ">" + item.ChoiceName + "</option>";
                    });
                }
                ddlSubPointRule.html(html);
                that.bindAddPointRule();
            }
        });
    },
    bindAddPointRule: function () {
        var that = this;
        var ddlAddPointRule = $(".panic_add select[name='AddPointRule']"), html = "";
        ddlAddPointRule.empty();
        top.AJAX.ajax({
            src: "CountDown/GetAddRule",
            type: "get",
            data: {},
            callback: function (data) {
                html += "<option value=\"" + that.guidEmpty + "\">--请选择--</option>";
                if (data != null && data.length > 0) {
                    $(data).each(function (index, item) {
                        html += "<option value=\"" + item.PrimaryKeyGuid + "\"" + (that.addPointRule == item.PrimaryKeyGuid ? " selected=\"selected\"" : "") + ">" + item.ChoiceName + "</option>";
                    });
                }
                ddlAddPointRule.html(html);
            }
        });
    },
    bindEvent: function () {
        var that = this;
        $(".btn-search").click(function () {
            var data = {
                productName: $(".panic_check input[name='ProductName']").val(),
                categoryId: $(".panic_check select[name='Category']").val()
            };
            that.bindProduct(data);
        });
        $("input[name='IsDiscount']").change(function () {
            if ($(this).val() == "true")
                $(".panic_discount").show();
            else
                $(".panic_discount").hide();
        });
        $("[type='datetime']").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "0Y",
            maxDate: "1Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
        $("[name='DiscountType']").change(function () {
            var $unit = $("input[name='DiscountNumber']").next("i");
            switch (parseInt($(this).val())) {
                case 0:
                    $unit.text("%");
                    break;
                case 1:
                    $unit.text("元");
                    break;
            }
        });
        $("[name='CouponOutType']").change(function () {
            if (parseInt($(this).val()) == 1) {
                $("[name='SetCouponOutDate']").closest("div").hide();
                $("[name='SetCouponOutDays']").closest("div").show();
            }
            else {
                $("[name='SetCouponOutDate']").closest("div").show();
                $("[name='SetCouponOutDays']").closest("div").hide();
            }
        });
        $(".btn-submit").click(function (e) {
            e.preventDefault();
            var isDiscountCode = $.getBoolean($("[name='IsDiscount']:checked").val()), data = {
                CountDownId: that.id,
                ProductId: $.getNumber($("[name='ProductId']").val()),
                StartDate: $.time2stamp($("[name='StartDate']").val() + " " + $("[name='StartHour']").val() + ":" + $("[name='StartMinute']").val() + ":00"),
                EndDate: $.time2stamp($("[name='EndDate']").val() + " " + $("[name='EndHour']").val() + ":" + $("[name='EndMinute']").val() + ":00"),
                IsDiscountCode: isDiscountCode,
                DiscountCode: isDiscountCode ? {
                    DiscountType: $.getNumber($("[name='DiscountType']:checked").val()),
                    DiscountNumber: parseFloat($("[name='DiscountNumber']").val()),
                    DiscountNum: $.getNumber($("[name='DiscountNum']").val()),
                    CouponOutType: parseInt($("[name='CouponOutType']:checked").val()),
                    SetCouponOutDate: $.time2stamp($("[name='SetCouponOutDate']").val()),
                    SetCouponOutDays: $.getNumber($("[name='SetCouponOutDays']").val()),
                    DiscountUrl: $("[name='DiscountUrl']").val()
                } : null,
                CountDownPrice: $.getNumber($("[name='CountDownPrice']").val()),
                WithShippingFee: $("[name='WithShippingFee']:checked").length > 0,
                ActivityStock: $.getNumber($("[name='ActivityStock']").val()),
                Stock4Display: $.getNumber($("[name='Stock4Display']").val()),
                RecoveryTime: $.getNumber($("[name='RecoveryTime']").val()),
                CountDownAddress: $("[name='CountDownAddress']").val(),
                Content: $("[name='Content']").val(),
                SubPointRule: $("[name='SubPointRule']").val(),
                AddPointRule: $("[name='AddPointRule']").val()
            };
            var IsValid = true;
            if (data.ProductId < 1) {
                alert("请选择参加抢购活动的商品!");
                IsValid = false;
                return false;
            }
            if (data.StartDate > data.EndDate) {
                alert("开始时间不能大于结束时间!");
                IsValid = false;
                return false;
            }
            if (data.ActivityStock < 1) {
                alert("限时实际抢购数量必须大于零!");
                IsValid = false;
                return false;
            }
            if (data.RecoveryTime < 1) {
                alert("商品回收时间必须大于零!");
                IsValid = false;
                return false;
            }
            if (IsValid) {
                top.AJAX.ajax({
                    src: that.id > 0 ? "CountDown/UpdateCountDown" : "CountDown/AddCountDown",
                    type: "post",
                    data: data,
                    callback: function (rs) {
                        alert((that.id > 0 ? "编辑" : "添加") + "抢购活动成功！");
                        that.closeWindow();
                    }
                });
            }
        });
    },
    closeWindow: function () {
        top.O2O.refreshWindow(this.mainid);
        top.O2O.closeWindow(window.name.substr(5));
    }
};