$(function () {

    // -------------------- 表单校验 ------------------------------
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 原密码
        oldPwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码
        newPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        // 确认密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致,请确认密码'
            }
        }
    })

    // ----------------------- 修改密码 ------------------------------

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()

                localStorage.removeItem('token')

                window.parent.location.href = '/login.html'


            }
        });

    })
})