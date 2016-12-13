
$(function () {

    getBlog();
    $(".warning").css('display', "none");

    /* 顶部导航栏动画 */
    if ($(window).width() > 1170) {
        var navHeight = $('.navbar-custom').height();
        $(window).on('scroll', {
            previousTop: 0
        }, function () {
            var currentTop = $(window).scrollTop();
            if (currentTop < this.previousTop) {
                if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                    $('.navbar-custom').addClass('is-visible');
                } else {
                    $('.navbar-custom').removeClass('is-visible is-fixed');
                }
            } else if (currentTop > this.previousTop) {
                $('.navbar-custom').removeClass('is-visible');
                if (currentTop > navHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
            }
            this.previousTop = currentTop;
        });
    }

    /* 获取博客帖子 */
    function getBlog( pageindex, pagesize ) {
        //设置默认数值
        pageindex = pageindex || 1;
        pagesize = pagesize || 5;
        $.ajax({
            url:'http://127.0.0.1:8888/posts/getpage',
            datetype:'json',
            type:'get',
            data:{ pageindex:pageindex, pagesize:pagesize },
            success:function ( data ) {
                //返回结果为数组，将其转变为json对象,以便使用
                var result = { item:data };
                var artHTML = template( "arttemp", result );

                //渲染页面
                $(".artical > .row > .list").html( artHTML );
                //通过当前页码和大小来获取总页数
                getPageCount( pageindex, pagesize );
            }
        });
    }

    function getPageCount( pageindex, pagesize ) {
        $.ajax({
            url:'http://127.0.0.1:8888/posts/count',
            datetype:'json',
            type:'get',
            data:{  pagesize:pagesize },
            success:function ( data ) {
                /* 前后翻页 */
                $(".pager > .prev > a")
                //先解绑事件再绑定,以免重复触发事件,
                //因getPageCount函数在getBlog函数中执行,
                //点击发生后,会重新执行getBlog函数,也就会再次执行click绑定
                    .unbind('click').click(function () {
                    if ( pageindex == 1 ){
                        $(".warning").html("已经是第一页了")
                        //先清除动画再执行,防止动画叠加
                            .stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    } else {
                        //局部加载获取数据
                        getBlog( --pageindex, pagesize );
                    }
                });
                $(".pager > .next > a").unbind('click').click(function () {
                    if ( pageindex == data.pagecount ){
                        $(".warning").html("已经是最后一页了").stop(true).fadeIn( 500, "linear").delay(1500).fadeOut( 1500, "linear");
                    } else {
                        getBlog( ++pageindex, pagesize );
                    }
                });
            }
        });
    }
});
