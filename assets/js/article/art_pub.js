$(function () {


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    var form = layui.form
    var layer = layui.layer

    // 初始化富文本编辑器
    initEditor()


    initCate()


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            dataType: 'json',
            data: '',
            success: function (res) {

                // layer.msg(res.message)

                if (res.status === 0) {
                    var htmlStr = template('tpl-cate', res)
                    $('[name=cate_id]').html(htmlStr)
                    form.render()
                }
            }
        });
    }


    // 为选择封面的按钮, 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {

        $('#coverFile').click();

    })


    // --------------------------- 修改图片 ------------------------------

    $('#coverFile').on('change', function () {

        // 拿到用户选择的图片
        var file = this.files[0]

        if (file.length === 0) {
            return layer.msg('请选择用户头像')
        }


        // 2. 根据选择的文件, 创建一个对应的 URL 地址
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域, 在重新设置图片链接, 之后再创建新的裁剪区域
        // 更换剪裁区的图片（销毁之前的剪裁区 --> 更换图片 --> 重新生成剪裁区）
        $image.cropper('destroy').attr('src', imgURL).cropper(options)

    })

    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        var fd = new FormData(this)

        fd.append('state', state)

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                // console.log(...fd);
                publish(fd)
            })
    })


    function publish(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'post',
            data: fd,
            contentType: false,
            processData:false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg('添加成功, 跳转中')

                setTimeout(() => {
                    window.parent.document.querySelector('#art_list').click();

                }, 1500);

            }
        });
    }


})