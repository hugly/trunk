/**
 * Created by hugly on 14-7-13.
 */
$(document).ready(function(){
    artical_review.init();
});
artical_review={
    //当前数据
    nowData:null,
    rehref:"",
    //初始化
    init:function(){
        if(window.location.href.indexOf("=")!=-1){
            var href="";
            href=window.location.href.substring(window.location.href.indexOf("=")+1);
            this.rehref=decodeURI(href.substring(href.indexOf("=")+1));
        }
        this.initValue();
        this.scrollLoading();
        this.bindEvent();
    },
    //滚动加载
    scrollLoading:function(){
        var _this=this;
        $.scrollLoadInterval({
            runIn:this,                               //加个回调执行对象
            mainDiv:$("#artical_review_title"),                        //@param:jqobj     列表需要插入的obj
            buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName:"getArticleCommentList",         //@param:str       调用的api接口名
            bindDataFn:_this.bindData,                  //@param:function 数据绑定函数
            scrollForKey:"CommentId",                 //@param:str       滚动加载需要的key
            searchData:{
                searchKey:_this.rehref                          //@param:str        //查询输入的文字
                //articleId:263                          //@param:int        //文章id   263测试数据
            }
        });
    },
    //初始化搜索框的值
    initValue:function(){
        $(".search_artical_review_search_pro").attr({"value":this.rehref});
    },
    //数据绑定
    bindData:function(data){
        this.nowData=data;
        var oParent=$("#artical_review_title");
        var oTem=$("#artical_review_template");
        for(var i=0;i<data.length;i++){
            this.createDetail(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDetail:function(data,oParent,oTem){
        //克隆当前数据
        var oTar=oTem.clone(true).attr({"id":""}).css({"display":"block"});
//        oTar.removeAttr("style");
//        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oParent,oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);

    },
    //数据内容填充
    fillData:function(oParent,obj,data){
        var show=data.IsShow?"显示":"不显示";

        oParent.find(".artical_review_detail").each(function(i){
            obj.find(".artical_review_reivewid span").text(i+1);
        });
        obj.find(".artical_review_content span").text(data.Content);
        obj.find(".artical_review_username span").text(data.NickName);
        obj.find(".artical_review_display a").text(show);
        obj.attr({"CommentId":data.CommentId});
        obj.attr({"dis":data.IsShow});
    },
    //事件绑定
    bindEvent:function(){
        var _this=this;
        //查询按钮
        $("#search_artical_review_search").click(function(){
            _this.search();
        });
        //显示或者不显示
        $("#artical_review_reviewshow").click(function(){
            _this.show(this);
        });
    },
    //查询事件
    search:function(){
        this.rehref=$(".search_artical_review_search_pro").attr("value");
        window.location.href="artical_review.html?mainid=1&searchKey="+this.rehref;
    },
    //根据id返回当前isshow
    getIsShow:function(id){
        for(var i=0;i<this.nowData.length;i++){
            if(id==this.nowData[i].CommentId){
                this.isshow=this.nowData[i].IsShow;
            }
        }
    },
    //显示、不显示操作
    show:function(obj){
        var _this=this,
            id=$(obj).parent().parent().attr("CommentId"),
            dis=$(obj).parent().parent().attr("dis");
        if(dis=="false"){
            dis=true;
        }else if(dis==true){
            dis=false;
        }else if(dis="true"){
            dis=false;
        }else if(dis=false){
            dis=true;
        }
        top.AJAX.editArticleComment({
            data:{
                id:id,            //@param:int 评论id
                showState:dis      //@param:int 显示状态  1:显示 0:不显示
            },
            callback:function(rs){
                var show=dis?"显示":"不显示";
                $(obj).text(show);
                dis=$(obj).parent().parent().attr({"dis":dis})
            }
        });
    }
};