/**
 * Created by hugly on 14-8-20.
 */
titleDetail=[
    {title:"规则名称",type:"word",width:210,key:"BaseName"},
    {title:"规则变动类型值",type:"word",width:160,key:"ChangeTypeVal"},
    {title:"规则变动值",type:"word",width:120,key:"ChangeVal"},
    {title:"规则变动描述",type:"word",width:220,key:"ChangeNote"},
    {title:"规则变动时间",type:"time",width:140,key:"ChangeDate"}
];
data=[];

$(document).ready(function(){
    USERINGEGRAL.init();
});
USERINGEGRAL={
    //搜索关键字
    searchKey:"",
    //开始时间
    startTime:"",
    //结束时间
    endTime:"",
    //初始化
    init:function(){
        var dataArr=[];
        dataArr=this.getArrByUrl(window.location.href);
        if(dataArr.length>1){
            this.searchKey=dataArr[1];
            this.startTime=dataArr[2] || "";
            this.endTime=dataArr[3] || "";
        }else{
            this.searchKey=dataArr[0];
        }
        if(this.startTime!=""){
            $("#search_user_ingegral_start_time").val($.stamp2date(this.startTime));
        }else{
            $("#search_user_ingegral_start_time").val("");
        }
        if(this.endTime!=""){
            $("#search_user_ingegral_end_time").val($.stamp2date(this.endTime));
        }else{
            $("#search_user_ingegral_end_time").val("");
        }

        this.getData();
        this.dataContral();
        this.bindEvent();
    },
    //获取数据
    getData:function(){
        var _this=this,
            obj=$("#user_ingegral_list_layer");
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:obj,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:obj,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getCurrentUserInfro",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"pointHistoryId",         //翻页需要传递的参数id    @param:str
            searchData:{                    //查询条件的json
                userId:_this.searchKey,
                begTime:_this.startTime,
                endTime:_this.endTime
            }
        });
    },
    //迭代数据
    IterationData:function(rs){
        data=data.concat(rs);
        var oParent=$("#user_ingegral_list_layer");
        CREATE_LIST.init(oParent);

    },
    //日历控件
    dataContral:function(){
        $("#search_user_ingegral_start_time").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
        $("#search_user_ingegral_end_time").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: "-10Y",
            maxDate: "10Y",
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-60:c+60'
        });
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oSearch=$("#search_user_ingegral_query"),
            oStartTime=$("#search_user_ingegral_start_time"),
            oEndTime=$("#search_user_ingegral_end_time");

        //搜索事件
        oSearch.click(function(){
            _this.searchEvent(this,oStartTime,oEndTime);
        });

    },
    //搜索事件
    searchEvent:function(obj,oStartTime,oEndTime) {
        this.startTime= $.time2stamp(oStartTime.val());
        this.endTime= $.time2stamp(oEndTime.val());


        if(this.startTime==-2211782400000){
            this.startTime="";
        }
        if(this.endTime==-2211782400000){
            this.endTime="";
        }
        window.location.href="user_ingegral.html?mainid=9&id="+this.searchKey+"&begTime="+this.startTime+"&endTime="+this.endTime;
    },
    //解析url里面得数据
    getArrByUrl:function(url){
        var arr1=[],
            arr2=[],
            data=[];
        if(url.indexOf("&")==-1){
            arr1=url.split("?");
            arr2=arr1[1].split("=");
            data.push(arr2[1]);
        }else{
            arr1=url.split("&");
            for(var i= 0,j=arr1.length;i<j;i++){
                data.push(arr1[i].split("=")[1]);
            }
        }
        return data;
    }
};