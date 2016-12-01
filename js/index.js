
$(function () {

    getBlog();


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
                $(".pager > .prev > a").click(function () {
                    if ( pageindex == 1 ){
                        $(".warning").html("已经是第一页了").css('display', 'block').fadeIn( 2000, "linear").delay(1500).fadeOut( 2000, "linear");
                    } else {
                        //局部加载获取数据
                        getBlog( --pageindex, pagesize );
                    }
                });
                $(".pager > .next > a").click(function () {
                    if ( pageindex == data.pagecount ){
                        $(".warning").html("已经是最后一页了").css('display', 'block').fadeIn( 2000, "linear").delay(1500).fadeOut( 2000, "linear");
                    } else {
                        getBlog( ++pageindex, pagesize );
                    }
                });
            }
        });
    }
});
