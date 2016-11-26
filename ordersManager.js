

function Order(user_id, date, first_id, second_id, side_id){
	this.user_id = user_id;
	this.date = date;
	this.first_id = first_id;
	this.second_id = second_id;
	this.side_id = side_id;
};


var orders = [
	new Order(0, new Date("November 28, 2016"), 0, 3, 5),
	new Order(0, new Date("November 29, 2016"), 1, 4, null),
	//new Order(0, new Date("November 30, 2016"), 1, 3, 6),
	new Order(0, new Date("November 31, 2016"), 2, 4, 6),
	new Order(1, new Date("November 28, 2016"), 1, null, 5),
	new Order(1, new Date("November 28, 2016"), 0, 3, null),

];

var days_name = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

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

function getNextDays(user_id, today, n){
	
	var days = [];
	
	days.push({
		name: days_name[today.getDay()],
		day: today.getDate(),
		month: today.getMonth()+1,
		class: (getOrders(user_id, today) == null) ? "btn-default" : "btn-success"
	});
	
	for(var i=1; i< n; i++){
		var date = followingDay(today, i);
		
		days.push({
			name: days_name[date.getDay()],
			day: date.getDate(),
			month: date.getMonth()+1,
			class: (getOrders(user_id, date) == null) ? "btn-default" : "btn-success"
		});
		
	}
	
	return days;
}

exports.getNextDays = getNextDays;
exports.getOrders = getOrders;
