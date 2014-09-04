/**
 * Created with JetBrains WebStorm.
 * User: Jerry Shaw
* Date: 14-7-28
* Time: 上午11:31
* form ui.
*/
/// <reference path="jquery-1.6.2.min.js" />
/// <reference path="jq.extend.js" />
(function ($) {
    $.formLoad=function(){
        // ColorPicker拾色器 begin
        if (typeof $.fn.ColorPicker != "undefined") {
            $("input.color-picker").before(function () {
                var $this = $(this);
                $this.val($this.val() || "#FFFFFF");
                return "<div class=\"colorpicker-selector\"><div class=\"colorpicker-ui\" style=\"background-color: " + $this.val() + ";\"></div><div class=\"colorpicker-control\"></div></div>";
            });
            $(".colorpicker-selector .colorpicker-control").append(function () {
                return $(this).closest(".colorpicker-selector").next("input.color-picker");
            });
            $(".colorpicker-selector").each(function () {
                var $this = $(this);
                $this.val($this.val() || "#FFFFFF");
                $this.ColorPicker({
                    color: $this.val(),
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        $(".colorpicker-ui", $this).css('backgroundColor', '#' + hex);
                        $(".colorpicker-control input", $this).val("#" + hex);
                    }
                });
            });
        }
        // ColorPicker拾色器 end

        // 日期时间控件 begin
        if (typeof $.fn.datepicker != "undefined") {
            $("[type='datetime']").each(function () {
                var $this = $(this), _dateFormat = $this.attr("data-format") || "yy-mm-dd", _minDate = $this.attr("data-min") || "0Y", _maxDate = $this.attr("data-max") || "2Y", _changeMonth = $.getBoolean($this.attr("data-change-month") || "true"), _changeYear = $.getBoolean($this.attr("data-change-year") || "true"), _yearRange = $this.attr("data-year-range") || "c-60:c+60";
                $this.datepicker({
                    dateFormat: _dateFormat,
                    minDate: _minDate,
                    maxDate: _maxDate,
                    changeMonth: _changeMonth,
                    changeYear: _changeYear,
                    yearRange: _yearRange
                });
            });
        }
        // 日期时间控件 end
    };
    $.fn.json2form = function (json) {
        if (typeof json != "undefined" && json != null) {
            $(this).each(function () {
                var elemType = $(this).attr("type") == undefined ? this.type : $(this).attr("type");
                var elemName = $(this).attr("name");
                var elemData = json[elemName];
                if (typeof elemData != "undefined" && elemData != null) {
                    switch (elemType) {
                        case undefined:
                        case "text":
                        case "password":
                        case "hidden":
                        case "button":
                        case "reset":
                        case "textarea":
                        case "submit": {
                            if (typeof (elemData) == "string") {
                                $(this).val(elemData.toUpperCase() == "NULL" ? "" : elemData);
                            } else {
                                $(this).val(elemData + "");
                            }
                            break;
                        }
                        case "datetime":
                            $(this).val($.stamp2date(elemData));
                            break;
                        case "checkbox":
                        case "radio": {
                            $(this).removeAttr("checked");
                            if (elemData.constructor == Array) {//checkbox multiple value is Array
                                for (var elem in elemData) {
                                    if (elemData[elem] == $(this).val()) {
                                        $(this).attr("checked", "checked");
                                    }
                                }
                            } else {//radio or checkbox is a string single value
                                if (elemData == $(this).val()) {
                                    $(this).attr("checked", "checked");
                                }
                            }
                            break;
                        }
                        case "select":
                        case "select-one":
                        case "select-multiple": {
                            $(this).find("option:selected").removeAttr("selected");
                            if (elemData.constructor == Array) {
                                for (var elem in elemData) {
                                    $(this).find("option[value='" + elemData[elem] + "']").attr("selected", "selected");
                                }
                            } else {
                                $(this).find("option[value='" + elemData + "']").attr("selected", "selected");
                            }
                            break;
                        }
                    }
                }
            });
        }
    };
})(jQuery);