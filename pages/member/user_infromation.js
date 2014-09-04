/**
 * Created by hugly on 14-8-20.
 */
titleDetail=[
    {title:"用户名",type:"link",width:210,key:"UserName",fun:[aa]},
    {title:"用户昵称",type:"link",width:210,key:"NickName",fun:[aa]},
    {title:"当前积分",type:"word",width:120,key:"CurrentPoint"},
    {title:"累计积分",type:"word",width:100,key:"TotalPoint"},
    {title:"当前游戏次数",type:"word",width:130,key:"GameNum"},
    {title:"是否冻结",type:"dis",width:80,key:"IsFrozen",fun:[cc],aValue:["是","否"]}
];
data=[];

function aa(obj,data){
    top.O2O.openNewWindow({
        title:"用户积分流水",        //@param,  str
        url:"pages/member/user_ingegral.html?id="+data.UserId,          //@param,  str
        width:900,        //@param,  int
        height:600        //@param,  int
    });
}
//是否冻结
function cc(obj,data){

}

$(document).ready(function(){
    USERINFROMATION.init();
});
USERINFROMATION={
    //搜索关键字
    searchKey:"",
    //初始化
    init:function(){
        if(window.location.href.indexOf("searchKey")!=-1){
            var key=window.location.href.substr(window.location.href.indexOf("searchKey"));
            this.searchKey=decodeURI(key.substr(key.indexOf("=")+1));
            $("#search_user_infromation_query").prev().val(this.searchKey);
        }
        this.getData();
        this.bindEvent();
    },
    //获取数据
    getData:function(){
        var _this=this,
            obj=$("#user_infromation_list_layer");
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:obj,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:obj,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getUserInfroContain",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"pointId",         //翻页需要传递的参数id    @param:str
            searchData:{                    //查询条件的json
                queryKey:_this.searchKey
            }
        });
    },
    //数据迭代
    IterationData:function(rs){
        data=data.concat(rs);
        var oParent=$("#user_infromation_list_layer");
        CREATE_LIST.init(oParent);
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oSearch=$("#search_user_infromation_query");
        oSearch.click(function(){
            _this.searchEvent(this);
        });
    },
    //搜索事件
    searchEvent:function(obj){
        this.searchKey=$(obj).prev().val();
        window.location.href="user_infromation.html?mainid=9&searchKey="+this.searchKey;
    }
};