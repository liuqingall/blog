$(function () {
    var obj = query(location.search);

    $.ajax({
        url: 'http://' + net.url + '/posts/' + obj['id'],
        type: 'get',
        success: function (data) {
            //$(document).find('html').html(data);

        }
    });
    //获得评论
    getComments();

    //发表评论
    $('form').submit(function(){
        setComment();
        return false;
    });

    //点赞支持
    view('.fa-thumbs-o-up', 'support');

    //反对
    view('.fa-thumbs-o-down', 'oppose');

    //获得评论的函数封装
    function getComments() {

        $.ajax({
            url: 'http://' + net.url + '/comments/' + obj['id'],
            type: 'get',
            success: function (data) {

                var item = {results: data};

                var html = template('tpl', item);

                $('#usercomments').append(html);
            }
        });

    }

   //发表观点的函数封装
    function view(className, view) {
        $('body').on('click', className, function () {
            var id = $(this).data('id');
            var that = $(this);
            $.ajax({
                url: 'http://' + net.url + '/' + view + '/' + id,
                type: 'get',
                success: function (data) {

                    //判断权限
                    if (data && data.code === -1) {
                        location.href = '/blog自己/blog/login.html';
                        return false;
                    }
                    if (data.code === 1) {

                        $(that).next().text(data.data);
                    }
                }
            })
        });
    }

    //发表评论
    function setComment(){
        var formData = $('form').serialize();

        $.ajax({
            url:'http://'+net.url+'/comments/create',
            type:'post',
            data:formData,
            success:function(data) {
                console.log(data);
                if(data.code===-1) {
                    location.href = './login.html';
                    return;
                }
                if(data.code===1) {
                    $('.info').text('发表成功').fadeIn(500).delay(1000).fadeOut(500);


                }else {
                    $('.info').text('发表失败').fadeIn(500).delay(1000).fadeOut(500);
                }
            }

        })
    }

    function query(url) {

        var str = url.split('?')[1],//split()将字符串分割成数组
            obj = {};
        str.split('&').forEach(function (v, k) {
            var arr = v.split('=');
            obj[arr[0]] = arr[1] ? arr[1] : '';

        });
        return obj;
    }

});

