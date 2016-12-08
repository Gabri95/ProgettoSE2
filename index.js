var pg = require('pg');
process.env.DATABASE_URL=process.env.DATABASE_URL+'?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
console.log(process.env.DATABASE_URL);

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

var bodyParser = require('body-parser');

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


app.get('/order', sessionManager.isLogged, function(request, response){
	
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
    var place = getVar.place;
    
    if(year == 'undefined' || month == 'undefined' || day == 'undefined'){
		response.redirect('/error');
	}else{
        var date = new Date(1900 + parseInt(year), month -1, day, 0, 0, 0, 0);
        ordersManager.makeOrder(request.session.user.username, date, first, second, side, place, function(err){
            
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


function dayPage(request, response, callback){
    
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
	var url_parts = url.parse(request.url, true);
	//variabile che conterrà i parametri
	var getVar = url_parts.query;
	
	var year = getVar.year;
	var month = getVar.month - 1;
	var day = getVar.day;
	
	
	if(year == 'undefined' || month == 'undefined' || day == 'undefined'){		
		response.redirect('/error');
	}else{
		
        var day = new Date(1900 + parseInt(year), month, day, 0, 0, 0, 0);
	
		ordersManager.getNearDays(request.session.user.username, day, 2, 2, function(err, days){
            if(err){
                response.redirect('/error');
            }else{
                for(var i=0; i< days.length; i++){
                    days[i].name = days[i].name.slice(0, 3);
                }

                ordersManager.getOrder(request.session.user.username, day, function(err, order){
                    if(err){
                        response.redirect('/error');
                    }else{
                        callback(year, month, day, days, order);
                    }
                });
                
            }
            
        });
    }
    
}

app.get('/day', sessionManager.isLogged, function(request, response){
	
	dayPage(request, response, function(year, month, day, days, order){
        if(order == null){
            menuManager.getMenu(day, function(err, menu){

                if(err || menu == null){
                    response.redirect('/error');
                }else{
                    //Compilo e inserisco nella risposta il template
                    bind.toFile(
                        'web_pages/utente/menu_ordinare.tpl',
                        {
                            y_2: days[0],
                            y_1: days[1],
                            day: days[2],
                            t_1: days[3],
                            t_2: days[4],
                            place: 'domicilio',
                            menu: menuManager.getMenuOrderedDishes(menu, null)
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
                    order: order
                }, 
                function(d){
                    //write response
                    response.writeHead(200, createHeaders());
                    response.end(d);
                }
            );

        }
    });
});



app.get('/edit', sessionManager.isLogged, function(request, response){
	dayPage(request, response, function(year, month, day, days, order){
        if(order == null){
            response.redirect('/error');
        }else{
            menuManager.getMenu(day, function(err, menu){
                
                if(err || menu == null){
                    response.redirect('/error');
                }else{
                    //Compilo e inserisco nella risposta il template
                    bind.toFile(
                        'web_pages/utente/menu_ordinare.tpl',
                        {
                            y_2: days[0],
                            y_1: days[1],
                            day: days[2],
                            t_1: days[3],
                            t_2: days[4],
                            place: order.place,
                            menu: menuManager.getMenuOrderedDishes(menu, order)
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
