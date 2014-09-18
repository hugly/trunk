/**
 * Created by hugly on 14-7-9.
 */
$(document).ready(function(){
    artical_Category.init();
});
artical_Category={
    data:null,
    //判断新建还是编辑
    isnew:false,
    id:null,
    //初始化函数
    init:function(){
        this.uploadImg();
        this.bindEvent();
        this.getData();
    },
    //图片上传
    uploadImg:function(){
        window.abc = new $.uploadFile({
            id:"add_artical_Category_icon",                  //input[type='file']的 id   @param:str
            formId:"add_artical_Category_form",              //表单id                     @param:str
            types:"jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber:1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc:top.AJAX.fileUploadUrl,
            showImageWrapId:"add_artical_Category_img",      //图片上传完后显示区域id        @param:str
            imgs:[]                     //已存在的图片                 @param:array
        });
    },
    //获取数据
    getData:function(){
        var _this=this;
        top.AJAX.getArticlesTypeList({
            callback:function(rs){
                _this.data=rs;
               _this.bindDate(rs);
            }
        });

    },
    //通过id取数据
    getDatabyid:function(id){
        var oData=null;
        for(var i=0;i<this.data.length;i++){
            if(id==this.data[i].CategoryId){
                  oData=this.data[i];
                  break;
            }
        }
        return oData;
    },
    //绑定数据
    bindDate:function(data){
        var oParent=$("#artical_Category_title");
        var oTem=$("#add_artical_Category_template");
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
        this.fillData(oTar,data);
        //插入到相应位置
        oTar.appendTo(oParent);
    },
    //数据内容填充
    fillData:function(obj,data){
        obj.find(".artical_Category_name span").text(data.Name);
        obj.attr({"categoryid":data.CategoryId});
    },
    //删除事件
    delDetile:function(obj){
        //删除文章类别
        if(confirm("确认删除？")){
            top.AJAX.delArticlesType({
                data:{
                    categoryid:$(obj).parent().parent().attr("categoryid")            //@param:int   类别id
                },
                callback:function(rs){
                        $(obj).parent().parent().remove();
                }
            });
        }
    },
    //编辑事件
    editDetil:function(obj1,obj2,obj){
        obj1.css({"display":"block"});
        obj2.css({"display":"block"});
        this.isnew=false;
        var id=$(obj).parent().parent().attr("categoryid"),
            nowdata=null,
            oList=$("#add_artical_Category_list");
        this.id=id;
        if(this.getDatabyid(id)==null){
            alert("数据错误");
        }else{
            nowdata=this.getDatabyid(id);
            oList.find(".add_articalCategory_name").val(nowdata.Name);
            oList.find(".add_artical_Category_intro").val(nowdata.Description);
        }
    },
    //增加文章分类窗口打开函数
    addOpen:function(obj1,obj2){
        this.isnew=true;
        obj1.css({"display":"block"});
        obj2.css({"display":"block"});
        oList=$("#add_artical_Category_list");
        oList.find(".add_articalCategory_name").val("");
        oList.find(".add_artical_Category_intro").val("");
    },
    //增加文章分类窗口关闭函数
    addClose:function(obj1,obj2){
        obj1.css({"display":"none"});
        obj2.css({"display":"none"});
    },
    //增加文章分类窗口确定功能函数
    addDeter:function(obj){
        var _this=this;
        if(this.isnew){
            //增加文章类别
            top.AJAX.addArticlesType({
                data:{
                    Name:obj.find(".add_articalCategory_name").val(),                      //类别名   @param:str
                    DisplaySequence:1,          //数字大的在前面   @param:int
                    Description:obj.find(".add_artical_Category_intro").val()                //说明      @param:str
                },
                callback:function(rs){
                   alert("添加文章类别成功！");
                }
            });
        }else{
            //修改文章类别
            top.AJAX.editArticlesType({
                data:{
                    CategoryId:_this.id,                  //类别id    @param:int
                    Name:obj.find(".add_articalCategory_name").val(),                      //类别名   @param:str
                    DisplaySequence:6,          //数字大的在前面   @param:int
                    Description:obj.find(".add_artical_Category_intro").val()                //说明      @param:str
                },
                callback:function(rs){
                    alert("修改文章类别成功！");
                }
            });
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this;
        var obj=$("#artical_Category_title");
        var oAdd=$("#add_artical_Category_list");
        var oClose=$("#add_artical_Category_del");
        var oZoom=$("#add_artical_Category_con");
        var oAddopen=$("#add_artical_Category");
        var oSure=oAdd.find(".add_artical_Category_list_add");
        //删除事件
        obj.find(".artical_Category_detail_del").click(function(){
            //_this.delDetile(this);
        });
        //编辑事件
        obj.find(".artical_Category_detail_edit").click(function(){
           // _this.editDetil(oAdd,oZoom,this);
        });
        //增加文章分类窗口打开函数
        oAddopen.click(function(){
            //_this.addOpen(oAdd,oZoom);
        });
        //增加文章分类窗口关闭函数
        oClose.click(function(){
            //_this.addClose(oAdd,oZoom);
        });
        //增加文章分类窗口确定功能函数
        oSure.click(function(){
            //_this.addDeter(oAdd);
        });
    }
};