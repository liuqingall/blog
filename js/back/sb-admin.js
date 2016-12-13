$(function(){

    getPosts();
    $("nav .navbar-header > a").html( window.localStorage.getItem('username') );
    getUser();

    function getPosts() {
        $.ajax({
            url:'http://'+net.url+'/admin/posts',
            type:'get',
            dataType:'json',
            data:{pageindex:1},
            success:function(data) {
                var item = {result:data};
                var html = template('tpl',item);
                $('#tbody').html(html);
            }
        });
    }

    //绑定用户ID,以便在跳转用户管理时判断权限。
    //数据庞大时不宜使用,应添加相应接口。
    function getUser() {
        $.ajax({
            url:'http://'+net.url+'/admin/users',
            type:'get',
            dataType:'json',
            success:function(data) {
                if( data ){
                    for ( var i = 0; i < data.length; i++ ){
                        if( data[i].username === $("nav .navbar-header > a").html() ){
                            $("nav .navbar-header > a").attr('userid', data[i].id );
                        }
                    }
                }
                return;
            }
        });
    }

    var isSave = -1;

    //当模态窗口 隐藏的时候触发的事件
    //清空输入框内容
    $('#myModal').on('hidden.bs.modal', function (e) {
        $("#form input[type=text], #form textarea").val("");
        isSave = -1;
    })

    //添加时切换保存按钮所发生的的请求
    $("#btnAdd").on("click", function () {
        isSave = 1;
        $("#myModalLabel").text("添加帖子");
    })

    //逻辑:判断是添加还是编辑
    $("#btnSave").click(function () {
        var id = $("#id").val(),
            title = $("#title").val(),
            content = $("#content").val();
        if ( isSave == 1 ){
            //此时为保存新数据
            $.ajax({
                url:'http://'+net.url+'/admin/posts/create',
                type:'post',
                dataType:'json',
                data:{title:title,content:content},
                success:function(data) {
                    if( data && data.code === 1 ){
                        //操作数据库成功
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg ).stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        //刷新列表显示最新数据库数据
                        getPosts();
                    } else {
                        $(".prompting").html( data.msg ).stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        } else if ( isSave == 2){
            //此时为编辑数据
            $.ajax({
                url:'http://'+net.url+'/admin/posts/update',
                type:'post',
                dataType:'json',
                data:{id:id,title:title,content:content},
                success:function(data) {
                    if( data && data.code === 1 ){
                        //成功则提示成功并且刷新列表
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        getPosts();
                    } else {
                        //未成功操作数据库数据则提示出错
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        }
    });


    $("#tbody").on("click", ".btn-primary", function () {
        isSave = 2;
        $("#myModalLabel").text("编辑帖子");

        $("#myModal").modal("show");

        //获取绑定ID
        var id = +$(this).parent().parent().children().eq(0).html();
        $.ajax({
            url:'http://'+net.url+'/admin/posts/' + id,
            type:'get',
            dataType:'json',
            success:function(data) {
                //从后台获取相应数据
                $("#title").val(data.data.title);
                $("#content").val(data.data.content);
                $("#id").val( data.data.id );
            }
        });

    })

    $("#tbody").on("click", ".btn-danger", function () {
        var id = +$(this).parent().parent().children().eq(0).html();
        //提示是否确认删除以便防止失误操作
        $(".del").stop().fadeIn(200, "linear");
        $(".confirm").unbind('click').click(function () {
            $(".del").css('display', 'none');
            //发送请求操作数据库
            $.ajax({
                url:'http://'+net.url+'/admin/posts/delete/' + id,
                type:'get',
                dataType:'json',
                success:function(data) {
                    if( data && data.code === 1 ){
                        //此时成功操作数据库,重新渲染最新页面
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        getPosts();
                    } else {
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        });

        $(".cancel").unbind('click').click(function () {
            $(".del").fadeOut(1000, "linear");
        });
    });

    $("#btnSearch").click(function () {
        var wd = $("#txtSearch").val();
        $.ajax({
            url:'http://'+net.url+'/admin/posts/search',
            type:'get',
            datatype:'json',
            data:{wd:wd},
            success:function (data) {
                if( !data[0] ){
                    $(".prompting").html( '未搜索到相关帖子,请重试!' )
                        .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    return;
                }
                var item = {result:data};
                var html = template('tpl',item);
                $('#tbody').html(html);
            }
        });
    });

    //点击用户管理时先进行权限查询
    //只有用户role属性为admin时,有权限进行用户管理
    $(".userManage").click(function () {
        var uid = $("nav .navbar-header > a").attr('userid');
        $.ajax({
            url:'http://'+net.url+'/admin/users/' + uid,
            type:'get',
            dataType:'json',
            success:function(data) {
                if( data && data.role == 'admin' ){
                    window.location.href = '/myblog/blog/admin/user.html';
                } else {
                    $(".prompting").html( '您没有足够的权限！' )
                        .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                }
            }
        });
        return false;
    });
});
