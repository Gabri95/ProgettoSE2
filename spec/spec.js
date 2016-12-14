
var request = require("request");
var requestJSON = require("request-json");
var pg = require("pg");

var sessionManager = require("../sessionManager.js");
var ordersManager = require("../ordersManager.js");
var menuManager = require("../menuManager.js");
var dishesManager = require("../dishesManager.js");
var utility = require("../utility.js");

process.env.DATABASE_URL=process.env.DATABASE_URL+'?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
console.log(process.env.DATABASE_URL);
 
var base_url = "http://localhost:5000";


/*
*   N.B.: SI RACCOMANDA DI REINIZIALIZZARE IL DATABASE PRIMA DI ESEGUIRE IL TEST
*   È POSSIBILE UTILIZZARE I COMANDI NEI FILE *.sql DISPONIBILI NELLA CARTELLA "db"
*/

//UNIT TEST DEI MODULI
 
describe("Test sessionManager: ", function(){
    
    
    describe(" test authenticate", function(){
        
        describe(" on existing user", function(){
            it(" with right password", function(done){
                sessionManager.authenticate('gabri', 'prova', function(err, user){
                    expect(err).toBeNull();
                    expect(user).not.toBeNull();
                    expect(user.username).toBe('gabri');
                    expect(user.password).toBe('prova');
                    expect(user.name).toBe('Gabriele');
                    expect(user.surname).toBe('Cesa');
                    expect(user.address).toBe('via Benzoni 36');
                    expect(user.phone).toBe('12345678');
                    done();
                });
                
            });
            
            it(" with wrong password", function(done){
                sessionManager.authenticate('gabri', 'wrong', function(err, user){
                    expect(err).toBeNull();
                    expect(user).toBeNull();
                    done();
                });
            });
        });
        
        it(" on unexisting user", function(done){
            sessionManager.authenticate('pippo', 'prova', function(err, user){
                expect(err).toBeNull();
                expect(user).toBeNull();
                done();
            });
        });
        
        
    });
    
    
});


describe("Test ordersManager: ", function(){
    
    //inserisco in una data molto lontana da quella odierna, dove so che non esiste nessun ordine
    var unexistingOrderDate = utility.followingDay(new Date(), 100);
        
        
    
    describe("on getOrder", function(){
        
        it(" with unexisting user", function(done){
            ordersManager.getOrder('pippo', new Date("December 2, 2016"), function(error, order){
                expect(order).toBeNull();
                done();
            });
            
        });
        
        it(" with unexisting order", function(done){
            ordersManager.getOrder('gabri', unexistingOrderDate, function(error, order){
                expect(order).toBeNull();
                done();
            });
        });
        
        it(" with existing user", function(done){
            var date = new Date("December 2, 2016");
            ordersManager.getOrder('gabri', date, function(error, order){
                expect(order).not.toBeNull();
                expect(order).toEqual(new ordersManager.Order('gabri',
                                                              date,
                                                              null,
                                                              new dishesManager.Dish(5, 'fritto misto', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(7, 'patatine fritte', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(9, 'macedonia', 'Tipico piatto italiano', null, null),
                                                              "mensa"));
                done();
            });
        });
            
        
    });
    
    describe(" on makeOrder", function(){
        
        
        it(" check if order inserted", function(done){
            //se i test precedenti sono andati a buon fine, allora nel giorno "unexistingOrderDate" non è presente nessun ordine
            ordersManager.makeOrder('gabri', unexistingOrderDate, null, 5, 7, 9, 'mensa', function(err){
                expect(err).toBeNull();
                
                //controllo se ora invece è presente
                ordersManager.getOrder('gabri', unexistingOrderDate, function(err, order){
                    expect(err).toBeNull();
                    expect(order).not.toBeNull();
                    expect(order).toEqual(new ordersManager.Order('gabri',
                                                              unexistingOrderDate,
                                                              null,
                                                              new dishesManager.Dish(5, 'fritto misto', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(7, 'patatine fritte', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(9, 'macedonia', 'Tipico piatto italiano', null, null),
                                                              "mensa"));
                    done(); 
                });
                
            });
            
            
        });
        
        it(" check if order overwritten", function(done){
            //ora l'ordine dovrebb essere presente. Controlliamo se viene sovrascritto
            ordersManager.makeOrder('gabri', unexistingOrderDate, 0, 3, null, null, 'domicilio', function(err){
                expect(err).toBeNull();
                
                ordersManager.getOrder('gabri', unexistingOrderDate, function(err, order){
                    expect(err).toBeNull();
                    expect(order).not.toBeNull();
                    expect(order).toEqual(new ordersManager.Order('gabri',
                                                              unexistingOrderDate,
                                                              new dishesManager.Dish(0, 'pasta al pomodoro', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(3, 'bistecca', 'Tipico piatto italiano', null, null),
                                                              null,
                                                              null,
                                                              "domicilio"));
                    done(); 
                });
                
            });
        });
        
        it(" check if invalid parameter", function(done){
            
            ordersManager.makeOrder('gabri', unexistingOrderDate, 'a', 'undefined', -3, {prova: 'prova'}, 'asnem', function(err){
                expect(err).toBeNull();
                
                ordersManager.getOrder('gabri', unexistingOrderDate, function(err, order){
                    expect(err).toBeNull();
                    expect(order).not.toBeNull();
                    expect(order.user).toBe('gabri');
                    expect(order.date).toEqual(unexistingOrderDate);
                    expect(order.first).toBe(null);
                    expect(order.second).toBe(null);
                    expect(order.side).toBe(null);
                    expect(order.dessert).toBe(null);
                    expect(order.place).toEqual('domicilio');
                    done(); 
                });
                
            });
            
        });
        
        it(" check if late order denied", function(done){
            //provo a fare un ordine per domani
            //l'ordine dovrebbe venire rifiutato
            var tomorrow = utility.followingDay(new Date(), 1);
            ordersManager.makeOrder('gabri', tomorrow, null, 5, 7, 9, 'mensa', function(err){
                expect(err).toBeNull();
                
                //controllo se l'ordine di domani è quello che mi aspettavo
                ordersManager.getOrder('gabri', unexistingOrderDate, function(err, order){
                    expect(err).toBeNull();
                    //l'ordine trovato non dovrebbe essere quello inserito (può essere null o un altro ordine in base a cosa era già presente)
                    expect(order).not.toEqual(new ordersManager.Order('gabri',
                                                              unexistingOrderDate,
                                                              null,
                                                              new dishesManager.Dish(5, 'fritto misto', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(7, 'patatine fritte', 'Tipico piatto italiano', null, null),
                                                              new dishesManager.Dish(9, 'macedonia', 'Tipico piatto italiano', null, null),
                                                              "mensa"));
                    done(); 
                });
                
            });
            
            
        });
        
            
        
    });
    
    describe(" on getNearDays", function(){
        
        var days_name = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
        var today = new Date();
        it(" with 0 days", function(done){
            
            
            ordersManager.getNearDays('gabri', today, 0, 0, function(err, days){
                expect(days.length).toBe(1);
                expect(days[0].name).toBe(days_name[today.getDay()]);
                expect(days[0].day).toBe(today.getDate());
                expect(days[0].month).toBe(today.getMonth()+1);
                expect(days[0].year).toBe(today.getFullYear());

                done();
            });
            
        });
        
        it(" with a positive number of days", function(done){
            var p = 3, f = 4;
            ordersManager.getNearDays('gabri', today, p, f, function(err, days){
                expect(days.length).toBe(p+f+1);
                expect(days[p].name).toBe(days_name[today.getDay()]);
                expect(days[p].day).toBe(today.getDate());
                expect(days[p].month).toBe(today.getMonth()+1);
                expect(days[p].year).toBe(today.getFullYear());
                done();
            });
        });
        
        it(" with a negative number of days", function(done){
            var p = -3, f = -2;
            ordersManager.getNearDays('gabri', today, p, f, function(err, days){
                expect(days.length).toBe(1);
                expect(days[0].name).toBe(days_name[today.getDay()]);
                expect(days[0].day).toBe(today.getDate());
                expect(days[0].month).toBe(today.getMonth()+1);
                expect(days[0].year).toBe(today.getFullYear());
                done();
            });
        });
        
        it(" with null day", function(done){
            var p = 3, f = 4;
            ordersManager.getNearDays('gabri', null, p, f, function(err, days){
                expect(days.length).toBe(0);
                done();
            });
        });
            
        
    });
    
    
    
    
});


describe("Test menuManager: ", function(){
    
    
    describe(" on getMenu", function(){
        
        it(" with existing day", function(done){
            var date = new Date("December 01, 2016");
            menuManager.getMenu(date, function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.date).toEqual(date);
                done();
            });
            
        });
        
        it(" with unexisting day", function(done){
            var date = new Date("November 20, 2016");
            menuManager.getMenu(date, function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.date).toEqual(date);
                expect(menu.firsts.length).toBe(0);
                expect(menu.seconds.length).toBe(0);
                expect(menu.sides.length).toBe(0);
                expect(menu.desserts.length).toBe(0);
                expect(menu.a_firsts.length).toBe(0);
                expect(menu.a_seconds.length).toBe(0);
                expect(menu.a_sides.length).toBe(0);
                expect(menu.a_desserts.length).toBe(0);
                done();
            });
        });
        
        it(" with null", function(done){
            menuManager.getMenu(null, function(err, menu){
                expect(err).toBeNull();
                expect(menu).toBeNull();
                done();
            });
        });
            
        
    });
    
    describe(" on getSuggestedMenu", function(){
        
        it(" with existing day", function(done){
            var date = new Date("December 03, 2016");
            menuManager.getSuggestedMenu(date, function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.length).toBe(4);
                done();
            });
            
        });
        
        it(" with unexisting day", function(done){
           var date = new Date("November 20, 2016");
            menuManager.getSuggestedMenu(date, function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.length).toBe(0);
                done();
            });
        });
        
        it(" with null", function(done){
            menuManager.getSuggestedMenu(null, function(err, menu){
                expect(err).toBeNull();
                expect(menu).toBeNull();
                done();
            });
        });
            
        
    });
    
    
    describe(" on getMenuDish", function(){
        
        it(" with existing day and dish", function(done){
            var date = new Date("December 03, 2016");
            menuManager.getMenuDish(date, 'primo', function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.suggested.length).toBe(1);
                expect(menu.suggested[0].id).toBe(1);
                expect(menu.alternatives.length).toBe(1);
                expect(menu.alternatives[0].id).toBe(2);
                
                done();
            });
            
        });
        
        it(" with unexisting day", function(done){
            var date = new Date("November 20, 2016");
            menuManager.getMenuDish(date, 'primo', function(err, menu){
                expect(err).toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.suggested.length).toBe(0);
                expect(menu.alternatives.length).toBe(0);
                done();
            });
        });
        
        it(" with date null", function(done){
            menuManager.getMenuDish(null, 'primo', function(err, menu){
                expect(err).toBeNull();
                expect(menu).toBeNull();
                done();
            });
        });
        
        it(" with dish null", function(done){
            var date = new Date("December 03, 2016");
            menuManager.getMenuDish(date, null, function(err, menu){
                expect(err).toBeNull();
                expect(menu).toBeNull();
                done();
            });
        });
            
        it(" with dish invalid", function(done){
            var date = new Date("December 03, 2016");
            menuManager.getMenuDish(date, 'tsrif', function(err, menu){
                expect(err).not.toBeNull();
                expect(menu).not.toBeNull();
                expect(menu.suggested.length).toBe(0);
                expect(menu.alternatives.length).toBe(0);
                done();
            });
        });
        
    });
    
});


describe("Test dishesManager: ", function(){
    
    
    describe(" on getDish", function(){
                
        it(" with unexisting id", function(done){
            dishesManager.getDish(100, function(err, dish){
                expect(dish).toBeNull();
                done();
            });
        });
        
        it(" with null", function(done){
            dishesManager.getDish(null, function(err, dish){
                expect(dish).toBeNull();
                done();
            });
        });
        
        it(" with existing id", function(done){
            dishesManager.getDish(0, function(err, dish){
                expect(dish).not.toBeNull();
                expect(dish.id).toBe(0);
                done();
            });
        });
        
    });
    
    
    
});




//TESTING DI ALCUNE API

describe("Test authentication: ", function() {
    
    it("on not logged user redirect to /start", function(done) {
        request.get(
            base_url, 
            function(error, response, body) {
				expect(response.request.href).toContain(base_url + "/start");
                done();
            });
    }); 
    
    var client = requestJSON.createClient(base_url);
    
    describe("test login", function() {
		
        describe("on wrong username and password", function(){
            var data = {username: 'gabri', password: 'wrong'};
            it(" redirect to /start", function(done) {
                client.post(base_url + "/login", data, 
                    function(error, response, body) {
                        expect(response.statusCode).toBe(302);
                        expect(response.headers.location).toBe("/start");
                        done();
                    });
            }); 
        });
        
        
        describe("on correct username and password", function(){
            var data = {username: 'gabri', password: 'prova'};
            it(" redirect to /", function(done) {
                client.post(base_url + "/login", data, 
                    function(error, response, body) {
                        expect(response.statusCode).toBe(302);
                        expect(response.headers.location).toBe("/home");
                        done();
                    });
            }); 
        });
    
    });
    
    describe("test logout", function() {
		
		
		it(" redirect to /start", function(done) {
			client.post(base_url + "/logout", null,
				function(error, response, body) {
                    expect(response.statusCode).toBe(302);
                    expect(response.headers.location).toBe("/start");
					done();
				});
		}); 
        
	});
    
    
});


describe("Test /getdish AJAX call: ", function() {
    
    var client = requestJSON.createClient(base_url);
    
    
    
    describe("on invalid parameters ", function() {
		
        describe("on invalid date", function(){
            var data = {year: "2016", month: "12", day: "wrong", dish: "primo"};
            it(" return empty lists", function(done) {
                client.get(base_url + "/getdish?day=" + data.day + "&month=" + data.month + "&year=" + data.year + "&dish=" + data.dish, 
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).not.toBe(null);
                        
                        var data = body; 
                    
                        expect(data).not.toBeNull();
                        expect(data.suggested).not.toBeNull();
                        expect(data.alternatives).not.toBeNull();
                        expect(data.suggested.length).toBe(0);
                        expect(data.alternatives.length).toBe(0);
                        done();
                    });
            }); 
        });
        
        describe("on invalid dish", function(){
            var data = {year: "2016", month: "12", day: "2", dish: "wrong"};
            it(" return empty lists", function(done) {
                client.get(base_url + "/getdish?day=" + data.day + "&month=" + data.month + "&year=" + data.year + "&dish=" + data.dish,
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).not.toBe(null);
                        var data = body;
                        expect(data).not.toBeNull();
                        expect(data.suggested).not.toBeNull();
                        expect(data.alternatives).not.toBeNull();
                        expect(data.suggested.length).toBe(0);
                        expect(data.alternatives.length).toBe(0);
                        done();
                    });
            }); 
        });
        
        describe("on missing dish", function(){
            var data = {year: "2016", month: "12", day: "2"};
            it(" return empty lists", function(done) {
                client.get(base_url + "/getdish?day=" + data.day + "&month=" + data.month + "&year=" + data.year + "&dish=" + data.dish,
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).not.toBe(null);
                        var data = body; 
                        expect(data).not.toBeNull();
                        expect(data.suggested).not.toBeNull();
                        expect(data.alternatives).not.toBeNull();
                        expect(data.suggested.length).toBe(0);
                        expect(data.alternatives.length).toBe(0);
                        done();
                    });
            }); 
        });
    
    });
    
    describe("on correct parameters ", function() {
		
        describe("on inexisting menu", function(){
            var data = {year: "2018", month: "12", day: "5", dish: "primo"};
            it(" return empty lists", function(done) {
                client.get(base_url + "/getdish?day=" + data.day + "&month=" + data.month + "&year=" + data.year + "&dish=" + data.dish,
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).not.toBe(null);
                        var data = body; 
                        expect(data).not.toBeNull();
                        expect(data.suggested).not.toBeNull();
                        expect(data.alternatives).not.toBeNull();
                        expect(data.suggested.length).toBe(0);
                        expect(data.alternatives.length).toBe(0);
                        done();
                    });
            }); 
        });
        
        describe("on existing menu", function(){
            var data = {year: 2016, month: 12, day: 5, dish: "primo"};
            it(" return non-empty lists", function(done) {
                client.get(base_url + "/getdish?day=" + data.day + "&month=" + data.month + "&year=" + data.year + "&dish=" + data.dish,
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body).not.toBeNull();
                        var data = body;
                        expect(data).not.toBeNull();
                        expect(data.suggested).not.toBeNull();
                        expect(data.alternatives).not.toBeNull();
                        expect(data.suggested.length).toBe(2);
                        expect(data.alternatives.length).toBe(0);
                        
                        
                        var d0 = {id: 2, name: 'tortelli di zucca', description: 'Tipico piatto italiano'};
                        var d1 = {id: 0, name: 'pasta al pomodoro', description: 'Tipico piatto italiano'};
                        var s0 = data.suggested[0];
                        var s1 = data.suggested[1];
                    
                        var check0 = (d0.id == s0.id && d0.name == s0.name) ||
                                    (d0.id == s1.id && d0.name == s1.name);
                        
                        var check1 = (d1.id == s0.id && d1.name == s0.name) ||
                                    (d1.id == s1.id && d1.name == s1.name);
                        expect(check0).toBe(true);    
                        expect(check1).toBe(true);    
                        
                        done();
                    });
            }); 
        });
        
    
    });
    
    
});


