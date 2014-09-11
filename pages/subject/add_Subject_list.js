/**
 * Created by hugly on 14-8-21.
 */
titleDetail=[
    {title:"选择",type:"checkType",width:70,key:"RelateId"},
    {title:"相关记录",type:"linkType",width:600,key:"Name",href:"LinkUrl"},
    {title:"相关图片",type:"img",width:143,key:"ImageUrl"}
];
data=[];

$(document).ready(function(){
    ADDSUBJECTLIST.init();
    KindEditor.ready(function(){});
});
ADDSUBJECTLIST={
    CurrentCheckVal:[],
    CurrentCode:"",
    CurrentDataArr:[],
    //当前页面所有被选中的单选框的值
    RelateDataJson:{},
    //当前被选中得索引值
    CurrentDataIndex:0,
    //当前请选择xxxx活动中要被勾选的项的集合
    CurrentRelateData:[],
    //当前模板序号
    CurrentIndex:0,
    //缓存当前数据
    CurrentData:null,
    //当前主题活动数据
    CurrentThemeData:null,
    //页面类型
    pageType:"add",
    //专题id
    ActivityId:"",
    //是否使用了模板
    IsTemplateActivity:false,
    //初始化
    init:function(){
        var href=window.location.href;
        if(href.indexOf("=")!=-1){
            this.ActivityId=href.substr(href.indexOf("=")+1);
            this.pageType="mdf";
        }
        this.getActivityTemData();
    },
    //获取专题详情及该专题模板对象信息
    getActivityAndTemDetail:function(data){
        var _this=this;
        top.AJAX.getSpecialDetail({
            data:{
                ActivityId:_this.ActivityId
            },
            callback:function(rs){
                _this.CurrentThemeData=rs;
                _this.createActivityTemData(data);
                _this.bindEvent(data,rs);
                _this.AssembleRelateData(rs);
            }
        });
    },
    //组装模板被选中input得数据
    AssembleRelateData:function(data){
        if(!$.isEmptyObject(data.ActivityTemplate)){
            if(data.ActivityTemplate.Modules.length>0){
                var moudles=data.ActivityTemplate.Modules;
                for(var i= 0,j=moudles.length;i<j;i++){
                    this.RelateDataJson[moudles[i].Code]=moudles[i].RelateData;
                }
            }
        }
    },
    //获取数据
    getActivityTemData:function(){
        var _this=this;
        top.AJAX.getSubjectTemplate({
            callback:function(rs){
                if(_this.pageType=="mdf"){
                    _this.getActivityAndTemDetail(rs);
                }else{
                    _this.createActivityTemData(rs);
                    _this.bindEvent(rs);
                }
            }
        });
    },
    //创建模板列表数据
    createActivityTemData:function(data){
        var CurrentThemeData=this.CurrentThemeData || {},
            _this=this,
            modelName=[],
            oParent=$("#add_Subject_list"),
            oActity=oParent.find("#add_subject_activity"),
            oTemplate=oParent.find("#add_subject_template"),
            oStatic=oParent.find("#add_subject_static"),
            ActivityTemplate=CurrentThemeData.ActivityTemplate || "",
            oLayer=$("#add_subject_dataLayer"),
            createTime="",
            endTime="",
            showOrder=0;

            if(CurrentThemeData.StartDate==undefined){
                createTime="";
            }else{
                createTime= $.stamp2date(CurrentThemeData.StartDate);
            }

            if(CurrentThemeData.ShowOrder==undefined){
                showOrder=0;
            }else{
                showOrder=CurrentThemeData.ShowOrder;
            }

            if(CurrentThemeData.EndDate==undefined){
                endTime="";
            }else{
                endTime= $.stamp2date(CurrentThemeData.EndDate)
            }

        this.aa=new CREATE_INPUT({
            data:[
                //text
                {
                    title:"专题活动名称",
                    type:"text",
                    id:"ActivityName",
                    msg:"",
                    isMust:true,
                    val:CurrentThemeData.ActivityName
                }
            ],
            body:oActity
        });

        this.bb=new CREATE_INPUT({
            data:[
                //select
                {
                    title:"专题模版",
                    type:"select",
                    id:"ActivityTemplate",
                    msg:"",
                    isMust:false,
                    val:_this.makeSureWhichTem(_this.arr2Object(_this.getTemplateName(data),_this.getCodeByData(data)),ActivityTemplate.Name)
                }
            ],
            body:oTemplate
        });

        this.cc=new CREATE_INPUT({
            data:[
                //imageUpload
                {
                    title:"专题大图",
                    type:"imageUpload",
                    id:"UploadPathbig",
                    msg:"上传图片后,必须点击页面底部的确定按钮,保存数据。",
                    isMust:false,
                    maxNumber:1,
                    val:_this.str2Arr(CurrentThemeData.BigUploadUrl)
                },
                //imageUpload
                {
                    title:"专题中图",
                    type:"imageUpload",
                    id:"UploadPathWell",
                    msg:"上传图片后,必须点击页面底部的确定按钮,保存数据。图片大小为316px * 97px",
                    isMust:false,
                    maxNumber:1,
                    val:_this.str2Arr(CurrentThemeData.MediumUploadUrl)
                },
                //imageUpload
                {
                    title:"专题小图",
                    type:"imageUpload",
                    id:"UploadPathsmall",
                    msg:"上传图片后,必须点击页面底部的确定按钮,保存数据。",
                    isMust:false,
                    maxNumber:1,
                    val:_this.str2Arr(CurrentThemeData.SmallUploadUrl)
                },
                //text
                {
                    title:"网页标题",
                    type:"text",
                    id:"SeoTitle",
                    msg:"",
                    isMust:false,
                    val:CurrentThemeData.SeoTitle
                },
                //textarea
                {
                    title:"网页关键字",
                    type:"textarea",
                    id:"SeoKeywords",
                    msg:"",
                    isMust:false,
                    val:CurrentThemeData.SeoKeywords
                },
                //textarea
                {
                    title:"网页描述",
                    type:"textarea",
                    id:"SeoDescription",
                    msg:"",
                    isMust:false,
                    val:CurrentThemeData.SeoDescription
                },
                //textarea
                {
                    title:"备注",
                    type:"textarea",
                    id:"Remark",
                    msg:"",
                    isMust:false,
                    val:CurrentThemeData.Remark
                },
                //text
                {
                    title:"链接地址",
                    type:"text",
                    id:"ActivityUrl",
                    msg:"未使用模板格式为：“http://www.xxx.com”,使用模板格式为：“xxx”",
                    isMust:true,
                    val:CurrentThemeData.ActivityUrl
                },
                //text
                {
                    title:"排序顺序",
                    type:"text",
                    id:"ShowOrder",
                    msg:"数字越大,显示位置越靠前",
                    isMust:false,
                    val:showOrder
                },
                //checkbox
                {
                    title:"是否在顶部显示",
                    type:"checkbox",
                    id:"IsTopShow",
                    msg:"",
                    isMust:false,
                    val:_this.getArrByData(CurrentThemeData.IsTopShow)
                },
                //text
                {
                    title:"开始时间",
                    type:"text",
                    id:"StartDate",
                    msg:"轮换的有效时间在开始时间和结束时间之间",
                    isMust:true,
                    val: createTime
                },
                //text
                {
                    title:"结束时间",
                    type:"text",
                    id:"EndDate",
                    msg:"",
                    isMust:true,
                    val: endTime
                },
                {
                    title:"简介",
                    type:"textarea",
                    id:"Summary",
                    msg:"限制在1000个字符以内。",
                    isMust:false,
                    val:CurrentThemeData.Summary
                },
                {
                    title:"详细介绍",
                    type:"superTextArea",
                    id:"Description",
                    msg:"限制在1000个字符以内。",
                    isMust:false,
                    val:CurrentThemeData.Description
                }


            ],
            body:oStatic
        });

        //生成日历控件
        this.dataContral();

        var objS=document.getElementById("ActivityTemplate"),
            obj=$('<a href="javascript:;" id="submit_add_subject_list_temp">提交</a>');

        oParent.append(obj);
        this.CurrentData=CurrentThemeData;
        if(this.CurrentData.ActivityId){
            this.CurrentRelateData=this.getRelateData();
        }

        this.bindDataToTem(objS,oLayer,CurrentThemeData);

    },
    //将获取得专题模板数据绑定到相关得地方
    bindDataToTem:function(obj,oLayer,CurrentThemeData){
        var value=$(obj).val();
        if(value==0){
            this.IsTemplateActivity=false;
        }else{
            this.IsTemplateActivity=true;
            this.bindDataByTheme(oLayer,CurrentThemeData);
        }
    },
    //模板数据绑定
    bindDataByTheme:function(oLayer,CurrentThemeData){
        var _this=this,
            oTemAttr=$("<div style='width: 100%; height: auto;'></div>"),
            oTemModules=$("<div style='width: 100%; height: auto;'></div>");
        oLayer.prepend($("<h3 style='font-size: 16px; color: #09f;'>模板属性</h3>"));

        this.temProperties=new CREATE_INPUT({
            data:_this.createTableByData(CurrentThemeData.ActivityTemplate.Properties),
            body:oLayer
        });

        oLayer.append(oTemAttr);
        oLayer.append(oTemModules);
        oTemModules.append(this.createTableByModules(CurrentThemeData.ActivityTemplate.Modules));

        this.aboutbindEvent();

    },
    //日历控件
    dataContral:function(){
        $("#StartDate").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
        $("#EndDate").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
    },
    //相关活动事件
    aboutbindEvent:function(){
        var _this=this,
            oLayer=$("#add_subject_dataLayer"),
            oActivity=oLayer.find(".getCompanyActivity");

        //选择相关活动
        oActivity.click(function(){
            _this.CurrentIndex=oActivity.index(this);
            _this.getDataByType(this);
            _this.RelateDataJson[$(this).attr("code")]=$(this).attr("relatedata").split(",");
        });

    },
    //事件绑定
    bindEvent:function(data,rs){
        var _this=this,
            oLayer=$("#add_subject_dataLayer"),
            oTemplate=$("#add_subject_template"),
            oSelect=oTemplate.find("select"),
            oSubmit=$("#submit_add_subject_list_temp"),
            oActivity=oLayer.find(".getCompanyActivity");

        //监听模板下拉选项框
        oSelect.bind("change",function(){
            _this.getTemByTheme(this,data,oLayer);
        });

        //提交事件
        oSubmit.live("click",function(){
            _this.submitData(data,rs);
        });
    },
    //相关活动函数
    getDataByType:function(obj){
        var _this=this,
            clone=$("#add_subject_newDiv"),
            div=clone.clone(true).attr({"id":""}).css({"display":"block"}),
            moduleType=$(obj).attr("type"),
            articalType=0,
            maxNum=$(obj).attr("maxcount"),
            code=$(obj).attr("code"),
            relatedata=$(obj).attr("relatedata");

            if(relatedata){
                this.CurrentCheckVal=relatedata.split(",");
            }else{
                this.CurrentCheckVal=[];
            }


        if(moduleType==0){
            articalType=$(obj).attr("articaltype");
        }
        data=[];

        $.openDiv({
            width:850,
            height:450,
            title:$(obj).html(),
            div:div
        });

        $.scrollLoadInterval({
            runIn:this,
            scrollObj:div,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:div,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getSubjectActivityPage",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"PageIndex",         //翻页需要传递的参数id    @param:str
            searchData:{
                Type:moduleType,
                ArticleType:articalType
            }
        });

        this.bindCheckbox(obj,div,maxNum,code,this.CurrentCheckVal)

    },
    //根据返回得数据默认选中checkbox
    PitchOnCheckboxByData:function(obj,data){
        if(data.length>0){
            var aInput=obj.find("input[name=checkbox]");
            for(var i= 0,j=data.length;i<j;i++){
                for(var m= 0,n=aInput.length;m<n;m++){
                    if(data[i]==$(aInput[m]).val()){
                        $(aInput[m]).attr({"checked":true});
                    }
                }
            }
        }
    },
    //绑定数据
    IterationData:function(rs){
        var oParent=$(".add_subject_newDiv");
        if(rs.length>0){
            data=data.concat(rs);
            oParent.html("");
            CREATE_LIST.init(oParent);

            this.PitchOnCheckboxByData(oParent,this.CurrentCheckVal);
        }else{
            oParent.html("没有相关内容！");
        }
    },
    //checkbox选中事件绑定
    bindCheckbox:function(obj,oParent,maxNum,code,arr){
        var _this=this,
            checkArr=arr,
            aCheckbox=oParent.find("input[name=checkbox]");


        aCheckbox.die("click");
        aCheckbox.live("click",function(){
            _this.checkEvent(obj,this,maxNum,oParent,checkArr,code);
        });
    },
    //checkbox事件
    checkEvent:function(oParentObj,obj,maxNum,oParent,checkArr,code){
        var len=oParent.find("input:checked").length;

        if(len>maxNum){
            $(obj).attr({"checked":false});
            alert("不能超出最大选择数"+maxNum);
        }else{
            if($(obj).is(":checked")){
                if(!this.isInArray($(obj).val(),checkArr)){
                    checkArr.push($(obj).val());
                }
            }else{
                if(this.isInArray($(obj).val(),checkArr)){
                    this.removeValueInArr($(obj).val(),checkArr)
                }
            }
        }
        $(oParentObj).attr({"relatedata":checkArr});
        this.RelateDataJson[code]=checkArr;
    },
    //删除数组中指定的字符
    removeValueInArr:function(n,arr){
        var index;
        if(arr){
            if(typeof arr[0]=="string"){
                index=arr.indexOf(n);
            }else{
                index=arr.indexOf(parseInt(n));
            }

            if(index>-1){
                arr.splice(index,1);
            }
        }
        return arr;
    },
    //判断数组中是否包含某个元素
    isInArray:function(n,arr){
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i] == n){
                return true;
            }
        }
        return false;
    },
    //根据专题模版 获取不同的数据
    getTemByTheme:function(obj,data,oLayer){
        var code=this.CurrentData.ActivityTemplate || {},
            value=$(obj).val();

        oLayer.html("");
        this.loadTemData(oLayer,data[value-1]);

        this.CurrentDataIndex=value;

    },
    //加载有数据时候得模板
    loadTemData:function(oLayer,data){
        var _this=this,
            oTemAttr=$("<div style='width: 100%; height: auto;'></div>"),
            oTemModules=$("<div style='width: 100%; height: auto;'></div>");

        if(data){
            oLayer.prepend($("<h3 style='font-size: 16px; color: #09f;'>模板属性</h3>"));

            this.temProperties=new CREATE_INPUT({
                data:_this.createTableByData(data.Properties),
                body:oLayer
            });

            oLayer.append(oTemAttr);
            oLayer.append(oTemModules);
//        oTemModules.append(oTemplate);

            //this.createTableByModules(data.Modules,oTemplate);

            oTemModules.append(this.createTableByModules(data.Modules));

            this.aboutbindEvent();
        }

    },
    //抓去数据中的code
    getCodeByData:function(data){
        var dataArr=[];
        for(var i= 0,j=data.length;i<j;i++){
            dataArr.push(data[i].Code);
        }
        return dataArr;
    },
    //抓取数据中的模板名字
    getTemplateName:function(data){
        var dataArr=[];
        for(var i= 0,j=data.length;i<j;i++){
            dataArr.push(data[i].Name);
        }
        return dataArr;
    },
    //将数组转化为数组对象
    //[{id:0,val:"成都",select:false},{id:1,val:"上海",select:true}]
    arr2Object:function(arr,arr1){
        var dataArr=[];
        dataArr.push({id:0,val:"请选择",select:true})
        for(var i= 0,j=arr.length;i<j;i++){
            var c={};
            c.id=i+1;
            c.val=arr[i];
            c.select=false;
            c.code=arr1[i];
            dataArr.push(c);
        }
        return dataArr;
    },
    //提交数据
    submitData:function(ModulesData,rs){
        var data=rs || {},
            dataCC=this.cc.getData(),
            IsTemplateActivity=false,
            IsTopShow=false,
            ActivityImage=[],
            ActivityTemplate={},
            DStartDate= 0,
            DEndDate= 0,
            ShowOrder= 0,
            temCode="",
            Modules=[],
            Properties=[],
            temData=[],
            temArr=[],
            temDataArr=[];

        this.CurrentDataIndex=parseInt(this.bb.getData().ActivityTemplate);
        if(this.CurrentDataIndex!=0){
            temCode=ModulesData[this.CurrentDataIndex-1].Code;
            temData=ModulesData[this.CurrentDataIndex-1].Modules;
            IsTemplateActivity=true;
            for(var i= 0,j=temData.length;i<j;i++){
                temArr.push(temData[i].Code);
                var name="dataName"+i;
                temDataArr.push(this[name].getData());
            }

            this.data2Json(this.temProperties.getData(),Properties);
            this.data2JSONData(temDataArr,Modules,temArr);
        }

        if(temCode!=""){
            ActivityTemplate.Code=temCode;
            ActivityTemplate.Modules=Modules;
            ActivityTemplate.Properties=Properties;
        }

        if(dataCC.IsTopShow.length!=0){
            IsTopShow=true;
        }

        if(dataCC.UploadPathbig[0]!=undefined){
            ActivityImage.push(this.dataInToJson(dataCC.UploadPathbig[0]));
        }
        if(dataCC.UploadPathWell[0]!=undefined){
            ActivityImage.push(this.dataInToJson(dataCC.UploadPathWell[0]));
        }
        if(dataCC.UploadPathsmall[0]!=undefined){
            ActivityImage.push(this.dataInToJson(dataCC.UploadPathsmall[0]));
        }

        if(dataCC.StartDate){
            DStartDate= $.time2stamp(dataCC.StartDate);
        }else{
            DStartDate="";
        }
        if(dataCC.EndDate){
            DEndDate= $.time2stamp(dataCC.EndDate);
        }else{
            DEndDate="";
        }


        ShowOrder=parseInt(dataCC.ShowOrder);

        var data={};
        delete dataCC.UploadPathWell;
        delete dataCC.UploadPathbig;
        delete dataCC.UploadPathsmall;

        data= $.extend(
            this.aa.getData(),
            dataCC,
            {"IsTemplateActivity":IsTemplateActivity},
            {"IsTopShow":IsTopShow},
            {"ActivityImage":ActivityImage},
            {"ActivityTemplate":ActivityTemplate},
            {"StartDate":DStartDate},
            {"EndDate":DEndDate},
            {"ShowOrder":ShowOrder}
        );
        if(DEndDate>DStartDate){
            if(this.pageType=="add"){
                top.AJAX.addShopSpecialDetail({
                    data:data,
                    callback:function(){
                        alert("添加成功!");
                        top.O2O.refreshWindow("6");
                        top.O2O.closeWindow("subAdd");
                    }
                });
            }else{
                var EditData={},
                    ActivityId=rs.ActivityId;
                EditData= $.extend(data,{"ActivityId":ActivityId});
                top.AJAX.editShopSpecialDetail({
                    data:EditData,
                    callback:function(){
                        alert("修改成功!");
                        top.O2O.refreshWindow("6");
                        top.O2O.closeWindow("subEdit");
                    }
                });
            }
        }else{
            alert("结束时间必须大于开始时间!");
        }
    },
    //组装模板属性数据
    data2Json:function(temOne,Properties){
        for(var name in temOne){
            var c={};
            c.Column=name;
            if(name=="ActivityBgImgID"){
                if(temOne[name][0]==undefined){
                    temOne[name][0]="";
                }
                c.PropertityValue=temOne[name][0]+"|"+window.location.href;
            }else{
                c.PropertityValue=temOne[name];
            }
            Properties.push(c);
        }
    },
    //组装Moudles数据
    data2JSONData:function(temArr,Modules,codeTwoArr){
        for(var i= 0,j=temArr.length;i<j;i++){
            var d={},
                ProArr=[];
            if(!$.isEmptyObject(temArr[i])){
                for(var name in temArr[i]){
                    var e={};
                    e.Column=name;
                    if(name=="ModuleImgID"){
                        if(temArr[i][name][0]==undefined){
                            temArr[i][name][0]="";
                        }
                        e.PropertityValue=temArr[i][name][0]+"|"+window.location.href;
                    }else{
                        e.PropertityValue=temArr[i][name];
                    }
                    ProArr.push(e);
                }
            }

            d.Code=codeTwoArr[i];
            if(this.RelateDataJson[codeTwoArr[i]]==undefined){
                d.RelateData=[];
            }else{
                d.RelateData=this.RelateDataJson[codeTwoArr[i]];
            }
            d.Properties=ProArr;
            Modules.push(d);
        }
    },
    //根据URL取出相关字段数组
    getArrByURL:function(url){
        if(url.indexOf("&")!=-1){
            var arr=url.split("&"),
                arr1=[],
                arr2=[];
            for(var i= 0,j=arr.length;i<j;i++){
                arr1=arr[i].split("=");
                arr2.push(arr1[1]);
            }
            return arr2;
        }
    },
    //将数据转化为Checkbox的数组
    getArrByData:function(data){
        var arr=[],
            c={};
        //[{id:0,val:"默认不显示",select:false}]
        c.id=0;
        c.val="默认不显示";
        c.select=data;
        arr.push(c);

        return arr;
    },
    //确定选择的哪个模板
    makeSureWhichTem:function(arr,tem){
        for(var i= 0,j=arr.length;i<j;i++){
            arr[i].select=false;
            if(arr[i].val==tem){
                arr[i].select=true;
            }else{
                arr[0].select=true;
            }
        }
        return arr;
    },
    //字符串转为数组
    str2Arr:function(str){
        var arr=[];
        if(str){
            arr.push(str);
        }
        return arr;
    },
    //根据数据创建表单
    createTableByData:function(data){
        var arr=[];
        for(var i= 0,j=data.length;i<j;i++){
            var c={};
            c.title=data[i].Name;
            c.type=top.O2O.inputType[data[i].Control];
            c.id=data[i].Column;
            c.isMust=data[i].Required;
            if(data[i].Height){
                c.msg="请按以下标准上传图片,大小"+data[i].Width+"*"+data[i].Height;
                c.maxNumber=1;
                if(data[i].PropertityValue){
                    if(data[i].PropertityValue==""){
                        c.val=[];
                    }else{
                        c.val=[data[i].PropertityValue];
                    }
                }else{
                    c.val=[];
                }
            }else{
                c.msg="";
                if(data[i].Column=="ActivityArea"){
                    c.val=parseInt(data[i].PropertityValue);
                }else{
                    c.val=data[i].PropertityValue;
                }
            }

        arr.push(c);
        }
        return arr;
    },
    //根据modules创建表单
    createTableByModules:function(data){
        var oTemplate=$("<div style='width: 100%; height: auto;'></div>");
        for(var i= 0,j=data.length;i<j;i++){
            var oModu=$("<div style='width: 100%; height: auto;'></div>"),
                dataName="dataName"+i;
            oModu.append($("<h3 style='font-size: 14px; color: #09f; padding-left: 20px; margin: 10px 0;'>"+data[i].Name+"</h3>"));

            this[dataName]=new CREATE_INPUT({
                data:this.createTableByData(data[i].Properties),
                body:oModu
            });
            if(data[i].RelateData){
                oModu.append($("<a class='getCompanyActivity' RelateData='"+data[i].RelateData+"' code='"+data[i].Code+"' articaltype='"+data[i].ArticleType+"' type='"+data[i].ModuleType+"' maxCount='"+data[i].MaxContentCount+"'style='display:block;width: 140px; height:30px; line-height: 30px; background: #09f; color: #fff; padding-left: 20px; margin-left: 20px;'>请选择"+data[i].Name+"相关活动</a>"));
            }else{
                oModu.append($("<a class='getCompanyActivity' code='"+data[i].Code+"' articaltype='"+data[i].ArticleType+"' type='"+data[i].ModuleType+"' maxCount='"+data[i].MaxContentCount+"'style='display:block;width: 140px; height:30px; line-height: 30px; background: #09f; color: #fff; padding-left: 20px; margin-left: 20px;'>请选择"+data[i].Name+"相关活动</a>"));
            }
            oModu.append($("<span style='margin-left: 20px;'>内容图片建议大小为：220px * 165px</span>"));
            oTemplate.append(oModu);

        }
        return oTemplate;
    },
    //获取选择相关活动中要被选中的数据
    getRelateData:function(){
        if(this.pageType=="mdf"){
            var arr=[],
                Modules=this.CurrentData.ActivityTemplate.Modules || [];
            for(var i= 0,j=Modules.length;i<j;i++){
                arr.push(Modules[i].RelateData);
            }
            return arr;
        }
    },
    //将数据转化为数组
    dataInToJson:function(data){
        if(data==undefined){
            data="";
        }
        var c={};
        c.UploadPath=data;
        c.UploadPageUrl=window.location.href;
        return c;
    }
};

