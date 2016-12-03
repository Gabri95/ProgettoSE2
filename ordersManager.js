
//connect DB
var pg = require('pg');
var dishesManager = require('./dishesManager.js');


function Order(user, date, first, second, side, place){
	this.user = user;
	this.date = date;
	this.first = first;
	this.second = second;
	this.side = side;
    this.place = place;
};



function makeOrder(user, date, first, second, side, place, callback){
    
    first = (first == 'undefined' || !checkIfNormalInteger(first)) ? null : parseInt(first);
    second = (second == 'undefined' || !checkIfNormalInteger(second)) ? null : parseInt(second);
    side = (side == 'undefined' || !checkIfNormalInteger(side)) ? null : parseInt(side);
    place = (place == 'mensa') ? 'mensa' : 'domicilio';
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		
		//add order
		client.query(
            'INSERT INTO foodapp.orders VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (username, date) DO UPDATE SET	first = EXCLUDED.first, second = EXCLUDED.second, side = EXCLUDED.side, place = EXCLUDED.place',
            [user, date, first, second, side, place], function(err, result) {
		  done();
		  if (err) { 
			  console.error(err);
              
          }else {
			  console.log("order inserted");
		  }
          callback(err);
		});
  	}); 
    
}

function getOrder(user, date, callback){
	//connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
		//query
		client.query('SELECT O.place, F.id as f_id, F.name as f_name, F.description as f_des, '+
                            'S.id as s_id, S.name as s_name, S.description as s_des, ' +
                            'C.id as c_id, C.name as c_name, C.description as c_des ' +
                    'FROM foodapp.orders O ' + 
                                'LEFT OUTER JOIN foodapp.dishes F ON (O.first = F.id) ' +
                                'LEFT OUTER JOIN foodapp.dishes S ON (O.second = S.id) ' +
                                'LEFT OUTER JOIN foodapp.dishes C ON (O.side = C.id) ' +
                    'WHERE O.username = $1 AND O.date = $2', 
                     [user, date],
                     function(err, result) {
			//release the client back to the pool
			done();
			var order = null;
			//manages err
			if (err){ 
				console.error(err); 
		  	} else if(result.rows.length > 0){
                var r = result.rows[0];
                order = new Order(user,
                                  date, 
                                  (r.f_id != null) ? new dishesManager.Dish(r.f_id, r.f_name, r.f_des, null, null) : null,
                                  (r.s_id != null) ? new dishesManager.Dish(r.s_id, r.s_name, r.s_des, null, null) : null, 
                                  (r.c_id != null) ? new dishesManager.Dish(r.c_id, r.c_name, r.c_des, null, null) : null,
                                  r.place);
                
		  	}
            callback(err, order);
            
		});
  	});
}


function getOrders(user, start_date, end_date, callback){
	//connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
		//query
		client.query("SELECT D.date, O.date as ordered " +
                    "FROM generate_series($2::date, $3::date, '1 day'::interval) D LEFT OUTER JOIN (SELECT * FROM foodapp.orders WHERE username = $1) O ON (D.date = O.date) " +
                    "ORDER BY D.date",
                     [user, pgFormatDate(start_date), pgFormatDate(end_date)],
                     function(err, result) {
			//release the client back to the pool
			done();
			var orders = [];
			//manages err
			if (err){ 
				console.error(err); 
                
		  	} else if(result.rows.length > 0){
                for(var i=0; i<result.rows.length; i++){
                    var r = result.rows[i];
                    orders.push({date: r.date, ordered: (r.ordered != null) ? true : false});
                }
                
		  	}
            callback(err, orders);
            
		});
  	});
}




function getNearDays(user, today, p, f, callback){
	
	getOrders(user, previeusDay(today, p), followingDay(today, f), function(err, orders){
        
        var days = [];
        
        if(err){
            console.error(err);
        }else{
            for(var i=0; i<orders.length; i++){
            
                var o = orders[i];

                days.push({
                    name: days_name[o.date.getDay()],
                    day: o.date.getDate(),
                    month: o.date.getMonth()+1,
                    year: o.date.getYear(),
                    class: (o.ordered) ? "btn-success" : "btn-default"
                });
            }
            
        }
        

        callback(err, days);        
    });
}


/**
 * Funzione che controlla se la stringa "str" può rappresentare un intero non negativo (un numero naturale)
 * utilizzando le Espressioni Regolari
 * 
 * @str stringa di cui controllare il contenuto
 * @return un valore booleano che indica se la stringa è o meno un numero naturale
 */
function checkIfNormalInteger(str) {
    return /^\d+$/.test(str);
}




var days_name = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];


function followingDay(day, n){
	
	var date = new Date(day);
	date.setDate(day.getDate()+n);
    
	return date;
}

function previeusDay(day, n){
	
	var date = new Date(day);
	date.setDate(day.getDate()-n);
	return date;
}


//from https://gist.github.com/jczaplew/f055788bf851d0840f50
// Convert Javascript date to Pg YYYY MM DD
function pgFormatDate(date) {
  /* Via http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date */
  function zeroPad(d) {
    return ("0" + d).slice(-2)
  }

  var parsed = new Date(date)

  return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");
}



exports.Order = Order;

exports.getNearDays = getNearDays;
exports.makeOrder = makeOrder;
exports.getOrder = getOrder;
exports.getOrders = getOrders;
