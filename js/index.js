/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 14-7-8
 * Time: 下午4:48
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */

$(document).ready(function(){
    INDEX.init();
});


CACHE = {};


INDEX = {
    init:function(){
        this.eventBind();
    },
    eventBind:function(){
        var _this = this;
        $("#login_submit").click(function(){
            $(window).unbind("keyup");
            $("#login_submit").unbind("click");
            _this.checkForm();
        });

        $(window).keyup(function(e){
            if(e.keyCode == 13){
                $(window).unbind("keyup");
                $("#login_submit").unbind("click");
                _this.checkForm();
            }
        })

    },
    checkForm:function(){
        var _this = this;
        _this.resizeInput();
        $.checkInputs({
            inputs:[
                {
                    id:"login_username",                              //要检查的input的id
                    name:"用户名",                           //要检查的input的名字（信息提示用）
                    rules:"must",                  //验证规则，见 rules 对象
                    error:""                     //（非必须）自定义错误提示
                },
                {
                    id:"login_user_password",             //要检查的input的id
                    name:"密码",                           //要检查的input的名字（信息提示用）
                    rules:"must",                           //验证规则，见 rules 对象
                    error:""                     //（非必须）自定义错误提示
                }
            ],
            success:function(){
                _this.checkSuccess();
            },
            error:function(msg,ids){
                _this.checkError(msg,ids)
            }
        })
    },
    resizeInput:function(){
        $("input").css({
            border:"1px solid rgb(205, 204, 204)"
        });
        $("#login_err_message").text("").css({display:"none"});
    },
    checkError:function(msg,ids){
        for(var i= 0,l=ids.length;i<l;i++){
            var this_id = ids[i];
            $("#"+this_id).css({
                border:"1px solid #f00"
            })
        }
        var err_obj = $("#login_err_message");
        err_obj.text(msg);
        err_obj.css({display:"block"});
        this.eventBind();
    },
    checkSuccess:function(){
        var username = $.trim($("#login_username").val()),
            password = $.trim($("#login_user_password").val());

        this.submit(username,password);
    },
    submit:function(usr,pass){
        $("#login_err_message").css({display:"none"});
        $("#login_submit").html($("#login_loading").html()).css({
            background:"#ccc"
        });

        var _this = this;



        AJAX.login({
            success:function(rs){
                CACHE.userInfo = rs;
                _this.loginSuccess();

            },
            error:function(msg){
                _this.loginError(msg);
            },
            data:{
                UserName:usr,
                PassWord:pass
            }
        });


    },
    loginSuccess:function(){
        $("#login_submit").html("登录成功");

        $("#main").animate({
            "opacity":0
        },1000,function(){
            $(this).css({display:"none"});
            //页面跳转
            $("#desktop").css({display:"block"});
            //桌面初始化
            Core.init();
        });
    },
    loginError:function(msg){
        $("#login_submit").html("登 录").css({
            background:"#D53700"
        });
        this.checkError(msg,[])

    }

};