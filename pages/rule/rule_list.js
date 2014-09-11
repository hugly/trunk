/**
 * Created by hugly on 14-8-18.
 */
titleDetail=[
    {title:"积分名称",type:"word",width:222,key:"BaseName"},
    {title:"积分分值",type:"word",width:60,key:"BasePointVal"},
    {title:"积分类型",type:"word",width:120,key:"ChangeTypeVal"},
    {title:"任务类型",type:"word",width:100,key:"BaseRoleTypeVal"},
    {title:"任务图片",type:"img",width:130,key:"BaseLconUrl"},
    {title:"显示状态",type:"dis",width:60,key:"IsShow",fun:[cc],aValue:["显示","不显示"]},
    {title:"操作",type:"opera",width:150,key:"",fun:[aa,bb]}
];
data=[];
//编辑
function aa(obj,data){
    RULE_LIST.getRuleDataById(data.BasePointId);
}

//删除
function bb(obj,data){
    if(confirm("确定删除当前数据？")){
        top.AJAX.delRuleDetail({
            data:{
                basePointId:data.BasePointId
            },
            callback:function(){
                $(obj).parent().parent().remove();
            }
        });
    }
}

//显示/不显示
function cc(obj,data){
    top.AJAX.editRuleDis({
        data:{
            basePointId:data.BasePointId,
            isShow:!data.IsShow
        },
        callback:function(rs){
            var dis=data.IsShow?"不显示":"显示";
            $(obj).text(dis);
            data.IsShow=!data.IsShow;
        }
    });
}
$(document).ready(function(){
    RULE_LIST.init();
    KindEditor.ready(function(){});
});
RULE_LIST={
    //新增还是编辑规则
    pageType:"add",
    //img数组
    imgArr:[],
    //克隆的对象
    clone:null,
    //规则类型
    ruleType:[],
    //规则变动类型
    changeType:[],
    //规则变动ID
    changeID:"",
    //规则角色类型
    roleType:[],
    //规则角色ID
    roleID:"",
    //搜索关键字
    searchKey:"",
    //初始化
    init:function(){
        var oParent=$("#rule_list_layer"),
            valueArr=[];
        valueArr=this.getArrByURL(window.location.href);

        this.searchKey=decodeURI(valueArr[2]);
        this.changeID=valueArr[3];
        this.roleID=valueArr[4];


        if(this.searchKey=="undefined"){
            this.searchKey="";
        }

        if(typeof this.changeID=="undefined"){
            this.changeID="";
        }

        if(typeof this.roleID=="undefined"){
            this.roleID="";
        }


        $("#search_product_query").prev().val(this.searchKey);

        this.getData();
        CREATE_LIST.init(oParent);


    },
    //获取数据
    getData:function(){
        var _this=this;
        top.AJAX.getRuleList({
            data:{
                changeType:this.changeID,
                baseRoleTypeId:this.roleID,
                queryName:this.searchKey
            },
            callback:function(rs){
                data=rs;
                CREATE_LIST.createListData(titleDetail,data);
                _this.getRuleType();
            }
        });
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oParent=$("#rule_list"),
            //添加新积分规则
            oAdd=oParent.find("#add_rule_list"),
            //查询
            oSearch=oParent.find("#search_product_query");

            this.clone=$("#add_rule_temp");
        //添加新积分规则
        oAdd.live("click",function(){
            _this.addRuleDetail(_this.clone);
        });
        //查询
        oSearch.live("click",function(){
            _this.searchList(this);
        });
    },
    //查询
    searchList:function(obj){
        this.searchKey=$(obj).prev().val();
        this.changeID=$("#search_rule_change_type").find("option:checked").attr("id");
        this.roleID=$("#search_rule_role_type").find("option:checked").attr("id");

        window.location.href="rule_list.html?mainid=8&mainid=8&searchkey="+this.searchKey+"&changeID="+this.changeID+"&roleID="+this.roleID;
    },
    //根据id确定选中得option
    getOptionByID:function(id,obj){
        obj.find("option").each(function(){
            if($(this).attr("id")==id){
                $(this).attr({"selected":"true"});
            }
        });
    },
    //新增规则
    addRuleDetail:function(clone,data){
        data=data || {};
        if(data.BasePointId!=undefined){
            this.pageType="mdf";
        }else{
            this.pageType="add";
        }
        var _this=this,
            div=clone.clone().attr({id:""}).css({display:"block"}),
            ruleTypeID=data.BaseTypeId,
            changeTypeID=data.ChangeType,
            roleTypeID=data.BaseRoleTypeId,
            arr=[],
            title="";


        this.ruleType=this.initSelect(this.ruleType);
        this.changeType=this.initSelect(this.changeType);
        this.roleType=this.initSelect(this.roleType);

        if(!data.BaseLconUrl=="" || !data.BaseLconUrl=="undefined"){
            this.imgArr.push(data.BaseLconUrl);
        }
        if(this.pageType=="add"){
            title="添加新规则";
            if(data.BaseName){
                arr=this.screenOption(this.ruleType,ruleTypeID);
            }else{
                arr=this.choseOption(this.ruleType,ruleTypeID);
            }
        }else{
            title="编辑规则";
            //arr.push(data.BaserTypeVal);
            arr.push({id:0,val:data.BaserTypeVal,select:true});
        }

        $.openDiv({
            width:850,
            height:460,
            title:title,
            div:div
        });

        this.bb = new CREATE_INPUT({
            data:[
                //text
                {
                    title:"规则名称",
                    type:"text",
                    id:"BaseName",
                    msg:"长度限制在1-20个字符之间",
                    isMust:true,
                    val:data.BaseName
                },
                //text
                {
                    title:"规则分值",
                    type:"text",
                    id:"BasePointVal",
                    msg:"必须为数字,负数为扣分,最多10位数。",
                    isMust:true,
                    val:data.BasePointVal
                },
                //select
                {
                    title:"规则类型",
                    type:"select",
                    id:"BaseTypeId",
                    msg:"",
                    isMust:true,
                    val:arr

//                        {id:0,val:"新手任务",select:true},
//                        {id:1,val:"日常任务",select:false},
//                        {id:1,val:"普通/全部任务",select:false}

                },
                //select
                {
                    title:"规则变动类型",
                    type:"select",
                    id:"ChangeType",
                    msg:"",
                    isMust:true,
                    val:this.choseOption(this.changeType,changeTypeID)
//                        {id:0,val:"碎片规则",select:true},
//                        {id:1,val:"游戏次数规则",select:false},
//                        {id:2,val:"抢购规则",select:false},
//                        {id:3,val:"兑换规则",select:false},
//                        {id:4,val:"积分规则",select:false},
//                        {id:5,val:"天购币规则",select:false}

                },
                //select
                {
                    title:"规则角色类型",
                    type:"select",
                    id:"BaseRoleTypeId",
                    msg:"",
                    isMust:true,
                    val:this.choseOption(this.roleType,roleTypeID)
//                        {id:0,val:"新手任务",select:true},
//                        {id:1,val:"日常任务",select:false},
//                        {id:1,val:"普通/全部任务",select:false}

                },
                //imageUpload
                {
                    title:"任务规则图标",
                    type:"imageUpload",
                    id:"BaseLconUrl",
                    msg:"请上传一张用户任务规则展示图,大小小于500k。格式:.jpg,.png。",
                    isMust:true,
                    maxNumber:1,
                    val:this.imgArr
                },
                //text
                {
                    title:"来源简述",
                    type:"text",
                    id:"BaseNoteBrief",
                    msg:"长度限制在1-20个字符之间",
                    isMust:true,
                    val:data.BaseNoteBrief
                },
                //super text area
                //            需要先挂载-------------------------------
                //                <link rel="stylesheet" href="../../doc_edit/themes/default/default.css" />
                //                <script charset="utf-8" src="../../doc_edit/kindeditor-min.js"></script>
                //                <script charset="utf-8" src="../../doc_edit/lang/zh_CN.js"></script>
                {
                    title:"目标",
                    type:"superTextArea",
                    id:"BaseNote",
                    msg:"长度限制在1-300个字符之间",
                    isMust:false,
                    val:data.BaseNote
                }

            ],
            body:div
        });

        var obj=$('<a href="javascript:;" id="submit_add_rule_temp">提交</a>');

        div.append(obj);

        obj.click(function(){
            if(data.BaseName){
                _this.modifyRule(data);
            }else{
                _this.addRule();
            }
        });
    },
    //填充select
    fillSelect:function(obj,arr){
        for(var i= 0,j=arr.length;i<j;i++){
            obj.append($("<option id='"+arr[i].id+"'>"+arr[i].val+"</option>"));
        }
    },
    //获取规则类型
    getRuleType:function(){
        var _this=this;
        top.AJAX.getBusinessesRuleType({
            callback:function(rs){
                _this.ruleType=_this.transformationJson(rs);
                _this.getRuleChangeType();
            }
        });
    },
    //获取规则变动类型
    getRuleChangeType:function(){
        var _this=this;
        top.AJAX.getRuleChangeType({
            callback:function(rs){
                _this.changeType=_this.transformationJson(rs);
                _this.getRuleRoleType();
            }
        });
    },
    //获取规则角色类型
    getRuleRoleType:function(){
        var _this=this;
        top.AJAX.getRuleRoleType({
            callback:function(rs){
                var changeType=$("#search_rule_change_type"),
                    roleType=$("#search_rule_role_type");
                _this.roleType=_this.transformationJson(rs);
                _this.fillSelect(changeType,_this.changeType);
                _this.fillSelect(roleType,_this.roleType);
                _this.getOptionByID(_this.changeID,changeType);
                _this.getOptionByID(_this.roleID,roleType);
                _this.bindEvent();
            }
        });
    },
    //将接口返回的数据拼成数组
    transformationJson:function(data){
//      {id:0,val:"新手任务",select:true},
//      {id:1,val:"日常任务",select:false},
//      {id:1,val:"普通/全部任务",select:false}

        var arr=[];
        arr.push({id:-2,val:"请选择",select:true});
        for(var i= 0,j=data.length;i<j;i++){
            var c={};
            c.id=data[i].SwitchPositionId;
            c.val=data[i].SwitchPostitionName;
            c.select=false;
            arr.push(c);
        }
        return arr;
    },
    //根据id获取当前数据
    getRuleDataById:function(id){
        var _this=this;
        top.AJAX.getRuleDetailByKey({
            data:{
                basePointId:id
            },
            callback:function(rs){
                _this.addRuleDetail(_this.clone,rs);
            }
        });
    },
    //判断选中的option
    choseOption:function(arr,id){
        for(var i= 0,j=arr.length;i<j;i++){
            if(arr[i].id==id){
                arr[i].select=true;
            }
        }
        return arr;
    },
    //筛选选中的option
    screenOption:function(arr,id){
        var arr1=[];
        for(var i= 0,j=arr.length;i<j;i++){
            if(arr[i].id==id){
                arr[i].select=true;
                arr1.push(arr[i]);
            }
        }
        return arr1;
    },
    //初始化select选项
    initSelect:function(arr){
        for(var i= 0,j=arr.length;i<j;i++){
            arr[i].select=false;
        }
        return arr;
    },
    //新增规则
    addRule:function(){
        var dataJson={},
            imgJosn={},
            _this=this;

        imgJosn.BaseLconUrl=this.bb.getData().BaseLconUrl[0];

        dataJson= $.extend(this.bb.getData(),imgJosn);


        top.AJAX.addRuleDetail({
            data:dataJson,
            callback:function(){
                alert("新增规则成功!");
                window.location.reload();
            }
        });
    },
    //修改规则
    modifyRule:function(data){
        var _this=this,
            c={},
            dataList;
        c.BaseLcon=data.BaseLcon;
        c.OldBaseLconUrl=data.OldBaseLconUrl;
        c.UploadPageUrl=window.location.href;
        c.BaseTypeId=data.BaseTypeId;
        c.BaseLconUrl=this.bb.getData().BaseLconUrl[0];
        c.BasePointId=data.BasePointId;

        dataList=$.extend(_this.bb.getData(),c);


        if(this.formTest(_this.bb.getData())){
            top.AJAX.modifyRuleDetail({
                data:dataList,
                callback:function(){
                    alert("修改规则成功!");
                    window.location.reload();
                }
            });
        }

    },
    //表单验证
    formTest:function(data){
        var nameReg=/^.{1,20}$/,
            scoreReg=/^-?\d{1,10}$/,
            resumeReg=/^.{1,20}$/,
            targetReg=/^.{0,300}$/;

        if(!nameReg.test(data.BaseName)){
            alert("规则名称输入不符合规范!");
            return false;
        }
        if(!scoreReg.test(data.BasePointVal)){
            alert("规则分值输入不符合规范!");
            return false;
        }
        if(!resumeReg.test(data.BaseNoteBrief)){
            alert("来源简述输入不符合规范!");
            return false;
        }
        if(!targetReg.test(data.BaseNote)){
            alert("目标输入不符合规范!");
            return false;
        }else{
            return true;
        }
    },
    //根据URL取出相关字段数组
    getArrByURL:function(url){
        var arr=url.split("&"),
            arr1=[],
            arr2=[];
        for(var i= 0,j=arr.length;i<j;i++){
            arr1=arr[i].split("=");
            arr2.push(arr1[1]);
        }
        return arr2;
    }
};
