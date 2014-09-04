/**
 * Created by hugly on 14-8-19.
 */
titleDetail=[
    {title:"游戏名称",type:"word",width:150,key:"GameName"},
    {title:"会员ID",type:"word",width:150,key:"UserID"},
    {title:"会员名",type:"word",width:200,key:"UserName"},
    {title:"奖励类型",type:"word",width:120,key:"AwardTypeName"},
    {title:"奖励物品名称",type:"word",width:120,key:"AwardName"},
    {title:"订单号码",type:"word",width:200,key:"OrderID"},
    {title:"奖励时间",type:"time",width:200,key:"AwardTime"}
];
data=[];

$(document).ready(function(){
    AWARDRECORD.init();
});
AWARDRECORD={
    gameID:0,
    memberID:"",
    memberName:"",
    startData:"",
    endData:"",
    //初始化
    init:function(){
        var arr=this.getArrByURL(window.location.href) || [];

        if(arr[0]){
            this.gameID=arr[0];
        }
        if(arr[1]){
            this.memberID=parseInt(arr[1]);
        }
        if(arr[2]){
            this.memberName=decodeURI(arr[2]);
        }
        if(arr[3]){
            this.startData= parseInt(arr[3]);
        }
        if(arr[4]){
            this.endData= parseInt(arr[4]);
        }

        this.bindDateControl();
        this.getDataBylist();
        this.getListByGame();
        this.bindEvent();
    },
    //初始化搜索选项
    initCheckViews:function(){
        var oParent=$("#award_records_list");
        oParent.find("#blongsGame").val(this.gameID);
        oParent.find(".search_award_records_list_search_ID").val(this.memberID);
        oParent.find(".search_award_records_list_search_Name").val(this.memberName);
        if(this.startData){
            oParent.find("#search_award_records_list_search_StartTime").val($.stamp2date(this.startData));
        }else{
            oParent.find("#search_award_records_list_search_StartTime").val("");
        }
        if(this.endData){
            oParent.find("#search_award_records_list_search_EndTiem").val($.stamp2date(this.endData));
        }else{
            oParent.find("#search_award_records_list_search_EndTiem").val("");
        }
    },
    //绑定日历控件
    bindDateControl:function(){
        $("#search_award_records_list_search_StartTime").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
        $("#search_award_records_list_search_EndTiem").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
    },
    //获取列表数据
    getDataBylist:function(){
        var _this=this,
            obj=$("#award_records_list_layer");
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:obj,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:obj,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getCompanyGameAwardList",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"gameHistoryID",         //翻页需要传递的参数id    @param:str
            searchData:{                    //查询条件的json
                gameId:_this.gameID,
                userId:_this.memberID,
                userName:_this.memberName,
                startDate:_this.startData,
                endDate:_this.endData
            }
        });
    },
    //绑定列表数据
    IterationData:function(rs){
        data=data.concat(rs);
        var oParent=$("#award_records_list_layer");
        CREATE_LIST.init(oParent);
    },
    //获取游戏列表数据
    getListByGame:function(){
        var _this=this;
        top.AJAX.getGameRewardsGameList({
            data:{
                isAll:1
            },
            callback:function(rs){
                _this.createGameList(_this.dataToJsonArr(rs));
                _this.initCheckViews();
            }
        });
    },
    //将获取得数据转化为数组json
     dataToJsonArr:function(data){
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
    //生成所属游戏列表
    createGameList:function(data){
        var div=$("#blongsGame");
        for(var i=0,j=data.length;i<j;i++){
            var option=$("<option value='"+data[i].id+"'>"+data[i].val+"</option>");
            div.append(option);
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oSearch=$("#search_award_records_query");
        //搜索事件
        oSearch.live("click",function(){
            _this.searchEvent(this);
        });
    },
    //搜索
    searchEvent:function(obj){
        var oParent=$(obj).parent();
        this.gameID=oParent.find("#blongsGame").val();
        this.memberID=oParent.find(".search_award_records_list_search_ID").val();
        this.memberName=oParent.find(".search_award_records_list_search_Name").val();
        this.startData=$.time2stamp(oParent.find("#search_award_records_list_search_StartTime").val());
        this.endData=$.time2stamp(oParent.find("#search_award_records_list_search_EndTiem").val());

        window.location.href="award_records.html?gameID="+this.gameID+"&memberID="+this.memberID+"&memberName="+this.memberName+"&startData="+this.startData+"&endData="+this.endData;
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
    }
};