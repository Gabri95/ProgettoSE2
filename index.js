

var sessionManager = require("./sessionManager.js");
var menuManager = require("./menuManager.js");
var dishesManager = require("./dishesManager.js");
var ordersManager = require("./ordersManager.js");


//parse URL
var url = require('url');

var path = require('path');

//express lib
var express = require('express');

//for templates
var bind = require('bind');

var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser');

var session = require('express-session')



//instantiate express
var app = express();

//app.use(cookieParser());



app.use(session({
  secret: 'dn329rhjdwsd',
  resave: true,
  saveUninitialized: true,
/*  cookie: {  
			 secure: true,
			 maxAge: 6000000000000
		  }*/
}))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



//Imposto la porta su cui il server ascolterà le richieste
app.set('port', (process.env.PORT || 1337));



app.use('/pages', express.static(__dirname + '/web_pages/'));

app.use('/photos', express.static(__dirname + '/photos/'));




app.use('/logout', function (req, res) {
  delete req.session.user;
  req.session.destroy();
  res.redirect('/start');
}); 


app.use('/start', function (req, res) {
	res.sendFile(path.join(__dirname + "/web_pages/start.html"));
});

app.post('/login', function (req, res) {
	
  var post = req.body;
  
  var user = sessionManager.authenticate(post.username, post.password);
  
  if (user !== null) {
    req.session.user = user;
    
    res.redirect('/');
  } else {
    res.redirect('/start');
  }
});


app.use('/error', sessionManager.isLogged, function(request, response){    
    res.sendFile(path.join(__dirname + "/web_pages/error.html"));

});


app.use('/week', sessionManager.isLogged, function(request, response){
	
    //Imposto l'header della risposta
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*"; //for cross enviroment request
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";//methods allowed to responce
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"; //type of headers
    //answer
    headers["Content-Type"] = "text/html";//format response
    
    
    
    var days = ordersManager.getNextDays(request.session.user.id, new Date(), 6);
	
	
	//Compilo e inserisco nella risposta il template
	bind.toFile(
		'web_pages/utente/settimana.tpl',
		{days: days}, 
		function(d){
			//write response
			response.writeHead(200, headers);
			response.end(d);
		}
	);


	

});



app.use('/day', sessionManager.isLogged, function(request, response){
	
    
    
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month - 1;
	var day = getVar.day;
	
	
	if(year == 'undefined' || month == 'undefined' || day == 'undefined'){
		
		resp.redirect('/error');
		
	}else{
		
		//Imposto l'header della risposta
		var headers = {};
		headers["Access-Control-Allow-Origin"] = "*"; //for cross enviroment request
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";//methods allowed to responce
		headers["Access-Control-Allow-Credentials"] = false;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"; //type of headers
		//answer
		headers["Content-Type"] = "text/html";//format response
		
		var day = new Date(1900 + parseInt(year), month, day, 0, 0, 0, 0);
	
		var days = ordersManager.getNearDays(request.session.user.id, day, 2);
		
		for(var i=0; i< days.length; i++){
			days[i].name = days[i].name.slice(0, 3);
		}
		
		var order = ordersManager.getOrders(request.session.user.id, day);
		
		if(order == null){
			
			var menu = menuManager.getDailyMenu(day);
			
			if(menu != null){
				//Compilo e inserisco nella risposta il template
				bind.toFile(
					'web_pages/utente/menu_ordinare.tpl',
					{
						y_2: days[0],
						y_1: days[1],
						day: days[2],
						t_1: days[3],
						t_2: days[4],
						menu: dishesManager.getMenuDishes(menu)
					}, 
					function(d){
						//write response
						response.writeHead(200, headers);
						response.end(d);
					}
				);
			}else{
				resp.redirect('/error');
			}
			
		}else{
			//Compilo e inserisco nella risposta il template
			bind.toFile(
				'web_pages/utente/menu_ordinato.tpl',
				{
					y_2: days[0],
					y_1: days[1],
					day: days[2],
					t_1: days[3],
					t_2: days[4],
					order: dishesManager.getOrderedDishes(order)
				}, 
				function(d){
					//write response
					response.writeHead(200, headers);
					response.end(d);
				}
			);
			
			
		}
		
		
		
		
			
			
	}
	
	


	

});


app.use('/', sessionManager.isLogged, function(request, response){
	
    //Imposto l'header della risposta
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*"; //for cross enviroment request
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";//methods allowed to responce
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"; //type of headers
    //answer
    headers["Content-Type"] = "text/html";//format response
    
    
    
    
	
	
	//Compilo e inserisco nella risposta il template
	bind.toFile(
		'web_pages/utente/home.tpl',
		{}, 
		function(d){
			//write response
			response.writeHead(200, headers);
			response.end(d);
		}
	);


	

});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
