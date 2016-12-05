//connect DB
var pg = require('pg');
var dishesManager = require('./dishesManager.js');


function Menu(date, firsts, seconds, sides, desserts, a_firsts, a_seconds, a_sides, a_desserts){
	this.date = date;
    this.firsts = firsts;
    this.seconds = seconds;
    this.sides = sides;
    this.desserts = desserts;
    this.a_firsts = a_firsts;
    this.a_seconds = a_seconds;
    this.a_sides = a_sides;
    this.a_desserts = a_desserts;
};



function getMenu(date, callback){
    //connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
                client.query('SELECT F.dish_id as id, F.dish as dish, F.suggested as suggested, D.name as name, D.description as description \
                              FROM (SELECT dish_id, dish, suggested FROM foodapp.menu WHERE date = $1) as F JOIN foodapp.dishes D ON (F.dish_id = D.id) \
                              ORDER BY F.dish, F.suggested', 
                             [date], 
                             function(err, result) {  
                                //release the client back to the pool
                                done();
                                
                                var menu = null;
                                //manages err
                                if (err){ 
                                    console.log(err);
                                } else if (result.rows.length > 0) {
                                    var rows = result.rows;
                                    menu = new Menu(date, [], [], [], [], [], []);

                                    for(var i =0; i<rows.length; i++){
                                        var d = rows[i];
                                        var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
                                        var suggested = rows[i].suggested;
                                        switch(d.dish){
                                            case 'primo':
                                                if(suggested){
                                                    menu.firsts.push(dish);
                                                }else{
                                                    menu.a_firsts.push(dish);
                                                }
                                                break;
                                            case 'secondo':
                                                if(suggested){
                                                    menu.seconds.push(dish);
                                                }else{
                                                    menu.a_seconds.push(dish);
                                                }
                                                break;
                                            case 'contorno':
                                                if(suggested){
                                                    menu.sides.push(dish);
                                                }else{
                                                    menu.a_sides.push(dish);
                                                }
                                                break;
                                            case 'dessert':
                                                if(suggested){
                                                    menu.desserts.push(dish);
                                                }else{
                                                    menu.a_desserts.push(dish);
                                                }
                                                break;
                                            default:
                                                break;

                                        }
                                    }

                                }else{
                                    menu = new Menu(date, [], [], [], [], [], []);
                                }
                    
                                callback(err, menu);
                            }
                );
  	     }
    );
}



function getSuggestedMenu(date, callback){
    //connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
                client.query('SELECT F.dish_id as id, F.dish as dish, D.name as name, D.description as description '+
                             'FROM (SELECT dish_id, dish FROM foodapp.menu WHERE date = $1 AND suggested = true) as F '+
                                    'JOIN foodapp.dishes D ON (F.dish_id = D.id) '+
                             'ORDER BY dish', 
                             [date], 
                             function(err, result) {  
                                //release the client back to the pool
                                done();
                                
                                var menu = [];
                                //manages err
                                if (err){ 
                                    console.log(err);
                                } else if (result.rows.length > 0) {
                                    var rows = result.rows;

                                    for(var i =0; i<rows.length; i++){
                                        var d = rows[i];
                                        var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
                                        
                                        menu.push(dish);
                                    }

                                }
                    
                                callback(err, menu);
                            }
                );
  	     }
    );
}



function getMenuDish(date, dish, callback){
    //connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
                client.query('SELECT P.dish_id as id, P.suggested as suggested, D.name as name, D.description as description \
                              FROM (SELECT dish_id, suggested FROM foodapp.menu WHERE date = $1 AND dish = $2) as P JOIN foodapp.dishes D ON (P.dish_id = D.id)', 
                             [date, dish], 
                             function(err, result) {  
                                //release the client back to the pool
                                done();
                                
                                var menu = {
                                    suggested: [],
                                    alternatives: []
                                };  
                                //manages err
                                if (err){ 
                                    console.log(err);
                                } else if (result.rows.length > 0) {
                                    var rows = result.rows;
                                    

                                    for(var i =0; i<rows.length; i++){
                                        var d = rows[i];
                                        var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
                                        var suggested = rows[i].suggested;
                                        
                                        if(suggested){
                                            menu.suggested.push({
                                                id: d.id,
                                                name: d.name,
                                                description: d.description
                                            });
                                        }else{
                                            menu.alternatives.push({
                                                id: d.id,
                                                name: d.name,
                                                description: d.description
                                            });
                                        }
                                    }

                                }
                    
                                callback(err, menu);
                            }
                );
  	     }
    );
}





function getMenuOrderedDishes(menu, order){
	
	menu["first_ordered"] = (order != null && order.first != null) ? order.first.id : null;
    menu["second_ordered"] = (order != null && order.second != null) ? order.second.id : null;
    menu["side_ordered"] = (order != null && order.side != null) ? order.side.id : null;
    menu["dessert_ordered"] = (order != null && order.dessert != null) ? order.dessert.id : null;
    
    
	for(var i=0; i<menu.firsts.length; i++){
        var dish = menu.firsts[i];
        dish["ordered"] = (menu.first_ordered == dish.id);
	}
	for(var i=0; i<menu.seconds.length; i++){
		var dish = menu.seconds[i];
        dish["ordered"] = (menu.second_ordered == dish.id);
	}
	for(var i=0; i<menu.sides.length; i++){
		var dish = menu.sides[i];
        dish["ordered"] = (menu.side_ordered == dish.id);
	}
	for(var i=0; i<menu.desserts.length; i++){
		var dish = menu.desserts[i];
        dish["ordered"] = (menu.dessert_ordered == dish.id);
	}
    
	return menu;
}


exports.Menu = Menu;

exports.getMenu = getMenu;
exports.getMenuOrderedDishes = getMenuOrderedDishes;
exports.getMenuDish = getMenuDish;
exports.getSuggestedMenu = getSuggestedMenu;