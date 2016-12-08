 
var request = require("request");
var requestJSON = require("request-json");

var sessionManager = require("../sessionManager.js");
var ordersManager = require("../ordersManager.js");
var menuManager = require("../menuManager.js");
var dishesManager = require("../dishesManager.js");


 
var base_url = "http://localhost:1337";
 
describe("Test authentication:", function() {
    
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
                        expect(response.headers.location).toBe("/");
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



describe("Test sessionManager: ", function(){
    
    
    describe(" test authenticate", function(){
        
        describe(" on existing user", function(){
            it(" with right password", function(done){
                var user = sessionManager.authenticate('gabri', 'prova');
                expect(user).not.toBeNull();
                expect(user.id).toBe(0);
                expect(user.username).toBe('gabri');
                expect(user.password).toBe('prova');
                expect(user.name).toBe('Gabriele');
                expect(user.surname).toBe('Cesa');
                expect(user.address).toBe('via Benzoni, 36 Mantova');
                done();
            });
            
            it(" with wrong password", function(done){
                var user = sessionManager.authenticate('gabri', 'wrong');
                expect(user).toBeNull();
                done();
            });
        });
        
        
        it(" on unexisting user", function(done){
            var user = sessionManager.authenticate('pippo', 'prova');
            expect(user).toBeNull();
            done();
        });
        
        
    });
    
    
});



describe("Test ordersManager: ", function(){
    
    
    describe(" on getOrder", function(){
        
        it(" with unexisting user", function(done){
            var order = ordersManager.getOrders(100, new Date("November 28, 2016"));
            expect(order).toBeNull();
            done();
        });
        
        it(" with unexisting order", function(done){
            var order = ordersManager.getOrders(0, new Date("November 20, 2016"));
            expect(order).toBeNull();
            done();
        });
        
        it(" with existing user", function(done){
            var order = ordersManager.getOrders(0, new Date("November 28, 2016"));
            expect(order).toEqual(new ordersManager.Order(0, new Date("November 28, 2016"), 0, 3, 5));
            done();
        });
            
        
    });
    
    
    describe(" on getNextDays", function(){
        
        it(" with 0 days", function(done){
            var days = ordersManager.getNextDays(0, new Date(), 0);
            expect(days.length).toBe(0);
            done();
        });
        
        it(" with a positive number of days", function(done){
            var days = ordersManager.getNextDays(0, new Date(), 5);
            expect(days.length).toBe(5);
            done();
        });
        
        it(" with a negative number of days", function(done){
            var days = ordersManager.getNextDays(0, new Date(), -5);
            expect(days.length).toBe(0);
            done();
        });
        
        it(" with null day", function(done){
            var days = ordersManager.getNextDays(100, null, 5);
            expect(days.length).toBe(0);
            done();
        });
            
        
    });
    
    
});



describe("Test menuManager: ", function(){
    
    
    describe(" on getDailyMenu", function(){
        
        it(" with existing day", function(done){
            var menu = menuManager.getDailyMenu(new Date("November 28, 2016"));
            expect(menu).not.toBeNull();
            done();
        });
        
        it(" with unexisting day", function(done){
            var menu = menuManager.getDailyMenu(new Date("November 20, 2016"));
            expect(menu).toBeNull();
            done();
        });
        
        it(" with null", function(done){
            var menu = menuManager.getDailyMenu(null);
            expect(menu).toBeNull();
            done();
        });
            
        
    });
    
    
    
});



describe("Test dishesManager: ", function(){
    
    
    describe(" on getDish", function(){
        
        it(" with existing id", function(done){
            var dish = dishesManager.getDish(0);
            expect(dish).not.toBeNull();
            done();
        });
        
        it(" with unexisting id", function(done){
            var dish = dishesManager.getDish(100);
            expect(dish).toBeNull();
            done();
        });
        
        it(" with null", function(done){
            var dish = dishesManager.getDish(null);
            expect(dish).toBeNull();
            done();
        });
            
        
    });
    
    
    
});