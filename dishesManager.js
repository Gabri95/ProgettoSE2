//connect DB
var pg = require('pg');


/**
 * Costruttore per l'oggetto Dish, rappresentate il contenuto di una riga della tabella "dishes" nel database.
 * Gli attributi contenuti rappresentano una tupla nella tabella.
 *  
 * @param {integer} id          l'id del piatto
 * @param {string}  name        il nome del piatto
 * @param {string}  description una breve descrizione del piatto
 */
function Dish(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
}


/**
 * Metodo che cerca nel database il piatto identificato dall'id specificato.
 * 
 * Nel caso venga trovato richiama la fuzione di callback passandogli come secondo paramentro un oggetto Dish che rappresenta il piatto trovato.
 * 
 * Nel caso si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query tale parametro sarà null.
 * Verrà passato come primo parametro anche l'errore verificatosi.
 * 
 * @param {integer}  id       l'id del piatto da cercare
 * @param {function} callback funzione di callback che deve accettare due parametri: err e dish,
 *                            rispettivamente l'eventuale errore riscontrato e il piatto trovato
 */
function getDish(id, callback) {
    //connect to database
    pg.connect(
        //enviromental variable, set by heroku
        process.env.DATABASE_URL,
        function (err, client, done) {

            if (err) {
                //nel caso si sia verificato un errore lo stampo e richiamo la funzione di callback
                console.error(err);
                callback(err, null);
            } else {
                //query
                client.query('SELECT * FROM foodapp.dishes WHERE id = $1 LIMIT 1', [id], function (err, result) {
                    //release the client back to the pool
                    done();
                    
                    var dish = null;
                    
                    if (err) {
                        //nel caso si sia verificato un errore lo stampo
                        console.error(err);
                    } else if (result.rows.length > 0) {
                        //nel caso sia stato trovato almeno un risultato, prendiamo il primo
                        //(N.B.: è garantito che ne possa esistere al massimo uno in quanto "id" è la chiave primaria) 
                            
                        var r = result.rows[0];

                        dish = new Dish(id, r.name, r.description);

                    }
                    //in ogni caso richiamo la funzione di callback con l'eventuale errore verificatosi e il piatto trovato (eventualmente nullo)
                    callback(err, dish);

                });
            }

        });
}





exports.Dish = Dish;

exports.getDish = getDish;
