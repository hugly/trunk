/**
 * Created by Aaron on 14-7-16.
 */
$(document).ready(function(){
    ORDER_MANAGEMENT.init();
});


ORDER_MANAGEMENT={
    type:null,
    searchKey:null,
    init:function(){
        this.type = $.getUrlParam("type") || 0;
        this.searchKey = decodeURI($.getUrlParam("search"))|| "";
        this.type1 = $.getUrlParam("type1") || 0;



        this.intervalPage();

        this.bindEvent();
        this.listEventBind();
        this.bindSendGoodsDivEvent();
        //this.bindSendYHJDivEvent();
        this.getData();

    },


    //初始化页面赋值
    intervalPage:function(){
        $("#order_manange_search_val").val(this.searchKey);
        $("#order_manange_search_type").val(this.type);
        $("#order_manange_search_type1").val(this.type1);
    },


    //获取数据
    getData:function(){
        var _this = this;

        var getListData = function(){
            $.scrollLoadInterval({
                runIn:this,                               //加个回调执行对象
                mainDiv:$("#order_manage_info"),          //@param:jqobj     列表需要插入的obj
                buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
                getDataApiName:"getManageorderList",   //@param:str       调用的api接口名
                bindDataFn:_this.bindData,               //@param:function 数据绑定函数
                scrollForKey:"OrderId",                 //@param:str       滚动加载需要的key
                searchData:{
                    searchKey:_this.searchKey,                    //@param:str        //查询输入的文字
                    orderType:_this.type1,                        //@param:int          //订单类型
                    orderStatus:_this.type                        //@param:int          //订单状态
                    //0:未提交,1:待支付,2:待发货,3:已发货,4:关闭,5:完成
                }
            });
            _this.getExportList();
        };

        var getTypeData = function(){

        };



        getListData();
    },
    //绑定数据
    bindData:function(data){
        var obj2 = $("#order_manage_even"),
//            obj = $("#clone_hang_main"),
//            obj1 = $("#order_manage_odd"),
//
            body=$("#order_manage_info");

        for(var i= 0,l=data.length;i<l;i++){
            var this_data = data[i],
//                this_obj = obj.clone().attr({id:""}).css({display:"block"}),
//                this_obj1 = obj1.clone().attr({id:""}).css({display:"block"}),
                this_obj2 = obj2.clone().attr({id:""}).css({display:"block"});

//            this_obj.append(this_obj1).append(this_obj2);
//            this_obj1.find(".clone_no").text(this_data.OrderId);
            var time = $.stamp2time(this_data.OrderDate);
//            this_obj1.find(".clone_time").text(time);
            var isPrint = (this_data.IsPrinted)?  "已打印" : "未打印";
//            this_obj1.find(".order_odd_list3").text(isPrint);

            this_obj2.attr({id:"list_"+this_data.OrderId});
            this_obj2.find(".order_list0").html("<input type='checkbox' value='"+this_data.OrderId+"' name='list_check'>"+this_data.OrderNumber);
            this_obj2.find(".order_list1").text(this_data.Username);
            this_obj2.find(".order_list2").text(this_data.RealName).attr({address:this_data.Address,area:this_data.ShippingRegion,orderid:this_data.OrderId});
            this_obj2.find(".order_list3").text(time);
            if(this_data.Remark){
                this_obj2.find(".order_list4").text(this_data.Remark);
            }else{
                this_obj2.find(".order_list4").text("其它方式");
            }

            this_obj2.find(".order_list5").text(top.AJAX.OrderType[this_data.OrderType]).attr({_type:this_data.OrderType});
            this_obj2.find(".order_list6").text(isPrint);
            this_obj2.find(".order_list7").text(top.AJAX.OrderStatus[this_data.OrderStatus]);
            if(this_data.OrderStatus != 2 ){
                this_obj2.find(".order_list8").find("a").eq(1).css({display:"none"});
            }

            body.append(this_obj2);

        }
    },
    //绑定事件
    bindEvent:function(){
        var _this = this;
        //搜索按钮事件
        $("#order_manange_search").click(function(){
            _this.searchEven();
        });

        //导出订单信息
        $("#order_manange_export1").click(function(){
            _this.exportFileShow(1);
        });

        //导出快递信息
        $("#order_manange_export2").click(function(){
            _this.exportFileShow(2);
        });

        //订单导出按钮
        $("#order_manange_export_button1").click(function(){
            _this.exportFile(this,1);
        });

        //快递导出按钮
        $("#order_manange_export_button2").click(function(){
            _this.exportFile(this,2);
        });

        //全选按钮
        $("#list_all").click(function(){
            _this.selectAll(this);
        });

        //批量发货
        $("#send_out_all").click(function(){
            _this.sendGoodsGetData();
        })

    },
    //获取导出数据字段
    getExportList:function(){
        var _this=this;
        top.AJAX.getExportWords({
            callback:function(rs){
                _this.fillData2Layer(rs);
            }
        });
    },
    //将数据丢到相应的位置
    fillData2Layer:function(data){
        for(var i= 0,l=data.OrderOut.length;i<l;i++){
           if(data.OrderOut[i].Tyep==0){
               this.fillData2Order(data.OrderOut[i]);
           }else if(data.OrderOut[i].Tyep==1){
               this.fillData2Express(data.OrderOut[i]);
           }else if(data.OrderOut[i].Tyep==-1){
               this.fillData2Order(data.OrderOut[i]);
               this.fillData2Express(data.OrderOut[i]);
           }
        }
    },
    //将数据填充到订单信息中
    fillData2Order:function(data){
        var oParent=$("#order_manage_ul_order");
        $('<div class="order_manage_li" sqlName='+data.SqlName+'><input type="checkbox" value='+data.Name+'/><span>'+data.Name+'</span></div>').insertBefore(oParent);
    },
    //将数据填充到快递单信息中
    fillData2Express:function(data){
        var oParent=$("#order_manage_ul_express");
        $('<div class="order_manage_li" sqlName='+data.SqlName+'><input type="checkbox" value='+data.Name+'/><span>'+data.Name+'</span></div>').insertBefore(oParent);
    },
    //列表事件绑定
    listEventBind:function(){
        var _this = this;
        $(".order_list8_info").live("click",function(){
            var id = $(this).parent().parent().find(".order_list0 input").val();
            _this.showInfo(id);
        });

        $(".order_list8_send").live("click",function(){
            var id = $(this).parent().parent().find(".order_list0 input").val(),
                type = $(this).parent().parent().find(".order_list5").attr("_type");
            _this.openSendGoodDiv(id,type);
        });


    },
    //搜索触发
    searchEven:function(){
        var val = $.trim($("#order_manange_search_val").val()),
            type = $("#order_manange_search_type").val(),
            type1 = $("#order_manange_search_type1").val();

        window.location.href = "order_management.html?search="+val+"&type="+type+"&type1="+type1;
    },
    //导出格式事件选项卡
    exportFileShow:function(type){
        var show1 = $("#order_manange_info_export1"),
            show2 = $("#order_manange_info_export2"),
            type1 = show1.css("display"),
            type2 = show2.css("display");

        if(type == 1){
            //订单信息
            if(type1 == "block"){
                show1.css({display:"none"});
                show2.css({display:"none"});
            }else{
                show1.css({display:"block"});
                show2.css({display:"none"});
            }

        }else{
            //快递信息
            if(type2 == "block"){
                show1.css({display:"none"});
                show2.css({display:"none"});
            }else{
                show1.css({display:"none"});
                show2.css({display:"block"});
            }

        }


    },
    //导出文件
    exportFile:function(obj,type){
        //type:  1:订单   2:快递
        var main = $(obj).parent().parent(),
            select = main.find("input[type='checkbox']"),
            radio = main.find("input[type='radio']"),
            select_val = this.getSelectVal(select),
            radio_val = this.getSelectVal(radio),
            isType= 0,
            arr=[],
            href="";

        if(radio.eq(1).attr("checked")=="checked"){
            isType=1;
        }
        href="?type="+isType+"&";
        if(select_val == ""){
            alert("请选择要导出的信息");
            return;
        }
        select.each(function(){
            if($(this).attr("checked")){
                //c.Name=$(this).val().substr(0,$(this).val().indexOf("/"));
                arr.push($(this).parent().attr("sqlname"));
            }
        });
        for(var i= 0,l=arr.length;i<l;i++){
           var str1="OrderOut["+i+"][Name]="+arr[i].Name+"&OrderOut["+i+"][SqlName]="+arr[i].SqlName+"&";
           href+=str1;
        }
        window.open(top.AJAX.url+"Manageorder/ExcelOrder?"+ $.param({
            type:isType,     //导出的类型： @param:int  0 CSV格式(默认);1 TXT格式;
            fields:arr.join(","),
            companyId:top.CACHE.userInfo.CompanyID
        }));
        /*top.AJAX.exportOrder({
            data:{
                type:isType,     //导出的类型： @param:int  0 CSV格式(默认);1 TXT格式;
                fields:arr.join(",")
            },
            callback: function (rs) {

            }
        });*/
    },
    //获取select的值
    getSelectVal:function(obj){
        var return_val = "";
        obj.each(function(){
            if($(this).attr("checked")){
                return_val += $(this).val() + ",";
            }
        });
        return return_val.substr(0,return_val.length-1);
    },
    //列表全选或取消全选
    selectAll:function(obj){
        var state = $(obj).attr("checked"),
            body = $("#order_manage_info");
        if(!state){
            //取消全选
            body.find("input[type='checkbox']").attr({checked:false});
        }else{
            //全选
            body.find("input[type='checkbox']").attr({checked:true});
        }
    },
    //批量发货获取数据
    sendGoodsGetData:function(){
        var selects = $("#order_manage_info").find("input[type='checkbox']"),
            select_val = this.getSelectVal(selects),
            data = [],
            type1 = "";

        select_val = select_val.split(",");

        for(var i= 0,l=select_val.length;i<l;i++){
            var this_dom = $("#list_"+select_val[i]),
                code = this_dom.find(".order_list0").text() || " ",
                data1 = this_dom.find(".order_list2"),
                orderid=data1.attr("orderid")||" ",
                name = data1.text() || " ",
                area = data1.attr("area") || " ",
                address = data1.attr("address") || " ",
                type = this_dom.find(".order_list7").text();
            type1 = this_dom.find(".order_list5").attr("_type");

            if(type == "待发货"){
                data.push({
                    orderid:orderid,
                    code: code,
                    name: name,
                    area: area,
                    address: address
                });
            }


        }

        if(data.length == 0){
            alert("请选择待发货的订单!");
            return;
        }

        if(type1 == 0){
            this.openSendGoodsDiv(data);
        }else{
            this.yhjAllSendSubmit();
        }





    },
    //打开批量发货窗口
    openSendGoodsDiv:function(data){
        var div = $("#send_all_main_1").clone().attr({id:""}).css({display:"block"}),
            body = div.find(".send_all_body"),
            clone = $("#send_all_body_list");

        this.createSelect(top.AJAX.sendType,"",div.find(".js_type1"));
        this.createSelect(top.AJAX.sendType1,"",div.find(".js_type2"));



        for(var i= 0,l=data.length;i<l;i++){
            var this_list = clone.clone().attr({id:""}).css({display:"block"}),
                this_data = data[i];

            this_list.attr({"orderid":this_data.orderid});
            this_list.find(".send_all_body_list1").text(this_data.code);

            this_list.find(".send_all_body_list2").text(this_data.name);
            this_list.find(".send_all_body_list3").text(this_data.area);
            this_list.find(".send_all_body_list4").text(this_data.address);
            this_list.find(".send_all_body_list5").append(this.createSelect(top.AJAX.sendType,"js_type1"));
            this_list.find(".send_all_body_list6").append(this.createSelect(top.AJAX.sendType1,"js_type2"));
            this_list.find(".send_all_body_list7").append("<input class='js_input' type='text' />");

            body.append(this_list);
        }

        $.openDiv({
            width:850,
            height:360,
            title:"批量发货",
            div:div
        })
    },
    //批量发货窗口事件绑定
    bindSendGoodsDivEvent:function(){
        var _this = this;

        $(".js_type1_button").live("click",function(){
            var this_val = $(this).parent().find(".js_type1_all").val();
            $(".js_type1").val(this_val);
        });

        $(".js_type2_button").live("click",function(){
            var this_val = $(this).parent().find(".js_type2_all").val();
            $(".js_type2").val(this_val);
        });

        $(".js_type3_button").live("click",function(){
            var this_val = parseInt($(this).parent().find(".js_input").val());
            var inputs = $(".send_all_body_list").find(".js_input");
            inputs.each(function(){
                $(this).val(this_val);
                this_val++;
            })

        });

        $(".js_send_goods_submit").live("click",function(){
            _this.sendGoodsSubmit();
        });

        $(".send_goods_yhj_button1").live("click",function(){
            _this.bindSendYHJDivEvent(this);
        });

        $(".send_goods_yhj_button2").live("click",function(){
            _this.sendGoodSubmit(this);
        });

    },
    //动态创建select
    createSelect:function(data,class_name,select){

        select = select ||  $("<select class='"+class_name+"'></select>");

        for(var key in data){
            select.append("<option value='"+key+"'>"+data[key]+"</option>");
        }

        return select;

    },
    //批量发货提交
    sendGoodsSubmit:function(){
        var oParent=$(".send_all_body"),
            arr=[];
        oParent.find(".send_all_body_list").each(function(){
            var c={};

            c.OrderId=$(this).attr("orderid");
            c.ExpressCompanyName=$(this).find(".js_type2").val();
            c.RealShippingModeId=parseInt($(this).find(".js_type1").val());
            $(this).find(".js_type1 option").each(function(){
                if($(this).attr("value")==c.RealShippingModeId){
                    c.RealModeName=$(this).text();
                }
            });
            c.ShipOrderNumber=$(this).find(".js_input").val();
            arr.push(c);
        });

        top.AJAX.sendGoodsBatch({
            data:{
                "OrderIdList":arr
            },
            callback: function (rs) {
                alert("货物批量发货成功！");
                window.location.reload();
            }
        });

    },
    //优惠劵批量发货
    yhjAllSendSubmit:function(){
        var oParent=$("#order_manage_info"),
            aInput=oParent.find("input[type=checkbox]"),
            arr=[];

        aInput.each(function(){
            var c={};
            if($(this).attr("checked")){
                c.OrderId=parseInt($(this).val());
                c.CouponNote="";
                arr.push(c)
            }
        });
        top.AJAX.sendCouponBatch({
            data:{
                "OrderCouponList":arr
            },
            callback: function (rs) {
                alert("优惠券批量发货成功！");
                window.location.reload();
            }
        });
    },
    //打开单个发货窗口  判断
    openSendGoodDiv:function(id,type){

        if(type == 0){
            //普通订单
            this.showPTDiv(id);
        }else{
            //优惠劵订单
            this.showYHJDiv(id);
        }
    },

    //获取订单详情
    getOrderInfo:function(id,callback){
        top.AJAX.getManageorderInfo({
            data:{
                orderId:id           //订单id      @param:int
            },
            callback:callback
        });
    },

    //显示订单详情
    showInfo:function(id){
        var bind_data = function(rs){
            var div = $("#win_order_info").clone().attr({id:""}).css({display:"block"});
            div.find(".win_order_info_title").find("span").text(top.AJAX.OrderStatus[rs.OrderStatus]);
            div.find(".js_bind_code").find("span").text(rs.OrderNumber);
            div.find(".js_bind_phone").find("span").text(rs.CellPhone);
            div.find(".js_bind_username").find("span").text(rs.Username);
            div.find(".js_bind_name").find("span").text(rs.RealName);
            div.find(".js_bind_email").find("span").text(rs.EmailAddress);
            div.find(".js_bind_time1").find("span").text($.stamp2time(rs.OrderDate));


            if(rs.UploadList){
                div.find(".js_bind_product_img").append("<img width='100' height='100' src='"+rs.UploadList[0].UploadPath+"' />");
            }else{
                div.find(".js_bind_product_img").append("<img width='100' height='100' src='' />");
            }
            div.find(".js_bind_product_name").find("span").text(rs.ProductName);
            div.find(".js_bind_product_number").find("span").text(rs.Quantity);
            div.find(".hs_bind_product_f_number").find("span").text(rs.ShipmentQuantity);


            div.find(".js_bind_send_gs").find("span").text(rs.ExpressCompanyName);
            div.find(".js_bind_send_area").find("span").append(rs.ShippingRegion);
            div.find(".js_bind_send_address").find("span").text(rs.Address);
            div.find(".js_bind_send_type").find("span").text(rs.RealModeName);
            div.find(".js_bind_send_code").find("span").text(rs.ShipOrderNumber);
            div.find(".js_bind_send_message").find("span").text(rs.Remark);


            $.openDiv({
                width:600,
                height:360,
                title:"订单详情",
                div:div
            })
        };


        this.getOrderInfo(id,bind_data);
    },
    //显示优惠卷发货窗口
    showYHJDiv:function(id){

        var bindData = function(rs){
            var div = $("#send_goods_yhj").clone().attr({id:rs.OrderId}).css({display:"block"});
            div.find(".js_code").find("span").text(rs.OrderId);
            div.find(".js_time").find("span").text($.stamp2time(rs.OrderDate));
            div.find(".js_phone").find("span").text(rs.CellPhone);
            div.find(".js_text").append("<textarea></textarea>");

            $.openDiv({
                width:600,
                height:260,
                title:"优惠劵发货",
                div:div
            })
        };

        this.getOrderInfo(id,bindData);

    },
    //显示普通发货窗口
    showPTDiv:function(id){
        var _this = this;

        var bind_data = function(rs){


            var div = $("#win_order_info").clone().attr({id:rs.OrderId}).css({display:"block"});
            div.find(".win_order_info_title").find("span").text(top.AJAX.OrderStatus[rs.OrderStatus]);
            div.find(".js_bind_code").find("span").text(rs.OrderNumber);

            div.find(".js_bind_phone").find("span").append("<input type='text' value='"+rs.CellPhone+"'/>");
            div.find(".js_bind_username").find("span").text(rs.Username);

            div.find(".js_bind_name").find("span").append("<input type='text' value='"+rs.RealName+"'/>");


            div.find(".js_bind_email").find("span").text(rs.EmailAddress);
            div.find(".js_bind_time1").find("span").text($.stamp2time(rs.OrderDate));

            if(rs.UploadList){
                div.find(".js_bind_product_img").append("<img width='100' height='100' src='"+rs.UploadList[0].UploadPath+"' />");
            }
            div.find(".js_bind_product_name").find("span").text(rs.ProductName);
            div.find(".js_bind_product_number").find("span").text(rs.Quantity);
            div.find(".hs_bind_product_f_number").find("span").text(rs.ShipmentQuantity);



            div.find(".js_bind_send_gs").find("span").append(_this.createSelect(top.AJAX.sendType));
            div.find(".js_bind_send_area").find("span").province_city_county(top.AJAX.areaXML,"","","",rs.RegionId);


            div.find(".js_bind_send_address").find("span").append("<input type='text' value='"+rs.Address +"' />");
            div.find(".js_bind_send_type").find("span").append(_this.createSelect(top.AJAX.sendType1));
            div.find(".js_bind_send_code").find("span").append("<input type='text' value=''/>");
            div.find(".js_bind_send_message").find("span").text(rs.Remark);

            div.append('<input id="send_out_all" class="order_manage_message_select_button send_goods_yhj_button2" type="button" value="确定发货">');


            $.openDiv({
                width:600,
                height:360,
                title:"订单发货",
                div:div
            })
        };


        this.getOrderInfo(id,bind_data);
    },
    //优惠卷发货窗口事件绑定
    bindSendYHJDivEvent:function(obj){
        var _this = this,
            body=$(obj).parent(),
            OrderId=body.attr("id"),
            CouponNote=body.find(".js_text").find("textarea").val();

            OrderId=parseInt(OrderId);
            //优惠劵发货
            top.AJAX.sendCoupon({
                data:{
                    OrderId:OrderId,                   //订单id      @param:int
                    CouponNote:CouponNote                 //订单备注     @param:str
                },
                callback:function(rs){
                    alert("发货成功！");
                    window.location.reload();
                }
            });

    },
    //普通发货
    sendGoodSubmit:function(obj){
        var body = $(obj).parent(),
            OrderId = body.attr("id"),
            ShippingModeId = body.find(".js_bind_send_gs").find("select").val(),
            CellPhone = body.find(".js_bind_phone").find("input").val(),
            RealName = body.find(".js_bind_name").find("input").val(),
            ShipOrderNumber = body.find(".js_bind_send_code").find("input").val(),
            Address = body.find(".js_bind_send_address").find("input").val(),
            RegionId = body.find(".js_bind_send_area").find("select").eq(2).val(),
            ExpressCompanyName = body.find(".js_bind_send_type").find("select").val(),
            RealModeName=null;
            body.find(".js_bind_send_gs").find("select").find("option").each(function(){
                if(ShippingModeId==$(this).val()){
                    RealModeName=$(this).text();
                }
            });

        console.log(OrderId);

            top.AJAX.sendGoods({
                data:{OrderIdList:[{
                    "OrderId":parseInt(OrderId),
                    "ShippingModeId": "",
                    "ExpressCompanyName": ExpressCompanyName,
                    "ShipOrderNumber": ShipOrderNumber,
                    "UpdateUserId": top.CACHE.userInfo.UserId,
                    "RegionId": parseInt(RegionId),
                    "CellPhone": CellPhone,
                    "RealName": RealName,
                    "Address": Address,
                    "RealShippingModeId": parseInt(ShippingModeId),
                    "RealModeName": RealModeName
                }]},
                callback:function(){
                    alert("成功发货!");
                    window.location.reload();
                }
            });

    }
};