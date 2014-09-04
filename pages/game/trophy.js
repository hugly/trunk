/**
 * Created by hugly on 14-8-19.
 */
titleDetail=[
    {title:"所属游戏",type:"word",width:120,key:"GameName"},
    {title:"奖励类型",type:"word",width:100,key:"AwardTypeName"},
    {title:"状态",type:"dis",width:60,key:"AwardStatus",aValue:["有效","无效"]},
    {title:"奖品列表",type:"dis",width:60,key:"AwardShow",aValue:["显示","不显示"]},
    {title:"PC版图片",type:"img",width:130,key:"AwardIconPicUrl"},
    {title:"弹窗图片",type:"img",width:130,key:"AwardIconSmallPicUrl"},
    {title:"奖励内容",type:"word",width:120,key:"AwardName"},
    {title:"奖励数量/分值",type:"word",width:80,key:"AwardValue"},
    {title:"出现概率",type:"word",width:60,key:"AwardAwardProbalityValue"},
    {title:"每天最大出现",type:"word",width:80,key:"AwardCount"},
    {title:"今天出现",type:"word",width:60,key:"AppearCount"},
    {title:"操作",type:"operaType",width:136,key:"",fun:[aa],opera:["编辑"]}
];
data=[];
//编辑
function aa(obj,data){
    var _this=this,
        clone=$("#add_game_list_temp");
    top.AJAX.getCompanyGameAwardSetting({
        data:{
            awardId:data.AwardID
        },
        callback:function(rs){
            TROPHY.addTrophy(clone,rs);
        }
    });
}


$(document).ready(function(){
    TROPHY.init();
});
TROPHY={
    //所属游戏
    gameId:0,
    //奖励类型
    awardType:0,
    //奖品状态
    awardState:-1,
    //列表显示
    awardShow:-1,
    //游戏下拉列表
    gameList:[],
    //游戏奖励类型下拉列表
    gameAwardList:[],
    //关联商品
    relationPro:[],
    //初始化
    init:function(){
        this.getGameList();
        this.bindEvent();
    },
    //获取关键字
    getKeyWords:function(){
        var dataArr=[],
            oGame=$("#belongsGame"),
            oAwardType=$("#awardType"),
            oAwardState=$("#awardState"),
            oListDis=$("#listDisplay");

        dataArr=this.getArrByURL(window.location.href) || [];
        this.gameId=dataArr[0];
        this.awardType=dataArr[1];
        this.awardState=dataArr[2];
        this.awardShow=dataArr[3];

        oGame.val(this.gameId);
        oAwardType.val(this.awardType);
        oAwardState.val(this.awardState);
        oListDis.val(this.awardShow);

        this. getTrophyList();

    },
    //获取奖品管理列表
    getTrophyList:function(){
        var _this=this,
            div=$("#game_list_layer");
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:div,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:div,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getCompanyGameAwardSettingList",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"awardId",         //翻页需要传递的参数id    @param:str
            searchData:{                    //查询条件的json
                gameId:_this.gameId,
                awardType:_this.awardType,
                awardStatus:_this.awardState,
                awardShow:_this.awardShow
            }
        });
    },
    //获取游戏下拉列表
    getGameList:function(){
        var _this=this;
        top.AJAX.getGameRewardsGameList({
            data:{
                isAll:1
            },
            callback:function(rs){
                var obj=$("#belongsGame");
                _this.gameList=_this.exportDataBeSelsect(rs);
                _this.bindDataToPage(_this.gameList,obj);
                _this.getGameAwardList();
            }
        });
    },
    //获取商家可以添加到游戏中的商品
    getCompanyGameProduct:function(val){
        var _this=this;
        top.AJAX.GetCompanyGameProductList({
            data: {
                productName: val
            },
            callback:function(rs){
                _this.relationPro=_this.exportDataBeSelsect(rs);
                _this.getPorductIDByAward(val);
            }
        });
    },
    //获取游戏奖励类型下拉列表
    getGameAwardList:function(){
        var _this=this;
        top.AJAX.getGameAwardTypeList({
            data:{
                isAll:1
            },
            callback:function(rs){
                var obj=$("#awardType");
                _this.gameAwardList=_this.exportDataBeSelsect(rs);
                _this.bindDataToPage(_this.gameAwardList,obj);
                _this.getKeyWords();
            }
        });
    },
    //迭代数据
    IterationData:function(rs){
        var oParent=$("#game_list_layer");
        data=data.concat(rs);
        CREATE_LIST.init(oParent);
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oParent=$("#game_list"),
            //添加新专题活动
            oAdd=oParent.find("#add_game_list"),
            oAwardType=$("#AwardType"),
            clone=$("#add_game_list_temp"),
            oSearch=$("#search_game_query");
        //添加新专题活动
        oAdd.live("click",function(){
            _this.addTrophy(clone);
        });
        //奖励类型change事件
        oAwardType.live("change",function(){
            if($(this).val()==4){
                _this.getPorductIDByAward();
            }else{
                _this.clearLayer();
            }
        });
        //搜索
        oSearch.click(function(){
            _this.searchTrophy(this);
        });
    },
    //清除弹出层
    clearLayer:function(){
        var div=$("#award_product_layer");
        div.html("");
        div.css({"display":"none"});
    },
    //如果奖励类型选择商品做弹出层
    getPorductIDByAward:function(val){
        var _this=this,
            div=$("#award_product_layer");
        div.css({"display":"block"});

        this.ProductValue=new CREATE_INPUT({
            data:[
                //select
                {
                    title:"关联商品",
                    type:"select",
                    id:"productList",
                    msg:"",
                    isMust:true,
                    val:_this.relationPro
                },
                //text
                {
                    title:"商品名称",
                    type:"text",
                    id:"productName",
                    msg:"",
                    isMust:true,
                    val:val
                }
            ],
            body:div
        });
        var obj=$('<a href="javascript:;" id="search_Porduct_inAwardSetting">查询</a>');
        obj.click(function(){
            _this.getCompanyGameProduct($(this).prev().find("#productName").val());
            div.html("");
        });
        div.append(obj);
    },
    //专题添加
    addTrophy:function(clone,data){
        var _this=this,
            div=clone.clone().attr({id:""}).css({display:"block"}),
            gamelist=[],
            gameAwardList=[],
            AwardStatus=[
                {id:0,val:"无效",select:true},
                {id:1,val:"有效",select:false}
            ],
            AwardShow=[
                {id:0,val:"不显示",select:true},
                {id:1,val:"显示",select:false}
            ],
            AwardIconSmallPicUrl=[],
            AwardIconPicUrl=[];

            this.gameList=this.initSelect(this.gameList);
            this.gameAwardList=this.initSelect(this.gameAwardList);

        $.openDiv({
            width:820,
            height:500,
            title:"添加游戏奖励",
            div:div
        });
        if(data){

            gamelist=this.exportDataBeSelsectById(this.gameList,data.GameId);
            gameAwardList=this.exportDataBeSelsectById(this.gameAwardList,data.AwardType);
            AwardStatus=this.exportDataBeSelsectById(AwardStatus,data.AwardStatus);
            AwardShow=this.exportDataBeSelsectById(AwardShow,data.AwardShow);

            if(data.AwardIconSmallPicUrl){
                AwardIconSmallPicUrl.push(data.AwardIconSmallPicUrl);
            }
            if(data.AwardIconPicUrl){
                AwardIconPicUrl.push(data.AwardIconPicUrl);
            }

            if(data.ProductID){
                this.getProductById(data.ProductID);
            }

            _this.TrophyAward= new CREATE_INPUT({
                data:[
                    //select
                    {
                        title:"所属游戏",
                        type:"select",
                        id:"GameId",
                        msg:"",
                        isMust:true,
                        val:gamelist
                    },
                    //select
                    {
                        title:"奖励类型",
                        type:"select",
                        id:"AwardType",
                        msg:"",
                        isMust:true,
                        val:gameAwardList
                    }
                ],
                body:div
            });

            var oProduct=$("<div id='award_product_layer'></div>");
            div.append(oProduct);

            _this.TrophyList=new CREATE_INPUT({
                data:[
                    //text
                    {
                        title:"出现概率",
                        type:"text",
                        id:"AwardProbality",
                        msg:"如果概率为10％,则填10,支持两位小数,填0,用户不能翻出奖品。哭脸＝100%－其它概率之和",
                        isMust:true,
                        val:data.AwardProbality
                    },
                    //text
                    {
                        title:"出现次数",
                        type:"text",
                        id:"AwardCount",
                        msg:"每天出现次数上限,填0表示不限制。",
                        isMust:true,
                        val:data.AwardCount
                    },
                    //text
                    {
                        title:"奖品名称",
                        type:"text",
                        id:"AwardName",
                        msg:"",
                        isMust:true,
                        val:data.AwardName
                    },
                    //text
                    {
                        title:"奖励值",
                        type:"text",
                        id:"AwardValue",
                        msg:"碎片数量、积分分值、商品数量、游戏次数",
                        isMust:true,
                        val:data.AwardValue
                    },
                    //select
                    {
                        title:"奖品状态",
                        type:"select",
                        id:"AwardStatus",
                        msg:"",
                        isMust:true,
                        val:AwardStatus
                    },
                    //select
                    {
                        title:"奖品列表",
                        type:"select",
                        id:"AwardShow",
                        msg:"奖品在列表中是否显示",
                        isMust:true,
                        val:AwardShow
                    },
                    //imageUpload
                    {
                        title:"PC端图片",
                        type:"imageUpload",
                        id:"AwardIconSmallPicUrl",
                        msg:"请上传一张奖品背景图,大小小于500k。格式:.jpg,.png。",
                        isMust:false,
                        maxNumber:1,
                        val:AwardIconSmallPicUrl
                    },
                    //imageUpload
                    {
                        title:"弹窗图片",
                        type:"imageUpload",
                        id:"AwardIconPicUrl",
                        msg:"请上传一张奖品背景图,大小小于500k。格式:.jpg,.png。",
                        isMust:false,
                        maxNumber:1,
                        val:AwardIconPicUrl
                    }
                ],
                body:div
            });

        }else{
            _this.TrophyAward= new CREATE_INPUT({
                data:[
                    //select
                    {
                        title:"所属游戏",
                        type:"select",
                        id:"GameId",
                        msg:"",
                        isMust:true,
                        val:_this.gameList
                    },
                    //select
                    {
                        title:"奖励类型",
                        type:"select",
                        id:"AwardType",
                        msg:"",
                        isMust:true,
                        val:_this.gameAwardList
                    }
                ],
                body:div
            });
            var oProduct=$("<div id='award_product_layer'></div>");
            div.append(oProduct);

            _this.TrophyList=new CREATE_INPUT({
                data:[
                    //text
                    {
                        title:"出现概率",
                        type:"text",
                        id:"AwardProbality",
                        msg:"如果概率为10％,则填10,支持两位小数,填0,用户不能翻出奖品。哭脸＝100%－其它概率之和",
                        isMust:true,
                        val:""
                    },
                    //text
                    {
                        title:"出现次数",
                        type:"text",
                        id:"AwardCount",
                        msg:"每天出现次数上限,填0表示不限制。",
                        isMust:true,
                        val:""
                    },
                    //text
                    {
                        title:"奖品名称",
                        type:"text",
                        id:"AwardName",
                        msg:"",
                        isMust:true,
                        val:""
                    },
                    //text
                    {
                        title:"奖励值",
                        type:"text",
                        id:"AwardValue",
                        msg:"碎片数量、积分分值、商品数量、游戏次数",
                        isMust:true,
                        val:""
                    },
                    //select
                    {
                        title:"奖品状态",
                        type:"select",
                        id:"AwardStatus",
                        msg:"",
                        isMust:true,
                        val:[
                            {id:0,val:"无效",select:true},
                            {id:1,val:"有效",select:false}
                        ]
                    },
                    //select
                    {
                        title:"奖品列表",
                        type:"select",
                        id:"AwardShow",
                        msg:"奖品在列表中是否显示",
                        isMust:true,
                        val:[
                            {id:0,val:"不显示",select:true},
                            {id:1,val:"显示",select:false}
                        ]
                    },
                    //imageUpload
                    {
                        title:"PC端图片",
                        type:"imageUpload",
                        id:"AwardIconSmallPicUrl",
                        msg:"请上传一张奖品背景图,大小小于500k。格式:.jpg,.png。",
                        isMust:false,
                        maxNumber:1,
                        val:[]
                    },
                    //imageUpload
                    {
                        title:"弹窗图片",
                        type:"imageUpload",
                        id:"AwardIconPicUrl",
                        msg:"请上传一张奖品背景图,大小小于500k。格式:.jpg,.png。",
                        isMust:false,
                        maxNumber:1,
                        val:[]
                    }
                ],
                body:div
            });

        }

        var obj=$('<a href="javascript:;" id="submit_add_subject_list_temp">提交</a>');

        obj.click(function(){
            _this.submitData(data);
        });

        div.append(obj);
    },
    //根据productid获取相关数据
    getProductById:function(id){
        var _this=this;
        top.AJAX.GetCompanyGameProductListById({
            data:{
                ProductID:id
            },
            callback:function(rs){
                _this.createProductDom(rs);
            }
        });
    },
    //创建dom
    createProductDom:function(data){
        var _this=this,
            div=$("#award_product_layer");
        div.css({"display":"block"});

        this.ProductValue=new CREATE_INPUT({
            data:[
                //select
                {
                    title:"关联商品",
                    type:"select",
                    id:"productList",
                    msg:"",
                    isMust:true,
                    val:_this.exportDataBeSelsect(data)
                },
                //text
                {
                    title:"商品名称",
                    type:"text",
                    id:"productName",
                    msg:"",
                    isMust:true,
                    val:""
                }
            ],
            body:div
        });
        var obj=$('<a href="javascript:;" id="search_Porduct_inAwardSetting">查询</a>');
        obj.click(function(){
            _this.getCompanyGameProduct($(this).prev().find("#productName").val());
            div.html("");
        });
        div.append(obj);
    },
    //初始化select菜单
    initSelect:function(data){
        for(var i= 0,j=data.length;i<j;i++){
            data[i].select=false;
        }
        return data;
    },
    //将data输出成select菜单
    exportDataBeSelsect:function(data){
        var arr=[];
        for(var i= 0,j=data.length;i<j;i++){
            var c={};
            c.id=data[i].Value;
            c.val=data[i].Text;
            c.select=data[i].Selected;
            arr.push(c);
        }
        return arr;
    },
    //确定选中data中得哪一个被选中
    exportDataBeSelsectById:function(data,id){
        for(var i= 0,j=data.length;i<j;i++){
            data[i].select=false;
            if(parseInt(data[i].id)==id){
                data[i].select=true;
            }
        }
        return data;
    },
    //将输出数据绑定到页面的相应位置
    bindDataToPage:function(data,obj){
        for(var i= 0,j=data.length;i<j;i++){
            var oPtion=$("<option value='"+data[i].id+"'>"+data[i].val+"</option>");
            obj.append(oPtion);
        }
    },
    //搜索事件
    searchTrophy:function(obj){
        var oParent=$(obj).parent(),
            gameId=oParent.find("#belongsGame").val(),
            awardType=oParent.find("#awardType").val(),
            awardStatus=oParent.find("#awardState").val(),
            awardShow=oParent.find("#listDisplay").val();

        window.location.href="trophy.html?gameId="+gameId+"&awardType="+awardType+"&awardStatus="+awardStatus+"&awardShow="+awardShow;
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
    //提交数据
    submitData:function(editData){
        var data={},
            data1=this.TrophyAward.getData(),
            data2={},
            data3=this.TrophyList.getData(),
            AwardIconPicUrl="",
            AwardIconSmallPicUrl="",
            UploadPageUrl=window.location.href,
            ProductID="",
            AwardStatus= 0,
            AwardShow= 0,
            AwardCount= 0,
            AwardProbality= 0,
            AwardType= 0,
            AwardValue= 0,
            GameId=0;

        if(data1.AwardType=="4"){
            data2=this.ProductValue.getData();
            ProductID=parseInt(data2.productList);
        }

        if(data3.AwardIconPicUrl.length!=0){
            AwardIconPicUrl=data3.AwardIconPicUrl[0];
        }

        if(data3.AwardIconSmallPicUrl.length!=0){
            AwardIconSmallPicUrl=data3.AwardIconSmallPicUrl[0];
        }

        AwardStatus=parseInt(data3.AwardStatus);
        AwardShow=parseInt(data3.AwardShow);
        AwardCount=parseInt(data3.AwardCount);
        AwardProbality=parseInt(data3.AwardProbality);
        AwardType=parseInt(data1.AwardType);
        AwardValue=parseInt(data3.AwardValue);
        GameId=parseInt(data1.GameId);


        data= $.extend(data1,data2,data3,
            {
                AwardIconPicUrl:AwardIconPicUrl
            },
            {
                AwardIconSmallPicUrl:AwardIconSmallPicUrl
            },
            {
                UploadPageUrl:UploadPageUrl
            },
            {
                ProductID:ProductID
            },
            {
                AwardStatus:AwardStatus
            },
            {
                AwardShow:AwardShow
            },
            {
                AwardCount:AwardCount
            },
            {
                AwardProbality:AwardProbality
            },
            {
                AwardType:AwardType
            },
            {
                AwardValue:AwardValue
            },
            {
                GameId:GameId
            }
        );
        if(this.checkData()){
            if(editData){
                var mdfData={},
                    AwardIconOldPicUrl=editData.AwardIconOldPicUrl,
                    AwardIconSmallOldPicUrl=editData.AwardIconSmallOldPicUrl;
                mdfData= $.extend(data,{
                    AwardIconOldPicUrl:editData.AwardIconOldPicUrl,
                    AwardIconSmallOldPicUrl:editData.AwardIconSmallOldPicUrl,
                    AwardID:editData.AwardID
                });
                top.AJAX.EditCompanyGameAwardSetting({
                    data:mdfData,
                    callback:function(){
                        alert("修改成功!");
                        window.location.reload();
                    }
                });
            }else{
                top.AJAX.addCompanyGameAwardSettind({
                    data:data,
                    callback:function(){
                        alert("添加成功!");
                        window.location.reload();
                    }
                });
            }
        }
    },
    //数据验证
    checkData:function() {
        var data1 = this.TrophyAward.getData(),
            data2 = {},
            data3 = this.TrophyList.getData(),
            ProbabilityReg=/^(\d{1,2}|100)(\.\d{1,2})?$/g,
            timeReg=/^\d+$/g,
            aWardReg=/^\d+$/g;


        if(data1.GameId=="0"){
            alert("请选择所属游戏!");
            return false;
        }
        if(data1.AwardType=="0"){
            alert("请选择奖励类型!");
            return false;
        }

        if (data1.AwardType == "4") {
            data2 = this.ProductValue.getData();
            if(data2.productList==""){
                alert("请选择关联商品!");
                return false;
            }
        }

        if(!ProbabilityReg.test(data3.AwardProbality)){
            alert("你输入得出现概率选项不符合规范，请重新输入!");
            return false;
        }

        if(!timeReg.test(data3.AwardCount)){
            alert("你输入得出现次数不符合规范，请重新输入!");
            return false;
        }

        if(data3.AwardName==""){
            alert("你输入得奖品名称不符合规范，请重新输入!");
            return false;
        }
        if(!aWardReg.test(data3.AwardValue)){
            alert("你输入得奖励值不符合规范，请重新输入!");
            return false;
        }else{
            return true;
        }

    }

};