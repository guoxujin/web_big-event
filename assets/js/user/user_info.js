$(function () {


    // ----------------  整体表单验证 --------------------
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称不能大于6位'
            }
        }
    })


    // 初始化用户信息
    initUserInfo()
    function initUserInfo() {

        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }

                form.val('formUserInfo', res.data)
            }
        });
    }

    $('#btnReset').on('click', function (e) {
        e.preventDefault()

        initUserInfo();
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }

                layer.msg('更改用户信息成功')

                window.parent.getUserInfo();
            }
        });
    })

})