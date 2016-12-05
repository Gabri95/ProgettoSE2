
function Dish(id, name){
    this.id = id;
    this.name = name;
}

var date = {
    day: null,
    month: null,
    year: null
};

function setDate(day, month, year){
    date.day = day;
    date.month = month;
    date.year = year;
}

var dishes = ['primo', 'secondo', 'contorno', 'dessert'];

var ordering = 0;

var order = {
    first: null,
    second: null,
    side: null,
    dessert: null
};
var place = 'domicilio';


function setOrder(_first, _second, _side, _dessert, _place){
    
    if(_first.id != ""){
        setDish(dishes[0], _first);
    }
    if(_second.id != ""){
        setDish(dishes[1], _second);
    }
    if(_side.id != ""){
        setDish(dishes[2], _side);
    }
    if(_dessert.id != ""){
        setDish(dishes[3], _dessert);
    }
    
    setPlace(_place);
    
}

function setPlace(_place){
    place = _place;
    $("#luogo").val(_place);
}

function setDish(dish, choice){
    
    order[dish] = choice;
    
    var div = $("#"+dish+"_choice");
    var img = div.children("div").children("img");
    img.attr("src", "/photos/"+choice.id+".jpg");

    var name = choice.name;
    if(name == undefined){
        name = "";
    }
    img.attr("alt", name);

    $("#" + dish).val(choice.id);

}

function deleteDish(dish){
    
    order[dish] = null;
    
    var div = $("#"+dish+"_choice");
    var img = div.children("div").children("img");
    img.attr("src", "");
    img.attr("alt", "");

    $("#" + dish).val("");
}

var menu_hash = {};




function generateSelectDishRow(dish){
    var row = $("<div/>"); //document.createElement("div");
            
    row.addClass("row");

    row.append($("<div/>")
                .addClass("col-xs-6")
                .append($("<span/>")
                        .append($("<h3/>")
                                .append($("<i/>")
                                        .addClass("dish")
                                        .css("cursor", "pointer")
                                        .attr("dishid", dish.id)
                                        .text(dish.name)))));

    row.append($("<div/>")
                .addClass("col-xs-6")
                .append($("<img/>")
                        .addClass("img-rounded")
                        .attr("src", "/photos/" +dish.id +".jpg")
                        .attr("alt", dish.name)
                        .attr("width", 150)
                        .attr("height", 90)));   
    return row;
}


function generateDishRow(dish){
    var row = $("<div/>"); //document.createElement("div");
            
    row.addClass("row");

    row.append($("<div/>")
                .addClass("col-xs-6")
                .append($("<span/>")
                        .append($("<h3/>")
                                .append($("<i/>")
                                        .text(dish.name)))));

    row.append($("<div/>")
                .addClass("col-xs-6")
                .append($("<img/>")
                        .addClass("img-rounded")
                        .attr("src", "/photos/" +dish.id +".jpg")
                        .attr("alt", dish.name)
                        .attr("width", 150)
                        .attr("height", 90)));   
    return row;
}

function getDishes(){
    
    $.get("/getdish?day=" + date.day + "&month="+date.month+"&year="+date.year+"&dish="+dishes[ordering], function(data, status){
        data = JSON.parse(data);
        
        var dish = dishes[ordering];
        var prev_choice = (order[dish] != null) ? order[dish].id : null;
        
        $("#dishTitle").text(dish.toUpperCase());
        
        var panel = $("#suggestedDishes");
        panel.empty();
        for(var i=0; i<data.suggested.length; i++){
            var d = data.suggested[i];
            var row = generateSelectDishRow(d);
            if(d.id == prev_choice){
                row.find(".dish").addClass("chosen");
            }
            panel.append(row);
            
        }
        
        panel = $("#alternativeDishes");
        panel.empty();
        for(var i=0; i<data.alternatives.length; i++){
            var d = data.alternatives[i];
            var row = generateSelectDishRow(d);
            if(d.id == prev_choice){
                row.find(".dish").addClass("chosen");
            }
            panel.append(row);
            
        }
        
        if(data.alternatives.length == 0){
            $(".alternativa").hide();
        }else{
            $(".alternativa").show();
        }
        
        menu_hash = {};
        for(var i=0; i<data.suggested.length; i++){
            var dish = data.suggested[i];
            menu_hash[dish.id] = dish.name;
        }
        for(var i=0; i<data.alternatives.length; i++){
            var dish = data.alternatives[i];
            menu_hash[dish.id] = dish.name;
        }
        
    });
}

function dishView(){
    
    for(var i=0; i< dishes.length; i++){
        if(order[dishes[i]] == null || order[dishes[i]].id == ""){
            $("#" + dishes[i] + "_choice").hide();
        }
    }
    
    ordering = 0;

    getDishes();
}

function resumeView(){
    
    
    var panel = $("#resumeDishes");
    panel.empty();
    
    for(var i = 0; i<dishes.length; i++){
        if(order[dishes[i]] != null ){
            panel.append(generateDishRow(order[dishes[i]]));
        }
    }
    
    if(place != null){
        $(".placeBtn").filter("#"+place).addClass("chosen");
    }
    
    $(".dishesView").hide();
    $("#resumeView").show();
    
}

$(document).ready(function(){
    
    dishView();
    
    $(document).on('click', '.dish', function(event){
        
        var dishID = $(event.target).attr("dishid");
        
        
        
        var prev_choice = order[dishes[ordering]];
        
        $('.dish').filter('.chosen').removeClass("chosen");
        
        if(prev_choice == undefined || prev_choice.id != dishID){
            
            var dish = new Dish(dishID, menu_hash[dishID]);
            
            setDish(dishes[ordering], dish);
            
            $("#"+dishes[ordering]+"_choice").show("slow");
            
            $(event.target).addClass("chosen");
            
        }else{
            deleteDish(dishes[ordering]);
            $("#"+dishes[ordering]+"_choice").hide("slow");
        }
         
        
    });
    
	$("#orderButton").click(function(){
        
        ordering += 1;
        
        if(ordering < dishes.length){
            getDishes();
        }else{
            resumeView();
        }
		
    });
    
    $(".placeBtn").click(function(){
        
        $(".placeBtn").filter(".chosen").removeClass("chosen");
        $(this).addClass("chosen");
        
        setPlace($(this).attr("id"));
    });
    
});


