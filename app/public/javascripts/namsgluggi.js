$(document).ready(function(){

	//functions
	
		function litaHover(classinn, litur_over, litur_out){			
			$(classinn).hover(function(){
				$(this).css({
				'color': litur_over,
				'cursor': 'pointer'
				});
			}, function(){
				$(this).css({
				'color': litur_out,
				'cursor': 'default'
				});
			});
		}
		
		function baetavidNulli(i){
			if(i < 10){
				i = '0'+i;
			}
			return i;
		}
		
		function reiknaTima(){
			var timi = new Date();
			var klst = timi.getHours();
			var min = timi.getMinutes();
			var min2 = min.toString();
			min_lengd = min2.length;
			
			var timi = '('+baetavidNulli(klst)+':'+baetavidNulli(min)+') '
			return timi;
		}
		
	
	//javascript

		litaHover('.valmoguleiki', 'blue', 'black');

		$('.skilabod_takki_senda').click(function(){
			var skilabod = $('.skilabod_texti').val();
			now.distributeMessage("<p class='skilabod'>"+reiknaTima()+skilabod+"</p>");
		});
		
		now.receiveMessage = function(skilabod){
			$('.skilabod').after(skilabod);
		};
		
		var notendanafn = $('.login_nafn').text();
		var notendanafn2 = notendanafn.split(' ');
		now.notendanafn = notendanafn2[1];
		
		//phono init
		
		var phono = $.phono({
			apiKey: "bab66a746499fb362014bd985a9e8c59",
			onReady: function() {
			  $(".hringing").text("Hringdu");
			  console.log("Phono Session ID: " + this.sessionId);
			  now.SID = this.sessionId;
			}
		});		
		
		$(".hringing").click(function() {
			now.Hringing();
		});
		
		//now.js functions
	
		now.ready(function(){
			texti = $('.skilabod').text();
			if(texti == 'Hleður...'){
				$('.skilabod').text(reiknaTima()+now.notendanafn+' hefur tengst');
			}
			else{
				$('.skilabod').after('<p class="skilabod">'+reiknaTima()+now.notendanafn+' hefur tengst</p>');
			}
		});
		
		
		now.updateUserMenu = function(array_notendur){
			$('.hverjir_eru_inni').html('<p style="display:none;" class="hverjir_eru_inni_byrjun"></p>');
			for(i = 0; i < array_notendur.length;i++){
				$('.hverjir_eru_inni_byrjun').after("<p>"+array_notendur[i]+"</p>");
			}
		}

});