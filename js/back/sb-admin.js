$(function(){
    $.ajax({
        url:'http://'+net.url+':8888/admin/posts',
        type:'get',
        dataType:'json',
        data:{pageindex:1,pagesize:10},
        success:function(data) {
            var item = {result:data};
            var html = template('tpl',item);
            $('#tbody').append(html);
            $('#btnAdd').click(function(){
                $()
            });

        }
    })
});
