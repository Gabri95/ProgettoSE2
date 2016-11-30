
function Dish(id, name, description, photo, ingredients, recipe){
	this.id = id;
	this.name = name;
	this.description = description;
	this.photo = photo;
	this.ingredients = ingredients;
	this.recipe = recipe;
}



var dishes = [
	new Dish(0, "pasta al pomodoro", "piatto tipico italiano", "photos/pasta_pomodoro.jpg", ["pasta", "sugo di pomodoro"], ["prepara la pasta", "prepara il sugo di pomodoro", "metti la pasta sul piatto insieme al sugo"]),
	new Dish(1, "pasta al ragù", "piatto tipico italiano", "photos/pasta_ragu.jpg", ["pasta", "ragu"], []),
	new Dish(2, "tortelli di zucca", "piatto tipico italiano", "photos/tortelli_zucca.jpg", [], []),
	new Dish(3, "bistecca di pollo", "un tipico secondo di carne", "photos/bistecca_pollo.jpg", [], []),
	new Dish(4, "branzino", "secondo di pesce", "photos/branzino.jpg", [], []),
	new Dish(5, "verdure miste", "insalata di verdure crude", "photos/verdure.jpg", [], []),
	new Dish(6, "patatine fritte", "patatine fritte nell'olio", "photos/fries.jpg", [], [])
];



function copy(d){
    return new Dish(d.id, d.name, d.description, d.photo, d.ingredients, d.recipe);
}

function getDish(id){
	var d = null;
	for(var i =0; i<dishes.length; i++){
		if(dishes[i].id == id){
			d = copy(dishes[i]);
			break;
		}
	}
	
	return d;
}

function getOrderedDishes(order){
	var dishes = {
		first: getDish(order.first_id),
		second: getDish(order.second_id),
		side: getDish(order.side_id)
	};
	
	return dishes;
}

function getMenuDishes(menu){
	var dishes = {
		firsts: [],
		seconds: [],
		sides: []
	};
	
	for(var i=0; i<menu.firstDishes.length; i++){
		dishes.firsts.push(getDish(menu.firstDishes[i]));
	}
	for(var i=0; i<menu.secondDishes.length; i++){
		dishes.seconds.push(getDish(menu.secondDishes[i]));
	}
	for(var i=0; i<menu.sideDishes.length; i++){
		dishes.sides.push(getDish(menu.sideDishes[i]));
	}
	
	return dishes;
}

function getMenuOrderedDishes(menu, order){
	var dishes = {
        first_ordered: '',
        second_ordered: '',
        side_ordered: '',
		firsts: [],
		seconds: [],
		sides: []
	};
	
    if(order != null){
        dishes.first_ordered = order.first_id;
        dishes.second_ordered = order.second_id;
        dishes.side_ordered = order.side_id;
    }
    
	for(var i=0; i<menu.firstDishes.length; i++){
        var dish = getDish(menu.firstDishes[i]);
        dish["ordered"] = (order != null && order.first_id == dish.id);
		dishes.firsts.push(dish);
	}
	for(var i=0; i<menu.secondDishes.length; i++){
		var dish = getDish(menu.secondDishes[i]);
        dish["ordered"] = (order != null && order.second_id == dish.id);
		dishes.seconds.push(dish);
	}
	for(var i=0; i<menu.sideDishes.length; i++){
		var dish = getDish(menu.sideDishes[i]);
        dish["ordered"] = (order != null && order.side_id == dish.id);
		dishes.sides.push(dish);
	}
    
	
	return dishes;
}


exports.getDish = getDish;
exports.getMenuDishes = getMenuDishes;
exports.getOrderedDishes = getOrderedDishes;
exports.getMenuOrderedDishes = getMenuOrderedDishes;

