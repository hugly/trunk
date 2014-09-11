/**
 * Created by hugly on 14-8-12.
 */
titleDetail=[
    {title:"专题活动名称",type:"word",width:160,key:"ActivityName"},
    {title:"链接地址",type:"word",width:160,key:"ActivityUrl"},
    {title:"图片",type:"img",width:130,key:"ImageUrl"},
    {title:"活动序号",type:"word",width:60,key:"ShowOrder"},
    {title:"模板名称",type:"word",width:125,key:"ActivityTemplateName"},
    {title:"开始时间",type:"time",width:100,key:"StartDate"},
    {title:"结束时间",type:"time",width:100,key:"EndDate"},
    {title:"是否模板",type:"dis",width:60,key:"IsTemplateActivity",aValue:["是","否"]},
    {title:"是否顶部显示",type:"dis",width:80,key:"IsTopShow",fun:[cc],aValue:["显示","不显示"]},
    {title:"操作",type:"opera",width:150,key:"",fun:[aa,bb]}
];
data=[];
//编辑
function aa(obj,data){
    top.O2O.openNewWindow({
        title:"专题活动",        //@param,  str
        url:"pages/subject/add_Subject_list.html?ActivityId="+data.ActivityId,          //@param,  str
        width:900,        //@param,  int
        height:600        //@param,  int
    },"subEdit");
}

//删除
function bb(obj,data){
    if(confirm("确定删除当前数据?")){
        top.AJAX.delSpecialDetail({
            data:{
                ActivityId:data.ActivityId
            },
            callback:function(rs){
                $(obj).parent().parent().remove();
            }
        });
    }
}

//显示/不显示
function cc(obj,data){

    top.AJAX.modifySpecialDetail({
        data:{
            ActivityId:data.ActivityId,
            IsTopShow:!data.IsTopShow
        },
        callback:function(){
            var dis=data.IsTopShow?"不显示":"显示";
            $(obj).text(dis);
            data.IsTopShow=!data.IsTopShow;
        }
    });
}
$(document).ready(function(){
    SUBJECTLIST.init();
});
SUBJECTLIST={
    //专题名称
    themeName:"",
    //模板名称
    tempName:"",
    //初始化
    init:function(){
        var oParent=$("#subject_list_layer");

        this.getSearchKey();

        this.getData();
        CREATE_LIST.init(oParent);
        this.bindEvent();
    },
    //获取搜索关键字
    getSearchKey:function(){
        var dataArr=[];
        dataArr=this.getArrByURL(window.location.href) || {};
        dataArr[1]=dataArr[1] ||"";
        dataArr[2]=dataArr[2] ||"";
        this.themeName=decodeURI(dataArr[1]);
        this.tempName=decodeURI(dataArr[2]);

        $("#search_subject_list_subjectName").val(this.themeName);
        $("#search_subject_list_templateName").val(this.tempName);

    },
    //获取数据
    getData:function(){
        var _this=this,
            obj=$("#subject_list_layer");
        //获取商品列表
        $.scrollLoadInterval({
            runIn:this,
            scrollObj:obj,            //要滚动的div，不传为window滚动  @param:jqobj
            mainDiv:obj,              //要添加数据的容器       @param:jqobj
            buttonLength:100,               //距离底部多长触发加载    @param:int
            getDataApiName:"getSubjectList",//调用数据的api接口名    @param:str
            bindDataFn:_this.IterationData,                   //数据绑定函数(返回数据)  @param:function
            scrollForKey:"PageIndex",         //翻页需要传递的参数id    @param:str
            searchData:{                    //查询条件的json
                ActivityName:_this.themeName,
                TemplateName:_this.tempName
            }
        });
    },
    //数据迭代
    IterationData:function(rs){
        data=data.concat(rs);
        CREATE_LIST.createListData(titleDetail,data);
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            oAddSubject=$("#add_subject_list"),
            oSearch=$("#search_subject_query");

        oAddSubject.live("click",function(){
            _this.addSubject(this);
        });

        oSearch.live("click",function(){
            _this.search(this);
        });
    },
    //专题添加
    addSubject:function(obj){
        top.O2O.openNewWindow({
            title:"专题活动",        //@param,  str
            url:"pages/subject/add_Subject_list.html",          //@param,  str
            width:900,        //@param,  int
            height:600        //@param,  int
        },"subAdd");
    },
    //搜索事件
    search:function(obj){
        this.themeName=$("#search_subject_list_subjectName").val();
        this.tempName=$("#search_subject_list_templateName").val();
        window.location.href="subject_list.html?mainid=6&themeName="+this.themeName+"&tempName="+this.tempName;
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