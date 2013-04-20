$(document).ready(function(){
	
		//functions
		
		//gefur upp oll property a object!
		function getAllMethods(object) {
			return Object.getOwnPropertyNames(object).filter(function(property) {
				return typeof object[property] == 'function';
			});
		}
		
		function modalGluggi(header, content){
			$('body').append("<div class='modalgluggi'><h3>"+header+"</h3><p>"+content+"</p></div>");
			$('body').append("<div class='grima'></div>");
			var skjar_vidd = $(window).width();
			var haed_vefsidu = $(document).height();
			var scrollposY = $(window).scrollTop();
			var tiu_prosent_af_haed_vefs = 0.1*haed_vefsidu;
			var gluggi_vidd = $('.modalgluggi').outerWidth();
			var helmingur_modalglugga = gluggi_vidd/2;
			var midja_skjas = skjar_vidd/2;
			var vinstri = midja_skjas-helmingur_modalglugga;
			$('.modalgluggi').css({
			'left': vinstri,
			'top': tiu_prosent_af_haed_vefs+scrollposY
			});
			$('.grima').css({
			'width':skjar_vidd+10,
			'height':haed_vefsidu
			}).fadeIn('fast')
			$('.modalgluggi').fadeIn('fast');
		}
		
		function c(hvad){
			console.log(hvad);
		}
		
		function submittaSpurningu(efni){
			rammi = "<div class='spurning_um_kurs'><p class='sjalf_spurningin'>"+efni+"</p><h5><span class='spyrjandi'>spyrjandi</span><span class='timi_spurningar'>timi</span></h5></div>";
			$('.spurning_um_kurs').last().after(rammi);
		}
		
		function hladaMidju(header, innihald){
			vidd = $(document).width()+10;
			haed = $(document).height()+18;
						
			$('.header_infobox').html(header)
			$('.nedrihluti_infobox').html(innihald)
			
			var infobox_haed = $('.infobox_midja').outerHeight();
			var infobox_vidd = $('.infobox_midja').outerWidth();
	
			var helmingur_glugga = vidd/2;
			var helmingur_kassa = infobox_vidd/2;
			var vinstri = helmingur_glugga - helmingur_kassa;
	
			$('.infobox_midja').css({
			'top':'30%',
			'left':vinstri+'px'
			}).show()
			
			$('.grima').css({
			'width':vidd,
			'height':haed
			}).show();		
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
		
		$('.star-rating').live('click', function(){
			$('.submitta_einkunn').show();
		});
		
		$('.rating-cancel').live('click', function(){
			$('.submitta_einkunn').hide();
		});
		
		$('.submitta_einkunn').live('click', function(){
			var a = 0;
			$('.star-rating-on').each(function(i){
				a++;
			});
			alert(a);
		});
		
		$('.spyrja_spurningu_form').submit(function(){
			var spurning = $('.spurning_input').val();
			submittaSpurningu(spurning);
			return false;
		});
		
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

		$( ".hverjum_viltu_bjoda_textainput" )
			// don't navigate away from the field on tab when selecting an item
			.bind( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
				}
			})
			.live('focus', function(e){
				$('.hverjum_viltu_bjoda_textainput').autocomplete(options)
			});
			
			var options = {
				minLength: 0,
				source: function( request, response ) {
					// delegate back to autocomplete, but extract the last term
					response( $.ui.autocomplete.filter(
						availableTags, extractLast( request.term ) ) );
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					var terms = split( this.value );
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push( ui.item.value );
					// add placeholder to get the comma-and-space at the end
					terms.push( "" );
					this.value = terms.join( ", " );
					return false;
				}
			};

			
			
		
	
		$('.laera_med_vinum').live('click', function(){
			var fag = $('h3.fag').text();
			var takki_yttur_value = $(this).attr('name');
			
			$('.falda_inputtid').val(fag+'_'+takki_yttur_value+'_'+stofnandi);
	
			falda_inputtid = fag+'_'+takki_yttur_value+'_'+stofnandi;
			
			
			console.log(fag+' '+takki_yttur_value)
			
			var notendanafn = $('.login_nafn').text();
			var notendanafn2 = notendanafn.split(' ');
			var notendanafnid = notendanafn2[1];
			
			$.ajax('/yfirlit', {
				type : 'POST',
				data : { falda_inputtid : falda_inputtid },
			});
				
				
			switch(takki_yttur_value){
				case 'Hóplærdómur':
				//vill bua til nytt session
				now.lesaFag(takki_yttur_value, notendanafnid, stofnandi);
				break;
				case 'Lesa':
				//vill joina session sem er thegar i gangi
				now.lesaFag(takki_yttur_value, notendanafnid, stofnandi);
				break;
			} 

			$('.falda_inputtid_form').submit();

		});
	
		$('.joina_studysession').click(function(){ //setur gogn i falid form og submittar
			var fag = $(this).parents().children('.fag').text();
			takki_yttur_value = $(this).val();
			stofnandi = $('.stofnandi').text();
			$('.falda_inputtid').val(fag+'_'+takki_yttur_value+'_'+stofnandi);
	
			falda_inputtid = fag+'_'+takki_yttur_value+'_'+stofnandi;
			
			
			console.log(fag+' '+takki_yttur_value)
			
			var notendanafn = $('.login_nafn').text();
			var notendanafn2 = notendanafn.split(' ');
			var notendanafnid = notendanafn2[1];
			
			$.ajax('/yfirlit', {
				type : 'POST',
				data : { falda_inputtid : falda_inputtid },
			});
				
				
			switch(takki_yttur_value){
				case 'Hóplærdómur':
				//vill bua til nytt session
				now.lesaFag(takki_yttur_value, notendanafnid, stofnandi);
				break;
				case 'Lesa':
				//vill joina session sem er thegar i gangi
				now.lesaFag(takki_yttur_value, notendanafnid, stofnandi);
				break;
			} 

			$('.falda_inputtid_form').submit();
			
		
		});	
		
		$('input[type=text]').live('focus mouseup', function(e){
		if(e.type == 'focusin'){
			this.select()
			}
		else if(e.type == 'mouseup'){
			e.preventDefault();	
			}
		});	
		
		
		
		/*live('focus', function(e){
		if(e.type == 'focus') alert(e.type);//this.select();
		});*/
		
		$('.nyr_hopur').click(function(){
			
			header = 'Nýr hópur';
			htmlid = "<p><input type='text' value='Hvað á hópurinn að heita?' class='nyr_hopur_textainput' /></p><p><input type='text' value='Hvaða notendum viltu bjóða í hópinn?' class='hverjum_viltu_bjoda_textainput' /></p><input type='button' style='float:right; margin:10px 20px 0px auto;' value='Vista' class='vista_hop_takki'>"
			
			hladaMidju(header, htmlid)
			
		});		
		
		$('.eyda_hop').click(function(){
			
			$.ajax({
				type: "POST",
				url : '/eyda_hop',
				data : 'jsonp',
				dataType: "jsonp",
				jsonpCallback: "gogn",
				beforeSend : function(){
					header = "Hleð hópa..";
					htmlid = "<img src='/images/ajax-loader.gif' />";
					hladaMidju(header, htmlid);
				},
				complete : function(data, responseText){
					var d = JSON.parse(data.responseText);
					header = 'Eyða hóp';
					arr_hopar1 = d.hopar;
					arr_hopar = arr_hopar1.split(',');
					htmlid = '<p>Veldu þann hóp sem þú vilt eyða : </p><div class="eyda_hop_dropdown_container">'
					htmlid = htmlid.concat("<select class='dropdown_listi'>");
					for(i = 0;i < arr_hopar.length;i++){
						htmlid = htmlid.concat('<option value='+arr_hopar[i]+'>'+arr_hopar[i]+'</option>');
					}
					htmlid = htmlid.concat("</select></div><input style='float:right;margin:auto 20px;' class='loka_eyda_hop_takki' type='button' value='Eyða hóp'>");
					c(htmlid);
					hladaMidju(header, htmlid);
				}
			
			});			
		});
		
		$('.loka_eyda_hop_takki').live('click', function(e){
			var dropdown = $('.dropdown_listi').val();
			alert(dropdown); //vantar func til ad eyda thessum gaur
		});		
			
		$('.vista_hop_takki').live('click', function(){
			var nafn_hops = $('.nyr_hopur_textainput').val(); 
			var hverjir = $('.hverjum_viltu_bjoda_textainput').val();
			var em = hverjir.split(/[\(,\)]/);
			arr_full_nofn = [];
			arr_email = [];
			for(var name in em){
				val = em[name];
				if(/\S/.test(val)){
					var val_trimmad = $.trim(val);
					if(val_trimmad.indexOf('@') > -1){
						arr_email.push(val_trimmad);
					}
					else
					{
					arr_full_nofn.push(val_trimmad);
					}
				}
			}	

			
			
			c(arr_email);
			c(arr_full_nofn);
			
			var vidd = $('.infobox_midja').outerWidth();
			var haed = $('.infobox_midja').outerHeight();
			
			
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				jsonpCallback: "_testcb",
				url : 'http://198.101.202.31:3000/vistahopa',
				data : { arr_email:arr_email, arr_full_nofn:arr_full_nofn, nafn_hops:nafn_hops },
				beforeSend : function(){
					$('.nedrihluti_infobox').css({
					'width':vidd					
					}).html("<p><img src='/images/ajax-loader.gif' /></p>")				
				},
				complete : function(data){
					$('.nedrihluti_infobox').html("<p class='uppl_vistadar'>Upplýsingar vistaðar</p>");
				},
				success : function(data){
					
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});
		});

		
		var notendanafn = $('.login_nafn').text();
		var notendanafn2 = notendanafn.split(' ');
		now.notendanafn = notendanafn2[1];
	
	
		$('.info').hover(function(e){

			var texti = $(this).attr('name');
			var off = $(this).offset();
			var vi1 = off.left;
			var vi2 = $(this).outerWidth();
			vi = vi1+vi2;
			var to = off.top;
			$('body').append("<div class='infobox'>"+texti+"</div>")
			$('.infobox').css({
			'position':'absolute',
			'left':vi, 
			'top':to,
			});
		}, function(e){
			$('.infobox').hide();
		});
			
	$('.grima').live('click', function(){
		$('.grima, .modalgluggi').fadeOut().remove();
	});
	
	
	//autocomplete fyrir bjoda vinum
	$('.bjoda_vinum_i_laerdom_input').live('keyup', function(e){
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
				$(".bjoda_vinum_i_laerdom_input").autocomplete({
						source: leit_arr
				});
			}
		});
		if(e.which == 13){
			var nafn = $(this).val()
			$('.hverjum_er_bodid_nafn:last').after("<p class='hverjum_er_bodid_nafn'>"+nafn+"</p>")
			$(this).val('');
		}
	});
	
	$('h3').live('click', function(){
		userar = {};
		$('.hverjum_er_bodid_nafn').each(function(i){
			var nafn = $(this).text(); 
			if(nafn != ''){
				userar[i] = nafn;
			}
		})
		now.dreifaUserBodi(userar)
	});

	//tharf ad leysa hvad gerist tehgar user ytir a leysa med odrum -
	//1. koma upp med glugga sem bydur vinum? Leyfa ollum vinum ad sja? Leyfa ollum ad sja? Bjoda eda fa meldingu thegar e-r vill joina? hafa koku sem man preferences eda sleppa thvi?
	//2. Hafa random join?
	
	$('.leysa_prof').click(function(){
		//naer i val takkans og redirectar eftir thvi
		var laerdomur = $(this).val(); 
		if(laerdomur == 'Leysa með öðrum'){
			header = 'Hvernig viltu læra? Þú stjórnar';
			undirefni = '<div class="input_bjoda_vinum"><input type="text" value="bjoddu vinum" class="bjoda_vinum_i_laerdom_input" /><div class="hverjum_er_bodid"><p class="hverjum_er_bodid_nafn"></p></div></div><div class="hverjir_mega_sja"><select><option>Allir</option><option>Bara vinir</option><option>Enginn</option></select></div><div><input type="checkbox"> Muna stillingar</div><p>Þú getur alltaf breytt þessu í þínum stillingum</p>'
			modalGluggi(header, undirefni);
		}

		var prof_til_ad_leysa = $(this).parents('td').siblings('td').children('h4').text()
		var fag_heildarstrengur = $(this).parents().siblings('h3').text();
		var fag1 = fag_heildarstrengur.split(' - ');
		var namskeid = fag1[0]; 
		
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				jsonpCallback: "upplysingar_um_prof",
				url : '/saekjaprof',
				data : {laerdomur:laerdomur, prof_til_ad_leysa:prof_til_ad_leysa, namskeid:namskeid },
				success : function(data){
					if(laerdomur != 'Leysa með öðrum'){
						window.location = '/prof';
					}
				},
			});
	});
	
	//nowjs config
		now.updateUserMenu = function(array_notendur){
			for(i = 0; i < array_notendur.length;i++){
				console.log(array_notendur[i]);
			}
		}


	
});