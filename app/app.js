
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
/*
app.get('/', routes.index);
app.get('/users', user.list);
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

	util = require('util')	
	backbone = require('backbone');	
	_ = require('underscore')._;
	var moment = require('moment');

	moment.lang('is');
	
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'gunnitheman85',
	  database : 'akademia',
	});

	
	function clientize(notendanafn){
		notendanafn = notendanafn.replace('_','@')
		notendanafn = notendanafn.replace('_','.')
		return notendanafn;
	}
	
	function compareStrings(strengur1, strengur2){
		var alphabet = strengur1 < strengur2
		switch(alphabet){
			case true:
				return true;
				break;
			case false:
				return false;
				break;
		}
	}
	
	function nefnaSession(strengur1, strengur2){
		var hvor_er_a_undan = compareStrings(strengur1, strengur2)
		switch(hvor_er_a_undan){ //thessi statement er naudsynleg til ad tveir userar med mismunandi notendanofn fari samt sem adur i gruppu med sama nafni
			case true:
			session_hopur = strengur1+'_'+strengur2;
			break;
			case false:
			session_hopur = strengur2+'_'+strengur1;
			break;
		}
		return session_hopur;
	}
	
	function serverize(notendanafn){
		if(notendanafn.indexOf('@') > -1){
			notendanafn = notendanafn.replace('@','_')
		}
		if(notendanafn.indexOf('.') > -1){
			notendanafn = notendanafn.replace('.','_')
		}
		return notendanafn;
	}
	
	function striknidri(not){
		var asd = not.replace('@','_');
		return asd;
	}
	
	function attmerki(not){
		var asd = not.replace('_','@');
		return asd;
	}
	
	function baetavidNulli(i){
		if(i < 10){
			i = '0'+i;
		}
		return i;
	}

	function atburdur(atburdur){
		var dagsetning = reiknaDagsetningu();
		query = "INSERT INTO atburdir VALUES ('','"+dagsetning+"', '"+atburdur+"','soe3@hi.is')"
		connection.query(query);		
	}	

	//var dagsetning = '11:27 - 16/10/2012'
	
	function momentize(dagsetning){
		var now1 = moment().format('LLL') 
		var umreikningur = dagsetning.split(' - ');
		var timi = umreikningur[0];
		var date = umreikningur[1];
		var date_umr = date.split('/');
		var timi_umr = timi.split(':');
		var klst = parseInt(timi_umr[0])
		var min = parseInt(timi_umr[1])
		var dagur = parseInt(date_umr[0])
		var man = (parseInt(date_umr[1])-1)
		var ar = parseInt(date_umr[2])
		var moment2 = moment([ar, man, dagur, klst, min]).format('LLL')
		var momentid = moment([ar, man, dagur, klst, min]).fromNow();
		return momentid;
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
	
	sessionStore = new express.session.MemoryStore()
	
	/*
	var RedisStore = require('redis');
	client = RedisStore.createClient();
	*/
	//functions
	
	function arrLeita(arr, leitarord){
		for(x = 0;x < arr.length;x++){
			if(arr[x] == leitarord){
				return true
			}
		}
	}
	
	function timinnTofluStrengur(){
		var date = new Date();
		var min = date.getMinutes();
		var klst = date.getHours();
		var dagur = date.getDate();
		var man = date.getMonth()+1;
		var ar = date.getFullYear();
		strik = '_';
		dagsetning = baetavidNulli(klst)+strik+baetavidNulli(min)+strik+dagur+strik+man+strik+ar;
		return dagsetning;
	}
	
	function reiknaDagsetningu(){
		var date = new Date();
		var min = date.getMinutes()-3;
		var klst = date.getHours();
		var dagur = date.getDate();
		var man = date.getMonth()+1;
		var ar = date.getFullYear();
		dagsetning = baetavidNulli(klst)+':'+baetavidNulli(min)+' - '+dagur+'/'+man+'/'+ar;
		return dagsetning;
	}
	
	
	function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
	}
	
	function c(ord){
		console.log(ord);
	}
	
	function insp(hvad_a_ad_skoda, dypt){
		if(dypt){
			c(util.inspect(hvad_a_ad_skoda, depth=dypt, false, null))
		}
		else{
			c(util.inspect(hvad_a_ad_skoda, false, null))
		}
	}
	
	String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
	};
	
	
	
	
	
	//post routes
	app.post('/', function(req, res){
		
		username = req.body.username || 'Anonymous';
		// store the username as a session variable
		
		ID = req.sessionID.substring(0,25);
		client.hmset(ID, 'notendanafn', username);
			
		sessionStore.sessions.notendanafn = username;
		
		
		// redirect the user to homepage
		
		res.redirect('/yfirlit');
	
	});
	
	app.post('/naestaspurning', function(req, res){
		//naer i svarid sem notandinn valdi
		valid_svar2 = req.body.valid_svar;
		//naer i nafnid a namskeidinu
		namskeid = req.body.namskeid;
		//athugar hvort utskyringin hafi verid virk thegar svarad var
		utskyring = req.body.utskyring;
		//naer i timann
		timi = parseInt(req.body.timi);
		//naer i notandann sem er ad svara
		var notendanafn = req.cookies.notendanafn
		
		//naer i profid sem um raedir
		prof1 = req.body.prof;
		prof2 = prof1.split(' ');
		var prof_ar = prof2[1];
		prof = prof2[0]/*vor/haustprof*/+' '+prof2[1];//arid

		if(valid_svar2){ //ef ytt er a velja svar er thessi leid farin
			valid_svar = valid_svar2.toLowerCase()
			sp1 = req.body.spurning;
			sp2 = sp1.split(' - ');
			numer1 = sp2[1].split('#');
			numer2 = parseFloat(numer1[1]);
			numer = numer2;
			
		
		}
		else{ 
			sp1 = req.body.spurning;
			sp2 = sp1.split(' - ');
			numer1 = sp2[1].split('#');
			numer2 = parseFloat(numer1[1]);
			numer = numer2+1;
		}
		namskeid = sp2[0].trim();
		
		query = 'SELECT * FROM namsefni WHERE namskeid = "'+namskeid+'" AND qid = "'+numer+'" AND prof_ar="'+prof_ar+'"' //ma ekki setja prof_ar og tha finnur hun ekki naestu spurn?? 
			
		connection.query(query, function(err, rows, fields){
			var spurning_info;
			sp = rows[0];
			stig = 0;
			if(valid_svar2){	//ef notandinn valdi svar
				if(valid_svar == sp['rett']){ //ef svar er rett, ber thad saman vid svar i database
					svar = 'rett'
					if(utskyring == 'block'){
						stig = 15;
					}
					else{
						stig = 30;
					}
				}
				else{ //ef svarid er rangt
					svar = 'rangt'
					stig = 0;
				}
				var qid = sp.qid; //qid spurningarinnar sem notandinn var ad svara
				var query4 = 'SELECT * FROM '+notendanafn+' WHERE qid ="'+qid+'"'; //velur ur notendatoflunni retta spurningu ut fra qid
				connection.query(query4, function(err, rows, fields){  
					var spurning =  rows[0];
					if(spurning != undefined){
						var timi_spurning = spurning['heildartimi']; //naer i timann sem er skradur fyrir i database
					}
					if(!timi_spurning){
						timi_spurning = 0;
					}
					var timi_heild = parseInt(timi_spurning) + parseInt(timi); //baetir timanum vid ef notandinn svaradi aftur
					if(spurning != undefined){
						query = 'UPDATE '+notendanafn+' SET svar="'+svar+'", stig="'+stig+'", svarlidur="'+valid_svar+'", heildartimi="'+timi_heild+'" WHERE qid="'+qid+'"';
						connection.query(query);
					}
					else{
						query = "INSERT INTO "+notendanafn+" VALUES ('','salfr','"+namskeid+"','"+prof+"','"+timi+"','"+svar+"','"+valid_svar+"','"+sp['qid']+"','"+sp['rett']+"','"+stig+"')"	
						connection.query(query);
						timi = 0;
					}
				});
				sp['rett_rangt'] = svar;
			}
			//checkar hvort notandinn hefur svarad spurningunni og ef hann hefur gert thad hledur theim upplysingum med lika
			query2 = 'SELECT * FROM '+notendanafn+' WHERE qid = "'+numer+'"';
			connection.query(query2, function(err, rows, fields){
				spurning_info = rows[0];
				
				if(spurning_info){ //ef spurning er til stadar i toflunni opnast tessi statement
					sp['spurning_info'] = spurning_info;
					stig_skrad_i_db = spurning_info.stig;
					
					switch(stig){
						case 0: //ef svar valid af notanda var rangt
							stig = 0 - stig_skrad_i_db;
							break;
						case 15: //ef svar valid af notanda var rett med utskyringu
							stig = 15 - stig_skrad_i_db;
							break;
						case 30: //ef svar valid af notanda var rett
							stig = 30 - stig_skrad_i_db;
							break;					
					}
					c('ny stig : ' + stig);
				}
				if(sp == undefined){
					c('THETTA ER SIDASTA SPURNINGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!')
					sp = { spurning : 'spurningar bunar' }
					res.end('spurning(\''+JSON.stringify(sp)+'\')');
				}
				else{
					sp['stig'] = stig;
					res.end('spurning(\''+JSON.stringify(sp)+'\')');
				}
			});
		});
	
	
	});
	
	app.post('/vistahopa', function(req, res){
			
		ID = req.sessionID.substring(0,25);
	
		client.hgetall(ID, function(err, obj){	
		query = "INSERT INTO namshopar VALUES ('','"+req.body.nafn_hops+"','"+req.body.arr_email+"','"+req.body.arr_full_nofn+"','"+obj.notendanafn+"','0','','','')"	
		connection.query(query);
		res.end('_testcb(\'{"message": "Hello world!"}\')');
		//nuna fara nofn og email i array sem er splittad med kommu og i mysql. Tharf ad updatea : 
		//1. vini i lestri
		});
	});
	
	app.post('/eyda_hop', function(req, res){
			
		ID = req.sessionID.substring(0,25);
	
		client.hgetall(ID, function(err, obj){
		
			query = "SELECT * FROM namshopar WHERE admin='"+obj.notendanafn+"'";
	
			connection.query(query, function(err, rows, fields){
			
				var hopar_arr = [];
		
				for(i = 0;i < rows.length; i++){
					nafn_hops = rows[i].nafn;
					hopar_arr.push(nafn_hops);
				}
	
				res.end('{"hopar": "'+hopar_arr+'"}');
			
			});
		});
	});
	
	app.post('/saekjanotendur', function(req, res){
		var user = [];
		query = "SELECT * FROM notendur";
		connection.query(query, function(err, rows, fields){
			for(i = 0;i < rows.length; i++){
				var nafn = rows[i].nafn;
				var email = rows[i].email;
				user.push(nafn, email);
			}
			res.end('notendur(\'{"notendur": "'+user+'"}\')');
		});
	
	});
	
	app.post('/yfirlit', function(req, res){
	
		ID = req.sessionID.substring(0,25);
	
		client.hgetall(ID, function(err, obj){
		
		fag1 = req.body.falda_inputtid;
		
		fag2 = fag1.split('_');
		
		fag = fag2[0];
		takki_yttur = fag2[1];
		stofnandi = fag2[2].trim();
		
		room = stofnandi+'_session';
		
		//session er bara "_session" - a eftir ad setja e-r redis func her og thar = checka!
		client.hmset(ID, 'takki_yttur', takki_yttur, 'fag', fag); 

		
		/*sessionStore.sessions.room = stofnandi+'_session';
		sessionStore.sessions.takki_yttur = takki_yttur;
		sessionStore.sessions.fag = fag;*/
		
		notendanafn = obj.notendanafn;
				


		switch(takki_yttur)
		{
			case 'Hóplærdómur':
				room = notendanafn.concat('_session'); 
				session_notanda = notendanafn+'_session'; 
				client.hmset(ID, 'room', session_notanda)
				query2 = "SELECT * FROM namshopar WHERE medlimir LIKE '%"+notendanafn+"%' AND nafn_now_hops NOT LIKE '%"+notendanafn+"%'"	
				connection.query(query2, function(err, rows, fields){
					for(i = 0;i < rows.length; i++){

						arr = rows[i]['medlimir']
						if(arr.indexOf(sessionStore.sessions.notendanafn) > -1){
							if(err){ throw err };
							
							var session = rows[i]['nafn_now_hops'];
							if(session == ''){
								nytt_session = notendanafn+'_session';
								connection.query("UPDATE namshopar SET nafn_now_hops='"+nytt_session+"', namskeid='"+fag+"'");
							}
							else
							{
								var nytt_session = session+' '+session_notanda;
								console.log('mysql er ad updeita - skipti : ' +i);
								console.log(nytt_session);
								connection.query("UPDATE namshopar SET nafn_now_hops='"+nytt_session+"', namskeid='"+fag+"'");
							}
						}
					}
				});
			break;
			case 'Lesa':
				console.log('Hann vill lesa með öðrum')
			break;
		}
			


		});
		res.redirect('/namsgluggi');
	})
	
	//get routes
	
	app.get('/', function(req, res) {
		res.render('index');
	});
	
	app.post('/login', function(req, res){
		var notendanafn = req.body.notendanafn;
		req.session.notendanafn = notendanafn;
		var notendanafn = serverize(notendanafn);

		c(notendanafn);
		
		bua_til_toflu = "CREATE TABLE IF NOT EXISTS "+notendanafn+" ( id int NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), fag varchar(100), namskeid varchar(100), prof varchar(50), heildartimi varchar(5), svar varchar(10), svarlidur varchar(10), qid varchar(5), rett_svar varchar(5), stig int )";
		connection.query(bua_til_toflu);
		
		res.cookie('notendanafn',notendanafn);
		res.end('ok');
	});
	
	app.get('/logout', function(req, res){
		
		ID = req.sessionID.substring(0,25);
	
		delete sessionStore.sessions.notendanafn;
		res.redirect('/');
	});
	
	app.get('/namsgluggi', function(req, res) {
	
		ID = req.sessionID.substring(0,25);

		client.hgetall(ID, function(err, obj){
	
		if (typeof sessionStore.sessions.notendanafn == 'undefined'){ 
			res.redirect('/');
		}
		else{ 
		
				
			/*request.post({ 
			url: 'http://198.101.202.31:8080/veljafag',
			body: JSON.stringify({ prufa:prufa, password:'my_pass' })
			}, function(e, r, body){
				console.log('request er kallad');
				console.log('request svar : ' + body);
			});*/
			
			que = "SELECT * FROM profspurningar WHERE flokkun='"+obj.fag+"'";
			connection.query(que, function(err, rows, fields){
			if(err){ throw err; }
			
				spurning = rows[0]['spurning'];
				svar_a = rows[0]['svar_a'];
				svar_b = rows[0]['svar_b'];
				svar_c = rows[0]['svar_c'];
				svar_d = rows[0]['svar_d'];
				svar_e = rows[0]['svar_e'];
				utskyring = rows[0]['utskyring']
				
			res.render('namsgluggi', { title: 'Námskeiðin þín', username: obj.notendanafn, items:items, fag:obj.fag, spurning:spurning, svar_a:svar_a, svar_b:svar_b, svar_c:svar_c, svar_d:svar_d, svar_e:svar_e, utskyring:utskyring });
			});
		}
		});
	});
	
	app.get('/thitt_yfirlit', function(req, res) {
		c("EXPRESS SEGIR ")
		insp(req.cookies);

		notendanafn = clientize(req.cookies.notendanafn);
		
		c(notendanafn);
		atburdir_arr = '';
	
		info_um_user = {
			email : 'Email',
			nafn : 'Fullt nafn',
			aldur : 'Aldur',
			kyn : 'Kyn'
		}
	
		var query = 'SELECT * FROM atburdir WHERE notendur LIKE "%'+notendanafn+'%" ORDER BY ID DESC LIMIT 4'
		connection.query(query, function(err, rows, fields){
			atburdir_arr = {}
			for(i = 0;i<rows.length;i++){
				tala_strengur = i.toString();
				var rod = rows[i];
				var timi1 = rod.timi;
				var timi = momentize(timi1);
				var atburdur = rod.atburdur;
				atburdir_arr[i] = {
					atburdur:atburdur,
					timi:timi
				}
			}
		
			var query2 = "SELECT * FROM notendur WHERE email='"+notendanafn+"'";
			connection.query(query2, function(err, rows, fields){
				var rod = rows[0];
				//insp(rod)
				for(var key in info_um_user){
					var val = rod[key];
					//c(val + ' -- ' + info_um_user.key)
					info_um_user[key] = val;
					if(val == ''){
						info_um_user[key] = 'Smelltu hér til að fylla inn'
					}
				}
//				var query3 = "SELECT * FROM skilabod WHERE til='"+clientize(notendanafn)+"' AND lesin='nei'";
				
	//			connection.query(query3, function(err, rows, fields){
		
					res.render('thitt_yfirlit', { notendanafn:notendanafn, atburdir_arr:atburdir_arr, info_um_user:info_um_user });
		//		});
			});
		});
	});
	
	app.get('/namsk_yfirlit', function(req, res) {
		
		var notendanafn = req.cookies.notendanafn;

		var namskeid = req.cookies.valid_namskeid
		
		var notendanafn = serverize(notendanafn);

	
		//athugar oll skrad prof i namsefni hja thessu namskeidi og gefur toflu med prof ar, prof onn og telur spurningarnar sem eru til
		var query = 'SELECT prof_ar,prof_onn, count(*) FROM namsefni WHERE namskeid="'+namskeid+'" GROUP BY prof_ar,prof_onn';
		
		connection.query(query, function(err, rows, fields){
	
			profa_array = [];
			//setur saman rettu strengina
			for(key in rows){
				value = rows[key];
				strengur = value.prof_onn + ' ' + value.prof_ar
				profa_array.push(strengur, value['count(*)'])
			}

			
			//var query2 = 'SELECT soe3_hi_is.prof, count(*) FROM soe3_hi_is INNER JOIN namsefni ON soe3_hi_is.qid=namsefni.qid GROUP BY soe3_hi_is.prof';
			var query2 = 'SELECT '+notendanafn+'.prof, count(*) FROM '+notendanafn+' INNER JOIN namsefni ON '+notendanafn+'.qid=namsefni.qid GROUP BY '+notendanafn+'.prof' 
			//c(query2)
			connection.query(query2, function(err, rows, fields){
			if(_.first(rows) == undefined){
				c('thad er ekkert ad finna i rows');
				for(j=0;j < profa_array.length;j+=3){
					profa_array.splice(j+2,0,0);
				}
			}
			else{
					spurningar_sem_notandi_hefur_svarad_arr = [];
					for(key in rows){
							value = rows[key];

							var indexinn = _.indexOf(profa_array, value.prof)
							splice = indexinn+2;
							fjoldi_spurninga_i_db = profa_array[indexinn+1];
							//fyrri breytan er fjoldi skradra spurninga i db fyrir akvedid prof, seinni er fjoldi spurninga ur sama profi sem notandi hefur svarad
							//c(fjoldi_spurninga_i_db + ' -- ' + val['count(*)']) 
							var prosenta = (value['count(*)']/fjoldi_spurninga_i_db)*100
							profa_array.splice(splice,0,prosenta);	
					}
					for(j=0;j < profa_array.length;j+=3){
						value1 = profa_array[j];
						value2 = profa_array[j+1];
						value3 = profa_array[j+2];
						
						if(typeof(value3) == 'undefined' || typeof(value3) == 'string'){
							profa_array.splice(j+2,0,0);
						}
					}
				}
				namskeid = 'Lifedl salfr'
				res.render('namsk_yfirlit', { profa_array:profa_array, notendanafn:clientize(notendanafn), namskeid:namskeid });
			});
		});
	});

	
	app.get('/prof', function(req, res) {
	if (typeof req.session.notendanafn == 'undefined') res.redirect('/');
		
		//ID = req.sessionID.substring(0,25);
		c('/prof : ')
		insp(req.session)

		var notendanafn = req.session.notendanafn;
 
		//	namskeid = obj.namskeid; ath ad breyta thessu, sleppa ID og setja upp sessionid jeeeeeeeeeeee
		//	onn = obj.onn;
		//	laerdomur = obj.laerdomur;
		//	ar = obj.ar;
			
		//query = 'SELECT * FROM namsefni WHERE namskeid="'+namskeid+'" AND prof_ar="'+ar+'" AND prof_onn="'+onn+'"'; - virkja thegar prof vinnu er lokid
		query = 'SELECT * FROM namsefni WHERE namskeid="Lífeðlisfræðileg sálfræði" AND prof_ar="2001" AND prof_onn="Vorpróf"'; //-virk a medan prof er i vinnu, svo ekki thurfi alltaf ad fara af namsk yfirliti
		
	connection.query(query, function(err, rows, fields){
		if(err){ throw err; }

			spurning = rows[0]['spurning'];
			svarmoguleiki_a = rows[0]['svar_a'];
			svarmoguleiki_b = rows[0]['svar_b'];
			svarmoguleiki_c = rows[0]['svar_c'];
			svarmoguleiki_d = rows[0]['svar_d'];
			svarmoguleiki_e = rows[0]['svar_e'];
	
			utskyring_a = rows[0]['utskyring_a'];
			utskyring_b = rows[0]['utskyring_b'];
			utskyring_c = rows[0]['utskyring_c'];
			utskyring_d = rows[0]['utskyring_d'];
			utskyring_e = rows[0]['utskyring_e'];

			
			utskyring_spurningu = rows[0]['utskyring_spurningu']
			qid = rows[0]['qid']
			namskeid = rows[0]['namskeid'];

		res.render('prof', { spurning:spurning, svarmoguleiki_a:svarmoguleiki_a, svarmoguleiki_b:svarmoguleiki_b, svarmoguleiki_c:svarmoguleiki_c, svarmoguleiki_d:svarmoguleiki_d, svarmoguleiki_e:svarmoguleiki_e, utskyring_a:utskyring_a, utskyring_b:utskyring_b, utskyring_c:utskyring_c, utskyring_d:utskyring_d, utskyring_spurningu:utskyring_spurningu, qid:qid, namskeid:namskeid, notendanafn:notendanafn, rows:rows }); 
	
		});
	});
	
	app.post('/saekjaskilabod', function(req, res){
		var notendanafn = req.cookies.notendanafn;
		var query = "SELECT * FROM skilabod WHERE til='"+clientize(notendanafn)+"' AND lesin='nei'";
		connection.query(query, function(err, rows, fields){
			insp(rows);
		});		
	});
	
	app.post('/fara_i_namsk_yfirlit', function(req, res){
		
		var namskeid = req.body.namskeid;
		//festir namskeid sem user valdi i koku
		res.cookie('valid_namskeid',namskeid);
		//klarar ajax request
		res.end('ok');
	});
	
	app.post('/navigationbox_leita', function(req, res){
		//var leitarstrengur = req.body.leitarstrengur;
		var query = "SELECT * FROM notendur";
		connection.query(query, function(err, rows, fields){
			var leitarstrengur = '';
			for(i = 0;i<rows.length;i++){
				var nidurstada = rows[i];
				if(nidurstada.nafn != ''){
					leitarstrengur += '-'+nidurstada.nafn+' ('+nidurstada.email+')';
				}
			}
			
			res.end('leitarnidurstodur-'+leitarstrengur);
			
		});
	
	});
	
	app.post('/saekjaprof', function(req, res){
		
		notandi = 'soe3_hi_is';

		//naer i namskeidid sem um raedir
		var namskeid = req.body.namskeid;	
		//naer i vor/jolaprof og artal profsins
		var profstrengur = req.body.prof_til_ad_leysa
		var prof1 = profstrengur.split(' ');
		var ar = prof1[1];
		var onn = prof1[0];
		//naer i multiplayer vs solo
		var laerdomur = req.body.laerdomur

		
		var asd = new Date();
		var artal = asd.getFullYear();
		var manudur = asd.getMonth() + 1;
		var dagur = asd.getDate();
		var klst = asd.getHours();
		var minutur = asd.getMinutes();
		
		//byr til toflustreng i hvert skipti sem einstaklingur startar
		toflustrengur = notandi;
		toflustrengur += '_'+artal;
		toflustrengur += '_'+manudur;
		toflustrengur += '_'+dagur;
		toflustrengur += '_'+klst;
		toflustrengur += '_'+minutur;
		toflustrengur += '_'+minutur;
		toflustrengur += '_'+namskeid;
		toflustrengur += '_'+onn;
		toflustrengur += '_'+ar;

		var alphabet = {
		'í': 'i',
		'ð': 'd',
		'æ': 'ae',
		'á': 'a',
		'é': 'e',
		'ú': 'u',
		'ó': 'o',
		};
		  
        var tafla_us = toflustrengur.replace(/[íðæóáéú]/g, function(s) {
            return alphabet[s];
        });
		
		c(tafla_us.length);
		
		query_bua_til_toflu = 'CREATE TABLE '+tafla_us+' (id INT, data VARCHAR(100))' //þarf að skapa töfluna, gerir það ekki eins og stendur.
		
		connection.query(query_bua_til_toflu, function(rows, fields, err){
			if(err) c(err);
		});
		
		ID = req.sessionID.substring(0,25);
		
		client.hmset(ID, 'namskeid', namskeid, 'onn', onn, 'laerdomur', laerdomur, 'ar', ar);

		
		res.end('upplysingar_um_prof(\''+JSON.stringify(laerdomur)+'\')');
	
	});
	
	app.post('/saekjaspurningamida', function(req, res){
		var namskeid = req.body.namskeid;
		var notendanafn = req.cookies.notendanafn;
		midar_obj = {};
		query = 'SELECT stig,qid FROM '+notendanafn+' WHERE namskeid = "'+namskeid+'"';
		connection.query(query, function(err, rows, fields){
			for(i = 0; i < rows.length;i++){
				rod = rows[i];
				midar_obj[i] = {
					'stig':rod.stig,
					'qid':rod.qid
				}
			}
			res.end('litir_spurningamida(\''+JSON.stringify(midar_obj)+'\')');
		});
	});
	
	app.get('/yfirlit', function(req, res) {

		ID = req.sessionID.substring(0,25);
	
		client.hgetall(ID, function(err, obj){
		
			if (typeof sessionStore.sessions.notendanafn == 'undefined') res.redirect('/');
			else{
			
				notendanafn = obj.notendanafn;
				
				leitarnafn = escape(notendanafn);
	
				c(leitarnafn);
	
				que = 'SELECT * FROM namshopar WHERE email LIKE "\%'+leitarnafn+'\%" escape "\"';
				connection.query(que, function(err, rows, fields){
				radir = rows;
					if(rows.length == 0){//userinn er ekki skráður í námshóp
					
					radir = {
						0 : {
							nafn:'Þú ert ekki skráður í námshóp eins og stendur',
						}
					}
							res.render('yfirlit', { title: 'Námskeiðin þín', username: obj.notendanafn, stofnandi:'', fag:'', items:items, radir:radir, disp_takki:'none', stofnandi_header:'Þú ert ekki skráður í námshóp eins og stendur', fag_header:'' });
					}
					else{//userinn er skráður í námshóp -- vantar e-d sem detectar ef session eru i gangi til ad fela takkann ef torf er a.
		
		
	
						for(var i = 0;i < rows.length;i++){
							if(rows[i].nafn_now_hops !== ''){ //thad er leshopur i gangi
								var asd = rows[i].nafn_now_hops
								var nafn1 = asd.split('_');
								var nafn = nafn1[0];
								rows[i].nafn_now_hops = nafn;
								disp_takki = 'block';
								}
								else{//enginn leshopur er i gangi i hopi notandans
									disp_takki = 'none';
									stofnandi_header = 'Enginn af vinum þínum eru að lesa þessa stundina';
								}
						}					
							res.render('yfirlit', { title: 'Námskeiðin þín', username: obj.notendanafn, items:items, radir:radir, disp_takki:disp_takki,stofnandi_header:stofnandi_header, fag_header:'' });					
					}
				});
			}
			});
		})
		
		var items = {
			SKN:{name:'Stærðfræðigreining IB', price:100},
			ASK:{name:'liffraeditest', price:690},
			CGI:{name:'Lífeðlisfræðileg sálfræði', price:250},
			NGT:{name:'Eðlisfræði B', price:900},
			KTN:{name:'Lífeðlisfræði B', price:1000}
		};
		
		//nowjs config ====================

		nowjs = require('now');
		everyone = nowjs.initialize(app, { cookieKey: 'connect.sid' });
		
		everyone.now.sendaNotendur = function(){
			everyone.now.komaNotendumFyrir();
		}
		
		everyone.now.dreifaUserBodi = function(userar){
			//klara func her og i yfirlit.js
			for(var key in userar){
				var dagsetning = reiknaDagsetningu();
				var notendanafn = serverize(this.user.cookie.notendanafn);
				var val = userar[key];
				var not1 = val.split('(');
				var not2 = not1[1].split(')');
				var user_sem_faer_skilabod = not2[0]
				var kaka_bodnir = serverize(user_sem_faer_skilabod);
				var session = nefnaSession(kaka_bodnir, notendanafn);
				var group = nowjs.getGroup(session);
				var skilabod = clientize(notendanafn) + ' langar að leysa próf með þér og er kominn í session';
				c('kallad er a dreifauserbodi');
				group.exclude([this.user.clientId]).now.bjodaUserumSession(skilabod);
				var query = "INSERT INTO skilabod VALUES ('','"+skilabod+"','"+clientize(notendanafn)+"','"+user_sem_faer_skilabod+"','nei','"+dagsetning+"')";
				connection.query(query);
			}
			//everyone.now.bjodaUserumSession(userar);
		}
		
		everyone.now.distributeMessage = function(message){
			var asd = reiknaDagsetningu();
			var timi = momentize(asd)
			var that = this;
			this.getGroups(function(groups){ // thetta naer i alla hopa sem userinn er i
				for(var i=0;i<groups.length;i++){
					if(groups[i] !== 'everyone'){ //excludar everyone hopinn og sendir svo skilabod til hopa usersins
						var group = nowjs.getGroup(groups[i]);
						c('userid thessa users : '+that.user.clientId);
						c('sendi skilabod a hopinn : ' +groups[i]);
						group.exclude([that.user.clientId]).now.receiveMessage("<div class='skilabod_thitt_yfirlit falid_skilabod'><p class='atburdur'>"+message+"</p><p class='timi_thitt_yfirlit'>"+timi+"</p></div>");
					}
				}
			});
		};

		function userSida(address, sida){
			if(address.indexOf(sida) > -1){
				return true;
			}
		}

nowjs.on('connect', function(){

		var address = this.socket.handshake.headers.referer; //gefur upp vid hvada url userinn er ad tengjast
		that = this;
		c('NOWJS SEGIR : ')
		var nowjs_client_id = this.user.clientId;
		//var session = 'soe3_hi_is'+'_'+timi
		var notendanafn = this.user.cookie.notendanafn;
		//atburdur('steindor tengdist'); -- atburdarfunctionin sem uppfaerir atburdi!, vantar ad tengja notendur vid hann
		query = 'SELECT * FROM tengsl WHERE notandi = "'+clientize(notendanafn)+'"'
		connection.query(query, function(err, rows, fields){
			if(typeof rows[0] != 'undefined'){ // athugar hvort notandi se skradur i tengsl - hvort hann eigi skrada vini
				var vinir = rows[0].vinir
				var vinir2 = vinir.split(' -- ');			
				for(i = 0;i < vinir2.length; i++){ // loopar i gegnum vinalistann og addar usernum i tveggja manna gruppur med sinum vinum
					session_not = serverize(notendanafn);
					//velur sessionid, notar notendanafn vinar + notendanafn users og byr til hop thar sem tveir userar eru
					var session1 = serverize(vinir2[i]);
					var hvor_er_a_undan = compareStrings(session1, session_not); 
					switch(hvor_er_a_undan){ //thessi statement er naudsynleg til ad tveir userar med mismunandi notendanofn fari samt sem adur i gruppu med sama nafni
						case true:
						session_hopur = session1+'_'+session_not;
						break;
						case false:
						session_hopur = session_not+'_'+session1;
						break;
					}
					
					session = session_hopur; //storar lokasamsettan strenginn i variable
					
					//naer i hopinn
					hopur = nowjs.getGroup(session)
					//setur notanda i sessionid
					hopur.addUser(nowjs_client_id);
				}	//lokar for loopu sem addar  usernum i rettar gruppur
			}
			else{//er ekki skradur i tofluna tengsl, ergo ekki med neina skrada vini
				session = 'steoell@gmail.com';
				c('thessi user a enga vini');
				var hopur = nowjs.getGroup(session)
				hopur.addUser(nowjs_client_id);
				c(that.now.room+ ' - clientId : '+that.user.clientId);
				insp(that.now);
			}

		});
		if(userSida(address, 'prof')){ //user fer i thessa loopu ef hann er ad tengjast vid /prof
			
			var timi = timinnTofluStrengur();
			
			var nowjs_client_id = that.user.clientId;
			
			everyone.now.sendaNotendur();
		
	}

});
		
		/*
nowjs.on('connect', function(){

	c('NOWJS SEGIR : ')
	insp(this.user)

	address = this.socket.handshake.headers.referer; //gefur upp vid hvada url userinn er ad tengjast
	
	that = this;
	
	if(userSida(address, 'namsgluggi')){ //user fer i thessa loopu ef hann er ad tengjast vid namsgluggann
		
		takki_yttur = obj.takki_yttur
				
		switch(takki_yttur){ //checkar hvada takka userinn ytti a.
			case 'Hóplærdómur':

			that.now.room = obj.room;

				console.log('namsgluggi segir '+obj.notendanafn+' hefur joinad '+obj.room)
			
				array_notendur = new Array();

				virkur_hopur = nowjs.getGroup(that.now.room);
				virkur_hopur.addUser(that.user.clientId);
						
						virkur_hopur.getUsers(function (users) { 
							for (var i = 0; i < users.length; i++){
							nowjs.getClient(users[i], function() { 
								c('her er gunni ad joina sitt session og fer i hopinn :');
								array_notendur[i] = obj.notendanafn;
								c(that.user.clientId)
								
						});
			
						virkur_hopur.now.updateUserMenu(array_notendur);
					
					}
				});
				
			break;
			case 'Lesa':
			
				that.now.room = obj.room;

				console.log('namsgluggi LESA segir '+obj.notendanafn+' hefur joinad '+that.now.room)

				array_notendur = new Array();

				virkur_hopur = nowjs.getGroup(that.now.room);
				
				virkur_hopur.addUser(that.user.clientId);
				console.log('namsglugginn segir : ' + that.now.room);
				
						virkur_hopur.getUsers(function (users) { 
							for (var i = 0; i < users.length; i++){
								nowjs.getClient(users[i], function() { 
													
									user_clientid = users[i];				
								
									user_cookiesid = this.user.cookie['cookie.sid']
									
									ID = user_cookiesid.substr(0,25);
										
									array_notendur[i] = this.now.notendanafn;
									console.log('user nr : '+i+' - '+user_clientid + ' - ' + this.now.notendanafn);
										
									
							});
			
							virkur_hopur.now.updateUserMenu(array_notendur);
							
							}
						});
			break;		
		}
	}
	else if(userSida(address, 'prof')){ //user fer i thessa loopu ef hann er ad tengjast vid /prof
		var timi = timinnTofluStrengur();
		var nowjs_client_id = that.user.clientId;
		//var session = 'soe3_hi_is'+'_'+timi
		var notandi = that.user.session.notendanafn
		c('notendanafn : '+notandi);
		if(notandi == 'guj8' || notandi == 'soe3'){
			var session = 'soe3_hi_is'
		}
		else{
			var session = 'almennt sess';
		}
		that.now.room = session;
		nowjs.getGroup(session).addUser(nowjs_client_id);
		
		c(address+' : '+that.now.room+ ' - clientId : '+that.user.clientId);
	}
	else if(userSida(address, 'thitt_yfirlit')){ //user fer i thessa loopu ef hann er ad tengjast vid /thitt_yfirlit

	
	
		var nowjs_client_id = that.user.clientId;
		//var session = 'soe3_hi_is'+'_'+timi
		var notandi = that.user.cookie.notendanafn;
		
		c("HVERSU OFT LOGGAST THESSI LINA ?!");
		
		query = 'SELECT * FROM tengsl WHERE notandi = "'+notandi+'"'
		
		connection.query(query, function(err, rows, fields){
			
			vinir = query['vinir'];
			vinir2 = query.split(' -- ');
			
			c('notendanafn : '+notandi + ' var ad tengjast thitt_yfirlit');
			if(notandi == 'guj8_hi.is' || notandi == 'soe3_hi.is'){
				var session = 'soe3_hi.is'
			}
			else{
				var session = 'almennt';
			}
			
			that.now.room = session;
			hopur = nowjs.getGroup(session)
			hopur.addUser(nowjs_client_id);
			
			hopur.now.distributeMessage(attmerki(notandi)+' var ad tengjast');
			
		});
		
		
		
		c(address+' : '+that.now.room+ ' - clientId : '+that.user.clientId);
	}
	//});//lokar hgetall
	
});*/

nowjs.on('disconnect', function(){

	//ID = this.user.cookie['cookie.sid'].substring(0,25)
	
	that = this;
	
	address = that.socket.handshake.headers.referer;
	ip_og_port = that.socket.handshake.address;
	
	//client.hgetall(ID, function(err, obj){

	
	

	if(address.indexOf('namsgluggi') > -1){//checkar ef einstaklingurinn er ad disconnecta fra namsglugga
	
		nafn = obj.notendanafn;	
		
		query = 'SELECT * FROM namshopar'
		connection.query(query, function(err, rows, fields){
			for(i = 0;i < rows.length;i++){
				var studysession = rows[i]['nafn_now_hops'];
				medlimir_hopsins = rows[i]['medlimir']
				if(medlimir_hopsins.indexOf(nafn) > -1){ //checkar ef virkt studysession er til stadar i einhverjum namshopa sem disconnectarinn er i
					if(studysession != ''){ // er e-d session i gangi skv sql
						studys_arr = studysession.split(' ');
						console.log(studys_arr);
						for(a = 0; a < studys_arr.length; a++){
								if(studys_arr[a] != ' '){
								studys = studys_arr[a];
								asd = studys.split('_');
								notandi_s = asd[0];
								if(nafn == notandi_s){ //er notandinn sem er ad disconnecta sa sem startadi sessionid
									
									session_to_remove = nafn+'_session';
									studys_arr.splice(studys_arr.indexOf(session_to_remove), 10)
									nyr_session_strengur = studys_arr.join(' ');
									console.log('strengurinn eftir ad gunni fer : '+nyr_session_strengur);
									var query = "UPDATE namshopar SET nafn_now_hops='"+nyr_session_strengur+"', namskeid='liffraeditest'" //her vantar ad setja inn thad fag sem um raedir, nuna er namskeid strengurinn liffraeditest!
									connection.query(query) // setur studysession notanda i null, onnur verda afram i gangi
								}
							}
						//vantar check ef annar i hopnum er i odru studysessioni	
						}
					}
				}
			}
		});
	array_notendur = new Array();

	room = obj.room;
	
	that.now.room = room;
	
	nowjs.getGroup(that.now.room).removeUser(that.user.clientId);
  
	nowjs.getGroup(that.now.room).getUsers(function (users) { 
		
		for (var i = 0; i < users.length; i++){
			
			nowjs.getClient(users[i], function() { 
				array_notendur[i] = obj.notendanafn;
				console.log('eftir i '+room+' : '+obj.notendanafn);
			});
			
		everyone.now.updateUserMenu(array_notendur);
		
				}
			});
		}
	//});
});

	everyone.now.lesaFag = function(takki_yttur_value, notendanafnid, stofnandi){
		
		stofnandinn = stofnandi;
		ID = this.user.cookie['cookie.sid'].substring(0,25)

		switch(takki_yttur_value){
		
				case 'Hóplærdómur':
				//vill bua til nytt session
				room = notendanafnid+'_session';
				client.hmset(ID, 'room', room)
				c('thessi bjo til herbergid ' + room);
				break;
				
				case 'Lesa':
				room1 = stofnandinn.trim();
				room = room1.concat('_session');
				client.hmset(ID, 'room', room);
				break;
			}
	};
	
		
	everyone.now.Hringing = function(){
		array_numer = new Array();
		
		nowjs.getGroup(this.now.room).getUsers(function (users) { 
			for (var i = 0; i < users.length; i++){
			
			nowjs.getClient(users[i], function() { 
				undirstrik = '_';
				asd1 = this.now.SID;
				asd2 = this.now.name;
				asd3 = asd1.concat(undirstrik);
				asd4 = asd3.concat(asd2);
				array_numer[i] = asd4;
				console.log(this.now.SID);
			});
			
			everyone.now.hringjaSID(array_numer);
			
			}
			
		});
	}

