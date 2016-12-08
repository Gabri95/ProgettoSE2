

function Order(user_id, date, first_id, second_id, side_id, place){
	this.user_id = user_id;
	this.date = date;
	this.first_id = first_id;
	this.second_id = second_id;
	this.side_id = side_id;
    this.place = place;
};


var orders = [
	new Order(0, new Date("November 28, 2016"), 0, 3, 5, "mensa"),
	new Order(0, new Date("November 29, 2016"), 1, 4, null, "mensa"),
	//new Order(0, new Date("November 30, 2016"), 1, 3, 6, "domicilio"),
	new Order(0, new Date("November 31, 2016"), 2, 4, 6, "domicilio"),
	new Order(1, new Date("November 28, 2016"), 1, null, 5, "mensa"),
	new Order(1, new Date("November 29, 2016"), 0, 3, null, "domicilio"),

];

var days_name = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];


function makeOrder(user_id, date, first, second, side, place){
    
    
    first = (first == 'undefined' || !checkIfNormalInteger(first)) ? null : parseInt(first);
    second = (second == 'undefined' || !checkIfNormalInteger(second)) ? null : parseInt(second);
    side = (side == 'undefined' || !checkIfNormalInteger(side)) ? null : parseInt(side);
    place = (place == 'mensa') ? 'mensa' : 'domicilio';
    
    var order = new Order(user_id, date, first, second, side, place);
    
    
    var idx = -1;
    for(var i=0; i < orders.length; i++){
        if(orders[i].user_id === order.user_id && orders[i].date.toDateString() === order.date.toDateString()){
            idx = i;
            break;
        }
    }

    if(idx < 0){
        //Nel caso non esista inserisco direttamente il nuovo ordine
        orders.push(order);
    }else{
        //Se ho trovato un ordine per questo giorno, modifico questo
        orders[idx] = order;
    }
    
}

function getOrders(user_id, date){
	var order = null;
	
	for(var i=0; i<orders.length; i++){
		if(orders[i].user_id == user_id && orders[i].date.toDateString() == date.toDateString()){
			order = orders[i];
			break;
		}
	}
	
	return order;
}



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

function getNextDays(user_id, today, n){
	
	var days = [];
    if(today != null && n > 0){
        days.push({
            name: days_name[today.getDay()],
            day: today.getDate(),
            month: today.getMonth()+1,
            year: today.getYear(),
            class: (getOrders(user_id, today) == null) ? "btn-default" : "btn-success"
        });

        for(var i=1; i< n; i++){
            var date = followingDay(today, i);

            days.push({
                name: days_name[date.getDay()],
                day: date.getDate(),
                month: date.getMonth()+1,
                year: date.getYear(),
                class: (getOrders(user_id, date) == null) ? "btn-default" : "btn-success"
            });

        }
    }
	
	return days;
}




function getNearDays(user_id, today, n){
	
	var days = [];
	
	if(today != null && n >= 0){
        for(var i=n; i>0; i--){
            var date = previeusDay(today, i);

            days.push({
                name: days_name[date.getDay()],
                day: date.getDate(),
                month: date.getMonth()+1,
                year: date.getYear(),
                class: (getOrders(user_id, date) == null) ? "btn-default" : "btn-success"
            });
        }

        days.push({
            name: days_name[today.getDay()],
            day: today.getDate(),
            month: today.getMonth()+1,
            year: today.getYear(),
            class: (getOrders(user_id, today) == null) ? "btn-default" : "btn-success"
        });

        for(var i=1; i<= n; i++){
            var date = followingDay(today, i);

            days.push({
                name: days_name[date.getDay()],
                day: date.getDate(),
                month: date.getMonth()+1,
                year: date.getYear(),
                class: (getOrders(user_id, date) == null) ? "btn-default" : "btn-success"
            });

        }
    }
	
	
	
	return days;
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


exports.Order = Order;
exports.getNearDays = getNearDays;
exports.getNextDays = getNextDays;
exports.getOrders = getOrders;
exports.makeOrder = makeOrder;
