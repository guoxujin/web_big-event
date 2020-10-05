// ----------------------- 登录注册页面的js --------------------------

$(function () {
    // 点击注册按钮
    $('#link_reg').on('click', function () {
        $('.login-box').hide().next('div').show()
    })

    //点击登录按钮
    $('#link_login').on('click', function () {
        $('.reg-box').hide().prev().show()
    })

    // -------------------- 整体表单校验 ---------------------------------

    // 从layui 中获取 form 对象
    let form = layui.form
    let layer = layui.layer
    // 自定义了一个叫做 pwd 验证规则 
    form.verify({

        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();

            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // -------------------------- 注册功能 ----------------------------------
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();

        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };

        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                // console.log('注册成功');
                layer.msg('注册成功,请登录!');
                // 成功之后调用点击事件
                $('#link_login').click()
            }
        });

        
    })


    // ------------------------- 登录功能 -----------------------------------
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            url:'/api/login',
            type:'POST',         
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0 ) {
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!')

                // console.log(res.token);

                localStorage.setItem('token', res.token);

                // 跳转到首页
                location.href = '/index.html'
            }
        });
    })
})