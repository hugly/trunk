/**
 * Created by hugly on 14-8-18.
 */
CREATE_LIST={
    //总宽度
    totalWidth:0,
    //总高度
    totalHeight:0,
    //初始化函数
    init:function(oParent){
        this.oParent=$("<div style='height: auto; position: relative;'></div>");
        this.createTitle(titleDetail);
        this.createListData(titleDetail,data);
        this.oParent.appendTo(oParent);
    },
    //生成页面title
    createTitle:function(data){
        this.totalWidth=0;
        var oParent=$("<div class='subject_title' style='width:100%; height: 32px; line-height: 32px; position: relative; border: 1px solid #AEB2BA; background: #F4F4F4;'></div>")
        for(var i= 0,j=data.length;i<j;i++){
            if(i<j-1){
                $("<div style='float: left; width:"+data[i].width+"px; border-right: 1px solid #AEB2BA; text-align: center; position: relative;'>"+data[i].title+"</div>").appendTo(oParent);
            }else{
                $("<div style='float: left; width:"+data[i].width+"px; text-align: center; position: relative;'>"+data[i].title+"</div>").appendTo(oParent);
            }
            this.totalWidth+=data[i].width+1;
        }
        this.oParent.css({"width":this.totalWidth});
        oParent.appendTo(this.oParent);
    },
    //创建数据列表
    createListData:function(titleDetail,data){
        var oParent=null,
            oLayer=$("<div style='overflow-y:auto;overflow-x:hidden; height:387px; width:"+(this.totalWidth+2)+"px'></div>"),
            cssStr="width:"+this.totalWidth+"px;height: 42px;line-height: 42px;position: relative;border: 1px solid #AEB2BA;margin-top: -1px;";
        for(var i= 0,j=data.length;i<j;i++){
            data[i].UserId=data[i].UserId || "";
            if(i%2){
                oParent=$("<div class='subject_list_detail' style='"+cssStr+"' id='"+data[i].UserId+"' linecode='"+i+"' dis='"+data[i].isShow+"'></div>");
            }else{
                oParent=$("<div class='subject_list_detail' style='background:#dde7f3;"+cssStr+"' id='"+data[i].UserId+"'  linecode='"+i+"' dis='"+data[i].isShow+"'></div>");
            }
            this.bindData(oParent,titleDetail,data[i]);
            oLayer.append(oParent);
            this.oParent.append(oLayer);
        }
    },
    //绑定页面数据
    bindData:function(obj,titleDetail,data){
        var str,
            key="",
            href="",
            cssStr="float:left; border-right:1px solid #aeb2ba; text-align:center; position:relative;";

        for(var i= 0,j=titleDetail.length;i<j;i++){
            key=titleDetail[i].key;
            href=titleDetail[i].href;
            switch (titleDetail[i].type){
                case "linkType":
                    str=this.linkTypeAnother(data[href],data[key]);
                    break;
                case "word":
                    str=this.wordType(data[key]);
                    break;
                case "link":
                    str=this.linkType("javascript:;",data[key],titleDetail[i].fun);
                    break;
                case "img":
                    str=this.imgType(120,40,data[key]);
                    break;
                case "operaType":
                    str=this.operaType(titleDetail[i].opera,titleDetail[i].fun);
                    break;
                case "opera":
                    str=this.operaType(["编辑","删除"],titleDetail[i].fun);
                    break;
                case "time":
                    str=this.timeType(data[key]);
                    break;
                case "yorn":
                    str=this.YorNType(data[key]);
                    break;
                case "dis":
                    str=this.disType("",data[key],titleDetail[i].fun,titleDetail[i].aValue);
                    break;
                case "static":
                    str=this.staticType(key);
                    break;
                case "check":
                    str=this.checkType(data[key]);
                    break;
                case "checkType":
                    str=this.checkTypeAnother(data[key]);
                    break;
            };
            if(i<titleDetail.length-1){
                var obj1=$("<div style='width:"+titleDetail[i].width+"px;"+cssStr+"'></div>");
                obj1.append(str);
                obj.append(obj1);
            }else{
                var width=titleDetail[i].width-20;
                var obj1=$("<div style='width:"+width+"px;"+cssStr+"border-right:none;'></div>");
                obj1.append(str);
                obj.append(obj1);
            }
        }
    },
    //静态文本类型
    staticType:function(data){
        var wordCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";
        return $("<span style='"+wordCss+"'>"+data+"</span>");
    },
    //linkType类型
    linkTypeAnother:function(href,data1){
        var _this=this;
        href=href || "javscript:;";
        var linkCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";
        var str="<a href='"+href+"' style='"+linkCss+"'>"+data1+"</a>";

        return str;

    },
    //checkboxAnother类型
    checkTypeAnother:function(data){
        var oParent=$("<div style='display:block; position: relative; width:90%; padding:0 5%; height:42px; line-height:42px; overflow:hidden;text-align:center; cursor:pointer;'></div>"),
            obj=$("<input style='float:left; margin:15px 5px;' type='checkbox' name='checkbox' value='"+data+"'>"),
            oSpan=$("<span style='float: left; display: block;'>"+data+"</span>");

        oParent.append(obj);
        oParent.append(oSpan);

        return oParent;
    },
    //checkbox类型
    checkType:function(data){
        if(data){
            return $("<input type='checkbox' checked>");
        }else{
            return $("<input type='checkbox'>");
        }
    },
    //文字类型
    wordType:function(data){
        if(data==null){
            data="";
        }
        var wordCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";
        return $("<span style='"+wordCss+"'>"+data+"</span>");
    },
    //图片类型
    imgType:function(width,height,data){
        var url="",
            imgCss="display:block; margin:1px 5px;";

        if(typeof data=="string"){
            url=data;
        }else{
            if(data){
                url=data[0].UploadPath;
            }else{
                url="";
            }
        }
        return $("<img style='width: "+width+"px; height: "+height+"px;"+imgCss+"' src='"+url+"' >");
    },
    //链接类型
    linkType:function(href,data1,fun){
        var _this=this;
        href=href || "javscript:;";
        var linkCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";
        var str="<a href='"+href+"' style='"+linkCss+"'>"+data1+"</a>";

        var obj=$(str).click(function(){
            fun[0](this,_this.getDataById(data,$(this).parent().parent().attr("id"),"UserId"));
        });

        return obj;
    },
    //操作类型
    operaType:function(data1,fun){
        var str="",
            operaCss=['display: inline-block;height: 30px;line-height: 30px;padding-left: 18px;background: url("images/edit.png") no-repeat 0 7px;',
                'display: inline-block;height: 30px;line-height: 30px;padding-left: 18px;margin-left: 10px;background: url("images/delete.gif") no-repeat 0 7px;'];

        for(var i= 0,j=data1.length;i<j;i++){
            str+="<a style='"+operaCss[i]+"' href='javascript:;'>"+data1[i]+"</a>";
        }
        var obj1=$($(str)[0]).click(function(){
            fun[0](this,data[$(this).parent().parent().attr("linecode")]);
        });
        var obj2=$($(str)[1]).click(function(){
            fun[1](this,data[$(this).parent().parent().attr("linecode")]);
        });
        var obj=[obj1[0],obj2[0]];
        return obj;
    },
    //时间类型
    timeType:function(data){
        var time="",
            wordCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";
        if(typeof data=="number"){
            time=$.stamp2date(data);
        }else{
            time=data;
        }

        return $("<span style="+wordCss+">"+time+"</span>");
    },
    //文字显示是／否类型
    YorNType:function(data){
        var is="",
            wordCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";

        is=data?"是":"否";

        return $("<span style='"+wordCss+"'>"+is+"</span>");
    },
    //显示状态类型   eg:ture:显示 false:不显示
    disType:function(href,data1,fun,aValue){
        href=href || "javascript:;";
        var isShow="",
            str="",
            linkCss="display:block; width:90%; padding:0 5%; height:42px; line-height:42px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; cursor:pointer;";

        isShow=data1?aValue[0]:aValue[1];

        str="<a href='"+href+"' style='"+linkCss+"'>"+isShow+"</a>";

        if(fun){
            var obj=$(str).click(function(){
                fun[0](this,data[$(this).parent().parent().attr("linecode")]);
            });

            return obj;
        }else{
            return $(str);
        }
    },
    //根据id找数据
    getDataById:function(data,id,attr){
        for(var i= 0,j=data.length;i<j;i++){
            if(data[i][attr]==id){
                return data[i];
                break;
            }
        }
    }
};