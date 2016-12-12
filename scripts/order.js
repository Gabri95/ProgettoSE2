/**
 * Costruttore dell'oggetto Dish contenente alcune informazioni su un piatto
 * @param {integer} id   id del piatto
 * @param {string}  name nome del piatto
 */
function Dish(id, name) {
    this.id = id;
    this.name = name;
}

// data per cui stiamo ordinando
var date = {
    day: null,
    month: null,
    year: null
};

/**
 * Metodo per impostare la data.
 * Questo metodo viene chiamato dentro la pagina HTML con i valori impostati attraverso il template di Bind dal server al momento della creazione della pagina
 * @param {integer} day   numero del giorno
 * @param {integer} month mese dell'anno
 * @param {integer} year  anno
 */
function setDate(day, month, year) {
    date.day = day;
    date.month = month;
    date.year = year;
}

//lista delle portate esistenti
var dishes = ['primo', 'secondo', 'contorno', 'dessert'];

//portata per la quale stiamo ordinando al momento
var ordering = 0;

//piatti scelti al momento
var order = {
    first: null,
    second: null,
    side: null,
    dessert: null
};

//luogo dove mangiare scelto
//di default è 'domicilio'
var place = 'domicilio';


/**
 * Metodo che inizializza gli ordini.
 * Nel caso si stia modificando un ordine già fatto, si vuole che le scelte siano inizializzate a quelle fatte in precedenza.
 * 
 * Se un piatto è null o ha il campo id vuoto o nullo, non verrà impostato.
 * Se il luogo è null o vuoto verrà lasciato il valore di default ('domicilio').
 * Se il luogo è una stringa non valida, verrà impostato il valore di default.
 * 
 * @param {Dish}   _first   piatto scelto come primo
 * @param {Dish}   _second  piatto scelto come secondo
 * @param {Dish}   _side    piatto scelto come contorno
 * @param {Dish}   _dessert piatto scelto come dessert
 * @param {string} _place   luogo scelto
 */
function setOrder(_first, _second, _side, _dessert, _place) {

    if (_first != null && _first.id != null && _first.id != "") {
        setDish(dishes[0], _first);
    }
    if (_second != null && _second.id != null && _second.id != "") {
        setDish(dishes[1], _second);
    }
    if (_side != null && _side.id != null && _side.id != "") {
        setDish(dishes[2], _side);
    }
    if (_dessert != null && _dessert.id != null && _dessert.id != "") {
        setDish(dishes[3], _dessert);
    }

    if (_place != null && _place != "") {
        setPlace(_place);
    }

}

/**
 * Imposta il luogo dove mangiare al valore passato come parametro
 * Nel caso _place non contenga ne "domicilio" ne "mensa" verrà impostato il valore di default "domicilio".
 * @param {string} _place luogo dove mangiare
 */
function setPlace(_place) {
    if (_place != "domicilio" && _place != "mensa") {
        _place = "domicilio";
    }
    place = _place;
    $("#luogo").val(_place);
}

/**
 * Imposta il piatto "choice" come scelta per la portata "dish"
 * 
 * @param {string} dish   portata per la quale deve essere impostata la scelta
 * @param {Dish}   choice oggetto di tipo Dish rappresentante il piatto scelto
 */
function setDish(dish, choice) {

    order[dish] = choice;

    var div = $("#" + dish + "_choice");
    var img = div.children("div").children("img");
    img.attr("src", "/photos/" + choice.id + ".jpg");
    
    

    var name = choice.name;
    if (name == undefined) {
        name = "";
    }
    img.attr("alt", name);
    img.attr("title", name);
    
    $("#" + dish).val(choice.id);

}

/**
 * Elimina la scelta per la portata specificata da "dish" se esistente
 * @param {string} dish portata della quale annullare la scelta
 */
function deleteDish(dish) {

    order[dish] = null;

    var div = $("#" + dish + "_choice");
    var img = div.children("div").children("img");
    img.attr("src", "");
    img.attr("alt", "");

    $("#" + dish).val("");
}



/**
 * Metodo che genera una div HTML contenente le informazioni sul piatto "dish".
 * Il paramentro booleano "selectable" impostato al valore "true" aggiunge la classe "dish" all'elemento contenente il nome del piatto,
 * permettendogli di venire selezionato con la pressione del mouse.
 * 
 * @param   {Dish}    dish      oggetto Dish con le informazioni da visualizzare
 * @param   {boolean} selected  se il piatto è selezionabile o meno
 * @returns {Element} un elemento HTML con le informazioni da visualizzare
 */
function generateDishRow(dish, selectable) {
    var row = $("<div/>");

    row.addClass("row");

    var i = $("<i/>")
        .attr("dishid", dish.id)
        .text(dish.name);

    if (selectable) {
        i.addClass("dish").css("cursor", "pointer");
    }

    row.append($("<div/>")
        .addClass("col-xs-6")
        .append($("<span/>")
            .append($("<h3/>")
                .append(i))));

    row.append($("<div/>")
        .addClass("col-xs-6")
        .append($("<img/>")
            .addClass("img-rounded")
            .attr("src", "/photos/" + dish.id + ".jpg")
            .attr("alt", dish.name)
            .attr("title", dish.name)
            .attr("width", 150)
            .attr("height", 90)));
    return row;
}


//HashMap che mappa l'id di un piatto nel suo nome
//utilizzato per accedere in modo più semplice, diretto ed efficiente ai piatti disponibili e alle loro informazioni
var menu_hash = {};


/**
 * Metodo che esegue una richesta in stile AJAX dei piatti nel menu per la prossima portata.
 * Dopodichè aggirona la pagina con i nuovi piatti.
 */
function getDishes() {

    $.get("/getdish?day=" + date.day + "&month=" + date.month + "&year=" + date.year + "&dish=" + dishes[ordering], function (data, status) {

        
        //prendo il nome della nuova portata
        var dish = dishes[ordering];

        //controllo se l'utente aveva già scelto un piatto in un'ordinazione precedente
        var prev_choice = (order[dish] != null) ? order[dish].id : null;


        $("#dishTitle").text(dish.toUpperCase());

        var panel = $("#suggestedDishes");
        panel.empty();
        for (var i = 0; i < data.suggested.length; i++) {
            var d = data.suggested[i];
            var row = generateDishRow(d, true);
            if (d.id == prev_choice) {
                row.find(".dish").addClass("chosen");
            }
            panel.append(row);

        }

        panel = $("#alternativeDishes");
        panel.empty();
        for (var i = 0; i < data.alternatives.length; i++) {
            var d = data.alternatives[i];
            var row = generateDishRow(d, true);
            if (d.id == prev_choice) {
                row.find(".dish").addClass("chosen");
            }
            panel.append(row);

        }

        //se non è presente nessuna alternativa nascondo il pannello per visualizzarle
        if (data.alternatives.length == 0) {
            $(".alternativa").hide();
        } else {
            $(".alternativa").show();
        }

        //imposto il contenuto di menu_hash con i nuovi piatti
        menu_hash = {};
        for (var i = 0; i < data.suggested.length; i++) {
            var dish = data.suggested[i];
            menu_hash[dish.id] = dish.name;
        }
        for (var i = 0; i < data.alternatives.length; i++) {
            var dish = data.alternatives[i];
            menu_hash[dish.id] = dish.name;
        }

    });
}

/**
 * Metodo che inizializza l'interfaccia grafica per iniziare ad ordinare i piatti
 * Si parte dalla prima portata, quindi imposta "ordering" a 0 e usa getDishes() per ottenere i primi piatti.
 * Inoltre, nasconde le portate nello spazio sovrastante che non sono ancora state scelte
 */
function dishView() {

    for (var i = 0; i < dishes.length; i++) {
        if (order[dishes[i]] == null || order[dishes[i]].id == "") {
            $("#" + dishes[i] + "_choice").hide();
        }
    }

    ordering = 0;

    getDishes();
}

/**
 * Metodo che modifica l'intefaccia grafica per passare alla visualizzazione del riepilogo dell'ordinazione
 */
function resumeView() {


    var panel = $("#resumeDishes");
    panel.empty();

    for (var i = 0; i < dishes.length; i++) {
        if (order[dishes[i]] != null) {
            panel.append(generateDishRow(order[dishes[i]]), false);
        }
    }

    if (place != null) {
        $(".placeBtn").filter("#" + place).addClass("chosen");
    }

    $(".dishesView").hide();
    $("#resumeView").show();

}


//operazioni di inizializzazione da eseguire alla fine del caricamento della pagina e impostazione delle azioni di alcuni elementi
$(document).ready(function () {

    //inizializzo la visualizzazione grafica per inziare ad ordinare
    dishView();

    //azione da eseguire al click sul nome di un piatto.
    //Nel caso il piatto selezionato non sia quelo già scelto, verrà impostato come scelta per la portata corrente.
    //In caso contrario, verrà cancellata la scelta.
    $(document).on('click', '.dish', function (event) {

        var dishID = $(event.target).attr("dishid");

        var prev_choice = order[dishes[ordering]];

        $('.dish').filter('.chosen').removeClass("chosen");

        if (prev_choice == undefined || prev_choice.id != dishID) {

            var dish = new Dish(dishID, menu_hash[dishID]);

            setDish(dishes[ordering], dish);

            $("#" + dishes[ordering] + "_choice").show("slow");

            $(event.target).addClass("chosen");

        } else {
            deleteDish(dishes[ordering]);
            $("#" + dishes[ordering] + "_choice").hide("slow");
        }


    });

    //azione da eseguire alla pressione del pulsante per confermare una portata.
    //In tal caso si passa alla portata successiva o al riassunto finale nel caso fossimo all'ultima
    $("#orderButton").click(function () {

        ordering += 1;

        if (ordering < dishes.length) {
            getDishes();
        } else {
            resumeView();
        }

    });

    //azione da eseguire quando viene spremuto un pulsante per la scelta del luogo dove mangiare
    $(".placeBtn").click(function () {

        $(".placeBtn").filter(".chosen").removeClass("chosen");
        $(this).addClass("chosen");

        setPlace($(this).attr("id"));
    });

});
