//$.device
(function(){
    var dummyStyle = document.createElement("div").style,
        vendor = (function () {
            if(window.navigator.msPointerEnabled){return "";}
            if("MozTransform" in dummyStyle){return "";}
            var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
        prefixStyle = function(style){
            if ( !vendor ) return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        },
        has3d = prefixStyle('perspective') in dummyStyle,
        css_s = (has3d)? "translate3d(" : "translate(",
        css_e = (has3d)? ",0)" : ")",


        _transform = prefixStyle('transform'),
        _transitionProperty = prefixStyle('transitionProperty'),
        _transitionDuration = prefixStyle('transitionDuration'),
        _transformOrigin = prefixStyle('transformOrigin'),
        _transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        _transitionDelay = prefixStyle('transitionDelay'),

        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        isWindows = (window.navigator.msPointerEnabled)? true : false,
        isIe = (navigator.appName == "Microsoft Internet Explorer"),
//        isWindows = navigator.userAgent.match(/MSIE 10/i)?true:false,
//        isWindows = false,

        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,


        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : (window.navigator.msPointerEnabled)? 'MSPointerDown' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : (window.navigator.msPointerEnabled)? 'MSPointerMove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : (window.navigator.msPointerEnabled)? 'MSPointerUp' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : (window.navigator.msPointerEnabled)? 'MSPointerUp' : 'mouseup',
        TRNEND_EV = (function () {
            if ( vendor === false ) return "transitionend";

            var transitionEnd = {
                ''			: 'transitionend',
                'webkit'	: 'webkitTransitionEnd',
                'Moz'		: 'transitionend',
                'O'			: 'otransitionend',
                'ms'		: 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),
        nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),
        counter = (function(){
            var a = 0;
            return function(){
                a += 1;
                return a;
            }
        })(),
        androidVer = (function(){
            var a = navigator.appVersion,
                b = a.indexOf("Android");
            if(b>=0){
                var c = b+ 7,
                    d = a.substr(c);
                return parseFloat(d).toFixed(1);
            }else{
                return null;
            }
        })(),
        windowVer = (function(){
            var a = navigator.appVersion,
                b = a.indexOf("MSIE");
            if(b>=0){
                var c = a.split("MSIE")[1];
                return parseInt($.trim(c));
            }else{
                return null;
            }
        })(),
    //TODO 获全系统版本号
        ver = (function(){
            if(isAndroid){
                return androidVer;
            }else if(isIDevice){
                return null;
            }else{
                return windowVer;
            }
        })(),
        language = (navigator.browserLanguage || navigator.language).toLowerCase();
        getCssName = function(style){
            if ( isWindows ) return style;

            style = cssVendor+style;
            return style;
        },
        box = (isWindows)? "-ms-flexbox" : cssVendor+"box",
        box_shadow = getCssName("box-shadow"),
        boxPack = (isWindows)? "-ms-flex-pack" : cssVendor+"box-pack",
        boxAlign = (isWindows)? "-ms-flex-align" : cssVendor+"box-align",
        boxFlex = (isWindows)? "-ms-flex" : cssVendor+"box-flex",
        boxOrient = (isWindows)? "-ms-flex-direction" : cssVendor+"box-orient",
        boxOrientRow = (isWindows)? "row" : "horizontal",
        boxVertical = (isWindows)? "column" : "vertical",
        backgroundSize = getCssName("background-size"),
        transform = getCssName("transform"),
        border_radius = (isWindows || (isAndroid && androidVer == "4.2" ))? "border-radius" : cssVendor+"border-radius",
        box_sizing = getCssName("box-sizing"),
        background_clip = getCssName("background-clip"),
        border_bottom_left_radius = getCssName("border-bottom-left-radius"),
        border_bottom_right_radius = getCssName("border-bottom-right-radius"),
        border_top_left_radius = getCssName("border-top-left-radius"),
        border_top_right_radius = getCssName("border-top-right-radius"),
        backface_visibility = getCssName("backface-visibility"),
        transition = getCssName("transition"),
        transition_property = getCssName("transition-property"),
        transition_duration = getCssName("transition-duration"),
        transition_timing_function = getCssName("transition-timing-function");


    var css = {
            "box":box,
            "box-align":boxAlign,
            "box-pack":boxPack,
            "background-size":backgroundSize,
            "background-clip":background_clip,
            "box-flex":boxFlex,
            "box-orient":boxOrient,
            "horizontal":boxOrientRow,
            "vertical":boxVertical,
            "transform":transform,
            "border-radius":border_radius,
            "border-bottom-left-radius":border_bottom_left_radius,
            "border-bottom-right-radius":border_bottom_right_radius,
            "border-top-left-radius":border_top_left_radius,
            "border-top-right-radius":border_top_right_radius,
            "box-sizing":box_sizing,
            "box-shadow":box_shadow,
            "backface-visibility":backface_visibility,
            "transition":transition,
            "transition-property":transition_property,
            "transition-duration":transition_duration,
            "transition-timing-function":transition_timing_function
        },
        gz = (function(){
            var reg,a=[];
            for(var key in css){
                if(key == "box" || key == "transition"){
                    //                a.push("([^-])box(?!-)");
                    a.push("([^-]"+key+"[^-])");
                }else if(key == "horizontal" || key == "vertical"){
                    a.push(key);
                }else{
                    a.push("([^-]"+key+")");
                }

            }
            reg = a.join("|");
            return new RegExp(reg,"ig");
        })(),
        css_prefix = function(data){
            var text = JSON.stringify(data),
                newtext = cssfile_prefix(text);
            return JSON.parse(newtext);
        },
        cssfile_prefix = function(data){
            return  data.replace(gz,function(a){
                var str = a.substr(1, a.length-2);
                if(str == "box" || str == "transition"){
                    var newstr = css[str];
                    return a.substr(0,1)+newstr+ a.substr(a.length-1);
                }else if(a == "horizontal" || a == "vertical"){
                    return css[a];
                }else{
                    return a.substr(0,1)+css[a.substr(1)];
                }
            });
        },
        fix_css = function(css){
            css = css.replace(/;/ig," ; ");
            return cssfile_prefix(css);
        };


    dummyStyle = null;



    $.device = {
        has3d:has3d,                //是否支持3d
        hasTouch:hasTouch,           //是否是触摸屏
        hasTransform:hasTransform,  //是否支持变形

        isAndroid:isAndroid,        //android   true false
        isIDevice:isIDevice,        //iphone，ipad
        isTouchPad:isTouchPad,      //hp
        isWindows:isWindows,        //windows phone
        isIe:isIe,                  //ie浏览器

        RESIZE_EV:RESIZE_EV,        //窗口变化
        START_EV:START_EV,          //点击
        MOVE_EV:MOVE_EV,            //移动
        END_EV:END_EV,              //释放
        CANCEL_EV:CANCEL_EV,        //结束
        TRNEND_EV:TRNEND_EV,        //变形结束 webkitTransitionEnd
        nextFrame:nextFrame,
        cancelFrame:cancelFrame,


        touchStartMove:10,       //触摸滚动触发距离，点击失败移动距离 px
        jg:600,					//同一个对象点击触发时间间隔  ms
        slideTriggerLength:10,		//长滑触发的距离 px
        slideLength:20,			//长滑的距离?? 倍
        outRangeLength:100,			//超出后还可以滑动的距离 px
        longClickTime:1000,			//长按触发时间	ms
        clickdelay:10,				//点击事件延迟触发时间  ms  touchstart
        slideTriggerMaxTime:1000,   //滑动触发的有效时间
//        size:deviceSize,       //设备屏幕大小   s m l     取法：  320   540分成3档
        androidVer:androidVer,       //android版本
        ver:ver,                     //系统版本
        language:language,          //语言版本  zh-cn

        counter:counter,                 //计数器  fn


        //原生的用无 -
        _transform:_transform,        //自动添加前缀
        _transitionProperty:_transitionProperty,
        _transitionDuration:_transitionDuration,
        _transformOrigin:_transformOrigin,
        _transitionTimingFunction:_transitionTimingFunction,
        _transitionDelay:_transitionDelay,

        //兼容ie10的css属性
        cssVendor:cssVendor,        //css前缀   -webkit-
        css_s:css_s,                //变形前缀    translate3d(
        css_e:css_e,                //变形后缀      ,0)
        box:box,
        box_pack:boxPack,
        box_align:boxAlign,
        box_flex:boxFlex,
        box_orient:boxOrient,
        horizontal:boxOrientRow,
        vertical:boxVertical,
        background_size:backgroundSize,
        transform:transform,
        border_radius:border_radius,
        box_sizing:box_sizing,
        box_shadow:box_shadow,
        background_clip : background_clip,
        border_bottom_left_radius : border_bottom_left_radius,
        border_bottom_right_radius : border_bottom_right_radius,
        border_top_left_radius : border_top_left_radius,
        border_top_right_radius : border_top_right_radius,
        backface_visibility : backface_visibility,
        transition : transition,
        transition_property : transition_property,
        transition_duration : transition_duration,
        transition_timing_function : transition_timing_function,

        //css自动替换
        css_prefix:css_prefix,
        cssfile_prefix:cssfile_prefix,
        fixCss:fix_css

    }



})();


$.trim = function(str){
    str = str || "";
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

//stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
$.stamp2time = function(b){
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year=a.getFullYear();
    var month=parseInt(a.getMonth())+1;
    month= (month<10)? "0"+month : month;
    var date=a.getDate();
    date= (date<10)? "0"+date : date;
    var hours=a.getHours();
    hours= (hours<10)? "0"+hours : hours;
    var minutes=a.getMinutes();
    minutes= (minutes<10)? "0"+minutes : minutes;
    var seconds=a.getSeconds();
    seconds= (seconds<10)? "0"+seconds : seconds;

    return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
};
//传入时间戳，输出日期部分
$.stamp2date = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    return year + "-" + month + "-" + date;
};
//a :   2012-12-13   2012-12-12 12:12:33  自动补位
$.time2stamp = function(a){
    var new_str = a.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    if(arr.length != 6){
        for(var i= 0,l=6-arr.length;i<l;i++){
            arr.push(0);
        }
    }

    return new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5])).getTime();
};

$.getArray = function(str){
    return ($.isArray(str))? str : [];
};
$.getFunction = function(fn){
    return ($.isFunction(fn))? fn : function(){};
};
$.getNumber = function(str){
    str = parseInt(str);
    str = str || 0;
    return str;
};
$.getBoolean = function (str) {
    var rs = false;
    if (typeof str != "undefined") {
        str = str.toString().toLowerCase();
        rs = (str == "true" || str == "t" || parseInt(str) > 0);
    }
    return rs;
};
$.convert = function (convertFunction, json, fields) {
    if ($.type(json) != "undefined" && json != null && $.type(fields) != "undefined") {
        if ($.type(fields) === "string") fields = fields.split(",");
        fields = fields.distinct();
        $.each(fields, function (index, item) {
            json[item] = convertFunction(json[item]);
        });
    }
    return json;
};
$.convertNumber = function (json, fields) {
    return $.convert($.getNumber, json, fields);
};
$.convertBoolean = function (json, fields) {
    return $.convert($.getBoolean, json, fields);
};
$.convertStamp = function (json, fields) {
    return $.convert($.time2stamp, json, fields);
};


/* 验证
*  $.checkInputs({
*      inputs:[
    *          {
    *              id:"test",                              //要检查的input的id
    *              name:"用户名",                           //要检查的input的名字（信息提示用）
    *              rules:"must,username,min:6,max:16",     //验证规则，见 rules 对象
    *              error:"用户名格式错误"                     //（非必须）自定义错误提示
*          },
*          ...
    *      ],
*      success:function(){
    *          //验证通过回调
        *          console.log("ok")
    *      },
*      error:function(msg,ids){
    *          //返回验证错误的文字
        *          console.log(msg)
    *      }
*  })
*
*
*/
(function(){
    var temp_fn = {
        rules:{
            username:{
                rule:/^[a-zA-Z][a-zA-Z0-9]*$/,
                error:"格式错误"
            },
            nickname:{
                rule:/^.+$/,
                error:"格式错误"
            },
            password:{
                rule:/^[a-zA-Z0-9]*$/,
                error:"不能有特殊字符"
            },
            mobile:{
                rule:/^[1]\d*$/,
                error:"格式错误"
            },
            email:{
                rule:/^[a-zA-Z0-9][a-zA-Z0-9-_\.]*@[a-zA-Z0-9_-]*\.[a-zA-Z0-9]*$/,
                error:"格式错误"
            },
            number:{
                rule:/^[0-9]*$/,
                error:"格式错误"
            },
            loginusername: {
                rule: /(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/,
                error:"只能为手机号码或者电子邮箱地址"
            }
        },
        check:function(datas){
            var inputs = $.getArray(datas.inputs),
                success = $.getFunction(datas.success),
                error = $.getFunction(datas.error),
                pass = true,
                error_messages = [],
                ids = [];

            for(var i = 0,l = inputs.length; i<l; i++){
                var this_input = inputs[i],
                    this_id = this_input.id,
                    this_rules = this_input.rules.split(","),
                    this_error_msg = this_input.error;

                var this_error = [],
                    this_state = true;
                this._checkOne(this_id,this_rules,function(text){
                    //未通过。。。
                    pass = false;
                    this_state = false;
                    this_error.push(text);
                });

                this_input.state = this_state;
                this_input.message = this_error.join(",");
                if(!this_state){
                    if(this_error_msg){
                        error_messages.push(this_error_msg);
                    }else{
                        error_messages.push(this_input.name+":"+this_input.message);
                    }
                    ids.push(this_id);
                }
            }

            if(pass){
                success();
            }else{
                var msg = error_messages.join(";");
                error(msg,ids);
            }

        },
        //检查流程
        _checkOne:function(id,rules,error){
            var obj = $("#"+id);
            if(obj.length == 0){ console.log("id:"+id+"元素没有找到");return; }

            var this_val = $.trim(obj.val());
            if(this_val){
                //输入有值需要验证
                for(var i= 0,l=rules.length; i<l; i++){
                    var rule = rules[i],
                        setRules = this.rules[rule];

                    if(setRules){
                        var reg = setRules.rule,
                            check = reg.test(this_val);

                        if(!check){
                            error(setRules.error);
                        }

                    }else if(rule.indexOf("max")>-1){
                        var length = rule.split(":")[1];
                        if(this_val.length > length){
                            error("不能超过"+length+"字符");
                        }

                    }else if(rule.indexOf("min")>-1){
                        var length1 = rule.split(":")[1];
                        if(this_val.length < length1){
                            error("不能少于"+length1+"字符");
                        }
                    }
                }
            }else{
                rules = rules.join(",");
                if(rules.indexOf("must") > -1){
                    //没有输入但是是必填项目 报错
                    error("不能为空");
                }
            }
        }
    };
    $.checkInputs = function(data){
        temp_fn.check(data);
    }
})();




//显示大图
//$.showPicture(src)   @param src：str
$.showPicture = function(src){
    var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAlgAAAJYAJvGvrMAAAGOSURBVDjLhZRLL0NREMd/9Whq50PYSjyKaNDK7crGd2DRxqKNjQ0rK4kVYUlESNj5ClZESUgXXn0oTRCtRNoSLT0WvT3mtKpzNmcyv7l35n9nrgNpTtxM4qOLTuCNOIccEOGTP8xBD5s8U0aJU+aFbdw4avF2pkgZqDxpgjhNfI58Q1yhKLAgU6bJ/YsrFO/MVPFe7kSgZGAl0VOawUo5GwK4IMSN9pKEiYjoLi7w8CTwIcAijkKRYgLo41THM4zDkna/CdtFWiR4YML2AqLMVTgWr4zhtyEvln0b48oomYzRZFynVPFrI56Drxr5kng1PiwEsE9L3Yi00abvreKuLWs8IaVbrbYfN+J5OBHuncY9jOqUmCCisCxkndUa3ZLU7UtZ12GEZ+2e0S+USeAHujnS8Sx+cLIlXnlGgEvxXQICV+zRAdDPvViYotFkUQzfIx50lYWm4/1B+HfvnMw3SflgEZe5/kHSDfFHQiZe+QkMsFMzWQrFK/sMUz8RALjwscK5vbB5oqxhVZSp2g819GPsdjchhgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNC0yNlQxMzo1ODoyNCswODowMHmGUoEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDQtMjZUMTM6NTg6MjQrMDg6MDAI2+o9AAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjguOC03IFExNiB4ODZfNjQgMjAxNC0wMi0yOCBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ1mkX38AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIA5Jg+MAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADgzM8JkksYAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAODMzUZXCmwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4NDkxOTA0QrnX9AAAABN0RVh0VGh1bWI6OlNpemUAMTcuOUtCQvJgtYsAAABidEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL2Z0cC8xNTIwL2Vhc3lpY29uLmNuL2Vhc3lpY29uLmNuL2Nkbi1pbWcuZWFzeWljb24uY24vcG5nLzExNTQ0LzExNTQ0MjAucG5nmJ8K+AAAAABJRU5ErkJggg==";

    var show = {
        div:null,
        zz:null,
        close:null,


        init:function(src){
            this.srcs = src;

            this.createZZ();
            this.createDiv();
            this.eventBind();
            var size = this.showDiv();
            this.loadImg(size);
        },
        createZZ:function(){
            var div = $("<div></div>");
            div.css({
                position:"fixed",
                left:0,
                top:0,
                width:"100%",
                height:"100%",
                background:"#000",
                opacity:"0.5"
            });
            this.zz = div;
        },
        createDiv:function(){
            var div = $("<div>loading...</div>");
            div.css({
                position:"fixed",
                width:"80%",
                height:"80%",
                left:"9%",
                top:"9%",
                border:"10px solid #fff",
                background:"#ccc",
                "text-align":"center",
                "border-radius":"10px"
            });

            var close = $("<img src='"+close_img+"'/>");
            close.css({
                position:"absolute",
                right:"-14px",
                top:"-14px",
                width:"24px",
                height:"24px",
                cursor:"pointer",
                "z-index":"10"
            });

            div.append(close);
            this.div = div;
            this.close = close;
            $("body").append(div)

        },
        eventBind:function(){
            var _this = this;
            this.close.click(function(e){
                e.preventDefault();
                e.stopPropagation();
                _this.destroy();
            });

            this.zz.click(function(e){
                e.preventDefault();
                e.stopPropagation();
                _this.destroy();
            });

            this.div.click(function(e){
                e.preventDefault();
                e.stopPropagation();
            });

        },
        showDiv:function(){
            var body = $("body");
            body.append(this.zz);
            body.append(this.div);

            var width = parseInt(this.div.width()),
                height = parseInt(this.div.height());

            this.div.css({
                "line-height":height+"px"
            });

            return {
                width:width,
                height:height
            }

        },
        loadImg:function(body_size){
            var img = new Image(),
                _this = this;

            img.onload = function(){
                _this.getImgSize(this,body_size);
            };

            img.src = src;

        },
        getImgSize:function(img,body_size){
            var objwidth = body_size.width,
                objheight = body_size.height,
                imgwidth = img.width,
                imgheight = img.height;

            if(imgwidth>0 && imgheight>0){
                if(imgwidth/imgheight>=objwidth/objheight){
                    if(imgwidth>objwidth){
                        newimgwidth = objwidth;
                        newimgheight = imgheight*objwidth/imgwidth;
                    }else{
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                }else{
                    if(imgheight>objheight){
                        newimgheight = objheight;
                        newimgwidth = imgwidth*objheight/imgheight;
                    }else{
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                }
            }

            this.div.css({
                width: newimgwidth + "px",
                height: newimgheight + "px",
                "line-height":newimgheight+"px",
                left:"50%",
                top:"50%",
                "margin-top":-newimgheight/2 - 10 +"px",
                "margin-left":-newimgwidth/2 -10 + "px"
            });

            $(img).css({
                position:"absolute",
                left:0,
                top:0,
                width:newimgwidth+"px",
                height:newimgheight+"px"
            });

            this.div.append(img);

        },
        destroy:function(){
            this.zz.unbind("click");
            this.close.unbind("click");
            this.div.unbind("click");

            this.zz.remove();
            this.div.remove();

            this.zz = null;
            this.div = null;
            this.close = null;
        }

    };

    show.init(src);


};



//loading
//$.loadShow();
//$.loadHide();
(function(){
    var zz = null,
        zz_main = null;
        load_gif = "../../image/load.gif";

    var show = function(){
        zz = $("<div></div>");
        var css = {
            position:"fixed",
            left:0,
            top:0,
            width:"100%",
            height:"100%",
            background:"#000",
            opacity:0,
            "z-index":99998
        };

        zz.css(css);

        zz_main = $("<div></div>");
        var img = $("<img src='"+load_gif+"'>");
        img.css({
            width:"100px",
            height:"100px",
            position:"absolute",
            top:"50%",
            left:"50%",
            "margin-left":"-50px",
            "margin-top":"-50px"
        });
        zz_main.css(css);
        zz_main.css({
            background:"",
            opacity:1,
            "z-index":99999
        });

        zz_main.append(img);

        $("body").append(zz).append(zz_main);

        zz.animate({
            opacity:0.4
        },1000)
    };
    var hide = function(){
        if(zz.length){
            zz.remove();
            zz_main.remove();
            zz = null;
            zz_main = null;
        }
    };

    $.loadShow = show;
    $.loadHide = hide;
})();


//滚动加载....
//var a = new $.scrollLoad({
//    mainDiv: $("#scroll_comment"),
//    buttonLength: 500,
//    ajaxFn: function (){
//        a.destroy();            //加载完成调用
//        a.ajaxSuccess();        //加载成功调用
//        a.ajaxError();      //加载失败调用
//        a.setActive(false);  //是否激活滚动加载
//    }
//})
(function () {
    var TGO = {};
    TGO.addEvent = function (target, type, func) {
        if (target.addEventListener) {
            target.addEventListener(type, func, false);
        } else if (target.attachEvent) {
            target.attachEvent("on" + type, func);
        } else {
            target["on" + type] = func;
        }
    };
    TGO.removeEvent = function (target, type, func) {
        if (target.removeEventListener) {
            target.removeEventListener(type, func, false);
        } else if (target.detachEvent) {
            target.detachEvent("on" + type, func);
        } else {
            delete target["on" + type];
        }
    };



    var scroll_load = function (data) {
        this.ajaxFn = data.ajaxFn || function () { };
        this.buttonLength = data.buttonLength || 100;
        this.scrollObj = (data.scrollObj)? data.scrollObj.get(0) : null;

        //是否加载中
        this.isLoading = false;
        //是否活动（多个加载在一个页面时使用）
        this.active = true;

        this.scrollFn = null;

        this.init();
    };
    scroll_load.prototype = {
        init: function () {
            this.addEvent();
        },
        //添加事件
        addEvent: function () {
            var _this = this,
                obj = this.scrollObj || window;

            TGO.addEvent(obj, "scroll", this.scrollFn = function () {
                _this.checkLoad();
            });
        },
        //检查是否触发加载事件
        checkLoad: function () {
            var scroll_top,scroll_height,win_height,scroll_button;


            if(this.scrollObj){
                scroll_top = parseInt(this.scrollObj.scrollTop);
                scroll_height = parseInt(this.scrollObj.scrollHeight);
                win_height = parseInt(this.scrollObj.style.height);
                scroll_button = scroll_height - scroll_top - win_height;
            }else{
                scroll_top = parseInt($(document).scrollTop());
                scroll_height = parseInt($("body").prop("scrollHeight"));
                win_height = parseInt($(window).height());
                scroll_button = scroll_height - scroll_top - win_height;
            }


            if (scroll_button < this.buttonLength && !this.isLoading && this.active) {
                this.ajaxFn();
            }
        },
        //销毁
        destroy: function () {
            TGO.removeEvent(window, "scroll", this.scrollFn);
        }
    };


    TGO.scrollLoad = function (data) {
        var _this = this;

        this.buttonLength = data.buttonLength || 200;
        this.mainDiv = data.mainDiv;
        this.showLoading = data.showLoading || true;
        this.ajaxFn = data.ajaxFn;
        this.scrollObj = data.scrollObj;

        this.loadObj = null;

        this.scrollFn = new scroll_load({
            ajaxFn: function () {
                _this.ajaxStart.call(_this);
            },
            buttonLength: _this.buttonLength,
            scrollObj:_this.scrollObj
        });

    };
    TGO.scrollLoad.prototype = {
        ajaxStart: function () {
            var _this = this;
            _this.scrollFn.isLoading = true;

            if (_this.showLoading) {
                _this.showLoad();
            }

            _this.ajaxFn();

        },
        //显示loading
        showLoad: function () {
            var div = $("<div>加载中，请稍后！</div>");
            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            this.mainDiv.append(div);

            this.loadObj = div;
        },
        //隐藏loading
        hideLoad: function () {
            if (this.loadObj && this.loadObj.find("a").length != 0) {
                this.loadObj.find("a").unbind("click").unbind("hover");
            }

            if (this.loadObj && this.loadObj.length != 0) {
                this.loadObj.remove();
            }

            this.loadObj = null;
        },
        //加载失败显示loading
        reShowLoad: function () {
            var _this = this,
                div = $("<div>加载失败，<a>点击重试</a></div>");


            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            div.find("a").click(function () {
                _this.hideLoad();
                _this.ajaxStart();
            }).hover(function () {
                $(this).css({ color: "#999" });
            }, function () {
                $(this).css({ color: "#000" });
            });

            this.mainDiv.append(div);
            this.loadObj = div;
        },
        //ajax调用成功回调
        ajaxSuccess: function () {
            this.hideLoad();
            this.scrollFn.isLoading = false;
        },
        //ajax调用失败回调
        ajaxError: function () {
            this.hideLoad();
            this.reShowLoad();
        },
        //ajax 加载完数据
        destroy: function () {
            this.hideLoad();
            this.scrollFn.destroy();
            this.scrollFn = null;

            this.mainDiv = null;
            this.showLoading = null;
            this.ajaxFn = null;
        },
        //设置是否触发滚动加载
        setActive: function (state) {
            if (this.scrollFn) {
                this.scrollFn.active = state;
            }
        }
    };

    $.scrollLoad = TGO.scrollLoad;
})();
//-----------------------------------------------------------------------
// 该项目特有(商家管理后台)
//-----------------------------------------------------------------------
$.scrollLoadInterval = function(opt){
    var main_div = opt.mainDiv,
        button_length = opt.buttonLength,
        get_data_api_name = opt.getDataApiName,
        bind_data_fn = opt.bindDataFn,
        scroll_id = 0,
        scroll_key = opt.scrollForKey,
        search_data = opt.searchData,
        run_in = opt.runIn,
        scroll_obj = opt.scrollObj,
        obj;

    var param = {
        mainDiv:main_div,
        scrollObj:scroll_obj,
        buttonLength:button_length,
        ajaxFn:function(){
            top.AJAX[get_data_api_name]({
                success:function(rs){
                    if(!rs || rs.length == 0 ){
                        obj.destroy();
                        bind_data_fn([]);
                    }else{
                        var rs_length = rs.length,
                            last_data = rs[rs_length-1];

                        scroll_id = last_data[scroll_key];

                        obj.ajaxSuccess();
                        bind_data_fn.call(run_in,rs);
                    }
                },
                error:function(msg){
                    obj.ajaxError();
                },
                data:search_data,
                scrollKey:scroll_key,
                scrollId:scroll_id
            })
        }
    };



    obj = new $.scrollLoad(param);

    obj.ajaxStart();
//    param.ajaxFn();
};



//获取图片在容器内显示的实际大小
$.getNewImageSize = function (imgwidth, imgheight, objwidth, objheight) {
    var newimgwidth, newimgheight;

    if (imgwidth > 0 && imgheight > 0) {
        if (imgwidth / imgheight >= objwidth / objheight) {
            if (imgwidth > objwidth) {
                newimgwidth = objwidth;
                newimgheight = imgheight * objwidth / imgwidth;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        } else {
            if (imgheight > objheight) {
                newimgheight = objheight;
                newimgwidth = imgwidth * objheight / imgheight;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        }
    }

    return {
        width: newimgwidth,
        height: newimgheight
    }
};



//上传文件
(function(){
    var upload_file = function(opt){
        this.inputId = opt.id;
        this.formId = opt.formId;
        this.showImageWrapId = opt.showImageWrapId;
        this.types = opt.types;
        this.serverSrc = opt.serverSrc;
        this.maxNumber = opt.maxNumber;
        this.imgs = opt.imgs;

        this.className = null;
        this.upLoadNumber = 0;

        this.init();
    };
    upload_file.prototype = {
        init:function(){
            this.addEvent();
            this.showStartImage();
        },
        //获取自身类名,必须实例化为 window.XXX
        getClassName:function(){
            for(var a in window){
                if(window[a] === this){
                    this.className = a;
                    break;
                }
            }
        },
        //事件绑定
        addEvent: function () {
            var _this = this;
            $("#" + this.inputId).change(function (e) {
                _this.inputChange(this, e);
            });
        },
        //检查文件类型
        checkFileType: function () {
            var value = $("#" + this.inputId).val(),
                type = value.substr(value.lastIndexOf(".") + 1).toLocaleLowerCase(),
                types = "," + this.types + ",";

            return (types.indexOf("," + type + ",") > -1);
        },
        //获取文件后
        inputChange: function () {
            if ($("#" + this.inputId).val() == "") {
                return;
            }

            var pass = this.checkFileType();

            if (!pass) {
                alert("文件格式不对");
                this.reCreateInput();
                return;
            }

            if(this.upLoadNumber >= this.maxNumber){
                alert("只能上传"+this.maxNumber+"张图片!");
                this.reCreateInput();
                return;
            }

            this.createIframe();
        },
        //创建iframe
        createIframe: function () {
            var iframe = $("<iframe name='__bens_iframe_name__' id='__bens_iframe__' width='0' height='0' frameborder='0' ></iframe>"),
                form = $("#" + this.formId),
                t = new Date().getTime();

            this.getClassName();

            form.attr({
                target: "__bens_iframe_name__",
                action: this.serverSrc + "?class="+this.className+"&t=" + t,
                enctype: "multipart/form-data",
                method: "post"
            });
            $("body").append(iframe);

            //            $("#"+this.inputId).wrap(form);
            //            $(form).append("<input type='text' value='123' name='test1'>");

            $.loadShow();
            form.submit();
        },
        //提交成功回调
        oldSuccess: function (rs) {
            $.loadHide();
            if (rs.State != 1) {
                //失败
                alert(rs.Message);
                this.reCreateInput();
                return;
            }

            var src = rs.Data;

//            src = "http://localhost:8023"+src;

            src = top.AJAX.pictureUrl+src;


            this.reCreateInput();
            this.upLoadNumber++;
            $("#__bens_iframe__").remove();
            this.showImg(src);

        },
        //重新生成input
        reCreateInput: function () {
            var _this = this,
                input = $("#" + this.inputId),
                clone = input.clone();

            clone.insertBefore(input);
            input.unbind("change");
            input.remove();

            clone.change(function (e) {
                _this.inputChange(this, e);
            });
        },
        //显示图片
        showImg:function(src,callback){
            var img = new Image(),
                _this = this;

            callback = $.getFunction(callback);


            var div = $("<div></div>");
            div.css({
                width: "128px",
                height: "150px",
                float: "left",
                margin: "0 15px"
            }).addClass("__upload_temp__");
            var div1 = $("<div></div>"),
                div2 = $("<div>删 除</div>"),
                div3 = $("<div></div>");

            div1.css({
                width: "100%",
                height: "128px"
            });
            div2.css({
                width: "100%",
                height: "22px",
                "text-align": "center",
                "line-height": "22px",
                background: "#ccc",
                cursor: "pointer"
            });
            div3.css({
                width: 0,
                height: "2px",
                background: "#f00"
            }).addClass("__upload_temp_pro__");


            div.append(div1).append(div3).append(div2);



            div2.click(function () {
                var temp_div = $(this).parent();

                _this.delOne();


                temp_div.remove();

            });

            $("#"+_this.showImageWrapId).append(div).css({ height: "160px" });
            callback();
            img.onload = function () {
                var width = img.width,
                    height = img.height,
                    new_size = $.getNewImageSize(width, height, 128, 128);

                var imgs = $("<img src='" + src + "' width = '" + new_size.width + "' height = '" + new_size.height + "' />");


                var temp_top = (128 - new_size.height) / 2,
                    temp_left = (128 - new_size.width) / 2;
                imgs.css({
                    margin: temp_top + "px " + temp_left + "px"
                });
                div1.append(imgs);

            };
            img.src = src;
        },
        //初始显示图片
        showStartImage:function(){
            var data = this.imgs,
                _this = this;

            var go = function(){
                if(data.length != 0){
                    var this_src = data.shift();
                    _this.upLoadNumber++;
                    _this.showImg(this_src,go);
                }
            };

            go();
        },
        //删除图片
        delOne: function () {
            this.upLoadNumber--;
        }
    };

    $.uploadFile = upload_file;

})();



//JSON
if (!this.JSON) {
    this.JSON = {};
}
(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

// 将JSON 数据对象反序列化到表单中
(function ($) {
    $.deserialize = function (str, options) {
        var pairs = str.split(/&amp;|&/i),
            h = {},
            options = options || {};
        for (var i = 0; i < pairs.length; i++) {
            var kv = pairs[i].split('=');
            kv[0] = decodeURIComponent(kv[0]);
            if (!options.except || options.except.indexOf(kv[0]) == -1) {
                if ((/^\w+\[\w+\]$/).test(kv[0])) {
                    var matches = kv[0].match(/^(\w+)\[(\w+)\]$/);
                    if (typeof h[matches[1]] === 'undefined') {
                        h[matches[1]] = {};
                    }
                    h[matches[1]][matches[2]] = decodeURIComponent(kv[1]);
                } else {
                    h[kv[0]] = decodeURIComponent(kv[1]);
                }
            }
        }
        return h;
    };

    $.fn.deserialize = function (options) {
        return $.deserialize($(this).serialize(), options);
    };
})(jQuery);

// 将表单数据序列化成 JSON 对象
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//获取地址栏参数
$.getUrlParam = function(param){
    var find_val = "";

    var search = window.location.search;
    search = search.substr(1);
    var searchs = search.split("&");

    for( var i= 0,l=searchs.length;i<l;i++){
        var this_val =  searchs[i],
            this_keys = this_val.split("="),
            this_key = this_keys[0];

        if(this_key == param){
            find_val = this_keys[1];
            break;
        }
    }
    return find_val;

};



//弹出居中层
(function(){
    var wrap = null,
        zz = null,
        close = null;

    $.openDiv = function(opt){
        var div_width = parseInt(opt.width),
            div_height = parseInt(opt.height),
            title_text = opt.title,
            div = $(opt.div),
            main = $("<div></div>"),

            title = $("<div>"+title_text+"</div>");
        var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAFk0lEQVRIx8WVa4jdRxnGf/O/X851L9lLkt2k2d3ETdLSEiwhVuvWoFKJaCwNhEJbQou0tNRuVKJiL5jUWxW0ULSUUEiKpRUFhYoxLVRYKcZ2m22wbiLuRjebvZ7dc/ac/21m/HAOSSW0+EV85+O88zzzzjzv88L/OMSHbf6cDv5K3C8QOzQMgC4LBBqWQZ/XMDGMP3WIuf+e4H4cnuVrPMLTQ77p3BOYzki5kOvzPbfNMIQDkKZZUo/jpWq9MV1L4tOJSp+/3bhh8mX1Z54l+WCCR8mjITCF2FcOct/qbWsbasvnLMs0MUzjSp5SijTLiNOMpWo1m1upTKxG0bFUy98IqP+YtSu55lXwAhp8E+O+nlL5e4Pre/vai3nDbAHLFmiaZWRSAhrHsigEgRF6bneWyttkImsp+p09eNkY8VWCr5Dnb1RFJ97+7lLpqYHenvbQD7ByIcJzkVGEUprmAqUk2A5GGKC0wjctQt/163GyK06TC+epnrudPGMkTYJPEJLHHGr3c88M9vZsCv2A8q4b2fH41+k78EUaM5eoTV1EaY2WCrtYYPiBQ9z0xBG8ni5m3jyDq8C17aAeRVtCaZx2hLX0RyIMgGMHv4wn7HvWFYvbQt9DBD4DDx6iuHOYsL+Pjxx+mK5b9wBglwpsu/9urjt4B15nB5u+8Dmy7i6qazUKgU97Pn+9Lax7j37+SwBYoxR49MRP+ou2P9JeLJhaa6SSrcdoRrBxPcOjDyMsm9KObWw6sB/L9wGoLy6xsLiImyYEOqCcz5mLlerI4V/9on+UwpS5GxeB+FhnsXBXZ6mUU1qTRRHVyQsUhgbwu9YB4BQLrLtlN2033oDpeQBEKyuc/s73mf796xR8H4TAsSzqcWTW4vhPwKQBGtADvmt3moZASolSmsW3z3L22NPMvPYGWspmuUGAYdst8FVOPXaM8eMnaQt8DMMgyVJs08KxrU5gAMAQCASiZFmWKYRAKoXSCoVm/szbvPujZ2hcunxNh5596RXGj5+k0w8IPBetNUoqDCEQhmECJYHgSvdorUHTBNcaJSV+bzeb9+/D7Wy/hmBw7wi79n2WMPDQqiXfK0JuYaKbBBpdSdNMSiXRmiZ4Tzc7Rx9iy8E7MV33GoLSpn72PPlN1o98HAyBUgqBaF5OKQlU3l/B+Xocz6dSYgiB4fvsPPwQGz5zG8JqNnujssIfnniK9379W7RUAOT6NnL9Iw/gbliPzDIcyyJNU6I4mQfOA1ga0DCxutaYbiRJd+A4ZK5N287tCMtqfmhlhVOPHeWt515gcPswgeuyYe8nEaZJeesgcRCSZRmubdOIE+qNZFrDBGjMMWJeveXAymtT57ZYmLtL+Zwh04QkiigPb0VpzalvH2X8+RN0hiFGvc7Cu+fI9XZTuG4zF069zpkXXqRoGPiey+zislyO6idGb/7UK/v/Nd50069SJEUO5W3vl1t6ureXcyF1mWH2bWQ5iZn9yzgdvo/vuU0hKEnQ04XsWMfM5CTG/BKbe7qo1Nb4x9zcW7U0vtPBmvwulaYX3YzDLLUlX1lLSZre6rteEDoO9UuzpJfnyHsujm3TFFpTJ9HKKo2L/6SgBd3tbdSiiIvzCwtrSfKNGepvhFhXzW6MhE+TR6MvxGm2FsXJR23L9Au5EN/zEKKpEqU1WmuEIfAch2IuR+B7VGo1Ls4vLFWj6EkNJ4s46Q+p/uc8GCNhD16m4Wws08m1ejQYx2mHaZqGa9uErk/oe4Seh2c7CGHQiGMuLy6ns8uVd9aS5IiGFwU0fsDqB4/MB/G5iY1MMDNoCuNex7BGcp7X5zp2m2kYDgIyKZMkSZdqUTydqOx3mVbHj7D374/zKj+l8eEz+f3xM9p5j7Qf9I6Wt5Rbx5ZbOp/Yij11H4v83+Lf7X5w5qpkSpcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMDQtMDNUMTc6MTg6MDIrMDg6MDDjrwpDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEyLTA4LTA1VDIyOjUwOjI1KzA4OjAwc0Az8QAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtNyBRMTYgeDg2XzY0IDIwMTQtMDItMjggaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmdZpF9/AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAzMij0+PQAAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMzLQWzh5AAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEzNDQxNzgyMjXFjXX8AAAAE3RFWHRUaHVtYjo6U2l6ZQAxLjc0S0JCSSPL9gAAAGJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvZnRwLzE1MjAvZWFzeWljb24uY24vZWFzeWljb24uY24vY2RuLWltZy5lYXN5aWNvbi5jbi9wbmcvMTA3OTEvMTA3OTEyMi5wbmdGbcMeAAAAAElFTkSuQmCC";

        close = $("<div></div>");
        wrap = $("<div></div>");
        zz = $("<div></div>");

        wrap.css({
            width:div_width+"px",
            height:div_height+"px",
            position:"fixed",
            left: "50%",
            top: "50%",
            "margin-top":-(div_height+60)/2 + "px",
            "margin-left":-(div_width+30)/2 + "px",
            background:"#fff",
            padding:"30px 0 30px 30px",
            "z-index":100
        });

        main.css({
            "overflow-y":"auto",
            "overflow-x":"hidden",
            width:div_width+"px",
            height:div_height+"px"
        });

        close.css({
            width:"24px",
            height:"24px",
            background:"url('"+close_img+"')",
            position:"absolute",
            top:"2px",
            right:"2px",
            cursor:"pointer"
        });

        title.css({
            width: (div_width) + "px",
            height:"30px",
            "line-height":"30px",
            position:"absolute",
            left:0,
            top:0,
            "padding-right":"30px",
            "border-bottom":"1px solid #999",
            "text-indent":"1em",
            "overflow":"hidden",
            "white-space": "nowrap",
            "-o-text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "-moz-bindings":"url('ellipsis.xml#ellipsis')"
        });


        zz.css({
            width:"100%",
            height:"100%",
            background:"#000",
            opacity:0,
            position:"fixed",
            left:0,
            top:0,
            "z-index":99
        });

        main.append(div).append(title).append(close);
        wrap.append(main);

        $("body").append(zz).append(wrap);
        zz.animate({
            opacity:0.5
        },500);


        close.click(function(){
            $.closeDiv();
        });
        zz.click(function(){
            $.closeDiv();
        });

    };
    $.closeDiv = function(){
        if(close){
            close.unbind("click");
            zz.unbind("click");
            zz.remove();
            wrap.remove();
        }
        close = null;
        wrap = null;
        zz = null;
    }
})();


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Array.prototype.distinct = function () {
    var sameObj = function (a, b) {
        var tag = true;
        if (!a || !b) return false;
        for (var x in a) {
            if (!b[x])
                return false;
            if (typeof (a[x]) === 'object') {
                tag = sameObj(a[x], b[x]);
            } else {
                if (a[x] !== b[x])
                    return false;
            }
        }
        return tag;
    }
    var newArr = [], obj = {};
    for (var i = 0, len = this.length; i < len; i++) {
        if (!sameObj(obj[typeof (this[i]) + this[i]], this[i])) {
            newArr.push(this[i]);
            obj[typeof (this[i]) + this[i]] = this[i];
        }
    }
    return newArr;
};



$.fn.province_city_county = function (xml_src,v_province, v_city, v_county,v_id) {
    var _self = this;
    //插入3个空的下拉框
    _self.html("<select id='province' name='province'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='city' name='city'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='county' name='county' ></select>");
    //分别获取3个下拉框
    var sel1 = _self.find("select").eq(0);
    var sel2 = _self.find("select").eq(1);
    var sel3 = _self.find("select").eq(2);

    //定义3个默认值
    _self.data("province", ["请选择", "0"]);
    _self.data("city", ["请选择", "0"]);
    _self.data("county", ["请选择", "0"]);
    //默认省级下拉
    if (_self.data("province")) {
        sel1.append("<option value='" + _self.data("province")[1] + "'>" + _self.data("province")[0] + "</option>");
    }
    //默认城市下拉
    if (_self.data("city")) {
        sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
    }
    //默认县区下拉
    if (_self.data("county")) {
        sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
    }
    $.get(xml_src, function (data) {
        //只传入最后一个id  反推前面的id
        if(v_id){
            v_county = v_id;
            v_city = $(data).find("#"+v_id).parent().attr("id");
            v_province = $(data).find("#"+v_id).parent().parent().attr("id");
        }



        var arrList = [];
        $(data).find('province').each(function () {
            var $province = $(this);
            sel1.append("<option value='" + $province.attr('id') + "'>" + $province.attr('name') + "</option>");
        });
        if (typeof v_province != 'undefined' && v_province != 0) {
            sel1.val(v_province);
            $("#TopRegionId").val(v_province);//给TopRegionId赋值
            sel1.change();
        }
    });

    //省级联动控制
    var index1 = "";
    var provinceValue = "";
    var cityValue = "";
    sel1.change(function () {
        //清空其它2个下拉框
        sel2[0].options.length = 0;
        sel3[0].options.length = 0;
        index1 = this.selectedIndex;
        if (index1 == 0) { //当选择的为 "请选择" 时
            if (_self.data("city")) {
                sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
            }
            if (_self.data("county")) {
                sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
            }
        } else {
            provinceValue = $('#province').val();
            $("#TopRegionId").val(provinceValue);//给TopRegionId赋值
            $.get(xml_src, function (data) {
                $(data).find("province[id='" + provinceValue + "'] > city").each(function () {
                    var $city = $(this);
                    sel2.append("<option value='" + $city.attr('id') + "'>" + $city.attr('name') + "</option>");
                });
                cityValue = $("#city").val();
                $("#RegionId").val(cityValue);//给RegionId赋值
                $(data).find("city[id='" + cityValue + "'] > county").each(function () {
                    var $county = $(this);
                    sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                });

                if (typeof v_city != 'undefined' && v_city != 0) {
                    sel2.val(v_city);
                    $("#RegionId").val(v_city);//给RegionId赋值
                    if ($(sel2).find("option:selected").val() == undefined) {
                        $(sel2).find('option:first').prop('selected', 'selected');
                    }
                    sel2.change();
                }

                if (typeof v_county != 'undefined' && v_county != 0) {
                    sel3.val(v_county);
                    $("#RegionId").val(v_county);//给RegionId赋值
                }
            });
        }
    }).change();

    //城市联动控制
    sel2.change(function () {
        //sel3[0].options.length = 0;
        var cityValue2 = sel2.val();//$('#cityValue2').val();
        if (cityValue2 > 0) {
            sel3[0].options.length = 0;
        }
        $.get(xml_src, function (data) {
            var iscounty = false;
            $(data).find("city[id='" + cityValue2 + "'] > county").each(function () {
                var $county = $(this);
                sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                iscounty = true;
            });
            if (typeof v_county != 'undefined' && v_county != 0) {
                sel3.val(v_county);
                if ($(sel3).find("option:selected").val() == undefined) {
                    $(sel3).find('option:first').prop('selected', 'selected');
                }
            }
            if (iscounty) {
                $("#RegionId").val($(sel3).val());//给RegionId赋值
            }
            else {
                $("#RegionId").val(sel2.val());//给RegionId赋值
            }
        });
    }).change();

    //区联动控制
    sel3.change(function () {
        countyValue = $('#county').val();
        $("#RegionId").val(countyValue);//给RegionId赋值
    })

    return _self;
};







