$(document).ready(function(){
	
		//functions
		
		//gefur upp oll property a object!
		function getAllMethods(object) {
			return Object.getOwnPropertyNames(object).filter(function(property) {
				return typeof object[property] == 'function';
			});
		}
		
		function c(hvad){
			console.log(hvad);
		}
		
		
		//javascript
		$('.hoplaerdomur').click(function(){

			var fag = $(this).parents().children('.fag').text();
			takki_yttur_value = $(this).val();
			stofnandi = $('.stofnandi').text();
			$('.falda_inputtid').val(fag+'_'+takki_yttur_value+'_'+stofnandi);
		
			header = 'Hvernig viltu læra?';//setja upp takkana thrja thannig ad allt se i godu, hugsanlega setja i toflu svo spurningamerkin geti verid beint undir hverjum takka.
		
			innihald = "<h3 class='fag'>"+fag+"</h3><div class='laera_med_vinum_container'><input type='button' class='laera_med_vinum' value='Með öllum' ><input type='button' class='laera_med_vinum' value='Eingöngu með vinum' name='Hóplærdómur' class='vista_hop_takki'><input type='button' class='laera_med_vinum' value='Keppa við vini' class=''></div>"

			hladaMidju(header, innihald)
		
		});
		
		$('.spurningayfirlit_midi, #prof_container').css({
		'display':'none',
		}).delay(1000).fadeIn('fast');
		
		setInterval(function(){
			$('.ajax_loader_gif').hide();
		}, 1000);
		
		function modalGluggi(header, content){
			$('body').append("<div class='modalgluggi'><h3>"+header+"</h3><p>"+content+"</p></div>");
			$('body').append("<div class='grima'></div>");
			var gluggi_vidd = $('.modalgluggi').outerWidth();
			var skjar_vidd = $(window).outerWidth();
			var helmingur_modalglugga = gluggi_vidd/2;
			var midja_skjas = skjar_vidd/2;
			var vinstri = midja_skjas-helmingur_modalglugga;
			$('.grima').css({
			'width':skjar_vidd+20,
			'height':'1000px'
			}).show()
			$('.modalgluggi').css('left', vinstri);
		}
		
		$('.hverjum_viltu_bjoda_textainput').live('keypress', function(e){
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				jsonpCallback: "notendur",
				url: '/saekjanotendur',
				success : function(data){
					availableTags = [];
					var asd = $.parseJSON(data);
					for(var name in asd){
						var strengur = asd[name];
						availableTags1 = strengur.split(',');
					}
					for(a = 0;a < availableTags1.length; a=a+2){
						console.log(availableTags1[a]);
						var nafn = availableTags1[a];
						var email = availableTags1[a+1];
						var strengur = nafn+' ('+email+')';//tharf ad baeta namshopa tofluna og setja email sem unique id, valda thvi ad email saveast ser!
						availableTags.push(strengur);
					}
				}
			})
		});
			

		function split( val ) {
			return val.split( /,\s*/ );
		} 
		function extractLast( term ) {
			return split( term ).pop();
		}

		$('.notendanafn').toggle(function(){
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
		
	$('.svar').click(function(){
		$this = $(this).parents('tr').children('td').children('.tala');
		if($this.hasClass('valid')){
			$('.tala').removeClass('ekki_valid');
			$this.removeClass('valid');
			$('.velja_svar').css('visibility','hidden');
		}
		else if($this.hasClass('ekki_valid')){
			$('.tala').addClass('ekki_valid').removeClass('valid');
			$this.addClass('valid').removeClass('ekki_valid');
		}			
		else{
			$('.velja_svar').css('visibility','visible')
			$this.addClass('valid')
			$('.tala').not('.valid').addClass('ekki_valid');
		}		
	});

	$('.spjall_form_prufgluggi').submit(function(){
		var spjalltexti = $('.spjall_input').val();
		now.distributeMessage(spjalltexti)
		return false;
	});
	
	now.komaNotendumFyrir = function(){
		$('.hverjir_eru_i_sess p').after("<p>asd</p>")
	}
	
	if (!!$('.sticky').offset()) { // make sure ".sticky" element exists
 
    var stickyTop = $('.sticky').offset().top; // returns number 
 
    $(window).scroll(function(){ // scroll event
 
	  var stickyLeft = $('.sticky').offset().left;
 
      var windowTop = $(window).scrollTop(); // returns number 
 
      if (stickyTop < windowTop-8){
        $('.sticky').css({ position: 'fixed', top: 8, left : stickyLeft });
      }
      else {
        $('.sticky').css('position','static');
      }
 
    });
 
	}
	
	$('.utskyring').click(function(){
		if($.cookie('sja_utskyringu_kaka') == 'true'){
			$('.utskyringin').slideDown('fast', 'swing')
		}
		else{
			modalGluggi('Stigin mín!! NEEEEEEEEEI',"Viltu örugglega sjá útskýringuna? Þú færð helmingi færri stig fyrir spurninguna eftir að þú hefur séð útskýringuna<div><input type='button' value='Já' class='takki blar fa_utskyringu'><input type='button' value='Nei' class='takki blar fa_utskyringu'><span class='muna_eftir_vali'><input type='checkbox'>Muna!</span><span class='loka_glugga' title='Loka glugga'>X</span></div>");
		}
	});
	
	//setja upp func sem updatear "i sessioni", setja upp nokkra mogulega liti sem user getur fengid!

	$('.loka_glugga').live('click', function(){
		$('.grima, .modalgluggi').hide();
	});
	
	$('.socialgluggi p').after('<p>ddd</p>')
	
	$('.fa_utskyringu').live('click', function(e){
		var val = $(this).val();
		var muna = $('.muna_eftir_vali input').is(':checked')
		if(muna == true){
			$.cookie('sja_utskyringu_kaka', muna, { path : '/prof' , expires : 365 });
		}
		if(val == 'Já'){
			$('.grima, .modalgluggi').hide();
			$('.utskyringin').slideDown('fast');			
		}
		else{
			$('.grima, .modalgluggi').hide();
		}
	});
	
	$('.grima').live('click', function(){
		$('.grima, .modalgluggi').hide();
	});
	
	$('.post').click(function(){
		$(this).addClass('post_nytt');
	});
	
	timi = 0;
	
	
	setInterval(function(){
		timi = timi + 1;
		c(timi);
		return timi;
	}, 1000);
	
	$('.velja_svar').click(function(){
		//Athugar hvaða próf er í gangi
		prof = $('.profatexti').text(); 
		if($(this).val() == 'Velja svar'){	
			//checkar hvort utskyring var virk a spurningunni
			var utskyring = $('.utskyringin').css('display'); //none(er ekki virk) / block (virk)
			//geymir numer spurningarinnar i variable til ad senda a server
			spurning = $('.numer_spurningar').text();
			//naer i nafn a namskeidinu til ad senda a server
			var namskeid = $('.namskeid').text();
			//tekur svarid sem notandi hefur valid og geymir thad i variable til ad senda a server
			valid_svar = $('.valid').text();
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				data: { spurning:spurning, valid_svar:valid_svar, timi:timi, namskeid:namskeid, utskyring:utskyring, prof:prof },
				jsonpCallback: "spurning",
				url: '/naestaspurning',
				success: function(data){
					gogn = $.parseJSON(data);
					svar = gogn['rett'];
					rett = '<span class="rett">&#10004;</span>';
					rangt = '<span class="rangt">&#10006;</span>';
					qid = gogn['qid'];
					//ef svarid var rangt 
					if(gogn['rett_rangt'] == 'rangt'){
						$(".qid_"+qid).addClass('spurningamidi_rangt').removeClass('spurningamidi_rett');
						var asd = $('.valid').parents('td').next('td').html();
						var rangt_svar = asd+' '+rangt;
						$('.valid').parents('td').next('td').html(rangt_svar);
					}//ef svarid var rett
					else if(gogn['rett_rangt'] == 'rett'){
						//baetir stigum vid eftir hverju notandinn svarar og hvort utskyring sjaist eda ekki // ath ad gogn['stig'] eru reiknud stig fra server eftir thvi hvad notandinn hafdi svarad adur ! 
						var stig = parseInt($('.stig').text()); stig_ny = stig+parseInt(gogn['stig']); $('.stig').text(stig_ny);
						//baetir rett vid rettan spurningamida, fadear i graenan og tekur raudan burt
						if(utskyring == 'none'){
							$(".qid_"+qid).addClass('spurningamidi_rett').removeClass('spurningamidi_rangt spurningamidi_utskyring');
						}
						else{
							$(".qid_"+qid).addClass('spurningamidi_utskyring').removeClass('spurningamidi_rangt spurningamidi_rett');
						}
					}
					$('.utskyringin').slideDown('fast');
					classi_rett = '.utskyring_'+svar;
					$(classi_rett).addClass('rett_utskyring');
					var rett_svar2 = $(classi_rett).parents('tr').prev('tr').children('.svarmoguleiki').html();
					$('.utskyring_svarmoguleiki').addClass('rong_utskyring');
					rett_svar = rett_svar2+' '+rett;
					rett_svar2 = $(classi_rett).parents('tr').prev('tr').children('.svarmoguleiki').html(rett_svar);
				}
			});
			svar = $('.valid').text();
			$('.utskyring_svarmoguleiki, .myndband').fadeIn().css('visibility','visible'); //hafa myndband i glugga? - setja prosentur aftan vid moguleika thegar buid er ad velja
			$(this).val('Næsta spurning').removeClass('velja_svar').addClass('naesta_spurning');
			$('.svarmoguleiki').removeClass('svar');

		}
		else
		{
		//felur svarmoguleika
		$('.utskyring_svarmoguleiki').hide().removeClass('rett_utskyring rong_utskyring');
		//felur utskyringu
		$('.utskyringin').slideUp('fast');
		//breytir velja svar takka aftur i upphaflegt astand, te. hidden + rett value
		$(this).addClass('velja_svar').removeClass('naesta_spurning').val('Velja svar').css('visibility','hidden');
		//felur myndbandstakka
		$('.myndband').css('visibility','hidden');
		//setur svarmoguleika aftur i gang
		$('.svarmoguleiki').addClass('svar');
		//afvirkjar allt fyrirframvalid af valmoguleikum
		$('.tala').removeClass('valid ekki_valid');
		spurning = $('.numer_spurningar').text();
		//incrementa qid
		qid = parseInt($('.qid').text()); qid++; $('.qid').text(qid);
		//resettar timer
		timi = 0;	
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				data: { spurning:spurning, prof:prof },
				jsonpCallback: "spurning",
				url: '/naestaspurning',
				beforeSend: function(){
					$('.spurning, .svar_a, .svar_b, .svar_c, .svar_d, .utskyringin p').html('<img src="/images/ajax-loader-snuningur.gif" />');
				},
				success : function(data){
					gogn = $.parseJSON(data);
					if(gogn['spurning'] == 'spurningar bunar'){
						$('.prof_kassi').text('thetta er buid')
					}
					else{
						$('.spurning').text(gogn['spurning']);
						$('.svar_a').text(gogn['svar_a']);
						$('.svar_b').text(gogn['svar_b']);
						$('.svar_c').text(gogn['svar_c']);
						$('.svar_d').text(gogn['svar_d']);
						$('.svar_e').text(gogn['svar_e']);
						$('.utskyring_a').text(gogn['utskyring_a']);
						$('.utskyring_b').text(gogn['utskyring_b']);
						$('.utskyring_c').text(gogn['utskyring_c']);
						$('.utskyring_d').text(gogn['utskyring_d']);
						$('.utskyring_e').text(gogn['utskyring_e']);
						$('.utskyringin p').text(gogn['utskyring_spurningu']);
						//ath ad qid spurningar verdur ad vera sama tala og su sem merkir myndbandid - lata myndband stodvast thegar smellt er framhja myndbandsglugga
						$('video').html("<source src='/videos/sal_lifsal_v01_s"+gogn['qid']+".mp4' type='video/mp4' />");
					}
				}
			});
		}
	});	

	//function sem litar spurningamidana eftir thvi hvort their eru rettir/rangir/osvaradir
	var namskeid = $('.namskeid').text();
	
	$.ajax({
		type: "POST",
		dataType: "jsonp",
		data: { namskeid:namskeid },
		jsonpCallback: "litir_spurningamida",
		url: '/saekjaspurningamida',
		success: function(data){
			midar = JSON.parse(data);
			stig = 0;
			for(var key in midar){
				svar = midar[key].svar;
				qid = midar[key].qid;
				stigin = midar[key].stig;
				stig += stigin;
				switch(stigin){
					case 30:
						$(".qid_"+qid+"").addClass('spurningamidi_rett');
						break;
					case 15:
						$(".qid_"+qid+"").addClass('spurningamidi_utskyring');
						break;
					case 0:
						$(".qid_"+qid+"").addClass('spurningamidi_rangt');
						break;
				}
			}
			$('.stig').text(stig);
		}
	});
	
	$('.leit_input').focus(function(){
		$(this).val('');
	});
	
	//function sem setur spurningarnar upp thegar smellt er a spurningaflipa i profi
	$('.spurningayfirlit_midi').click(function(){
		//Athugar hvaða próf er í gangi
		prof = $('.profatexti').text(); 
		qid = parseInt($(this).text());
		$('.qid').text(qid);
		var namsk1 = $('.numer_spurningar').text();
		var namsk2 = namsk1.split(' - ');
		var namsk = namsk2[0];
		numer_sp = qid-1;
		spurning = namsk+' - #'+numer_sp;
 			$.ajax({
				type: "POST",
				dataType: "jsonp",
				data: { spurning:spurning, prof:prof },
				jsonpCallback: "spurning",
				url: '/naestaspurning',
				beforeSend: function(){
					$('.spurning, .svar_a, .svar_b, .svar_c, .svar_d, .utskyringin p').html('<img src="/images/ajax-loader-snuningur.gif" />');
				},
				success : function(data){
					gogn = $.parseJSON(data);
						$('.spurning').text(gogn['spurning']);
						$('.svar_a').text(gogn['svar_a']);
						$('.svar_b').text(gogn['svar_b']);
						$('.svar_c').text(gogn['svar_c']);
						$('.svar_d').text(gogn['svar_d']);
						$('.svar_e').text(gogn['svar_e']);
						$('.utskyring_a').text(gogn['utskyring_a']);
						$('.utskyring_b').text(gogn['utskyring_b']);
						$('.utskyring_c').text(gogn['utskyring_c']);
						$('.utskyring_d').text(gogn['utskyring_d']);
						$('.utskyring_e').text(gogn['utskyring_e']);
						$('.utskyringin p').text(gogn['utskyring_spurningu']);
						timi = 0;
						//ath ad qid spurningar verdur ad vera sama tala og su sem merkir myndbandid - lata myndband stodvast thegar smellt er framhja myndbandsglugga
						$('video').html("<source src='/videos/sal_lifsal_v01_s"+gogn['qid']+".mp4' type='video/mp4' />");
					
				}
			});
	});
		
	 var triggers = $(".modalInput").overlay({

      // some mask tweaks suitable for modal dialogs
      mask: {
        color: '#ebecff',
        loadSpeed: 100,
        opacity: 0.9,
      },
	});	
		
});