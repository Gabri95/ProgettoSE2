
//connect DB
var pg = require('pg');



/**
 * Costruttore per l'oggetto User, rappresentate il contenuto di una riga della tabella "users" nel database.
 * I parametri da passare al costruttore sono gli attributi che caratterizzano un utente e che costituiscono una tubla nella tabella.
 * @param {string} username 
 * @param {string} password 
 * @param {string} name     
 * @param {string} surname  
 * @param {string} address  
 * @param {string} phone    
 */
function User(username, password, name, surname, address, phone) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.address = address;
    this.phone = phone;
};

/**
 * Metodo necessario per fare il login.
 * Il metodo controlla se l'utente corrispondente allo username inserito esiste e in tal caso se la password è corretta.
 * In caso affermativo verrà passato come parametro alla funzione di callback un oggetto User contenete le informazioni dell'utente appena autenticato.
 * In caso negativo il parametro sarà null.
 * Nel caso si sia verificato un errore durante la comunicazione con il database o durante l'esecuzione della query il parametro user sarà null.
 * Inoltre, verrà passato come parametro anche l'errore verificatosi.
 * 
 * @param {string}     username 
 * @param {string}     password 
 * @param {function}   callback - funzione di callback che deve accettare due parametri: err e user,
 *                              rispettivamente l'eventuale errore riscontrato e l'utente autenticato
 */
function authenticate(username, password, callback) {
    
    //connect to database
    pg.connect(
        //enviromental variable, set by heroku
        process.env.DATABASE_URL,
        function (err, client, done) {
            
            if(err){
                //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
                console.error(err);
                callback(err, null);
            }else{
                //nel caso la connessione sia andata a buon fine eseguiamo la query
                client.query(
                    "SELECT * FROM foodapp.users WHERE username = $1 AND password = $2 LIMIT 1",
                    [username, password],
                    function (err, result) {
                        //release the client back to the pool
                        done();
                        
                        var u = null;
                        
                        if (err) {
                            //in caso di errore lo stampiamo
                            console.error(err);
                        } else if (result.rows.length > 0) {
                            //nel caso sia stato trovato almeno un risultato, prendiamo il primo
                            //(N.B.: è garantito che ne possa esistere al massimo uno in quanto "username" è una chiave primaria) 
                            
                            var r = result.rows[0];
                            u = new User(r.username, r.password, r.name, r.surname, r.address, r.phone);
                        }
                        
                        //in ogni caso richiamiamo la funzione di callback passandogli l'eventuale errore verificato e l'eventuale utente trovato
                        callback(err, u);
                    }
                );
                
            }
            
        }
    );
}


/**
 * Metodo che permette di inserire un nuovo utente nel database.
 * Nel caso si sia verificato un errore durante la comunicazione con il database o l'esecuzione della insert verrà passato
 * come parametro alla funzione di callback l'errore verificatosi.
 * 
 * @param {User}       user     
 * @param {function}   callback  - funzione di callback che deve accettare un parametro: err, che conterrà l'eventuale errore riscontrato
 */
function insertUser(user, callback) {

    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if(err){
            //in caso di errore lo stampiamo e richiamiamo la funzione di callback passandogli l'errore verificato.
            console.error(err);
            callback(err);
        }else{
            //nel caso la connessione sia andata a buon fine eseguiamo la insert
            client.query(
                'INSERT INTO foodapp.users VALUES ($1, $2, $3, $4, $5, $6)', [user.username, user.password, user.name, user.surname, user.address, user.phone],
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


/**
 * Metodo che controlla se l'utente corrente è loggato e gestisce nel caso il reindirizzamento.
 * I parametri vengono impostati da express automaticamente. Per utilizzare questo metodo è sufficiente passarlo come parametro alla funzione
 * app.get/post/use per un determinato url.
 * 
 * @param {request    req      l'oggetto request di express
 * @param {response   res      l'oggetto response di express
 * @param {function}   next     metodo per passare alla route successiva
 */
function isLogged(req, res, next) {
    
    if(req.session && req.session.user != null){
        //se esiste l'attributo "user" nella sessione attuale, allora l'utente è loggato e si può procedere.
        next();
    }else{
        //in caso contrario l'utente viene reindirizzato alla pagina iniziale per fare l'accesso o la registrazione
        res.redirect('/start');
    }
}


/**
 * Metodo che controlla se l'utente corrente non è loggato e gestisce nel caso il reindirizzamento.
 * I parametri vengono impostati da express automaticamente. Per utilizzare questo metodo è sufficiente passarlo come parametro alla funzione
 * app.get/post/use per un determinato url.
 * 
 * @param {request    req      l'oggetto request di express
 * @param {response   res      l'oggetto response di express
 * @param {function}   next     metodo per passare alla route successiva
 */
function isNotLogged(req, res, next) {

    if(req.session && req.session.user != null){
        //se esiste l'attributo "user" nella sessione attuale, allora l'utente è loggato e quindi viene reindirizzato alla sua homepage
        res.redirect('/');
    }else{
        //in caso contrario può procedere
        next();
    }
}


//esportazione dei metodi fuori dal modulo

exports.User = User;

exports.authenticate = authenticate;
exports.insertUser = insertUser;
exports.isLogged = isLogged;
exports.isNotLogged = isNotLogged;
