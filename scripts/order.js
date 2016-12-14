/* ======== MODEL ========= */


// data per cui stiamo ordinando
var date = {
    day: null,
    month: null,
    year: null
};


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

//portata per la quale stiamo ordinando al momento
var ordering = 0;


/**
 * Costruttore dell'oggetto Dish contenente alcune informazioni su un piatto
 * @param {integer} id   id del piatto
 * @param {string}  name nome del piatto
 */
function Dish(id, name) {
    this.id = id;
    this.name = name;
}


/**
 * Metodo per impostare la data.
 * Questo metodo viene chiamato dentro la pagina HTML con i valori impostati attraverso il template di Bind dal server al momento della creazione della pagina
 * @param {integer} day   numero del giorno
 * @param {integer} month mese dell'anno
 * @param {integer} year  anno
 */
function setDate (day, month, year) {
    date.day = day;
    date.month = month;
    date.year = year;
}


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
function setOrder (_first, _second, _side, _dessert, _place) {

    if (_first != null && _first.id != null && _first.id != "") {
        order[dishes[0]] = _first;
    }
    if (_second != null && _second.id != null && _second.id != "") {
        order[dishes[1]] = _second;
    }
    if (_side != null && _side.id != null && _side.id != "") {
        order[dishes[2]] = _side;
    }
    if (_dessert != null && _dessert.id != null && _dessert.id != "") {
        order[dishes[3]] = _dessert;
    }

    if (_place == "mensa") {
        place = "mensa";
    }else{
        place = "domicilio";
    }

}

//lista delle portate esistenti
var dishes = ['primo', 'secondo', 'contorno', 'dessert'];


//HashMap che mappa l'id di un piatto nel suo nome
//utilizzato per accedere in modo più semplice, diretto ed efficiente ai piatti disponibili e alle loro informazioni
var menu_hash = {};


/* ======== OCTOPUS ========== */

var octopus = {
    
    /**
     * Funzione chiamata alla fine del caricamento della pagina per l'inizializzazione
     */
    init: function(){
        ordering = 0;
        
        //inizializzo la visualizzazione grafica per inziare ad ordinare
        dishView.init();
        
        //chiedo i dati della prima portata e li mostro
        this.getDishes();
        
    },
    
    /**
     * Funzione che permette di passare alla visualizzazioen di riepilogo dove verrà confermato l'ordine
     */
    toResumeView: function (){
        //inizializzo la resume view
        resumeView.init();    
        
        //nascondo la view delle portate
        dishView.clear();
        
        //mostro la resume view
        resumeView.show();
    },
    
    

    /**
     * Imposta il piatto "choice" come scelta per la portata "dish"
     * 
     * @param {string} dish   portata per la quale deve essere impostata la scelta
     * @param {Dish}   choice oggetto di tipo Dish rappresentante il piatto scelto
     */
    setDish: function (dish, choice) {

        order[dish] = choice;
        dishView.setDish(dish, choice);

    },

    /**
     * Ritorna la portata per la quale stiamo ordiando.
     * Se abbiamo finito di ordinare ritorna un valore null
     * 
     * @returns {string} la stringa che indica la portata attuale
     */
    getCurrentDish: function () {
        if(ordering < dishes.length){
            return dishes[ordering];
        }else{
            return null;
        }
        
    },

    /**
     * Ritorna il piatto al momento ordinato per la porta corrente.
     * Se abbiamo finito di ordinare ritorna un valore null.
     * 
     * @returns {Dish} il piatto ordiato per la portata corrente
     */
    getCurrentDishChoice: function () {
        if(ordering < dishes.length){
            return order[dishes[ordering]];
        }else{
            return null;
        }
    },

    /**
     * Elimina la scelta per la portata specificata da "dish" se esistente
     * @param {string} dish portata della quale annullare la scelta
     */
    deleteDish: function (dish) {
        order[dish] = null;
        dishView.deleteDish(dish);
    },

    /**
     * Metodo che esegue una richesta in stile AJAX dei piatti nel menu per la prossima portata.
     * Dopodichè aggiorna la pagina con i nuovi piatti.
     */
    getDishes: function () {

        $.get("/getdish?day=" + date.day + "&month=" + date.month + "&year=" + date.year + "&dish=" + this.getCurrentDish(), function (data, status) {

            
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
            
            //se l'utente aveva già scelto un piatto in un'ordinazione precedente, prendo l'id di questo piatto per visualizzarlo come già scelto
            var currentChoice = octopus.getCurrentDishChoice();
            var prev_choice = (currentChoice != null) ? currentChoice.id : null;
            
            dishView.showNewDish(data.suggested, data.alternatives, prev_choice);
            
        });
    },
    
    
    /**
     * Azione eseguita quando viene selezionato un piatto.
     * Nel caso il piatto selezionato non sia quello già scelto, verrà impostato come scelta per la portata corrente.
     * In caso contrario, verrà cancellata la scelta.
     * @param {integer} dishID l'id del piatto selezionato
     */
    selectDish: function(dishID) {
        
        var prev_choice = this.getCurrentDishChoice();

        var currentDish = this.getCurrentDish();

        
        if (prev_choice == undefined || prev_choice.id != dishID) {
            var dish = new Dish(dishID, menu_hash[dishID]);
            this.setDish(currentDish, dish);
        } else {
            this.deleteDish(currentDish);
        }
    },

    /**
     * Azzione eseguita quando viene confermato l'ordine per una portata.
     * Si passa alla portata successiva o al riassunto finale nel caso fossimo all'ultima.
     */
    confirmDish: function(){
        //passo alla portata successiva
        ordering += 1;

        //controllo se ho finito di ordinare le portate
        if (ordering < dishes.length) {
            this.getDishes();
        } else {
            //in caso abbia finito, passo alla resumeView
            this.toResumeView();
        }
    }

};



/* ====== VIEW ===== */

/**
 * Metodo che genera una div HTML contenente le informazioni sul piatto "dish".
 * Il paramentro booleano "selectable" impostato al valore "true" aggiunge la classe "dish" all'elemento contenente il nome del piatto e
 * gli permette di venire selezionato con la pressione del mouse.
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

    //se deve essere selezionabile aggiungo l'azione da eseguire alla pressione
    if (selectable) {
        i.addClass("dish").css("cursor", "pointer");
        
        //azione da eseguire al click sul nome di un piatto.
        i.click(function(){
            console.log("premuto");
            octopus.selectDish(dish.id);
        });
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





var dishView = {
    
    /**
     * Metodo che inizializza l'interfaccia grafica per iniziare ad ordinare i piatti.
     * Inoltre, mostra le portate nello spazio sovrastante che sono già state scelte precedentemente
     */
    init: function () {

        for (var i = 0; i < dishes.length; i++) {
            if (order[dishes[i]] != null && order[dishes[i]].id != "") {
                this.setDish(dishes[i], order[dishes[i]]);
            }
        }
        
        
        //azione da eseguire alla pressione del pulsante per confermare una portata.
        $("#orderButton").click(function () {
            octopus.confirmDish();
        });
        
        this.suggested_panel = $("#suggestedDishes");
        this.alternatives_panel = $("#alternativeDishes");
        this.title = $("#dishTitle");
        
    },
    
    /**
     * Funzione che fa sparire questa view, facendo spazio alla resume view
     */
    clear: function() {
        $(".dishesView").hide();
    },

    /**
     * Metodo chiamato quando deve essere mostrata una nuova portata.
     * Il metodo cancella i piatti della portata precedente e inserisce quelli nuovi.
     * 
     * @param {Dish[]} suggested    lista dei piatti suggeriti
     * @param {Dish[]} alternatives lista dei piatti alternativi
     * @param {integer} prev_choice  id del piatto precedentemente selezionato, se esiste
     */
    showNewDish: function(suggested, alternatives, prev_choice) {
        
        var dish = octopus.getCurrentDish();
        
        this.title.text(dish.toUpperCase());

        
        this.suggested_panel.empty();
        for (var i = 0; i < suggested.length; i++) {
            var d = suggested[i];
            var row = generateDishRow(d, true);
            if (d.id == prev_choice) {
                row.find(".dish").addClass("chosen");
            }
            this.suggested_panel.append(row);

        }

        this.alternatives_panel.empty();
        for (var i = 0; i < alternatives.length; i++) {
            var d = alternatives[i];
            var row = generateDishRow(d, true);
            if (d.id == prev_choice) {
                row.find(".dish").addClass("chosen");
            }
            this.alternatives_panel.append(row);

        }

        //se non è presente nessun piatto suggerito nascondo il pannello per visualizzarli
        if (suggested.length == 0) {
            $("#suggestedDishes").hide();
        } else {
            $("#suggestedDishes").show();
        }
        
        //se non è presente nessuna alternativa nascondo il pannello per visualizzarle
        if (alternatives.length == 0) {
            $(".alternativa").hide();
        } else {
            $(".alternativa").show();
        }
        
        
        
    },


    /**
    * Imposta il piatto "choice" come scelta per la portata "dish"
    * 
    * @param {string} dish   portata per la quale deve essere impostata la scelta
    * @param {Dish}   choice oggetto di tipo Dish rappresentante il piatto scelto
    */
    setDish: function (dish, choice) {
        $('.dish').filter('.chosen').removeClass("chosen");
        $('.dish').filter("[dishid=" + choice.id + "]").addClass("chosen");

        var div = $("#" + dish + "_choice");
        var img = div.children("div").children("img");
        img.attr("src", "/photos/" + choice.id + ".jpg");


        var name = choice.name;
        if (name == undefined) {
            name = "";
        }
        
        img.attr("alt", name);
        img.attr("title", name);
        div.show("slow");

    },

    /**
    * Elimina la scelta per la portata specificata da "dish" se esistente
    * @param {string} dish portata della quale annullare la scelta
    */
    deleteDish: function (dish) {
        
        $('.dish').filter('.chosen').removeClass("chosen");
        
        var div = $("#" + dish + "_choice");
        var img = div.children("div").children("img");
        img.attr("src", "");
        img.attr("alt", "");

        $("#" + dish).val("");
        
        div.hide("slow");
    }

};

var resumeView = {

    /**
     * Metodo che modifica l'intefaccia grafica per passare alla visualizzazione del riepilogo dell'ordinazione
     */
    init: function () {


        var panel = $("#resumeDishes");
        panel.empty();

        //mostro i piatti ordinati e imposto nel form i campi hidden reltivi ai piatti scelti
        for (var i = 0; i < dishes.length; i++) {
            if (order[dishes[i]] != null) {
                panel.append(generateDishRow(order[dishes[i]]), false);
                $("#" + dishes[i]).val(order[dishes[i]].id);
            }
        }

        //mostro la scelta predefinita o quella precedentemente impostata per il luogo ed imposto il relativo campo hidden del form
        if (place != null) {
            $(".placeBtn").filter("#" + place).addClass("chosen");
            $("#luogo").val(place);
        }else{
            $(".placeBtn").filter("#domicilio").addClass("chosen");
            $("#luogo").val('domicilio');
        }
        
        //azione da eseguire quando viene spremuto un pulsante per la scelta del luogo dove mangiare
        $(".placeBtn").click(function () {
            //lo visualizzo come luogo scelto
            $(".placeBtn").filter(".chosen").removeClass("chosen");
            $(this).addClass("chosen");
            
            //imposto il relativo campo hidden del form
            $("#luogo").val($(this).attr("id"));
        });

    },
    
    /**
     * Metodo per far apparire la resume view
     */
    show: function () {
        $("#resumeView").show();
    }

};

//operazioni di inizializzazione da eseguire alla fine del caricamento della pagina e impostazione delle azioni di alcuni elementi
$(document).ready(function () {
    octopus.init();
});
