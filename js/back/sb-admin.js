/*
$(function(){

   /!* var ue = UE.getEditor('content',{

        toolbars:[['Source', 'Undo', 'Redo','bold']],

        autoClearinitialContent:true,

        wordCount:false,

        elementPathEnabled:false

    });*!/



    function getPage(pageIndex,pageSize){

       $.ajax({
           url:'http://'+net.url+'/admin/posts',
           type:'get',
           dataType:'json',
           data:{pageindex:pageIndex,pagesize:pageSize},
           success:function(data) {

               var item = {result:data};
               var html = template('tpl',item);
               $('#tbody').append(html);


           }
       });
   }
    getPage(1,40);
    $('#save').on('click',function(){

        var t = parseInt($('#tbody tr:first-child td:last-child').attr('data-id'))+1;


        var str =  '<tr>'
            +'<td>1</td>'
            +'<td>js</td>'
            +'<td>'+$("#exampleInputEmail1").val()
            +'</td>'
            +'<td data-id='+t+'>'
            +'<button type="button" class="btn btn-primary">编辑</button>'
            +' <button type="button" class="btn btn-danger">删除</button>'
            +'</td>'
            +'</tr>';
        $('#tbody').prepend(str);

        $('#tbody tr:gt(0)').each(function(i,v){

            $($($(this).children()).eq(0)).html(i+2);
        });

        $('#myModal').hide();
        $('.modal-backdrop.in').hide();




    });
    $("#tbody").on("click", ".btn-danger", function () {

        var id = $(this).parent().data("id");

        $('.makeSure').fadeIn(500);

        $('.back').on('click',function(){
            $('.makeSure').fadeOut(500);
        });
        $('.sure').on('click',function(){
            $('[data-id=' + id + ']').parent().remove();
            $('.makeSure').fadeOut(500);

        })
    });



});
*/
$(function(){
    var id;//记录修改帖子的id
    var ue = UE.getEditor('content',{
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars:[['Source', 'Undo', 'Redo','bold']],
        //focus时自动清空初始化时的内容
        autoClearinitialContent:true,
        //关闭字数统计
        wordCount:false,
        //关闭elementPath
        elementPathEnabled:false

    });
    //获取所有数据
   function getData() {

       $.ajax({
           url:'http://'+net.url+'/admin/posts',
           type:'get',
           dataType:'json',
           data:{pageindex:1,pagesize:15},
           success:function(data) {

                //判断权限
               if(data && data.code===-1) {
                   location.href ='#';
                   return;
               }
               var item = {result:data};
               var html = template('tpl',item);
               $('#tbody').append(html);


           }

       });

   }
    getData();
    //删除
    $('#tbody').on('click','.btn-danger', function(){
       var id = $(this).parent().data('id');

        //提示是否删除
        $('.makeSure').fadeIn(500);

        $('.back').on('click',function(){
            $('.makeSure').fadeOut(500);
        });
        //从数据库中将数据删除
        $('.sure').on('click',function(){
            $.ajax({
                url:'http://'+net.url+'/admin/posts/delete/'+id,
                type:'get',
                data:{id:id},
                success:function(data){
                    //判断权限
                    if(data && data.code===-1) {
                        location.href ='#';
                        return;
                    }
                    if(data.code===1) {
                        $('.delete').text('删除成功').fadeIn(500).delay(1000).fadeOut(500);
                        $("#tbody tr").remove();//先将tbody中的内容清空
                        getData();//重新请求数据
                    }
                }
            });
            $('.makeSure').fadeOut(500);

        });


    });
    //添加或修改的标识
    var flag = -1;
    //添加帖子
   $('#btnAdd').on('click',function(){
       flag = 1;//添加帖子
       $('#myModalLabel').text('添加帖子');
       $("#myModal").modal("show");

   });
    //保存帖子
    $('#save').on('click',function(){
        //新创建的帖子的id

            data = $('form').serialize();

        data = data.replace("editorValue","content");



        if(flag===1) {
            $.ajax({
                url:'http://'+net.url+'/admin/posts/create',
                type:'post',
                data:{title:$('#exampleInputEmail1').val(),content:data},
                success:function(data){
                    //判断权限
                    if(data && data.code===-1) {
                        location.href ='#';
                        return;
                    }
                    if(data.code===1) {
                        $('.delete').text('保存成功').fadeIn(500).delay(1000).fadeOut(500);
                        $("#myModal").modal("hide");
                        $("#tbody tr").remove();//先将tbody中的内容清空
                        //重新加载数据
                        getData();
                    }else {
                        $('.delete').text('保存失败').fadeIn(500).delay(1000).fadeOut(500);
                    }
                }
            });
        } else if(flag==2) {
         //修改帖子
            $.ajax({
                url:'http://'+net.url+'/admin/posts/update',
                type:'post',
                data:{title:$('#exampleInputEmail1').val(),content:data,id:id},
                success:function(data) {
                    if(data.code===-1) {
                        location.href='#';
                        return false;
                    }
                    if(data.code===1) {
                        $('.delete').text('修改成功').fadeIn(500).delay(1000).fadeOut(500);
                        $("#myModal").modal("hide");
                        $("#tbody tr").remove();//先将tbody中的内容清空
                        //重新加载数据
                        getData();
                    }else {
                        $('.delete').text('修改失败').fadeIn(500).delay(1000).fadeOut(500);
                    }
                }

            })
        }

    });
    //编辑帖子
    $('#tbody').on('click','.btn-primary',function(){

        flag =2;
        id = $(this).parent().data('id');
        //修改标题
        $('#myModalLabel').text('编辑帖子');$("#myModal").modal("show");


        $.ajax({
            url:'http://'+net.url+'/admin/posts/'+id,
            type:'get',
            //data:{id:id},
            success:function(data) {

                $('#exampleInputEmail1').val(data.data.title);
                $('#id').val(data.data.id);
                ue.setContent(data.data.content);
            }
        });

    });
    //当模态框消失的时候要改变flag的值，将编辑器中的内容清空
    //在模态框完全隐藏后触发
    $('#myModal').on('hidden.bs.modal',function(){
        flag = -1;
        $('#exampleInputEmail1').val('');
        ue.setContent('');
    });
    //搜索帖子

});