/**
 * Created by hugly on 14-7-13.
 */
$(document).ready(function(){
    artical_management.init();
});
artical_management={
    //关键字
    rehref:"",
    //显示或者隐藏
    isShow:null,
    init:function(){
        var _this=this;
        if(window.location.href.indexOf("searchKey")!=-1){
            var href="";
            href=window.location.href.substring(window.location.href.indexOf("=")+1);
            this.rehref=decodeURI(href.substring(href.indexOf("=")+1));
            console.log(this.rehref);
        }
        this.initValue();
        //事件绑定
        this.bingEvent();
        //数据加载
        $.scrollLoadInterval({
            runIn:this,
            mainDiv:$("#artical_management_title"),                        //@param:jqobj     列表需要插入的obj
            buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName:"getArticlesList",         //@param:str       调用的api接口名
            bindDataFn:this.bingData,                  //@param:function 数据绑定函数
            scrollForKey:"ArticleId",                 //@param:str       滚动加载需要的key
            searchData:{
                searchKey:_this.rehref                          //@param:str        //查询输入的文字
            }
        });
    },
    //初始化搜索框的值
    initValue:function(){
        $(".search_artical_management_search_pro").attr({"value":this.rehref});
    },
    bingData:function(data){
        var oParent=$("#artical_management_title");
        var oTem=$("#artical_management_template");
        for(var i=0;i<data.length;i++){
           this.createDetail(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDetail:function(data,oParent,oTem){
        //克隆当前数据
        var oTar=oTem.clone(true).attr({"id":""}).css({"display":"block"});
        //oTar.css({"display":"block"});
//        oTar.removeAttr("style");
//        oTar.removeAttr("id");
        //对当前结构内容进行填充

        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);

    },
    //数据内容填充
    fillData:function(obj,data){
        this.isShow=data.IsShow ;
        this.isShow=this.isShow?"显示":"不显示";
        obj.find(".artical_management_logo_img").attr({"src":data.ArticlePicUrl});
        obj.find(".artical_management_protype").find("span").text(data.CategoryName);
        obj.find(".artical_management_name a").text(data.Title);
        obj.find(".artical_management_data span").text(data.ConvertTime);
        obj.find(".artical_management_release span").text(this.isShow);;
        obj.attr({"Article_id":data.ArticleId});
    },
    bingEvent:function(){
        var _this=this,
            oAdd=$("#add_artical_management"),
            oEdit=$(".artical_management_detail_edit"),
            oDel=$(".artical_management_detail_del");
            oSearch=$(".search_artical_management_search a");
        //添加新文章
        oAdd.click(function(){
            _this.addartical();
        });
        //编辑文章
        oEdit.click(function(){
            _this.editartical(this);
        });
        //删除
        oDel.click(function(){
            _this.delartical(this);
        });
        //搜索
        oSearch.click(function(){
            _this.search();
        });
    },
    //添加新文章函数
    addartical:function(){
        top.O2O.openNewWindow({
            title:"添加新文章",        //@param,  str
            url:"pages/artical/artical_addartical.html",          //@param,  str
            width:850,        //@param,  int
            height:600        //@param,  int
        },"new1")
    },
    //编辑文章
    editartical:function(obj){
        top.O2O.openNewWindow({
            title:"修改文章",        //@param,  str
            url:"pages/artical/artical_addartical.html?id="+$(obj).parent().parent().attr("article_id"),          //@param,  str
            width:850,        //@param,  int
            height:600        //@param,  int
        },"new2")
    },
    //删除文章
    delartical:function(obj){
        if(confirm("确定要删除数据吗？")){
            top.AJAX.delArticleDetail({
                data:{
                    articleId:$(obj).parent().parent().attr("article_id")
                },
                callback:function(){      //@param:fn    获取数据成功执行
                        $(obj).parent().parent().remove();
                    }
            });
        }
    } ,
    //查询事件
    search:function(){
        this.rehref=$(".search_artical_management_search_pro").attr("value");
        window.location.href="artical_management.html?mainid=1&searchKey="+this.rehref;
    }

};