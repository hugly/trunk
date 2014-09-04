/**
 * Created by hugly on 14-7-13.
 */
$(document).ready(function(){
    product_review.init();
});
product_review={
    //关键字
    keyword:"",
    //显示控制
    isDisplay:false,
    //初始化
    init:function(){
        if(window.location.href.indexOf("=")!=-1){
            this.keyword=decodeURI(window.location.href.substring(window.location.href.indexOf("=")+1));
        }
        $("#search_product_review_search_pro").val(this.keyword);
        this.getData();
        this.bindEvent();
    },
    //获取数据
    getData:function(){
        var _this=this;
        //获取商品评论列表
        $.scrollLoadInterval({
            runIn:this,                               //加个回调执行对象
            mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
            buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
            getDataApiName:"getProductCommentList",   //@param:str       调用的api接口名
            bindDataFn:_this.bindData,                  //@param:function 数据绑定函数
            scrollForKey:"id",                 //@param:str       滚动加载需要的key
            searchData:{
                searchKey:_this.keyword                         //@param:str        //查询输入的文字
            }
        });
    },
    //绑定数据
    bindData:function(data){
        var oParent=$("#product_review_title"),
            oTem=$("#product_review_template");
        for(var i=0;i<data.length;i++){
            this.createDom(data[i],oParent,oTem);
        }
    },
    //创建文档结构
    createDom:function(data,oParent,oTem){
        var oTar=oTem.clone(true);
        oTar.removeAttr("style");
        oTar.removeAttr("id");
        //对当前结构内容进行填充
        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);
    },
    //填充数据
    fillData:function(obj,data){
        this.isDisplay=data.IsShow;
        var isshow=this.isDisplay?"不显示":"显示";
        obj.find(".product_review_reid span").text(data.CommentId);
        obj.find(".prodcut_review_content span").text(data.Content);
        obj.find(".product_review_proname span").text(data.UserName);
        obj.find(".product_review_username span").text(data.UserName);
        obj.find(".product_review_score span").text(data.StarScore);
        obj.find(".product_review_data span").text(data.CreateTime);
        obj.find(".product_review_change a").text(isshow);
        obj.attr({"CommentId":data.CommentId});

        for(var i=0;i<imgNum;i++){
            $("<img src>").appendTo(obj.find(".product_review_disdetail"));
        }
        if(data.ReviewImgs!=null){
            var imgNum=data.ReviewImgs.length;

            for(var i=0;i<imgNum;i++){
                $("<img src>").appendTo(obj.find(".product_review_disdetail"));
            }

            obj.find(".product_review_disdetail img").each(function(i){
               $(this).attr({"src":data.ReviewImgs[i].ThumbUploadPath});
            });
        }
        obj.attr({"dis":data.IsShow});
    },
    //绑定事件
    bindEvent:function(){
        //显示隐藏状态修改
        var _this=this,
            oParent=$("#product_review_title"),
            oDis=$(".product_review_change a"),
            oSearch=$("#search_product_review_search"),
            oSmallPic=oParent.find(".product_review_disdetail img");
        oDis.click(function(){
            _this.isDisfun(this);
        });
        //搜索
        oSearch.live("click",function(){
            _this.searchEvent();
        });
        //小图放大
        oSmallPic.live("click",function(){
            $.showPicture($(this).attr("src"));
        });
    },
    //搜索
    searchEvent:function(){
        this.keyword=$("#search_product_review_search_pro").val();
        window.location.href="product_review.html?keyword="+this.keyword;
    },
    //是否显示函数
    isDisfun:function(obj){
        var _this=this,
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
        //评论编辑是否显示
        top.AJAX.editArticleComment({
            data:{
                id:$(obj).parent().parent().attr("CommentId"),            //@param:int 评论id
                showState:dis       //@param:int 显示状态  1:显示 0:不显示
            },
            callback:function(rs){
                var show=dis?"不显示":"显示";
                $(obj).text(show);
                dis=$(obj).parent().parent().attr({"dis":dis})
            }
        });
    }
};














