//connect DB
var pg = require('pg');
var dishesManager = require('./dishesManager.js');


function Menu(date, firsts, seconds, sides, a_firsts, a_seconds, a_sides){
	this.date = date;
    this.firsts = firsts;
    this.seconds = seconds;
    this.sides = sides;
    this.a_firsts = a_firsts;
    this.a_seconds = a_seconds;
    this.a_sides = a_sides;
};



function getMenu(date, callback){
    //connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
                client.query('SELECT F.dish_id, F.dish, F.suggested, D.name, D.description \
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
                                } else{
                                    var rows = result.rows;
                                    menu = new Menu(date, [], [], [], [], [], []);

                                    var suggested = rows[i].suggested;

                                    for(var i =0; i<rows.length; i++){
                                        var d = rows[i];
                                        var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
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
                                            default:
                                                break;

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
	
	
    if(order != null){
        menu["first_ordered"] = order.first.id;
        menu["second_ordered"] = order.second.id;
        menu["side_ordered"] = order.side.id;
    }
    
	for(var i=0; i<menu.firsts.length; i++){
        var dish = menu.firsts[i];
        dish["ordered"] = (order != null && order.first.id == dish.id);
	}
	for(var i=0; i<menu.seconds.length; i++){
		var dish = menu.seconds[i];
        dish["ordered"] = (order != null && order.second.id == dish.id);
	}
	for(var i=0; i<menu.sides.length; i++){
		var dish = menu.sides[i];
        dish["ordered"] = (order != null && order.side.id == dish.id);
	}
    
	return menu;
}


exports.Menu = Menu;

exports.getMenu = getMenu;
exports.getMenuOrderedDishes = getMenuOrderedDishes;
