
function DailyMenu(date, firstDishes, secondDishes, sideDishes){
	this.date = date;
	this.firstDishes = firstDishes;
	this.secondDishes = secondDishes;
	this.sideDishes = sideDishes;
};

var menu = [
	
	new DailyMenu(new Date("November 28, 2016"), [0, 1, 2], [3, 4], [5, 6]),
	new DailyMenu(new Date("November 29, 2016"), [0, 2], [4], [5]),
	new DailyMenu(new Date("November 30, 2016"), [2], [3, 4], [6]),
	new DailyMenu(new Date("December 1, 2016"), [0], [4], [5, 6]),
	new DailyMenu(new Date("December 2, 2016"), [0, 2], [4], [5]),
	new DailyMenu(new Date("December 3, 2016"), [1, 2], [3], [6]),
	new DailyMenu(new Date("December 4, 2016"), [1, 2], [3], [5, 6]),
	new DailyMenu(new Date("December 5, 2016"), [0, 2], [3, 4], [6]),
	new DailyMenu(new Date("December 6, 2016"), [0, 1], [3, 4], [5]),
	new DailyMenu(new Date("December 7, 2016"), [0, 1], [4], [5, 6]),
	new DailyMenu(new Date("December 8, 2016"), [0, 2], [3], [5]),
	
];




function getDailyMenu(date){
	
	var m = null;
	
	for(var i=0; i<menu.length(); i++){
		if(menu[i].date.toDateString() == date.toDateString()){
			m = menu[i];
			break;
		}
	}
	
	return m;
	
}



exports.getDailyMenu = getDailyMenu;


