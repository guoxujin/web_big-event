$(function () {

    var layer = layui.layer
    var form = layui.form
    // 分页
    var laypage = layui.laypage;


    // 美化时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {

        const date = new Date(dtStr)

        let y = padZero(date.getFullYear()); // 年

        let m = padZero(date.getMonth() + 1); // 月

        let d = padZero(date.getDate()); // 日

        let hh = padZero(date.getHours()); // 时

        let mm = padZero(date.getMinutes()); // 分

        let ss = padZero(date.getSeconds()); // 秒


        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补 0 函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }



    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态

    }

    // 初始化文章列表
    initTable()
    function initTable() {

        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 渲染分页
                RenderPaage(res.total)
            }
        });

    }


    // 获取所有分类的状态
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            data: '',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        // 获取 
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()

        // 赋值
        q.state = state
        q.cate_id = cate_id

        initTable()
    });


    // 渲染分页
    function RenderPaage(total) {

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到

            limit: q.pagesize, // 每页显示的条数。

            curr: q.pagenum, // 第几页

            limits: [2, 3, 5, 8, 10], // 每页条数的选择项

            layout: ['count', 'limit', 'page', 'prev', 'next', 'skip'],


            // 分页发生切换的时候, 触发 jump 回调函数
            jump: function (obj, first) {


                //obj包含了当前分页的所有参数，比如：
                // console.log('当前是第' + obj.curr + '页'); //得到当前页，以便向服务端请求对应页的数据。
                // console.log('每次显示' + obj.limit + '条'); //得到每页显示的条数

                // obj（当前分页的所有选项值）、


                // 改变当前的分页
                q.pagenum = obj.curr

                // 每页的条数
                q.pagesize = obj.limit


                // first（是否首次，一般用于初始加载的判断）
                //首次不执行
                // 判断, 不是第一次初始化分页, 才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        });

    }


    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        
       

        var id = $(this).attr('data-id')
        // console.log(Id);
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                type: 'get',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    // 页面汇总删除按钮个数等于1, 页码大于 1
                    // if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    

                    initTable()

                }
            });

            layer.close(index);
        });
    })

    

})