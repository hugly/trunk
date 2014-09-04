/**
 * Created by hugly on 14-7-13.
 */
$(document).ready(function(){
    artical_addartical.init();
});
artical_addartical={
    //文章id
    id:null,
    type:"add",
    editor:null,
    show:false,
    listData:null,
    nowImg:[],

    //初始化
    init:function(){
        var _this=this;
        this.type =   (window.location.href.indexOf("id")!=-1)?  "mdf" : "add";
        if(this.type=="add"){
            this.uploadImg([]);
        }
        this.bindEvent();
        this.createEditor();
    },
    init1:function(){
        if(this.type == "mdf"){
            this.id = window.location.href.substring(window.location.href.indexOf("=")+1);
            this.getData();
        }
    },
    getData :function(){
        var _this = this;
        top.AJAX.getArticleDetail({
            data:{
                ArticleId:_this.id            //@param:int   咨询id
            },
            callback:function(rs){      //@param:fn    获取数据成功执行
                _this.bindData(rs);
                _this.uploadImg(_this.nowImg);
            }
        });
    },
    //上传图片
    uploadImg:function(arr){
        var _this=this;
        window.abc = new $.uploadFile({
            id:"artical_addartical_pic_goods_list_up",                  //input[type='file']的 id   @param:str
            formId:"artical_addartical_pic_goods",              //表单id                     @param:str
            types:"jpg,jpeg,png",       //上传文件类型                @param:str
            maxNumber:1,                //最大能上传好多张图片          @param:int
            //服务器地址                  @param:str
            serverSrc:top.AJAX.fileUploadUrl,
            showImageWrapId:"artical_addartical_pic_goods_list",      //图片上传完后显示区域id        @param:str
            imgs:arr                     //已存在的图片                 @param:array
        });
    },
    //生成富文本编辑器
    createEditor:function(){
        var _this = this;
        KindEditor.ready(function(K) {
            _this.editor = K.create('textarea[name="content"]', {
                height:"300px",
                width:"400px",
                items:[ 'source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                    'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                    'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                    'anchor', 'link', 'unlink']
            });

            _this.getTypeList();
        });
    },
    //获取文章类别列表
    getTypeList:function(){
        var _this=this;
        //文章类别列表
        top.AJAX.getArticlesTypeList({
            callback:function(rs){
                _this.listData=rs;
                _this.init1();
                _this.bindTypeData(rs);
            }
        });
    },
    //绑定文章列表数据
    bindTypeData:function(data){
        var oParent=$("#artical_addartical_infro_type");
        for(var i= 0,l=data.length;i<l;i++){
             $("<option value="+data[i].CategoryId+">"+data[i].Name+"</option>").appendTo(oParent);
        }
    },
    //将当前取回来的数据绑定到相应的页面
    bindData:function(data){
        var obj=$("#artical_addartical");
        //主题
        obj.find(".artical_addartical_infro_goods").val(data.Title);
        //是否立即发布
        obj.find(".artical_addartical_infro_check").attr("checked", data.IsShow);
        this.show=data.IsShow;
        //搜索描述
        obj.find("#artical_addartical_infro_name").val(data.Meta_Description);
        //搜索关键字
        obj.find("#artical_addartical_infro_code").val(data.Meta_Keywords);
        //文章关键字
        obj.find("#artical_addartical_infro_article_code").val(data.ArticleTag);
        //文章类别列表
        $("#artical_addartical_infro_type").find("option").each(function(){
            if($(this).attr("value")==data.CategoryId){
                $(this).attr({"selected":"true"});
           }
        });
        //摘要
        obj.find("#artical_addartical_goods_intro").val(data.Description);
        //内容
        this.editor.html(data.Content);
        if(data.ArticlePicUrl!=""){
            this.nowImg.push(data.ArticlePicUrl);
        }
    },
    //事件绑定
    bindEvent:function(){
        var _this=this,
            abstartReg=/^(.{0,800})$/g,
            contentReg=/^(.+)$/g;
        //保存事件
        $(".artical_addartical_save a").click(function(){
            $.checkInputs({
                    inputs:[{
                    id:"artical_addartical_infro_goods",                              //要检查的input的id
                    name:"主题",                           //要检查的input的名字（信息提示用）
                    rules:"must,nickname,min:1,max:60",     //验证规则，见 rules 对象
                    error:"主题内容输入须在60个字以内!"                     //（非必须）自定义错误提示
                }],
                success:function(){
                    //验证通过回调
                    if($("#artical_addartical_infro_type").val()!="<--请选择-->"){
                    }else{
                        alert("所属分类必选!");
                        return;
                    }
                    if(_this.editor.html()){
                    }else{
                        alert("文章内容必填!");
                        return;
                    }
                    if(abstartReg.test($("#artical_addartical_goods_intro").val())){
                        if(_this.type=="mdf"){
                            _this.savedata(this);
                        }else{
                            _this.newsavedata(this);
                        }
                    }else{
                        alert("摘要填写不符合规范!");
                        return;
                    }
                },
                error:function(msg,ids){
                    //验证返回错误的文字
                    alert(msg);
                }
            });
        });
        //是否立即发布事件
        $("#artical_addartical_infro_check").click(function(){
            _this.release(this);
        });
    },
    //立即发布
   release:function(obj){
       if($(obj).is(":checked")){
           this.show=true;
       }else{
           this.show=false;
       }
   },
    //新添加文章保存
    newsavedata:function(obj){
        var obj=$("#artical_addartical"),
            _this=this,
            editor = this.editor;
        if($("#artical_addartical_infro_type").val()==""){
            alert("请至少添加一个分类！")
        }else if(obj.find(".artical_addartical_infro_goods").val()==""){
            alert("标题不能为空！");
        }else{
            top.AJAX.addArticleDetail({
                data:{
                    CategoryId:$("#artical_addartical_infro_type").val(),          //咨询类别id  @param:int
                    Title:obj.find(".artical_addartical_infro_goods").val(),               //标题       @param:str    200字符
                    Meta_Description:obj.find("#artical_addartical_infro_name").val(),    //meta说明   @param:str
                    Meta_Keywords:obj.find("#artical_addartical_infro_code").val(),       //meta关键字  @param:str
                    Description:obj.find("#artical_addartical_goods_intro").val(),         //摘要        @param:str
                    ArticleTag:obj.find("#artical_addartical_infro_article_code").val(),          //文章关键字     @param:str
                    Content:editor.html(),             //内容        @param:str
                    IsShow:_this.show,              //是否显示      @param:Boolean
                    ArticlePicUrl:$("#artical_addartical_pic_goods_list").find("img").attr("src"),        //咨询图片      @param:str
                    UploadPageUrl:window.location.href
                },
                callback:function(rs){      //@param:fn    获取数据成功执行
                    alert("添加文章成功！");
                    top.O2O.refreshWindow("1");
                    top.O2O.closeWindow("new1");
                }
            });
        }
    },
   //修改文章保存
    savedata:function(obj,editor){
        var obj=$("#artical_addartical"),
            _this=this,
            editor=this.editor;
        console.log(this.show);
        top.AJAX.editArticleDetail({
            data:{
                ArticleId:_this.id,           //咨询id     @param:int
                CategoryId:$("#artical_addartical_infro_type").val(),          //咨询类别id  @param:int
                Title:obj.find(".artical_addartical_infro_goods").val(),               //标题       @param:str    200字符
                Meta_Description:obj.find("#artical_addartical_infro_name").val(),    //meta说明   @param:str
                Meta_Keywords:obj.find("#artical_addartical_infro_code").val(),       //meta关键字  @param:str
                Description:obj.find("#artical_addartical_goods_intro").val(),         //摘要        @param:str
                ArticleTag:obj.find("#artical_addartical_infro_article_code").val(),          //文章关键字     @param:str
                Content:editor.html(),             //内容        @param:str
                IsShow:_this.show,              //是否显示      @param:Boolean
                ArticlePicUrl:$("#artical_addartical_pic_goods_list").find("img").attr("src"),         //咨询图片      @param:str
                UploadPageUrl:window.location.href
            },
            callback:function(rs){
                alert("修改文章成功！");
                top.O2O.refreshWindow("1");
                top.O2O.closeWindow("new2");
            }
        });
    }
};
