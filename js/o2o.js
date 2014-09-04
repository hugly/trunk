/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 14-7-8
 * Time: 下午5:48
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



// 0:线上测试  1：线上正式   2：测试    3：开发（自己改下面地址）
var __USE_TYPE__ = 3;





$.support.cors = true;
AJAX = {
    pictureUrl: "http://172.18.252.36:8023",   //上传图片显示地址

    //url: "http://172.18.254.158:8023/api/",
    url: "http://172.18.252.36:8023/api/",

    areaXML:"../../js/region.xml",  //xml相对于pages里面的html的地址

    tgogoSiteUrl: "http://www.tgogo.net",//商城主站的Url，后台查看商品和抢购拼接链接需要

    fileUploadUrl: "http://172.18.252.36:8023/api/product/UploadPictureByIframe",





    pageSize:30,        //分页记录数
    //物流公司
    sendType:{
        1:"韵达快递",
        2:"圆通",
        3:"申通",
        4:"中通",
        5:"顺丰",
        6:"天天快递",
        7:"EMS",
        8:"包邮"
    },
    //配送方式
    sendType1:{
        "顺丰快递":"顺丰快递",
        "EMS":"EMS",
        "联昊通物流":"联昊通物流",
        "全峰快递":"全峰快递",
        "全一快递":"全一快递",
        "圆通速递":"圆通速递",
        "中通速递":"中通速递",
        "宅急送":"宅急送",
        "韵达快运":"韵达快运",
        "海航天天快递":"海航天天快递",
        "联邦快递":"联邦快递",
        "汇通快运":"汇通快运",
        "德邦物流":"德邦物流",
        "中铁快运":"中铁快运",
        "CCES":"CCES",
        "申通物流":"申通物流",
        "龙邦物流":"龙邦物流",
        "新邦物流":"新邦物流",
        "港中能达":"港中能达",
        "优速物流":"优速物流",
        "全日通快递":"全日通快递",
        "邮政平邮":"邮政平邮",
        "亚风":"亚风",
        "长宇物流":"长宇物流",
        "大田物流":"大田物流",
        "其它":"其它"
    },
    OrderType:{
        0:"普通订单",
        1:"优惠劵订单"
    },
    OrderStatus:{
        0:"未提交",
        1:"待支付",
        2:"待发货",
        3:"已发货",
        4:"关闭",
        5:"完成"
    },
    ajax:function(opt){
        var url = this.url + opt.src,
            data = opt.data || {},
            type = opt.type,
            success = opt.callback,
            header = {
                Authorization:"Bearer "+CACHE.userInfo.AccessToken
            };

        data.CompanyID = CACHE.userInfo.CompanyID;
        data.UploadPageUrl = window.location.href;

        if(type == "post"){
            data = JSON.stringify(data);
        }

        $.loadShow();
        $.ajax({
            type:type,
            cache: false,
            crossDomain: true,
            url:url,
            data:data,
            headers:header,
            contentType:"application/json",
            dataType:"json",
            timeout:600000,
            success:function(rs){
                $.loadHide();
                var state = rs.State;
                if(state == 1) {
                    //成功
                    var result = rs.Data || [];
                    success(result);
                }else if(state == 3){
                    //很多失败...
                    var msg1 = rs.Errors.join(",");
                    alert(msg1);
                }else{
                    //失败
                    var msg = rs.Message;
                    alert(msg);
                }
            },
            error:function(e){
                $.loadHide();
                var state = e.status,
                    msg = "";

                if(state == "404" || state == "500"){
                    msg = "服务器繁忙,请稍后在试!";
                }else{
                    msg = "无法连接服务器";
                }

                alert(msg);
            }
        });
    },
    ajaxForScrollLoad:function(opt){
        //login 调用了该接口   data是字符串
        var url = this.url + opt.src,
            data = opt.data,
            type = opt.type,
            success = opt.success,
            error = opt.error,
            header = {};

        if(opt.src != "Account/SignIn"){
            header.Authorization = "Bearer "+CACHE.userInfo.AccessToken;
            data.CompanyID = CACHE.userInfo.CompanyID;
            data.UploadPageUrl = window.location.href;
        }

        if(type == "post"){
            data = JSON.stringify(data);
        }

        $.ajax({
            type:type,
            cache:false,
            url:url,
            data:data,
            headers:header,
            contentType:"application/json",
            dataType:"json",
            timeout:600000,
            success:function(rs){
                var state = rs.State;
                if(state == 1){
                    //成功
                    var result = rs.Data || [];
                    success(result);
                }else if(state == 3){
                    //很多失败...
                    var msg1 = rs.Errors.join(",");
                    alert(msg1);
                }else{
                    //失败
                    var msg = rs.Message;
                    error(msg);
                }
            },
            error:function(e){
                var state = e.status,
                    msg = "";

                if(state == "404" || state == "500"){
                    msg = "服务器繁忙,请稍后在试!";
                }else{
                    msg = "无法连接服务器";
                }

                error(msg);
            }
        });
    },


    login:function(opt){
        var url = "Account/SignIn",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            data = opt.data;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"post",
            data:data
        });

    },




    //商品品牌列表
    getProductBrandList:function(data){
        var url = "BrandCategories/GetList",
            success = $.getFunction(data.callback);

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:{}
        });
    },


//文章部分................................................................
    //商家咨询列表(文章列表)
    getArticlesList:function(opt){
        var url = "Article/GetArticles",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //商家咨询详情(文章详情)
    getArticleDetail:function(opt){
        var url = "Article/GetArticleDetail",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            articleId:""   //@param:int
//        }

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //增加商家咨询(文章增加)
    addArticleDetail:function(opt){
        var url = "Article/AddCompanyArticle",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            CategoryId:"",          //咨询类别id  @param:int
//            Title:"",               //标题       @param:str    200字符
//            Meta_Description:"",    //meta说明   @param:str
//            Meta_Keywords:"",       //meta关键字  @param:str
//            Description:"",         //摘要        @param:str
//            ArticleTag:"",          //文章关键字     @param:str
//            Content:"",             //内容        @param:str
//            IsShow:"",              //是否显示      @param:Boolean
//            ArticlePicUrl:""        //咨询图片      @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //删除商家咨询(文章删除)
    delArticleDetail:function(opt){
        var url = "Article/DeleteArticle",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            articleId:""    //@param:int  咨询id
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //保存修改咨询(文章修改)
    editArticleDetail:function(opt){
        var url = "Article/EditeArticle",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            ArticleId:"",            //咨询id     @param:int
//            CategoryId:"",          //咨询类别id  @param:int
//            Title:"",               //标题       @param:str    200字符
//            Meta_Description:"",    //meta说明   @param:str
//            Meta_Keywords:"",       //meta关键字  @param:str
//            Description:"",         //摘要        @param:str
//            ArticleTag:"",          //文章关键字     @param:str
//            Content:"",             //内容        @param:str
//            IsShow:"",              //是否显示      @param:Boolean
//            ArticlePicUrl:""        //咨询图片      @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //获取文章类别列表
    getArticlesTypeList:function(opt){
        var url = "ArticleCategories/GetArticleCategories",
            success = $.getFunction(opt.callback);
//            data = opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:{
                searchKey:""
            }
        });
    },
    //增加文章类别
    addArticlesType:function(opt){
        var url = "ArticleCategories/AddArticleCategories",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

        data.ParentId = 0;

//        data = {
//            Name:"",                      //类别名
//            DisplaySequence:"",          //数字大的在前面
//            ParentId:0,                  //写死
//            Description:""                //说明
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //删除文章类别
    delArticlesType:function(opt){
        var url = "ArticleCategories/DeleteArticleCategories",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            categoryid:""       //类别id  int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改文章类别
    editArticlesType:function(opt){
        var url = "ArticleCategories/UpdateArticleCategories",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

        data.ParentId = 0;

//        data = {
//            CategoryId:"",                //类别编号
//            Name:"",                      //类别名
//            DisplaySequence:"",          //数字大的在前面
//            ParentId:0,                  //写死
//            Description:""                //说明
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },



//咨询评论部分............................................................
    //咨询评论列表
    getArticleCommentList:function(opt){
        var url = "Article/GetArticleComment",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //咨询评论增加
    addArticleComment:function(opt){
        var url = "Article/AddArticleComment",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            ParentId:"",        //评论的父级id,没有父级传0
//            RelateID:"",        //咨询id
//            Content:""          //内容
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },


    //评论编辑是否显示
    editArticleComment:function(opt){
        var url = "Article/EditeShowState",
            success = $.getFunction(opt.callback),
            data = opt.data;

//        data = {
//            id:"",            //@param:int 评论id
//            showState:""      //@param:Boolean 显示状态  true:显示 false:不显示
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },





//商品部分............................................................
    //获取商品分类
    getProductTypeList:function(opt){
        var url = "Categories/GetList",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //新增商品分类
    addProductType:function(opt){
        var url = "Categories/AddCategories",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            Name:""             //名字
//        };


        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //修改商品分类
    editProductType:function(opt){
        var url = "Categories/UpdateCategories",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            Name:"",             //名字,
//            CategoryId:""         //分类id
//        };


        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //删除商品分类
    delProductType:function(opt){
        var url = "Categories/Delete",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            CategoryId:""         //分类id
//        };


        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //是否启用分类
    isUseProductType:function(opt){
        var url = "Categories/UpdateIsShow",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            CategoryId:""         //分类id
//        };


        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //分类排序
    sortProductType:function(opt){
        var url = "Categories/UpdateDisplaySequence",
            success = $.getFunction(opt.callback),
            data = opt.data || {};
//
//        data = {
//            list:[
//                {
//                    ID:"",                      //param:int   分类id
//                    DisplaySequeceNum:""        //param:int   排序值
//                }
//            ]
//        };


        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },




    //商品等级列表
    getProductLevelList:function(opt){
        var url = "ProductLevel/GetList",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //商品等级添加
    addProductLevel:function(opt){
        var url = "ProductLevel/AddProductLevel",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            LevelName:"",           //等级名称  @param:str   0-200字符
//            ProLevel:"",            //商品等级  @param:int
//            LevelDesc:"",           //等级说明  @param:str
//            upload:{
//                UploadPath:"",      //上传的图片地址
//                UploadPageUrl:""    //当前页面地址全路径不需要域  window.location.pathname
//            }
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //修改商品等级
    editProductLevel:function(opt){
        var url = "ProductLevel/UpdateProductLevel",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            ProductLevelID:"",       //商品等级id
//            LevelName:"",           //等级名称  @param:str   0-200字符
//            ProLevel:"",            //商品等级  @param:int
//            LevelDesc:"",           //等级说明  @param:str
//            upload:{
//                UploadPath:"",      //上传的图片地址
//                UploadPageUrl:""    //当前页面地址全路径不需要域  window.location.pathname
//            }
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //商品等级删除
    delProductLevel:function(opt){
        var url = "ProductLevel/DeleteProductLevel",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productlevelid:"",       //商品等级id
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //是否显示商品等级
    isUseProductLevel:function(opt){
        var url = "ProductLevel/UpdateIsShow",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productlevelid:"",       //商品等级id  @param:int
//            isshow:""                 //是否显示   @param:boolean   true:显示  false:不显示
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },





    //获取商品列表
    getProductList:function(opt){
        var url = "Product/GetList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },

    //新增商品信息
    addProduct:function(opt){
        var url = "Product/AddProduct",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            CategoryId:"",                      //@param:int   商品分类id
//            ProductName:"",                     //@param:str   商品名称   0-60
//            ShortDescription:"",                //@param:str   商品简介   富文本里面的html
//            Description:"",                     //@param:str    商品描述  富文本里面的html
//            Title:"",                           //@param:str    前台显示页面标题
//            Meta_Description:"",                //@param:str    你懂的
//            Meta_Keywords:"",                   //@param:str    你懂的
//            DisplaySequence:"",                 //@param:int    排序 >0
//            MarketPrice:"",                     //@param:float  市场价eg  12.00
//            ProductNewCode:"",                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
//            ProductLevelRelation:{
//                ProductLevelID:""               //@param:int
//            },
//            ProductRelatedCoupon:{
//                CouponOutType:"",               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
//                SetCouponOutDate:"",            //@param:int  过期时间(时间戳)
//                SetCouponOutDays:""             //@param:int  过期天数
//            },
//            ProductTagList:[
//                {
//                    TagId:""                    //@param:int 商品标签id
//                },
//                //....
//            ],
//            UploadList:[
//                {
//                    UploadPath:"",              //@param:str
//                    UploadPageUrl:""            //@param:str
//                }
//            ]
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //修改商品信息
    editProduct:function(opt){
        var url = "Product/Update",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            ProductId:"",                       //@param:int   商品id
//            CategoryId:"",                      //@param:int   商品分类id
//            ProductName:"",                     //@param:str   商品名称   0-60
//            ShortDescription:"",                //@param:str   商品简介   富文本里面的html
//            Description:"",                     //@param:str    商品描述  富文本里面的html
//            Title:"",                           //@param:str    前台显示页面标题
//            Meta_Description:"",                //@param:str    你懂的
//            Meta_Keywords:"",                   //@param:str    你懂的
//            DisplaySequence:"",                 //@param:int    排序 >0
//            MarketPrice:"",                     //@param:float  市场价eg  12.00
//            ProductNewCode:"",                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
//            ProductLevelRelation:{
//                ProductLevelID:""               //@param:int
//            },
//            ProductRelatedCoupon:{
//                CouponOutType:"",               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
//                SetCouponOutDate:"",            //@param:int  过期时间(时间戳)
//                SetCouponOutDays:""             //@param:int  过期天数
//            },
//            ProductTagList:[
//                {
//                    TagId:""                    //@param:int 商品标签id
//                },
//                //....
//            ],
//            UploadList:[
//                {
//                    UploadPath:"",              //@param:str
//                    UploadPageUrl:""            //@param:str
//                }
//            ]
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //删除商品信息
    delProduct:function(opt){
        var url = "Product/Delete",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productId:""       //商品id  @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //获取商品详情
    getProductInfo:function(opt){
        var url = "Product/GetModel",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productId:""       //商品id  @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //修改商品显示状态
    isUseProduct:function(opt){
        var url = "Product/UpdateIsShow",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productId:"",       //商品id  @param:int
//            isshow:""           //是否显示  @param:boolean   true/false
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //获取商品对应的相关咨询
    getConsultation:function(opt){
        var url = "Product/GetListByRelateArtPro",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            productId:"",       //商品id  @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //获取指定的资讯
    getAppointConsultation:function(opt){
        var url = "Article/GetListForProduct",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            articlesId:"",       // 资讯id  @param:int
//            categoryId:"",       // 资讯类别id @param:int
//            queryKey:"",         // 资讯标题模糊查询 @param:str
//            topNumber:""         // 资讯获取数量 @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //新增/清空商品资讯
    AddConsultation:function(opt) {
        var url = "Product/AddRelArtPro",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            ProductId:"",       // 商品id  @param:int
//            ArticleId:"",       // 资讯文章id @param:int  做清空操作的时候此字段不传
//        };

        this.ajax({
            src: url,
            callback: success,
            type: "post",
            data: data
        });
    },

    //商品标签列表
    getProductTagList:function(opt){
        var url = "Product/GetTagsList",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            TagID:"",       //标签id  @param:int
//            TagName:""     //标签名  @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //增加商品标签
    addProductTag:function(opt){
        var url = "Product/AddProductTags",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            tagName:""       //标签名  @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //修改商品比价
    editProductParity:function(opt){
        var url = "Product/AddPriceSource",
            success = $.getFunction(opt.callback),
            data = opt.data || [];

//        data = {
//            CouponProductId:"",         //商品id   @param:int
//            BusinessesId:"",            //比价来源商家id(eg:淘宝)  @param:int
//            Sort:"",                    //排序    @param:int
//            SourcesOfPrice:"",          //价格    @param:float   eg:12.00
//            PriceSourcesUrl:""          //来源地址  @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //编辑商家比价是否显示
    editContrastComment:function(opt){
        var url="Product/UpdatePriceIsShow",
            success= $.getFunction(opt.callback),
            data=opt.data || [];
//        data={
//            priceSourceId:"",  //比价信息id  @param:int
//            isshow:""          //是否显示    @param:bool  default:true
//        };
        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //商品评论列表
    getProductCommentList:function(opt){
        var url = "ProductComment/GetProductComment",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },

    //比价商家列表
    getCouponBusinessesList:function(opt){
        var url = "CouponBusinessesFrom/GetCouponBusFrom",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//          queryKey:""     @param:str   查询条件
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //添加比价商家
    addCouponBusinessesList:function(opt){
        var url = "CouponBusinessesFrom/AddBusinessesFrom",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            BusinessesName:"",          //商家名称     @param:str   0-10str
//            BusinessesIcon:"",          //商家图标     @param:int
//            BusinessesUrl:"",           //商家官网     @param:str
//            IsShow:""                   //是否显示     @param:boolean   true/false
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //修改商家比价
    editCouponBusinessesList:function(opt){
        var url = "CouponBusinessesFrom/UpdateBusinessesFrom",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            BusinessesId:"",            //商家id      @param:int
//            BusinessesName:"",          //商家名称     @param:str   0-10str
//            BusinessesIcon:"",          //商家图标     @param:int
//            BusinessesUrl:"",           //商家官网     @param:str
//            IsShow:""                   //是否显示     @param:boolean   true/false
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //删除商家比价
    delCouponBusinessesList:function(opt){
        var url = "CouponBusinessesFrom/DeleteBusinessesFrom",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            BusinessesId:""            //商家id      @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },



//订单部分......................................................................
    //获取订单列表
    getManageorderList:function(opt){
        var url = "Manageorder/GetList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },

    //删除订单
    delManageorder:function(opt){
        var url = "Manageorder/DeleteOrders",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            orderId:""            //订单id      @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //获取订单详情
    getManageorderInfo:function(opt){
        var url = "Manageorder/GetOrderDetails",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            orderId:""            //订单id      @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //订单发货
    sendGoods:function(opt){
        var url = "Manageorder/SendGoods",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            OrderId:"",                   //订单id      @param:int
//            CellPhone:"",                   //手机号码     @param:Str
//            RealName:"",                    //真实姓名   @param:Str
//            ExpressCompanyName:"",          //物流公司名  @param:str
//            ShippingModeId:"",              //配送方式id  @param:int
//            RegionId:"",                    //省市区ID,只传区id   @param:int
//            Address:"",                     //详细地址   @param:str
//            ShipOrderNumber:""              //运货单号  @param:Str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //优惠劵发货
    sendCoupon:function(opt){
        var url = "Manageorder/SendCoupon",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            OrderId:"",             //订单id   @param:int
//            CouponNote:""           //备注     @param:str
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },


    //订单普通批量发货
    sendGoodsBatch:function(opt){
        var url = "Manageorder/SendGoodsByOrederList",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = [{
//            OrderId:"",                   //订单id      @param:int
//            CellPhone:"",                   //手机号码     @param:Str
//            RealName:"",                    //真实姓名   @param:Str
//            ExpressCompanyName:"",          //物流公司名  @param:str
//            ShippingModeId:"",              //配送方式id  @param:int
//            RegionId:"",                    //省市区ID,只传区id   @param:int
//            Address:"",                     //详细地址   @param:str
//            ShipOrderNumber:""              //运货单号  @param:Str
//        },
//        ...
//        ];

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //订单优惠劵批量发货
    sendCouponBatch:function(opt){
        var url = "Manageorder/SendCouponByList",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = [{
//            OrderId:"",             //订单id   @param:int
//            CouponNote:""           //备注     @param:str
//        },
//       ...
//      ];

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },

    //订单导出
    exportOrder:function(opt){
        var url = "Manageorder/ExcelOrder",
            success = $.getFunction(opt.callback),
            data = opt.data || {};
//        data = {
//            type:""                 //导出的类型： @param:int  0 CSV格式(默认);1 TXT格式;
//            OrderOut:[
//              {
//                   Name: "sample string 1",
//                  SqlName: "sample string 2"
//              },
//              {}
//            ]
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

    //获取导出数据字段
    getExportWords:function(opt){
        var url = "Manageorder/FllData",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });

    },




//优惠劵.........................................................................
    //获取优惠劵列表
    getCouponList: function (opt) {
        var url = "Coupon/GetList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },

    //优惠劵删除
    delCoupon:function(opt){
        var url = "Coupon/DeleteCoupon",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            couponId:""             //优惠劵id   @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },

//打折码部分......................................................................
    getDiscountCodeList:function(opt){
        var url = "DiscountCode/GetList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },

    //打折码删除
    delDiscountCode:function(opt){
        var url = "DiscountCode/DeleteDiscountCode",
            success = $.getFunction(opt.callback),
            data = opt.data || {};

//        data = {
//            discountId:""             //打折码id   @param:int
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },


//规则部分  start
    //获取规则管理列表
    getRuleList:function(opt){
        var url="BasePoint/GetList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改显示状态
    editRuleDis:function(opt){
        var url="BasePoint/UpdateIsShow",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

//        data={
//            basePointId:"",     //规则id   @param:int
//            isShow:""           //是否显示 @param:bool
//        }

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });

    },
    //删除当前数据
    delRuleDetail:function(opt){
        var url="BasePoint/Delete",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

//        data={
//            basePointId:"",     //规则id   @param:int
//        }
        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //填充规则变动类型
    getRuleChangeType:function(opt){
        var url="BasePoint/FllDataChangeType",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //填充规则角色类型
    getRuleRoleType:function(opt){
        var url="BasePoint/FllDataBaseRoleType",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //获取商家未录入的规则类型
    getBusinessesRuleType:function(opt){
        var url="BasePoint/FllDataBaseType",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改单条规则基础数据
    modifyRuleDetail:function(opt){
        var url="BasePoint/UpdateBasePoint",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

//        data={
//            BasePointId:""    @param
//            BaseName:""    @param string
//            BasePointVal:""    @param int
//            BaseTypeId:""    @param   int
//            ChangeType:""    @param   int
//            BaseRoleTypeId:""    @param   int
//            BaseLcon:""    @param int
//            BaseLconUrl:""    @param  string
//            OldBaseLconUrl:""    @param   string
//            UploadPageUrl:""    @param    string
//            BaseNote:""    @param string
//            BaseNoteBrief:""    @param    string
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //根据主键获取单条规则基础数据
    getRuleDetailByKey:function(opt){
        var url="BasePoint/GetModel",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //新增规则基础数据
    addRuleDetail:function(opt){
        var url="BasePoint/AddBasePoint",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

//        data={
//            BasePointId:""    @param
//            BaseName:""    @param string
//            BasePointVal:""    @param int
//            BaseTypeId:""    @param   int
//            ChangeType:""    @param   int
//            BaseRoleTypeId:""    @param   int
//            BaseLcon:""    @param int
//            BaseLconUrl:""    @param  string
//            OldBaseLconUrl:""    @param   string
//            UploadPageUrl:""    @param    string
//            BaseNote:""    @param string
//            BaseNoteBrief:""    @param    string
//        };

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
//规则部分  end

//会员部分>商家用户积分  start
    //获取登陆商家下的所有含有积分用户信息
    getUserInfroContain:function(opt){
        var url = "ManageCompanyPoint/GetList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //根据用户ID查询当前用户下的积分流水
    getCurrentUserInfro:function(opt){
        var url="ManageCompanyPoint/GetListDetailByUserId",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
//会员部分>商家用户积分  end
//专题管理  start

    //获取专题列表
    getSubjectList:function(opt){
        var url="Activity/GetActivityList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //取得店铺所有专题模板配置
    getSubjectTemplate:function(opt){
        var url="Activity/GetActivityTemplate",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });

    },
    //获取专题中相关的选择数据（抢购、轮换、商品、资讯数据）
    getSubjectActivityPage:function(opt){
        var url="Activity/GetRelateDataList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //获取专题详情及该专题模板对象信息
    getSpecialDetail:function(opt){
        var url="Activity/GetActivityAndTemplateData",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //删除专题
    delSpecialDetail:function(opt){
        var url="Activity/DeleteActivity",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改显示在顶部状态（是否在顶部显示）
    modifySpecialDetail:function(opt){
        var url="Activity/UpdateTopShow",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //创建店铺专题
    addShopSpecialDetail:function(opt){
        var url="Activity/CreateCompanyActivity",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //编辑店铺专题
    editShopSpecialDetail:function(opt){
        var url="Activity/EditCompanyActivity",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
//专题管理  end


//游戏管理   start
    //初始化游戏设置数据
    initalGameSetting:function(opt){
        var url="Game/InitialCompanyGameSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //获取商家游戏设置列表
    getCompanyGameList:function(opt){
        var url="Game/GetCompanyGameSettingList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //获取商家游戏设置
    getCompanyGameDetail:function(opt){
        var url="Game/GetCompanyGameSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改商家游戏设置
    modifyCompanyGameSetting:function(opt){
        var url="Game/UpdateCompanyGameSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //获取游戏下拉列表
    getGameRewardsGameList:function(opt){
        var url="Game/GetGameList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //获取游戏奖励类型下拉列表
    getGameAwardTypeList:function(opt){
        var url="Game/GetGameAwardTypeList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });

    },
    //获取商家的游戏记录列表
    getCompanyGameAwardList:function(opt){
        var url="Game/GetCompanyGameAwardHistoryList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //获取商家游戏奖品设置列表
    getCompanyGameAwardSettingList:function(opt){
        var url="Game/GetCompanyGameAwardSettingList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //添加商家游戏奖品
    addCompanyGameAwardSettind:function(opt){
        var url="Game/AddCompanyGameAwardSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //获取商家游戏奖品
    getCompanyGameAwardSetting:function(opt){
        var url="Game/GetCompanyGameAwardSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //修改商家游戏奖品设置
    EditCompanyGameAwardSetting:function(opt){
        var url="Game/UpdateCompanyGameAwardSetting",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //获取商家可以添加到游戏中的商品
    GetCompanyGameProductList:function(opt){
        var url="Game/GetCompanyGameAwardProductList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //根据productid获取相应得数据
    GetCompanyGameProductListById:function(){
        var url="Game/GetCompanyGameAwardRelatedProduct",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
//游戏管理   end


//商品兑换  start
    //获取商家兑换商品列表
    getProductExchangeList:function(opt){
        var url="ProductExchange/GetCompanyProductExchangeList",
            success = $.getFunction(opt.success),
            error = $.getFunction(opt.error),
            postData = opt.data,
            add_key = opt.scrollKey,
            add_val = opt.scrollId;

        postData[add_key] = add_val;
        postData.pageSize = this.pageSize;

        this.ajaxForScrollLoad({
            src:url,
            success:success,
            error:error,
            type:"get",
            data:postData
        });
    },
    //获取商家兑换的商品
    getProductExchangeDetail:function(opt){
        var url="ProductExchange/GetCompanyProductExchange",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //No documentation available.
    GetCompanyExchangeableProductList:function(opt){
        var url="ProductExchange/GetCompanyExchangeableProductList",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });
    },
    //添加商家兑换商品
    AddCompanyProductExchange:function(opt){
        var url="ProductExchange/AddCompanyProductExchange",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //更新商家兑换商品
    UpdateCompanyProductExchange:function(opt){
        var url="ProductExchange/UpdateCompanyProductExchange",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"post",
            data:data
        });
    },
    //根据商品id获取商品
    getExchangeProductById:function(opt){
        var url="ProductExchange/GetCompanyExchangeRelatedProduct",
            success= $.getFunction(opt.callback),
            data=opt.data || {};

        this.ajax({
            src:url,
            callback:success,
            type:"get",
            data:data
        });

    }
//商品兑换  end

};





//线上测试
if(__USE_TYPE__ == 0){
    AJAX.pictureUrl = "http://api.corp.demo.tgogo.net";  //上传图片显示地址
    AJAX.url = "http://admin.corp.demo.tgogo.net/WEBAPI/api/";
    AJAX.areaXML = "../../js/region.xml";  //xml相对于pages里面的html的地址
    AJAX.tgogoSiteUrl = "http://www.tgogo.net";  //商城主站的Url，后台查看商品和抢购拼接链接需要
    AJAX.fileUploadUrl = "http://admin.corp.demo.tgogo.net/WEBAPI/api/product/UploadPictureByIframe";
}

//线上正式
if(__USE_TYPE__ == 1){
    AJAX.pictureUrl = "http://api.corp.tgogo.net";
    AJAX.url = "http://admin.corp.tgogo.net/WEBAPI/api/";
    AJAX.areaXML = "../../js/region.xml";
    AJAX.tgogoSiteUrl = "http://www.tgogo.net";
    AJAX.fileUploadUrl = "http://admin.corp.tgogo.net/WEBAPI/api/product/UploadPictureByIframe";
}

//测试
if(__USE_TYPE__ == 2){
    AJAX.pictureUrl = "http://172.18.253.243:8002";
    AJAX.url = "http://172.18.253.240:8080/WEBAPI/api/";
    AJAX.areaXML = "../../js/region.xml";
    AJAX.tgogoSiteUrl = "http://www.tgogo.net";
    AJAX.fileUploadUrl = "http://172.18.253.240:8080/WEBAPI/api/product/UploadPictureByIframe";
}












O2O = {
    openNewWindow: function(opt,id){
        id = id || "s" + new Date().getTime();
        Core.create(id,{
            title:opt.title,
            url:opt.url,
            width:opt.width,
            height:opt.height,
            resize:false
        })
    },
    closeWindow:function(id){
        $('.task-window li[window="'+id+'"]').remove();
        $("#window_"+id+"_warp").remove();
    },
    refreshWindow:function(id){
        window.frames["frame"+id].window.location.reload();
//        $("#frame"+id).attr("src",$("#frame"+id).attr("src"));
    },
    inputType:{
        TextBox:"text",
        UploadControl:"imageUpload",
        AddSelect:"area",
        TextBoxColor:"colorSelect"
    }
};