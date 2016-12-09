var pg = require('pg');
process.env.DATABASE_URL=process.env.DATABASE_URL+'?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
console.log(process.env.DATABASE_URL);

var sessionManager = require("./sessionManager.js");
var menuManager = require("./menuManager.js");
var dishesManager = require("./dishesManager.js");
var ordersManager = require("./ordersManager.js");
var utility = require('./utility.js');

//parse URL
var url = require('url');

var path = require('path');

//express lib
var express = require('express');

//for templates
var bind = require('bind');

//POST
var bodyParser = require('body-parser');

//Cross-Origin Resource Sharing (CORS), used for enabling pre-flight option
var cors = require('cors');

var cookieParser = require('cookie-parser');

var session = require('express-session');



//instantiate express
var app = express();

//app.use(cookieParser());





app.use(session({
  secret: 'dn329rhjdwsd',
  resave: true,
  saveUninitialized: true
/*  cookie: {  
			 secure: true,
			 maxAge: 6000000000000
		  }*/
}));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));




//Imposto la porta su cui il server ascolterà le richieste
app.set('port', (process.env.PORT || 5000));

//enable pre-flight authoriuzation
app.options('*', cors());





function getPlacePhrase(place){
    if(place == "" || place == null){
        return "";
    }else if(place == 'mensa'){
        return "Il pasto ti aspetta alla mensa";
    }else{
        return "Il pasto ti arriverà a casa";
    }
}

function createHeaders(){
    
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*"; //for cross enviroment request
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";//methods allowed to responce
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"; //type of headers
    //answer
    headers["Content-Type"] = "text/html";//format response
    
    return headers;
}



app.use('/pages', express.static(__dirname + '/web_pages/'));

app.use('/photos', express.static(__dirname + '/photos/'));

app.use('/scripts', express.static(__dirname + '/scripts/'));

app.use('/styles', express.static(__dirname + '/styles/'));




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
  
  sessionManager.authenticate(post.username, post.password, function(err, user){
      if(err){
          response.redirect('/error');
      }else if (user !== null) {
        req.session.user = user;

        res.redirect('/');
      } else {
        res.redirect('/start');
      }
  });

});


app.use('/error', sessionManager.isLogged, function(request, response){    
    response.sendFile(path.join(__dirname + "/web_pages/error.html"));

});


app.get('/makeorder', sessionManager.isLogged, function(request, response){
	
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month;
	var day = getVar.day;
    
    var first = getVar.first;
    var second = getVar.second;
	var side = getVar.side;
    var dessert = getVar.dessert;
    var place = getVar.place;
    
    if(year == 'undefined' || month == 'undefined' || day == 'undefined'){
		response.redirect('/error');
	}else{
        var date = new Date(parseInt(year), month-1, day, 0, 0, 0, 0);
        ordersManager.makeOrder(request.session.user.username, date, first, second, side, dessert, place, function(err){
            
            if(err){
                response.redirect('/error');
            }else{
                response.redirect('/day?year=' + year + '&month=' + month + '&day=' + day);
            }
            
        });   
    }
});


app.use('/week', sessionManager.isLogged, function(request, response){
	
    var days = ordersManager.getNearDays(request.session.user.username, new Date(), 0, 6, function(err, days){
        
        if(err){
            response.redirect('/error');
        }else{
            //Compilo e inserisco nella risposta il template
            bind.toFile(
                'web_pages/utente/settimana.tpl',
                {days: days}, 
                function(d){
                    //write response
                    response.writeHead(200, createHeaders());
                    response.end(d);
                }
            );
        }
    });
	
	
});


function returnJSON(response, obj){
    
    //answer a JSON file
	var json = JSON.stringify(obj);
    response.end(json);
    
}

function dayPage(request, response, callback){
    
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month;
	var day = getVar.day;
	
	
	if(year == 'undefined' || month == 'undefined' || day == 'undefined'){		
		response.redirect('/error');
	}else{
		
        var day = new Date(parseInt(year), month-1, day, 0, 0, 0, 0);
	
		ordersManager.getNearDays(request.session.user.username, day, 2, 2, function(err, days){
            if(err){
                response.redirect('/error');
            }else{
                for(var i=0; i< days.length; i++){
                    days[i].name = days[i].name.slice(0, 3);
                }
                
                callback(year, month, day, days);
                
            }
            
        });
    }
    
}


app.get('/getdish', sessionManager.isLogged, function(request, response){
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month;
	var day = getVar.day;
    
    var dish = getVar.dish;
    
	
	
	if(year == 'undefined' || month == 'undefined' || day == 'undefined' || dish == 'undefined' || (dish != 'primo' && dish != 'secondo' && dish != 'contorno' && dish != 'dessert')){		
		returnJSON(response, {suggested: [], alternatives: []});
	}else{
        
        var day = new Date(parseInt(year), month-1, day, 0, 0, 0, 0);
        
		menuManager.getMenuDish(day, dish, function(err, menu){
            
            returnJSON(response, menu);
        });
    }
});




app.get('/day', sessionManager.isLogged, function(request, response){
	
	dayPage(request, response, function(year, month, day, days, order){
        
        ordersManager.getOrder(request.session.user.username, day, function(err, order){
            if(err){
                response.redirect('/error');
            }else{
                if(order == null){
                    menuManager.getSuggestedMenu(day, function(err, menu){

                        if(err || menu == null){
                            response.redirect('/error');
                        }else{
                            //Compilo e inserisco nella risposta il template
                            bind.toFile(
                                'web_pages/utente/menu_non_ordinato.tpl',
                                {
                                    y_2: days[0],
                                    y_1: days[1],
                                    day: days[2],
                                    t_1: days[3],
                                    t_2: days[4],
                                    suggested: menu
                                }, 
                                function(d){
                                    //write response
                                    response.writeHead(200, createHeaders());
                                    response.end(d);
                                }
                            );
                        }
                    });
                } else {
                    //Compilo e inserisco nella risposta il template
                    bind.toFile(
                        'web_pages/utente/menu_ordinato.tpl',
                        {
                            y_2: days[0],
                            y_1: days[1],
                            day: days[2],
                            t_1: days[3],
                            t_2: days[4],
                            place_phrase: getPlacePhrase(order.place),
                            order: order
                        }, 
                        function(d){
                            //write response
                            response.writeHead(200, createHeaders());
                            response.end(d);
                        }
                    );

                }
            }
        });
        
    });
});




app.get('/order', sessionManager.isLogged, function(request, response){
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month;
	var day = getVar.day;
	
	
	if(year == 'undefined' || month == 'undefined' || day == 'undefined'){		
		response.redirect('/error');
	}else{
        
        var date = new Date(year, month-1, day, 0, 0, 0, 0);
        console.log(date);
        ordersManager.getOrder(request.session.user.username, date, function(err, order){

           if(err){
                response.redirect('/error');
            }else{
                 bind.toFile(
                    'web_pages/utente/menu_ordinare.tpl',
                    {
                        order: order,
                        day: {
                            day: date.getDate(),
                            month: date.getMonth()+1,
                            year: date.getFullYear(),
                            name: utility.toDayName(date.getDay())
                        }
                    }, 
                    function(d){
                        //write response
                        response.writeHead(200, createHeaders());
                        response.end(d);
                    }
                );
            }
        });
		
    }

});



app.use('/', sessionManager.isLogged, function(request, response){
	
    
	
	
	//Compilo e inserisco nella risposta il template
	bind.toFile(
		'web_pages/utente/home.tpl',
		{}, 
		function(d){
			//write response
			response.writeHead(200, createHeaders());
			response.end(d);
		}
	);


	

});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
