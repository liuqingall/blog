$(function () {
   getUsers();

   function getUsers() {
       $.ajax({
           url:'http://'+net.url+'/admin/users',
           type:'get',
           dataType:'json',
           success:function(data) {
               var item = {result:data};
               var html = template('tpl',item);
               $('#tbody').html(html);
           }
       });
   }

    var isSave = -1;

    //当模态窗口 隐藏的时候触发的事件
    $('#myModal').on('hidden.bs.modal', function (e) {
        $("#form input[type=text], #form textarea").val("");
        isSave = -1;
    })

    $("#btnAdd").on("click", function () {
        isSave = 1;
        $("#myModalLabel").text("添加用户");
    })

    $("#btnSave").click(function () {
        var nickname = $("#nickname").val(),
            username = $("#username").val(),
            password = $("#password").val(),
            userid = $("#id").val();
        if ( isSave == 1 ){
            $.ajax({
                url:'http://'+net.url+'/admin/users/create',
                type:'post',
                dataType:'json',
                data:{
                    nickname:nickname,
                    username:username,
                    password:password
                },
                success:function(data) {
                    if( data && data.code === 1 ){
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        getUsers();
                    } else {
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        } else if ( isSave == 2){
            $.ajax({
                url:'http://'+net.url+'/admin/users/update/' + userid,
                type:'post',
                dataType:'json',
                data:{
                    nickname:nickname,
                    username:username,
                    password:password
                },
                success:function(data) {
                    if( data && data.code === 1 ){
                        //操作成功则刷新页面获得最新列表数据
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        getUsers();
                    } else {
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        }

    });

    //编辑用户时,获取绑定ID值,并根据ID值来获取对应信息
    $("#tbody").on("click", ".btn-primary", function () {
        isSave = 2;
        $("#myModalLabel").text("编辑用户");

        $("#myModal").modal("show");

        var id = +$(this).parent().parent().children().eq(0).html();
        $.ajax({
            url:'http://'+net.url+'/admin/users/' + id,
            type:'get',
            dataType:'json',
            success:function(data) {
                $("#nickname").val(data.nickname);
                $("#username").val(data.username);
                $("#password").val( data.password );
                //绑定对应ID以便后续操作使用
                $("#id").val( data.id );
            }
        });

    })

    //点击删除时获取绑定ID值,并依此进行请求操作数据库
    $("#tbody").on("click", ".btn-danger", function () {
        var id = +$(this).parent().parent().children().eq(0).html();
        $(".del").stop().fadeIn(200, "linear");
        $(".confirm").unbind('click').click(function () {
            $(".del").css('display', 'none');
            $.ajax({
                url:'http://'+net.url+'/admin/users/delete/' + id,
                type:'get',
                dataType:'json',
                success:function(data) {
                    if( data && data.code === 1 ){
                        //成功则提示操作成功,并刷新页面返回最新数据库结果
                        $("#myModal").modal("hide");
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                        getUsers();
                    } else {
                        $(".prompting").html( data.msg )
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    }
                }
            });
        });

        $(".cancel").unbind('click').click(function () {
            $(".del").stop().fadeOut(1000, "linear");
        });
    });

    //搜索功能
    $("#btnSearch").click(function () {
        var id = $("#txtSearch").val();
        id = parseInt( id );
        $.ajax({
            url:'http://'+net.url+'/admin/users/' + id,
            type:'get',
            datatype:'json',
            success:function (data) {
                if( !data ){
                    //若结果集为空,则提示无结果
                    //return不刷新列表
                    $(".prompting").html( '未搜索到相关用户信息,请重试!' )
                        .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    return;
                }
                //拥有数据,加载到页面指定位置
                var item = {result:[data]};
                var html = template('tpl',item);
                $('#tbody').html(html);
            }
        });
    });
});
