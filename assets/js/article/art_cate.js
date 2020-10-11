$(function () {

    // --------------------- 获取文章内容 ---------------------
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function (res) {

                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }

    var layer = layui.layer;
    var form = layui.form
    // 给添加按钮设置点击事件
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    });

    // -------------------添加文章 --------------------------
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('恭喜您, 文章添加成功')
                layer.close(indexAdd)
            }
        });
    })

    // ------------------------- 根据Id获取文章内容 --------------------
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })

        var Id = $(this).attr('data-id')
        // console.log(id);

        $.ajax({
            url: '/my/article/cates/' + Id,
            type: 'get',
            success: function (res) {

                form.val('form-edit', res.data)
            }
        });
    });

    // ---------------- 修改文章 ---------------------\
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                initArtCateList();
                layer.msg('更新内容更新成功')
                layer.close(indexEdit)

                // console.log(res);
            }
        });
    })


    // ---------------- 删除文章 ------------------------
    $('body').on('click', '.btn-delete', function () {

        var Id = $(this).attr('data-id')
        console.log(id);

        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'get',
                dataType: 'json',
                data: '',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('删除文章成功');
                    layer.close(index);
                    initArtCateList()

                }
            });

        });
    })

    

})