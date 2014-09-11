/**
 * Created by hugly on 14-8-19.
 */
titleDetail=[
    {title:"游戏名称",type:"word",width:230,key:"GameName"},
    {title:"限制类型",type:"word",width:150,key:"RestrictTypeName"},
    {title:"最大游戏次数",type:"word",width:120,key:"MaxPlayCount"},
    {title:"PC赞助商名称",type:"word",width:230,key:"PcSponsorName"},
    {title:"PC赞助商商品名称",type:"word",width:230,key:"PcSponsorProductName"},
    {title:"操作",type:"operaType",width:180,key:"",opera:["编辑"],fun:[aa]}
];
data=[];
//编辑
function aa(obj,data){
    top.AJAX.getCompanyGameDetail({
        data:{
            settingId:data.SettingId
        },
        callback:function(rs){
            NUMBERMANAGEMENT.editGameDetail(rs);
        }
    });
}

$(document).ready(function(){
    NUMBERMANAGEMENT.init();
});
NUMBERMANAGEMENT={
    //数据验证
    isGo:false,
    //初始化
    init:function(){
        var oParent=$("#number_management_list_layer");
        this.bindEvent();
        this.getGameList();
    },
    //初始化游戏设置数据
    initGameSet:function(){
        var _this=this;
        top.AJAX.initalGameSetting({
            callback:function(rs){
                alert("初始化完成!");
                _this.getGameList();
            }
        });
    },
    //获取列表数据
    getGameList:function(){
        top.AJAX.getCompanyGameList({
            callback:function(rs){
                data=rs;
                var oParent=$("#number_management_list_layer");
                oParent.html("");
                CREATE_LIST.init(oParent);
            }
        });
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oParent=$("#number_management_list"),
            oInit=oParent.find("#search_number_management_query");

        oInit.click(function(){
            _this.initGameData();
        });
    },
    //数据初始化
    initGameData:function(){
        this.initGameSet();
    },
    //编辑事件
    editGameDetail:function(data){
        var _this=this,
            clone=$("#add_number_management_list_temp"),
            div=clone.clone().attr({"id":""}).css({"display":"block"}),
            selectArr=[],
            PcSponsorIconUrl=[],
            PcSponsorProductIconUrl=[],
            PcBackIconUrl=[];
        $.openDiv({
            width:850,
            height:500,
            title:"编辑商家游戏设置",
            div:div
        });

        selectArr=this.makeSureWhichChecked(data.RestrictType,this.arr2Object(data.RestrictTypeList));

        if(data.PcSponsorIconUrl){
            PcSponsorIconUrl.push(data.PcSponsorIconUrl);
        }
        if(data.PcSponsorProductIconUrl){
            PcSponsorProductIconUrl.push(data.PcSponsorProductIconUrl);
        }
        if(data.PcBackIconUrl){
            PcBackIconUrl.push(data.PcBackIconUrl);
        }

        this.EditDetail=new  CREATE_INPUT({
            data:[
                //text
                {
                    title:"游戏名称",
                    type:"text",
                    id:"GameName",
                    msg:"",
                    isMust:true,
                    val:data.GameName
                },
                //select
                {
                    title:"限制类型",
                    type:"select",
                    id:"RestrictType",
                    msg:"",
                    isMust:true,
                    val:selectArr

//                        {id:0,val:"新手任务",select:true},
//                        {id:1,val:"日常任务",select:false},
//                        {id:1,val:"普通/全部任务",select:false}

                },
                //text
                {
                    title:"最大游戏次数",
                    type:"text",
                    id:"MaxPlayCount",
                    msg:"该段时间内允许用户玩该游戏的次数",
                    isMust:true,
                    val:data.MaxPlayCount
                },
                //text
                {
                    title:"PC赞助商名称",
                    type:"text",
                    id:"PcSponsorName",
                    msg:"PC赞助商名称",
                    isMust:true,
                    val:data.PcSponsorName
                },
                //text
                {
                    title:"赞助商链接",
                    type:"text",
                    id:"PcSponsorUrl",
                    msg:"PC版赞助商链接地址",
                    isMust:true,
                    val:data.PcSponsorUrl
                },
                //text
                {
                    title:"赞助商商品名称",
                    type:"text",
                    id:"PcSponsorProductName",
                    msg:"PC版赞助商商品名称",
                    isMust:true,
                    val:data.PcSponsorProductName
                },
                //imageUpload
                {
                    title:"游戏背景图片",
                    type:"imageUpload",
                    id:"PcBackIconUrl",
                    msg:"PC版赞助商图片,图片格式请上传：.jpg; .png。",
                    isMust:false,
                    maxNumber:1,
                    val:PcBackIconUrl
                },
                //imageUpload
                {
                    title:"赞助商图片",
                    type:"imageUpload",
                    id:"PcSponsorIconUrl",
                    msg:"PC版赞助商图片,图片格式请上传：.jpg; .png。",
                    isMust:false,
                    maxNumber:1,
                    val:PcSponsorIconUrl
                },
                //imageUpload
                {
                    title:"赞助商商品图片",
                    type:"imageUpload",
                    id:"PcSponsorProductIconUrl",
                    msg:"PC版赞助商图片,图片格式请上传：.jpg; .png。",
                    isMust:false,
                    maxNumber:1,
                    val:PcSponsorProductIconUrl
                },
                {
                    title:"规则简介",
                    type:"textarea",
                    id:"RuleDesc",
                    msg:"",
                    isMust:false,
                    val:data.RuleDesc
                }
            ],
            body:div
        });

        var obj=$('<a href="javascript:;" id="submit_add_rule_temp">提交</a>');

        div.append(obj);

        obj.click(function(){
             _this.modifyGameDetail(data);
        });

    },
    //修改当前游戏数据
    modifyGameDetail:function(data){
        var dataJson={},
            oldJson={},
            formData=this.EditDetail.getData(),
            MaxPlayCount= 0,
            RestrictType= 0,
            PcSponsorIconUrl="",
            PcSponsorProductIconUrl="",
            PcBackIconUrl="",
            SettingId= 0,
            PcSponsorIconOldUrl="",
            PcSponsorProductIconOldUrl="",
            PcBackIconOldUrl="",
            UploadPageUrl=window.location.href;


            SettingId=data.SettingId;

            if(data.PcSponsorIconOldUrl==null){
                PcSponsorIconOldUrl="";
            }else{
                PcSponsorIconOldUrl=data.PcSponsorIconOldUrl;
            }

            if(data.PcSponsorProductIconOldUrl==null){
                PcSponsorProductIconOldUrl="";
            }else{
                PcSponsorProductIconOldUrl=data.PcSponsorProductIconOldUrl;
            }

            if(data.PcBackIconOldUrl==null){
                PcBackIconOldUrl="";
            }else{
                PcBackIconOldUrl=data.PcBackIconOldUrl;
            }


            MaxPlayCount=parseInt(formData.MaxPlayCount);
            RestrictType=parseInt(formData.RestrictType);

            if(formData.PcSponsorIconUrl.length!=0){
                PcSponsorIconUrl=formData.PcSponsorIconUrl[0];
            }
            if(formData.PcSponsorProductIconUrl.length!=0){
                PcSponsorProductIconUrl=formData.PcSponsorProductIconUrl[0];
            }
            if(formData.PcBackIconUrl.length!=0){
                PcBackIconUrl=formData.PcBackIconUrl[0];
            }

            oldJson={
                SettingId:SettingId,
                PcSponsorIconOldUrl:PcSponsorIconOldUrl,
                PcSponsorProductIconOldUrl:PcSponsorProductIconOldUrl,
                MaxPlayCount:MaxPlayCount,
                RestrictType:RestrictType,
                PcSponsorIconUrl:PcSponsorIconUrl,
                PcSponsorProductIconUrl:PcSponsorProductIconUrl,
                UploadPageUrl:UploadPageUrl,
                PcBackIconUrl:PcBackIconUrl
            };
            dataJson= $.extend(this.EditDetail.getData(),oldJson);
            if(this.dataCheck(MaxPlayCount,formData)){
                top.AJAX.modifyCompanyGameSetting({
                    data:dataJson,
                    callback:function(){
                        alert("修改成功!");
                        window.location.reload();
                    }
                });
            }
    },
    //数据验证
    dataCheck:function(MaxPlayCount,formData){
        if(MaxPlayCount==""){
            alert("最大游戏次数不能为空!");
            return false;
        }
        if(formData.PcSponsorName==""){
            alert("PC赞助商名称不能为空!");
            return false;
        }
        if(formData.PcSponsorUrl==""){
            alert("赞助商链接不能为空!")
            return false;
        }
        if(formData.PcSponsorProductName==""){
            alert("赞助商商品名称不能为空!");
            return false;
        }else{
            return true;
        }

    },
    //将数组转化为数组对象
    arr2Object:function(arr){
        var dataArr=[];
        for(var i= 0,j=arr.length;i<j;i++){
            var c={};
            c.id=arr[i].Value;
            c.val=arr[i].Text;
            c.select=arr[i].Selected;
            dataArr.push(c);
        }
        return dataArr;
    },
    //确定那一个下拉菜单被选中
    makeSureWhichChecked:function(id,arr){
        for(var i= 0,j=arr.length;i<j;i++){
            arr[i].select=false;
            if(arr[i].id==id){
                arr[i].select=true;
            }
        }
        return arr;
    }

};