


//--------------------------------------------------------------------------------------
//获取商品等级列表
top.AJAX.getProductLevelList({
    callback:function(rs){

    }
});
//--------------------------
//@rs  返回的列表记录,数组包对象
//[{
//    AddedDate: "2014-07-09T11:15:11",               //数据生成时间
//    LevelDesc: "等等等等级111111",                   //等级说明
//    LevelName: "等级1",                               //等级名称
//    ProLevel: 1,                                     //等级数字
//    ProductLevelID: 1,                               //id
//    UpdateedDate: "2014-07-09T11:15:11"              //数据更新时间
//}]



//文章部分.........................................................
//获取文章列表(商家咨询)(滚动加载的.....)
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getArticlesList",         //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"ArticleId",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:""                          //@param:str        //查询输入的文字
    }
});

//获取文章详情(咨询详情)
top.AJAX.getArticleDetail({
    data:{
        articleId:""            //@param:int   咨询id
    },
    callback:function(rs){      //@param:fn    获取数据成功执行

    }
});

//文章增加(增加咨询)
top.AJAX.addArticleDetail({
    data:{
        CategoryId:"",          //咨询类别id  @param:int
        Title:"",               //标题       @param:str    200字符
        Meta_Description:"",    //meta说明   @param:str
        Meta_Keywords:"",       //meta关键字  @param:str
        Description:"",         //摘要        @param:str
        ArticleTag:"",          //文章关键字     @param:str
        Content:"",             //内容        @param:str
        IsShow:"",              //是否显示      @param:Boolean
        ArticlePicUrl:""        //咨询图片      @param:str
    },
    callback:function(rs){      //@param:fn    获取数据成功执行
        console.log(rs)
    }
});

//文章删除(删除咨询)
top.AJAX.delArticleDetail({
    data:{
        articleId:""
    },
    callback:function(rs){      //@param:fn    获取数据成功执行
        console.log(rs)
    }
});

//文章修改保存(保存咨询)
top.AJAX.editArticleDetail({
    data:{
        ArticleId:"",           //咨询id     @param:int
        CategoryId:"",          //咨询类别id  @param:int
        Title:"",               //标题       @param:str    200字符
        Meta_Description:"",    //meta说明   @param:str
        Meta_Keywords:"",       //meta关键字  @param:str
        Description:"",         //摘要        @param:str
        ArticleTag:"",          //文章关键字     @param:str
        Content:"",             //内容        @param:str
        IsShow:"",              //是否显示      @param:Boolean
        ArticlePicUrl:""        //咨询图片      @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});

//文章类别列表
top.AJAX.getArticlesTypeList({
    callback:function(rs){
        console.log(rs)
    }
});

//增加文章类别
top.AJAX.addArticlesType({
    data:{
        Name:"aaa",                      //类别名   @param:str
        DisplaySequence:1,          //数字大的在前面   @param:int
        Description:"密密麻麻免费的"                //说明      @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});

//删除文章类别
top.AJAX.delArticlesType({
    data:{
        categoryid:""            //@param:int   类别id
    },
    callback:function(rs){
        console.log(rs)
    }
});

//修改文章类别
top.AJAX.editArticlesType({
    data:{
        CategoryId:2,                  //类别id    @param:int
        Name:"aaa",                      //类别名   @param:str
        DisplaySequence:1,          //数字大的在前面   @param:int
        Description:"密密麻麻免费的"                //说明      @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});



//文章评论部分......................................................
//文章评论列表(商家咨询评论列表)
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getArticleCommentList",         //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"id",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:""                         //@param:str        //查询输入的文字
    }
});

//文章评论增加
top.AJAX.addArticleComment({
    data:{
        ParentId:0,          //@param:int   评论的父级id,没有父级传0
        RelateID:263,        //@param:int   咨询id
        Content:"232323"     //@param:str   内容
    },
    callback:function(rs){
        console.log(rs)
    }
});

//评论编辑是否显示
top.AJAX.editArticleComment({
    data:{
        id:105,            //@param:int 评论id
        showState:0       //@param:int 显示状态  1:显示 0:不显示
    },
    callback:function(rs){
        console.log(rs)
    }
});







//商品部分......................................................
//获取商品分类列表
top.AJAX.getProductTypeList({
    callback:function(rs){
        console.log(rs)
    }
});

//新增商品分类
top.AJAX.addProductType({
    data:{
        Name:"test"                 //添加名       @param:str  0-60字符
    },
    callback:function(rs){
        console.log(rs)
    }
});

//修改商品分类
top.AJAX.editProductType({
    data:{
        Name:"test",                 //添加名       @param:str   0-60字符
        CategoryId:""                //分类id       @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//删除商品分类
top.AJAX.delProductType({
    data:{
        CategoryId:3                //分类id       @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//是否显示商品分类
top.AJAX.isUseProductType({
    data:{
        CategoryId:3,                //分类id       @param:int
        isshow:""                    //是否显示      @param:Boolean    true:显示, false:不显示
    },
    callback:function(rs){
        console.log(rs)
    }
});

//商品分类排序
top.AJAX.sortProductType({
    data:{
        list:[
            {
                ID:"",                      //param:int   分类id
                DisplaySequeceNum:""        //param:int   排序值
            }
        ]
    },
    callback:function(rs){
        console.log(rs)
    }
});



//获取商品等级列表
top.AJAX.getProductLevelList({
    callback:function(rs){

    }
});

//商品等级添加
top.AJAX.addProductLevel({
    data:{
        LevelName:"",           //等级名称  @param:str   0-200字符
        ProLevel:"",            //商品等级  @param:int
        LevelDesc:"",           //等级说明  @param:str
        upload:{
            UploadPath:"",      //上传的图片地址
            UploadPageUrl:window.location.pathname    //当前页面地址全路径不需要域
        }
    },
    callback:function(rs){
        console.log(rs)
    }
});

//商品等级修改
top.AJAX.editProductLevel({
    data:{
        ProductLevelID:"",      //等级id   @param:int
        LevelName:"",           //等级名称  @param:str   0-200字符
        ProLevel:"",            //商品等级  @param:int
        LevelDesc:"",           //等级说明  @param:str
        upload:{
            UploadPath:"",      //上传的图片地址(上传时返回的地址)   @param:Str
            UploadPageUrl:window.location.pathname    //当前页面地址全路径不需要域 @param:Str
        }
    },
    callback:function(rs){
        console.log(rs)
    }
});

//商品等级删除
top.AJAX.delProductLevel({
    data:{
        productlevelid:""      //等级id   @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//是否显示商品等级
top.AJAX.isUseProductLevel({
    data:{
        productlevelid:"",       //商品等级id  @param:int
        isshow:""                 //是否显示   @param:boolean   true:显示  false:不显示
    },
    callback:function(rs){
        console.log(rs)
    }
});



//获取商品列表
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getProductList",         //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"productId",                 //@param:str       滚动加载需要的key
    searchData:{
        productName:""                         //@param:str        //查询输入的文字
    }
});

//增加商品
top.AJAX.addProduct({
    data:{
        CategoryId:"",                      //@param:int   商品分类id
        ProductName:"",                     //@param:str   商品名称   0-60
        ShortDescription:"",                //@param:str   商品简介   富文本里面的html
        Description:"",                     //@param:str    商品描述  富文本里面的html
        Title:"",                           //@param:str    前台显示页面标题
        Meta_Description:"",                //@param:str    你懂的
        Meta_Keywords:"",                   //@param:str    你懂的
        DisplaySequence:"",                 //@param:int    排序 >0
        MarketPrice:"",                     //@param:float  市场价eg  12.00
        ProductNewCode:"",                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
        ProductLevelRelation:{
            ProductLevelID:""               //@param:int
        },
        ProductRelatedCoupon:{
            CouponOutType:"",               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
            SetCouponOutDate:"",            //@param:int  过期时间(时间戳)
            SetCouponOutDays:""             //@param:int  过期天数
        },
        ProductTagList:[
            {
                TagId:""                    //@param:int 商品标签id
            },
            //....
        ],
        UploadList:[
            {
                UploadPath:"",              //@param:str
                UploadPageUrl:""            //@param:str
            }
        ]
    },
    callback:function(rs){
        console.log(rs)
    }
});

//修改商品
top.AJAX.editProduct({
    data:{
        ProductId:"",                       //@param:int   商品id
        CategoryId:"",                      //@param:int   商品分类id
        ProductName:"",                     //@param:str   商品名称   0-60
        ShortDescription:"",                //@param:str   商品简介   富文本里面的html
        Description:"",                     //@param:str    商品描述  富文本里面的html
        Title:"",                           //@param:str    前台显示页面标题
        Meta_Description:"",                //@param:str    你懂的
        Meta_Keywords:"",                   //@param:str    你懂的
        DisplaySequence:"",                 //@param:int    排序 >0
        MarketPrice:"",                     //@param:float  市场价eg  12.00
        ProductNewCode:"",                  //@param:str    商品编码6位,前2位为商品分类id(1位前面自动补0),后四位手动输入
        ProductLevelRelation:{
            ProductLevelID:""               //@param:int
        },
        ProductRelatedCoupon:{
            CouponOutType:"",               //@param:int  过期类别  0,1  0时只填SetCouponOutDate,1填SetCouponOutDays
            SetCouponOutDate:"",            //@param:int  过期时间(时间戳)
            SetCouponOutDays:""             //@param:int  过期天数
        },
        ProductTagList:[
            {
                TagId:""                    //@param:int 商品标签id
            },
            //....
        ],
        UploadList:[
            {
                UploadPath:"",              //@param:str
                UploadPageUrl:""            //@param:str
            }
        ]
    },
    callback:function(rs){
        console.log(rs)
    }
});

//删除商品
top.AJAX.delProduct({
    data:{
        productId:""       //商品id  @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//获取商品详细信息
top.AJAX.getProductInfo({
    data:{
        productId:""       //商品id  @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//修改商品显示状态
top.AJAX.isUseProduct({
    data:{
        productId:"",       //商品id  @param:int
        isshow:""           //是否显示  @param:boolean   true/false
    },
    callback:function(rs){
        console.log(rs)
    }
});

//增加商品标签
top.AJAX.addProductTag({
    data:{
        tagName:""       //标签名  @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});

//获取商品标签
top.AJAX.getProductTagList({
    data:{
        TagID:"",       //标签id  @param:int
        TagName:""     //标签名  @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});


//修改商品比价
top.AJAX.editProductParity({
    data:[{
        CouponProductId:"",         //商品id   @param:int
        BusinessesId:"",            //比价来源商家id(eg:淘宝)  @param:int
        Sort:"",                    //排序    @param:int
        SourcesOfPrice:"",          //价格    @param:float   eg:12.00
        PriceSourcesUrl:""          //来源地址  @param:str
    }],
    callback:function(rs){
        console.log(rs)
    }
});



//获取商品评论列表
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getProductCommentList",   //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"id",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:""                         //@param:str        //查询输入的文字
    }
});


//获取比价商品信息列表
top.AJAX.getCouponBusinessesList({
    data:{
        queryKey:""     //@param:str   查询条件
    },
    callback:function(rs){
        console.log(rs)
    }
});


//添加比价商家
top.AJAX.addCouponBusinessesList({
    data:{
        BusinessesName:"",          //商家名称     @param:str   0-10str
        BusinessesIcon:"",          //商家图标     @param:int
        BusinessesUrl:"",           //商家官网     @param:str
        IsShow:""                   //是否显示     @param:boolean   true/false
    },
    callback:function(rs){
        console.log(rs)
    }
});


//修改商家比价
top.AJAX.editCouponBusinessesList({
    data:{
        BusinessesId:"",            //商家id      @param:int
        BusinessesName:"",          //商家名称     @param:str   0-10str
        BusinessesIcon:"",          //商家图标     @param:int
        BusinessesUrl:"",           //商家官网     @param:str
        IsShow:""                   //是否显示     @param:boolean   true/false
    },
    callback:function(rs){
        console.log(rs)
    }
});

//删除商家比价
top.AJAX.delCouponBusinessesList({
    data:{
        businessesId:""           //商家id      @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});


//订单部分......................................................
//获取订单列表
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getManageorderList",   //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"orderId",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:"",                         //@param:str        //查询输入的文字
        orderStatus:""                        //@param:int          //订单状态
        //0:未提交,1:待支付,2:待发货,3:已发货,4:关闭,5:完成
    }
});

//删除订单
top.AJAX.delManageorder({
    data:{
        orderId:""           //订单id      @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//获取订单详情
top.AJAX.getManageorderInfo({
    data:{
        orderId:""           //订单id      @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//订单发货
top.AJAX.sendGoods({
    data:{
        OrderId:"",                   //订单id      @param:int
        ShippingModeId:"",            //订单来源id   @param:int
        RealShippingModeId:"",        //快递类型id    @param:int
        ShipOrderNumber:"",            //运货单号     @param:Str
        ShipTo:"",                    //收货人     @param:Str
        CellPhone:"",                 //手机号码     @param:Str
        TelPhone:"",                  //座机号码     @param:Str
        Address:"",                   //地址      @param:Str
        ZipCode:""                      //邮编     @param:Str
    },
    callback:function(rs){
        console.log(rs)
    }
});

//优惠劵发货
top.AJAX.sendCoupon({
    data:{
        OrderId:"",                   //订单id      @param:int
        CouponNote:""                 //订单备注     @param:str
    },
    callback:function(rs){
        console.log(rs)
    }
});


//优惠劵部分.....................................................
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getCouponList",          //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"couponId",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:""                         //@param:str        //查询输入的文字
    }
});

//优惠劵删除
top.AJAX.delCoupon({
    data:{
        couponId:""             //优惠劵id   @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});

//打折码部分
$.scrollLoadInterval({
    runIn:this,                               //加个回调执行对象
    mainDiv:$("body"),                        //@param:jqobj     列表需要插入的obj
    buttonLength:200,                         //@param:int       距离底部多少开始加载数据,默认200
    getDataApiName:"getDiscountCodeList",          //@param:str       调用的api接口名
    bindDataFn:function(){},                  //@param:function 数据绑定函数
    scrollForKey:"discountId",                 //@param:str       滚动加载需要的key
    searchData:{
        searchKey:""                         //@param:str        //查询输入的文字
    }
});

//打折码删除
top.AJAX.delDiscountCode({
    data:{
        discountId:""             //打折码id   @param:int
    },
    callback:function(rs){
        console.log(rs)
    }
});














