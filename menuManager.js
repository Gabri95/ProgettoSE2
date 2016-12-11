//connect DB
var pg = require('pg');

//importo i moduli necessari
var dishesManager = require('./dishesManager.js');

/**
 * Costruttore per l'oggetto Menu, rappresentate il contenuto della tabella "menu" nel database.
 * Gli attributi contenuti rappresentano l'insieme del contenuto informativo delle diverse tuple che rappresentano il menu di un giorno insieme
 * a quelle della tabella dishes che descrivono ogni piatto disponibile
 * 
 * @param {Date}   date       data in cui è presente questo menu
 * @param {Dish[]} firsts     lista di primi disponibili consigliati
 * @param {Dish[]} seconds    lista di secondi disponibili consigliati
 * @param {Dish[]} sides      lista di contorni disponibili consigliati
 * @param {Dish[]} desserts   lista di dessert disponibili consigliati
 * @param {Dish[]} a_firsts   lista di primi disponibili alternativi
 * @param {Dish[]} a_seconds  lista di secodni disponibili alternativi
 * @param {Dish[]} a_sides    lista di contorni disponibili alternativi
 * @param {Dish[]} a_desserts lista di dessert disponibili alternativi
 */
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


/**
 * Metodo che cerca il menu di un determinato giorno.
 * 
 * Il metodo cerca nella tabella menu tutti i piatti disponibili per il giorno specificato.
 * 
 * Verrà passato come parametro alla funzione di callback un oggetto Menu contenete le informazioni trovate (con eventualmente alcune liste di piatti vuote).
 * Nel caso, invece, si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query il parametro menu sarà null.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * @param {Date}     date     la data per cui si vuole sapere il menu  
 * @param {function} callback funzione di callback che deve accettare due parametri: err e menu,
 *                            rispettivamente l'eventuale errore riscontrato e il menu disponibile
 */
function getMenu(date, callback){

	if(date != null){

		//connect to database
		pg.connect(
			//enviromental variable, set by heroku
			process.env.DATABASE_URL, 
			function(err, client, done) {
		        if(err){
		            console.error(err);
		            callback(err, null);
		        }else{
		            client.query('SELECT F.dish_id as id, F.dish as dish, F.suggested as suggested, D.name as name, D.description as description \
		                          FROM (SELECT dish_id, dish, suggested FROM foodapp.menu WHERE date = $1) as F JOIN foodapp.dishes D ON (F.dish_id = D.id) \
		                          ORDER BY F.dish, F.suggested', 
		                         [date], 
		                         function(err, result) {  
		                            //release the client back to the pool
		                            done();
		                            
		                            var menu = null;
		                            
		                            if(err){
		                                //nel caso si sia verificato un errore lo stampiamo
		                                console.log(err);
		                                
		                            }else if(result.rows.length > 0){
		                                //nel caso sia stato trovato almeno un piatto, li inseriamo dentro il menu
		                                var rows = result.rows;
		                                
		                                //creo un nuovo oggetto Menu, in cui ogni lista è inizialmente vuota
		                                menu = new Menu(date, [], [], [], [], [], []);

		                                for(var i =0; i<rows.length; i++){
		                                    //per ogni riga, ovvero per ogni piatto trovato
		                                    
		                                    var d = rows[i];
		                                    
		                                    //creo l'oggetto Dish corrispondente
		                                    var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
		                                    
		                                    //controllo se il piatto è suggerito o meno e lo inserisco nella lista opportuna
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
		                                //se non ho trovato nessun piatto ritorno un Menu con ogni lista vuota
		                                menu = new Menu(date, [], [], [], [], [], []);
		                            }
		                            
		                            //In ogni caso richiamo la funzione di callback con l'eventuale errore riscontrato ed il menu
		                            callback(err, menu);
		                        }
		            );
		        }
		            
	  	     }
		);
	}else{
		callback(null, null);
	}
}


/**
 * Il metodo cerca nella tabella menu tra tutti i piatti disponibili per il giorno specificato quelli che sono suggeriti.
 * 
 * Verrà passato come parametro alla funzione di callback una lista di Dish, rappresentanti i piatti consigliati.
 * Nel caso, invece, si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query, tale lista sarà vuota.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * @param {Date}     date     la data per cui si vuole sapere il menu  
 * @param {function} callback funzione di callback che deve accettare due parametri: err e menu,
 *                            rispettivamente l'eventuale errore riscontrato e il menu disponibile
 */
function getSuggestedMenu(date, callback){
	if(date != null){
		//connect to database
		pg.connect(
			//enviromental variable, set by heroku
			process.env.DATABASE_URL, 
			function(err, client, done) {
		        if(err){
		            //se si è verificato un errore lo stampo e richiamo la funzione di callback con l'errore e una lista vuota.
		            console.log(err);
		            callback(err, []);
		        }else{
		            client.query('SELECT F.dish_id as id, F.dish as dish, D.name as name, D.description as description '+
		                         'FROM (SELECT dish_id, dish FROM foodapp.menu WHERE date = $1 AND suggested = true) as F '+
		                                'JOIN foodapp.dishes D ON (F.dish_id = D.id) '+
		                         'ORDER BY dish', 
		                         [date], 
		                         function(err, result) {  
		                            //release the client back to the pool
		                            done();
		                            
		                            var menu = [];
		                            
		                            if(err){ 
		                                //nel caso si sia verificato un errore lo stampo
		                                console.log(err);
		                            }else if(result.rows.length > 0){
		                                //se è stato trovato almeno un risultato, inserisco gli oggetti Dish con le informazioni necessarie nella lista da restituire
		                                var rows = result.rows;

		                                for(var i =0; i<rows.length; i++){
		                                    var d = rows[i];
		                                    
		                                    var dish = new dishesManager.Dish(d.id, d.name, d.description, null, null);
		                                    menu.push(dish);
		                                }

		                            }
		                            
		                            //In ogni caso richiamo la funzione di callbakc passandogli l'eventuale errore e la lista calcolata
		                            callback(err, menu);
		                        }
		            );
		        }
		            
	  	     }
		);
	}else{
		callback(null, null);
	}
}


/**
 * Il metodo cerca nella tabella menu del database tutti piatti della portata specificata (dish) nel menu di un determinato giorno.
 * 
 * Verrà passato come parametro alla funzione di callback un oggetto con due attributi: "suggested" e "alternatives". Entrambi sono liste di oggetti
 * e contengono rispettivamente la lista di piatti consigliati e la lista di quelli alternativi per la portata specificata.
 * Ogni oggetto contenuto nelle liste ha i seguenti attributi:
 *    - id : l'id del piatto corrispondente
 *    - name : il nome del piatto corrispondente
 *    - description : la descrizione del piatto corrispondente
 * 
 * Nel caso si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query, tali liste saranno vuote.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * @param {Date}     date     la data per cui si vuole sapere il menu  
 * @param {string}   dish     portata della quale si è interessati a sapere i piatti disponibili
 * @param {function} callback funzione di callback che deve accettare due parametri: err e menu,
 *                            rispettivamente l'eventuale errore riscontrato e l'oggetto contenente le due liste di piatti
 */
function getMenuDish(date, dish, callback){

	if(date != null && dish != null){

		//connect to database
		pg.connect(
			//enviromental variable, set by heroku when first databse is created
			process.env.DATABASE_URL, 
			function(err, client, done) {
		        if(err){
		            //se si è verificato un errore lo stampo e richiamo la funzione di callback passandogli l'errore è le liste di piatti vuote
		            console.error(err);
		            callback(err, {suggested: [], alternatives: []});
		        }else{
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
		                            
		                            if(err){ 
		                                //se si è verificato un errore lo stampo
		                                console.log(err);
		                            }else if(result.rows.length > 0){
		                                //se abbiamo trovato almeno un risultato, inserisco i piatti corrispondenti nel menu da restituire
		                                var rows = result.rows;
		                                

		                                for(var i =0; i<rows.length; i++){
		                                    var d = rows[i];
		                                    
		                                    //per ogni piatto trovato creo l'oggetto corrispondente e lo inserisco nella lista opportuna
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
		                            //In ogni caso richiamo la funzione di callback con l'eventuale errore verificatosi
		                            //e le liste di piatti calcolate (eventualmente vuote)
		                            callback(err, menu);
		                        }
		            );
		        }
	  	     }
		);
	} else {
		callback(null, null);
	}
}




exports.Menu = Menu;

exports.getMenu = getMenu;
exports.getMenuDish = getMenuDish;
exports.getSuggestedMenu = getSuggestedMenu;