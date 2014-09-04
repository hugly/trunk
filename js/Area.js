$.fn.province_city_county = function (xml_src,v_province, v_city, v_county,v_id) {
    var _self = this;
    //插入3个空的下拉框
    _self.html("<select id='province' name='province'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='city' name='city'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='county' name='county' ></select>");
    //分别获取3个下拉框
    var sel1 = _self.find("select").eq(0);
    var sel2 = _self.find("select").eq(1);
    var sel3 = _self.find("select").eq(2);

    //定义3个默认值
    _self.data("province", ["请选择", "0"]);
    _self.data("city", ["请选择", "0"]);
    _self.data("county", ["请选择", "0"]);
    //默认省级下拉
    if (_self.data("province")) {
        sel1.append("<option value='" + _self.data("province")[1] + "'>" + _self.data("province")[0] + "</option>");
    }
    //默认城市下拉
    if (_self.data("city")) {
        sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
    }
    //默认县区下拉
    if (_self.data("county")) {
        sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
    }
    $.get(xml_src, function (data) {
        //只传入最后一个id  反推前面的id
        if(v_id){
            v_county = v_id;
            v_city = $(data).find("#"+v_id).parent().attr("id");
            v_province = $(data).find("#"+v_id).parent().parent().attr("id");
        }



        var arrList = [];
        $(data).find('province').each(function () {
            var $province = $(this);
            sel1.append("<option value='" + $province.attr('id') + "'>" + $province.attr('name') + "</option>");
        });
        if (typeof v_province != 'undefined' && v_province != 0) {
            sel1.val(v_province);
            $("#TopRegionId").val(v_province);//给TopRegionId赋值
            sel1.change();
        }
    });

    //省级联动控制
    var index1 = "";
    var provinceValue = "";
    var cityValue = "";
    sel1.change(function () {
        //清空其它2个下拉框
        sel2[0].options.length = 0;
        sel3[0].options.length = 0;
        index1 = this.selectedIndex;
        if (index1 == 0) { //当选择的为 "请选择" 时
            if (_self.data("city")) {
                sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
            }
            if (_self.data("county")) {
                sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
            }
        } else {
            provinceValue = $('#province').val();
            $("#TopRegionId").val(provinceValue);//给TopRegionId赋值
            $.get(xml_src, function (data) {
                $(data).find("province[id='" + provinceValue + "'] > city").each(function () {
                    var $city = $(this);
                    sel2.append("<option value='" + $city.attr('id') + "'>" + $city.attr('name') + "</option>");
                });
                cityValue = $("#city").val();
                $("#RegionId").val(cityValue);//给RegionId赋值
                $(data).find("city[id='" + cityValue + "'] > county").each(function () {
                    var $county = $(this);
                    sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                });

                if (typeof v_city != 'undefined' && v_city != 0) {
                    sel2.val(v_city);
                    $("#RegionId").val(v_city);//给RegionId赋值
                    if ($(sel2).find("option:selected").val() == undefined) {
                        $(sel2).find('option:first').prop('selected', 'selected');
                    }
                    sel2.change();
                }

                if (typeof v_county != 'undefined' && v_county != 0) {
                    sel3.val(v_county);
                    $("#RegionId").val(v_county);//给RegionId赋值
                }
            });
        }
    }).change();

    //城市联动控制
    sel2.change(function () {
        //sel3[0].options.length = 0;
        var cityValue2 = sel2.val();//$('#cityValue2').val();
        if (cityValue2 > 0) {
            sel3[0].options.length = 0;
        }
        $.get(xml_src, function (data) {
            var iscounty = false;
            $(data).find("city[id='" + cityValue2 + "'] > county").each(function () {
                var $county = $(this);
                sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                iscounty = true;
            });
            if (typeof v_county != 'undefined' && v_county != 0) {
                sel3.val(v_county);
                if ($(sel3).find("option:selected").val() == undefined) {
                    $(sel3).find('option:first').prop('selected', 'selected');
                }
            }
            if (iscounty) {
                $("#RegionId").val($(sel3).val());//给RegionId赋值
            }
            else {
                $("#RegionId").val(sel2.val());//给RegionId赋值
            }
        });
    }).change();

    //区联动控制
    sel3.change(function () {
        countyValue = $('#county').val();
        $("#RegionId").val(countyValue);//给RegionId赋值
    })

    return _self;
};




