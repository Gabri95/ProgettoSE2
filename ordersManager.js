//Numero massimo di giorni precedenti entro il quale va fatto l'ordine per un determinato giorno.
var DAY_LIMIT = 3;


//connect DB
var pg = require('pg');

//importo alcuni moduli esterni utili
var utility = require('./utility.js');
var dishesManager = require('./dishesManager.js');




/**
 * Costruttore per l'oggetto Order, rappresentate il contenuto di una riga della tabella "orders" nel database.
 * Gli attributi contenuti rappresentano l'insieme del contenuto informativo delle diverse tuple che rappresentano un ordine insieme
 * a quelle della tabella dishes che descrivono ogni piatto ordinato
 * 
 * @param {string} user    l'username che identifica l'utente che ha effettuato l'ordine
 * @param {Date}   date    la data per cui è stato effettuato l'ordine
 * @param {Dish}   first   il piatto ordinato come primo
 * @param {Dish}   second  il piatto ordinato come secondo
 * @param {Dish}   side    il piatto ordinato come contorno
 * @param {Dish}   dessert il piatto ordinato come dessert
 * @param {string} place   il luogo in cui l'utente ha scelto di mangiare
 */
function Order(user, date, first, second, side, dessert, place) {
    this.user = user;
    this.date = date;
    this.first = first;
    this.second = second;
    this.side = side;
    this.dessert = dessert;
    this.place = place;
};



/**
 * Metodo che permette di inserire un nuovo ordine nel database.
 * 
 * Nel caso manchino meno di DAY_LIMIT giorni al giorno per cui si vuole ordinare, non è più possibile effetturare o modificare l'ordinazione.
 * In questo caso, viene subito richiamata la funziona di callback passandogli un valore null.
 * 
 * Nel caso si sia verificato un errore durante la comunicazione con il database o l'esecuzione della insert verrà passato
 * come parametro alla funzione di callback l'errore verificatosi.
 * 
 * Se gli ID dei piatti non sono validi, vengono inseriti dei valori null
 * Nel caso il luogo non sia valido viene impostato di default "domicilio".
 * 
 * @param {string}   user     l'username che identifica l'utente che ha fatto l'ordine
 * @param {Date}     date     la data epr cui si vuole ordinare
 * @param {integer}  first    l'id del piatto ordinato come primo
 * @param {integer}  second   l'id del piatto ordinato come secondo
 * @param {integer}  side     l'id del piatto ordinato come contorno
 * @param {integer}  dessert  l'id del piatto ordinato come dessert
 * @param {string}   place    il luogo in cui l'utente ha scelto di mangiare
 * @param {function} callback funzione di callback che deve accettare un parametro: err, che conterrà l'eventuale errore riscontrato
 */
function makeOrder(user, date, first, second, side, dessert, place, callback) {

    if (utility.followingDay(new Date(), DAY_LIMIT) > date) {
        //nel caso manchino meno di DAY_LIMIT giorni al giorno per cui si vuole ordinare, non è più possibile effetturare o modificare l'ordinazione
        callback(null);
    } else {
        //controllo che gli ID dei piatti siano validi (interi naturali); in caso contrario vengono impostati a null.
        first = (first == 'undefined' || !utility.checkIfNormalInteger(first)) ? null : parseInt(first);
        second = (second == 'undefined' || !utility.checkIfNormalInteger(second)) ? null : parseInt(second);
        side = (side == 'undefined' || !utility.checkIfNormalInteger(side)) ? null : parseInt(side);
        dessert = (dessert == 'undefined' || !utility.checkIfNormalInteger(dessert)) ? null : parseInt(dessert);

        //controllo che il luogo sia valido. In caso contrario viene impostato di default "domicilio".
        place = (place == 'mensa') ? 'mensa' : 'domicilio';



        pg.connect(process.env.DATABASE_URL, function (err, client, done) {

            if (err) {
                //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
                console.error(err);
                callback(err);
            } else {
                //nel caso la connessione sia andata a buon fine eseguiamo la insert
                client.query(
                    'INSERT INTO foodapp.orders VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (username, date) DO UPDATE SET first = EXCLUDED.first, second = EXCLUDED.second, side = EXCLUDED.side, dessert = EXCLUDED.dessert, place = EXCLUDED.place', [user, date, first, second, side, dessert, place],
                    function (err, result) {

                        //release the client back to the pool
                        done();

                        if (err) {
                            //in caso di errore lo stampiamo
                            console.error(err);
                        }
                        //in ogni caso richiamiamo la funzione di callback passandogli l'eventuale errore verificato
                        callback(err);
                    }
                );
            }
        });

    }


}


/**
 * Metodo che cerca l'ordine di un utente per un determinato giorno.
 * 
 * Il metodo controlla se l'utente corrispondente allo username ha effettuato un ordine per il giorno specificato.
 * In caso affermativo verrà passato come parametro alla funzione di callback un oggetto Order contenete le informazioni di tale ordine.
 * In caso negativo tale parametro sarà null.
 * Nel caso si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query il parametro order sarà null.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * @param {string}   user     l'username che identifica l'utente che ha effettuato l'ordine
 * @param {Date}     date     la data per cui è stato effettuato l'ordine   
 * @param {function} callback funzione di callback che deve accettare due parametri: err e order,
 *                            rispettivamente l'eventuale errore riscontrato e l'ordine effettuato
 */
function getOrder(user, date, callback) {
    
    if(date != null){
        //connect to database
        pg.connect(
            //enviromental variable, set by heroku when first databse is created
            process.env.DATABASE_URL,
            function (err, client, done) {
            if (err) {
                //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
                console.error(err);
                callback(err);
            } else {
                //nel caso la connessione sia andata a buon fine eseguiamo la query
                client.query('SELECT O.place, F.id as f_id, F.name as f_name, F.description as f_des, ' +
                    'S.id as s_id, S.name as s_name, S.description as s_des, ' +
                    'C.id as c_id, C.name as c_name, C.description as c_des, ' +
                    'D.id as d_id, D.name as d_name, D.description as d_des ' +
                    'FROM foodapp.orders O ' +
                    'LEFT OUTER JOIN foodapp.dishes F ON (O.first = F.id) ' +
                    'LEFT OUTER JOIN foodapp.dishes S ON (O.second = S.id) ' +
                    'LEFT OUTER JOIN foodapp.dishes C ON (O.side = C.id) ' +
                    'LEFT OUTER JOIN foodapp.dishes D ON (O.dessert = D.id) ' +
                    'WHERE O.username = $1 AND O.date = $2', [user, date],
                    function (err, result) {

                        //release the client back to the pool
                        done();

                        var order = null;

                        if (err) {
                            //in caso di errore lo stampiamo
                            console.error(err);
                        } else if (result.rows.length > 0) {
                            //nel caso sia stato trovato almeno un risultato, prendiamo il primo
                            var r = result.rows[0];
                            order = new Order(user,
                                date,
                                (r.f_id != null) ? new dishesManager.Dish(r.f_id, r.f_name, r.f_des, null, null) : null,
                                (r.s_id != null) ? new dishesManager.Dish(r.s_id, r.s_name, r.s_des, null, null) : null,
                                (r.c_id != null) ? new dishesManager.Dish(r.c_id, r.c_name, r.c_des, null, null) : null,
                                (r.d_id != null) ? new dishesManager.Dish(r.d_id, r.d_name, r.d_des, null, null) : null,
                                r.place);

                        }
                        //in ogni caso richiamiamo la funzione di callback passandogli l'eventuale errore verificato e l'eventuale ordine trovato
                        callback(err, order);

                    }
                );
            }
        });
    }else{
        callback(null, null);
    }
}

/**
 * Metodo che controlla in quali giorni, tra le due date specificate, l'utente ha effettuato ordinazioni.
 * 
 * Il metodo controlla se l'utente corrispondente allo username ha effettuato un ordine per ognuno dei giorni compresi tra quelli specificati.
 * 
 * Se non si verificano errori verrà passato come parametro alla funzione di callback una lista di oggetti conteneti uno dei giorni (campo "date")
 * e un valore booleano che indica se ha effettuato un ordine per tale giorno (campo "ordered").
 * 
 * Nel caso si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query tale parametro conterrà una lista vuota.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * 
 * @param {string}   user       l'username che identifica l'utente che ha effettuato l'ordine
 * @param {Date}     start_date data di partenza
 * @param {Date}     end_date   data finale
 * @param {function} callback   funzione di callback che deve accettare due parametri: err e orders,
 *                              rispettivamente l'eventuale errore riscontrato e la lista dei giorni
 */
function getOrders(user, start_date, end_date, callback) {
    
    if(start_date != null && end_date != null){
        //connect to database
        pg.connect(
            //enviromental variable, set by heroku 
            process.env.DATABASE_URL,
            function (err, client, done) {
            if (err) {
                //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
                console.error(err);
                callback(err, []);
            } else {
                //nel caso la connessione sia andata a buon fine eseguiamo la query
                client.query("SELECT D.date, O.date as ordered " +
                    "FROM generate_series($2::date, $3::date, '1 day'::interval) D LEFT OUTER JOIN (SELECT * FROM foodapp.orders WHERE username = $1) O ON (D.date = O.date) " +
                    "ORDER BY D.date", [user, utility.pgFormatDate(start_date), utility.pgFormatDate(end_date)],
                    function (err, result) {
                        //release the client back to the pool
                        done();

                        var orders = [];

                        if (err) {
                            //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
                            console.error(err);
                        } else if (result.rows.length > 0) {
                            //nel caso sia stato trovato almeno un risultato prepariamo l'oggetto da ritornare
                            for (var i = 0; i < result.rows.length; i++) {
                                var r = result.rows[i];
                                orders.push({
                                    date: r.date,
                                    ordered: (r.ordered != null) ? true : false
                                });
                            }

                        }
                        //in ogni caso richiamiamo la funzione di callback passandogli l'eventuale errore verificato e la lista di giorni (eventualmente vuota)
                        callback(err, orders);

                    }
                );
            }
        });
    }else{
        callback(null, []);
    }
}



/**
 * Stabilisce la classe dell'ordine da visualizzare in base al fatto che ci sia già un ordine e se è passato o meno il tempo limite per ordinare.
 * @param   {Order}  order oggetto ordine da classificare
 * @returns {string} classe calcolata
 */
function getOrderClass(order) {
    //controllo la data odierna
    var today = new Date();

    if (utility.followingDay(today, DAY_LIMIT) > order.date) {
        //se la data dell'ordine è inferiore al "DAY_LIMIT"-esimo giorno successivo alla data odierna allora è scaduto il tempo
        return 'expired';
    } else {
        //altrimenti l'utente può ancora modificare l'ordine/ordinare
        return order.ordered ? 'completed' : 'uncompleted';
    }

}

/**
 * Metodo che controlla in quali giorni vicino al giorno specificato l'utente ha effettuato ordinazioni.
 * 
 * Il metodo controlla se l'utente corrispondente allo username ha effettuato un ordine per ognuno dei giorni compresi tra il p-esimo
 * giorno precedente a quello specificato ed il f-esimo successivo.
 * 
 * Se il giorno specificato è null, viene richiamata immediatamente la funzione di callback con entrambi i parametri null.
 * Se i parametri p e f sono negativi vengono impostati a 0.
 * 
 * Se non si verificano errori verrà passato come parametro alla funzione di callback una lista di oggetti, uno per ogni giorno, ognuno contenente:
 *    - il nome del giorno 
 *    - il numero del giorno
 *    - il numero del mese
 *    - l'anno
 *    - la classe del giorno (vedi metodo getOrderClass)
 * 
 * Questo metodo utilizza la funzione getOrders per interfacciarsi con il database. Nel caso si sia verificato un errore all'interno di quest'ultima e
 * che, quindi, il parametro err non sia null, verrà richiamata la funzioen di callback passando tale errore e una lista vuota.
 * 
 * 
 * @param {string}   user     username che identifica l'utente di cui controllare le ordinazioni
 * @param {Date}     today    data centrale
 * @param {integer}  p        numero di giorni precedenti da controllare
 * @param {integer}  f        numero di giorni successivi da controllare
 * @param {function} callback funzione di callback che deve accettare due parametri: err e days,
 *                            rispettivamente l'eventuale errore riscontrato e la lista dei giorni
 */
function getNearDays(user, today, p, f, callback) {

    if(today != null){
		if(p < 0) { p = 0; }
		if(f < 0) { f = 0; }
        
        //utilizzo il metodo getOrders per interfacciarmi con il database e contollare in quali giorni è già stato effettuato un ordine
        getOrders(user, utility.previousDay(today, p), utility.followingDay(today, f), function (err, orders) {
        
        var days = [];

        if (err == null) {
            //per ogni giorno ritornato da getOrders inserisco un nuovo oggetto nella lista da restituire
            for (var i = 0; i < orders.length; i++) {

                //prendo l'i-esimo elemento
                var o = orders[i];

                //inserisco nella lista l'oggetto che descrive l'i-esimo giorno
                days.push({
                    name: utility.toDayName(o.date.getDay()),
                    day: o.date.getDate(),
                    month: o.date.getMonth() + 1,
                    year: o.date.getFullYear(),
                    class: getOrderClass(o)
                });
            }

        }

        //In ogni caso richiamo la funzione di callback passandogli l'eventuale errore e la lista di giorni (eventualmente anche vuota)
        callback(err, days);
    });
    }else{
        callback(null, null);
    }
}






exports.Order = Order;
exports.DAY_LIMIT = DAY_LIMIT;
exports.getNearDays = getNearDays;
exports.makeOrder = makeOrder;
exports.getOrder = getOrder;
