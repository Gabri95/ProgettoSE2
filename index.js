

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


//Mappo la cartella contenente gli scripts JS utilizzati nel client su un percorso diverso per mascherare la struttura interna del server
app.use('/pages', express.static(__dirname + '/web_pages/'));




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
