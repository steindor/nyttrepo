$(document).ready(function(){
		
	//functions


	//now js functions
	now.receiveMessage = function(skilabod){
		var html = $('.container_messages').html();
		var asd = skilabod+html;
		$('.container_messages').html(asd);
		$('.falid_skilabod').slideDown();
		$('.skilabod_thitt_yfirlit').each(function(i){
			if(i > 4){
				$(this).slideUp();
			}
		});
	}	
	
	//javascript
	
	//sendir namskeidskoku af stad og redirectar yfir a namskeidsyfirlit ef allt er ok
	$('.namskeid_icon').click(function(){
		var namskeid = $(this).children('h4').text();
		$.ajax({
			url : '/fara_i_namsk_yfirlit',
			type : 'POST',
			data : { namskeid:namskeid },
			dataType : 'text',
			success : function(data){
				if(data == 'ok'){
					window.location = '/namsk_yfirlit'
				}
			},
		});		
	});

	now.ready(function(){
		var notendanafn = $('.notendanafn').text();
		now.distributeMessage(notendanafn + ' var ad tengjast');
	});
	
	$('h3').click(function(){
		var asd = $(this).text();
		now.distributeMessage(asd);
	});
	
	
	
		
});