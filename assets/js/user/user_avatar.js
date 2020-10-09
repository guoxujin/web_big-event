$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnFile').on('click', function () {
        $('#file').click();
    })


    // --------------------------- 修改图片 ------------------------------

    var layer = layui.layer
    $('#file').on('change', function () {

        // 拿到用户选择的图片
        var file = this.files[0]
        // console.log(files);

        // console.log(this);
        // console.log($(this));

        if (file.length === 0) {
            return layer.msg('请选择用户头像')
        }


        // 2. 根据选择的文件, 创建一个对应的 URL 地址
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域, 在重新设置图片链接, 之后再创建新的裁剪区域
        // 更换剪裁区的图片（销毁之前的剪裁区 --> 更换图片 --> 重新生成剪裁区）
        $image.cropper('destroy').attr('src', imgURL).cropper(options)

    })

    // ------------------------- 上传图片 ---------------------------

    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        $.ajax({
            url: '/my/update/avatar',
            type: 'POST',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功');
                window.parent.getUserInfo()

            }
        });
    })



    
    getUserInfo()
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                $image.cropper('destroy').attr('src', res.data.user_pic).cropper(options)
            }
        
        })
    }
})