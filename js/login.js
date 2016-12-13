$(document).ready(function(){

	$('.page-container form').submit(function(){

		var username = $(this).find('.username').val();
		var password = $(this).find('.password').val();
		if(username == ''){
			$(this).find('.pop').fadeOut('fast',function(){
				$(this).css('top','27px');
			});
			$(this).find('.pop').fadeIn('fast',function(){
				$(this).parent().find('.username').focus();
			});
			return false;
		}
		if(password == ''){
			$(this).find('.pop').fadeOut('fast',function(){
				$(this).css('top','96px');
			});
			$(this).find('.pop').fadeIn('fast',function(){
				$(this).parent().find('.password').focus();
			});
			return false;
		}
		var data = $('form').serialize();

		$.ajax({
			url:'http://'+net.url+'/account/login',
			type:'post',
			data:data,
			success:function(info) {
				console.log(info);
				if(info.code===1) {
					$('.message').text('登录成功').fadeIn(500).delay(1000).fadeOut(500);
					location.href='./admin/index.html';
				} else if(info.code===0) {
					$('.message').text('登录失败').fadeIn(500).delay(1000).fadeOut(500);

				} else {
					$('.message').text('登录失败').fadeIn(500).delay(1000).fadeOut(500);
				}
			}
		});
		return false;
	});

	$('.page-container form .username, .page-container form .password').keyup(function(){
		$(this).parent().find('.pop').fadeOut('fast');
	});




});