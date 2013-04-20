$(document).ready(function(){

	
	
	//forsidu js
	$('.login_form').submit(function(){
		alert('asd');
		return false;
	});
	
	$.ajax({
		url : '/saekjaskilabod',
		type : 'POST',
		dataType : 'text',
		success : function(data){
			alert(data);
		}
	});
	
	//menujavascriptid, togglar thad on og off fyrir notendanafn og skilabodaskjodu
	$('.notendanafn, .skilabodaskjoda').toggle(function(){
	var classi = $(this).hasClass('skilabodaskjoda');
	$(this).addClass('menu_opinn');
		$('body').append('<div class="menu"><p class="menuitem">Mitt yfirlit</p><p class="menuitem">Skilaboð</p><p class="menuitem">Stillingar</p></div>');
		var stada = $(this).offset();
		var vi = stada.left;
		var to = stada.top;
		$('.menu').css({
			'position':'absolute',
			'background-color':'white',
			'left':vi,
			'font-size':'.8em',
			'z-index':'1',
			'top':to+23
		});
	}, function(){
		$(this).removeClass('menu_opinn');
		$('.menu').hide();
	});
	
	//autocomplete fyrir leitarbox i navigationbar
	$('.userbar_leitarbox').live('keyup', function(e){
		var leitarstrengur = $(this).val();
		$.ajax({
			url : '/navigationbox_leita',
			type : 'POST',
			dataType : 'text',
			data : { leitarstrengur:leitarstrengur },
			jsonpCallback: "leitarnidurstodur",
			success : function(data){
				var strengur = data;
				var strengur2 = strengur.split('-');
				leit_arr = new Array();
				for(i = 1;i< strengur2.length;i++){
					leit_arr.push(strengur2[i])
				}
				$(".userbar_leitarbox").autocomplete({
						source: leit_arr
				});
			}
		});
	});
	
	$('.spyrja_spurningu_form').submit(function(){
		var notendanafn = $('.spurning_input').val();
		$.ajax({
			url : '/login',
			type : 'POST',
			dataType: "text",
			data : { notendanafn:notendanafn },
			success : function(data){
				if(data == 'ok'){
					window.location = '/thitt_yfirlit';
				}
			}
		});
		return false;
	});
	
	
	now.bjodaUserumSession = function(skilabod){
			var tala = parseInt($('.tala_skilabod').text());
			var tala = tala+1;
			var undirskilabod = skilabod.substring(0,25)
			$('.tala_skilabod').text(tala);
			$('.tala_skilabod').after('<p class="skilabod">'+undirskilabod+'.. <span class="sja_skilabod">Sýna</span></p>');
			setInterval(function(){
				$('.skilabod').fadeOut('fast');
			}, 6000)
	};
	
});