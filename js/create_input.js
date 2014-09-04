/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 14-8-18
 * Time: 上午10:55
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */


//调用样例  （支持自动生成text、textarea、select、imageUpload、checkbox、富文本编辑器）

//$(document).ready(function(){
//    bb = new CREATE_INPUT({
//        data:[
//            //text
//            {
//                title:"测试",
//                type:"text",
//                id:"test",
//                msg:"test_______123",
//                isMust:true,
//                val:"test"
//            },
//            //textarea
//            {
//                title:"测试1",
//                type:"textarea",
//                id:"test1",
//                msg:"testarea_______123",
//                isMust:true,
//                val:"test1"
//            },
//            //select
//            {
//                title:"测试2",
//                type:"select",
//                id:"test2",
//                msg:"请选择×××",
//                isMust:false,
//                val:[{id:0,val:"成都",select:false},{id:1,val:"上海",select:true}]
//            },
//            //area
//            {
//                title:"测试3",
//                type:"area",
//                id:"test3",
//                msg:"请选择×××",
//                isMust:false,
//                val:3136        //省市区最后一个区的id
//            },
//            //imageUpload
//            {
//                title:"测试4",
//                type:"imageUpload",
//                id:"test4",
//                msg:"请选择×××,大小100*100",
//                isMust:false,
//                maxNumber:5,
//                val:[
//                    "http://www.tgogo.net/TemplateSeries/BeautifulWest/image/banner-txt.png",
//                    "http://tgoimg.tgogo.net/activity/20140814/05174e2827734aa6a0fd2536ce86b771.jpg"
//                ]
//            },
//            //checkbox
//            {
//                title:"测试5",
//                type:"checkbox",
//                id:"test5",
//                msg:"请选择×××",
//                isMust:false,
//                val:[
//                    {id:0,val:"成都",select:false},
//                    {id:1,val:"上海",select:true},
//                    {id:2,val:"上海1",select:true}
//                ]
//            },
//            //super text area
////            需要先挂载-------------------------------
////                <link rel="stylesheet" href="../../doc_edit/themes/default/default.css" />
////                <script charset="utf-8" src="../../doc_edit/kindeditor-min.js"></script>
////                <script charset="utf-8" src="../../doc_edit/lang/zh_CN.js"></script>
//            {
//                title:"测试6",
//                type:"superTextArea",
//                id:"test6",
//                msg:"43123123123123123123123",
//                isMust:true,
//                val:"test"
//            },
//            //colorSelect
///           需要先挂载-------------------------------
////          <link rel="stylesheet" href="../../colorpicker/css/colorpicker.css" type="text/css" />
////          <script type="text/javascript" src="../../colorpicker/js/colorpicker.js"></script>
////          <script type="text/javascript" src="../../colorpicker/js/eye.js"></script>
////          <script type="text/javascript" src="../../colorpicker/js/utils.js"></script>
////          <script type="text/javascript" src="../../colorpicker/js/layout.js?ver=1.0.2"></script>
//            {
//                title:"测试7",
//                type:"colorSelect",
//                id:"test7",
//                msg:"43123123123123123123123",
//                isMust:true,
//                val:"ff0000"
//            }
//
//        ],
//        body:$("body")
//    });
//});

var CREATE_INPUT = function(data){
    this.data = data.data;
    this.body = data.body;

    this.bodyWidth = parseInt(this.body.width());

    this.cache = [];
    this.objs = {};
    this.id = 0;

    this.init();

};

CREATE_INPUT.prototype = {
    init:function(){
        for(var i= 0,l=this.data.length;i<l;i++){
            var obj = this.createDiv(),
                this_data = this.data[i],
                type = this_data.type,
                input = null,
                fn = null;

            if(type && this["create_"+type]){
                input = this["create_"+type](this_data,obj);
                if(input && input.obj){
                    obj.main.append(input.obj);
                }
                if(input && input.fn){
                    fn = input.fn;
                }
            }


            obj.title.text(this_data.title+":");
            if(this_data.isMust){
                obj.start.text("*");
            }



            this.body.append(obj.div);
            if(fn){
                fn();
            }
        }

    },
    //创建行div
    createDiv:function(){
        var div = $("<div></div>"),
            title = $("<div></div>"),
            start = $("<div></div>"),
            main = $("<div></div>"),
            clear = $("<div></div>");

        div.css({
            width:"100%",
            "line-height":"30px",
            position:"relative",
            margin:"10px 0"
        });
        title.css({
            width:"120px",
//            background:"#ccc",
            height:"30px",
            float:"left",
            "text-align":"right"
        });
        start.css({
            float:"left",
            width:"10px",
            height:"30px",
            color:"red",
            "padding-left":"5px",
            "line-height":"35px"
        });
        var width = this.bodyWidth - 200;
        main.css({
            float:"left",
            width:width+"px"

        });
        clear.css({
            clear:"both"
        });

        div.append(title).append(start).append(main).append(clear);
        return {
            div:div,
            title:title,
            start:start,
            main:main
        };
    },
    //创建提示文字
    createInfo:function(msg){
        var obj = $("<span>"+msg+"</span>");
        obj.css({"padding-left":"20px",color:"#999"});
        return obj;
    },
    //获取数据
    getData:function(){
        var obj = {};
        for(var i= 0,l=this.cache.length;i<l;i++){
            var key = this.cache[i].key,
                val = this.cache[i].val();

            obj[key] = val;
        }
        return obj;
    },
    //获取id
    getId:function(){
        this.id ++;
        return this.id;
    },
    //销毁
    destroy:function(){

    },

    //创建input  type=text
    create_text:function(data){
        var obj = $("<input type='text' />");
        obj.attr({id:data.id}).val(data.val);
        obj.css({
            "font-size": "14px",
            width: "240px",
            height: "16px",
            "line-height": "16px",
            padding: "4px"
        });

        var wrap = $("<div></div>");

        wrap.append(obj);

        if(data.msg){
            var msg = this.createInfo(data.msg);
            wrap.append(msg);
        }

        this.cache.push({
            key:data.id,
            val:function(){
                return $.trim(obj.val());
            }
        });

        return {
            obj:wrap
        };
    },
    //创建textarea
    create_textarea:function(data,div){
        var obj = $("<textarea></textarea>");
        obj.attr({id:data.id}).val(data.val);
        obj.css({
            width:"300px",
            height:"100px",
            border:"1px solid #ccc",
            "text-indent":"1em"
        });

        var wrap = $("<div></div>");

        if(data.msg){
            var msg = this.createInfo(data.msg);

            msg.css({
                "padding-left":0
            });
            wrap.append(msg);
            wrap.append("<br/>");
        }
        wrap.append(obj);

        this.cache.push({
            key:data.id,
            val:function(){
                return $.trim(obj.val());
            }
        });

        return {
            obj:wrap
        };
    },
    //创建select
    create_select:function(data){
        var obj = $("<select></select>");
        obj.attr({id:data.id});
        obj.css({
            border:"1px solid #ccc"
        });
        var selects = data.val || [];
        for(var i= 0,l=selects.length;i<l;i++){
            var this_data = selects[i],
                is_select = this_data.select;

            if(is_select){
                obj.append("<option value='"+this_data.id+"' selected='selected'>"+this_data.val+"</option>");
            }else{
                obj.append("<option value='"+this_data.id+"'>"+this_data.val+"</option>");
            }


        }


        var wrap = $("<div></div>");
        wrap.append(obj);

        if(data.msg){
            var msg = this.createInfo(data.msg);
            wrap.append(msg);
        }


        this.cache.push({
            key:data.id,
            val:function(){
                return $.trim(obj.val());
            }
        });

        return {
            obj:wrap
        };
    },
    //创建area  省市区
    create_area:function(data,div){
        if(data.msg){
            var msg = this.createInfo(data.msg);
            msg.css({"padding-left":0});
            div.main.append(msg);
            div.main.append("<br/>");
        }

        var divs = $("<div></div>"),
            val = data.val || "",
            xml = (top.AJAX)? top.AJAX.areaXML :  "js/region.xml";
        divs.province_city_county(xml,"","","",val);


        this.cache.push({
            key:data.id,
            val:function(){
                return divs.find("select").eq(2).val();
            }
        });

        return {
            obj:divs
        };
    },
    //创建上传图片组建
    create_imageUpload:function(data,div){
        if(data.msg){
            var msg = this.createInfo(data.msg);
            msg.css({"padding-left":0});
            div.main.append(msg);
            div.main.append("<br/>");
        }


        var main = div.main,
            time = new Date().getTime(),
            form = $("<form id='form"+time+"'></form>"),
            input = $("<input id='input"+time+"' type='file' name='file' />"),
            vals = data.val || [],
            show_div = $("<div id='show_div"+time+"'></div>"),
            ajax_url = (top.AJAX)? top.AJAX.fileUploadUrl :  "http://172.18.254.158:8025/WEBAPI/api/product/UploadPictureByIframe";

        form.append(input);
        main.append(form).append(show_div);


        this.cache.push({
            key:data.id,
            val:function(){
                var array = [];
                show_div.find("img").each(function(){
                   var src = $(this).attr("src");
                    array.push(src);
                });
                return array;
            }
        });


        var _id = this.getID(),
            _time = new Date().getTime(),
            _random = parseInt(Math.random()*10000);

        return {
            fn:function(){
                window["abc"+_time+"_"+_id+"_"+_random] = new $.uploadFile({
                    id:"input"+time,      //input[type='file']的 id   @param:str
                    formId:"form"+time,              //表单id                     @param:str
                    types:"jpg,jpeg,png",       //上传文件类型                @param:str
                    maxNumber:data.maxNumber,                //最大能上传好多张图片          @param:int
                    //服务器地址                  @param:str
                    serverSrc:ajax_url,
                    showImageWrapId:"show_div"+time,      //图片上传完后显示区域id        @param:str
                    imgs:vals                  //已存在的图片                 @param:array
                });

            }
        };



    },
    //创建多选框
    create_checkbox:function(data,div){
        var wrap = $("<div></div>"),
            datas = data.val;

        for(var i= 0,l=datas.length;i<l;i++){
            var list = $("<div></div>"),
                this_data = datas[i],
                checked = this_data.select,
                input = $("<input type='checkbox' name='"+data.id+"' value='"+this_data.id+"' />"),
                span = $("<span>"+this_data.val+"</span>");

            if(checked){
                input.attr({checked:true});
            }
            list.css({
                float:"left", padding:"0 10px"
            });

            list.append(input).append(span);
            wrap.append(list);
        }

        wrap.append("<div style='clear: both;'></div>");


        var body = $("<div></div>");


        if(data.msg){
            var msg = this.createInfo(data.msg);
            msg.css({"padding-left":0});
            body.append(msg);
            body.append("<br/>");
        }

        body.append(wrap);



        this.cache.push({
            key:data.id,
            val:function(){
                var array = [];
                wrap.find("input").each(function(){
                    if($(this).get(0).checked == true){
                        array.push($(this).val());
                    }
                });
                return array;
            }
        });

        return {
            obj:body
        };

    },
    //创建富文本框
    create_superTextArea:function(data){
        var body = $("<div></div>"),
            id = this.getId(),
            _this = this;

        if(data.msg){
            var msg = this.createInfo(data.msg);
            msg.css({"padding-left":0});
            body.append(msg);
            body.append("<br/>");
        }
        var text = $("<textarea name='content"+id+"'></textarea>");
        body.append(text);




        this.cache.push({
            key:data.id,
            val:function(){
                return _this.objs[id].html();
            }
        });


        return {
            obj:body,
            fn:function(){

                KindEditor.ready(function(K) {
                    var _temp = 'textarea[name="content'+id+'"]';
                    _this.objs[id] = K.create(_temp, {
                        height:"300px",
                        items:[ 'source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                            'anchor', 'link', 'unlink']
                    });

                    _this.objs[id].html(data.val);   //初始赋值
                });
            }
        };
    },
    //创建颜色选择器
    create_colorSelect:function(data){
        var obj = $("<input type='text' />");
        obj.attr({id:data.id}).val(data.val);
        obj.css({
            "font-size": "14px",
            width: "100px",
            height: "16px",
            "line-height": "16px",
            padding: "4px"
        });

        var wrap = $("<div></div>");

        wrap.append(obj);

        if(data.msg){
            var msg = this.createInfo(data.msg);
            wrap.append(msg);
        }

        obj.ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
                $(el).val(hex);
                $(el).ColorPickerHide();
            },
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(this.value);
            }
        }).bind('keyup', function(){
            $(this).ColorPickerSetColor(this.value);
        });


        this.cache.push({
            key:data.id,
            val:function(){
                return $.trim(obj.val());
            }
        });

        return {
            obj:wrap
        };
    },
    getID:(function(){
        var i=0;
        return function(){
            return i++;
        };
    })()
};







