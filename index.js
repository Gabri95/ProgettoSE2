//connect DB
var pg = require('pg');

//Impostata la variabile contente l'indirizzo online del database. Sono aggiunti i parametri necessari per poter permettere la connessione ad esso.
process.env.DATABASE_URL = process.env.DATABASE_URL + '?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';
console.log(process.env.DATABASE_URL);


//importazione dei moduli esterni necessari
var sessionManager = require("./sessionManager.js");
var menuManager = require("./menuManager.js");
var ordersManager = require("./ordersManager.js");
var utility = require('./utility.js');



//parse URL
var url = require('url');

var path = require('path');

//express lib
var express = require('express');

//for templates
var bind = require('bind');

//POST
var bodyParser = require('body-parser');

//Cross-Origin Resource Sharing (CORS), used for enabling pre-flight option
var cors = require('cors');

var cookieParser = require('cookie-parser');

var session = require('express-session');



//instantiate express
var app = express();


//impostazione dei parametri della sessione
app.use(session({
    secret: 'dn329rhjdwsd',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));




//Imposto la porta su cui il server ascolterà le richieste
app.set('port', (process.env.PORT || 5000));

//enable pre-flight authoriuzation
app.options('*', cors());




/**
 * Metodo che ritorna la frase da mostrare all'utente riguardo al luogo in cui ha scelto di mangiare nella visualizzazione del menu già ordinato.
 * @param   {string} place  luogo in cui l'utente ha scelto di mangiare
 * @returns {string}        frase da visualizzare
 */
function getPlacePhrase(place) {
    if (place == "" || place == null) {
        return "";
    } else if (place == 'mensa') {
        return "Il pasto ti aspetta alla mensa";
    } else {
        return "Il pasto ti arriverà a casa";
    }
}

/**
 * Ritorna gli header utilizzati in tutte le risposte che contengono un file html
 * @returns {object} l'header pronto da includere nella risposta
 */
function getHeaders() {

    var headers = {};
    //answer
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    headers["Content-Type"] = "text/html"; //format response

    return headers;
}

/**
 * Metodo che inserisce nella risposta la rappresentazione JSON dell'oggetto obj
 * @param {response} response la response di express
 * @param {Object}   obj      un qualunque oggetto da trasformare in JSON
 */
function returnJSON(response, obj) {
    var headers = {};
    //answer
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    headers["Content-Type"] = "application/json"; //format response

    //answer a JSON file
    var json = JSON.stringify(obj);
    
    response.writeHead(200, headers);
    response.end(json);
}

/**
 * Visualizza una pagina di errore in una risposta HTTP con codice 500
 * @param {response} response la response HTTP di express
 */
function errorPageInternalError(response){
    bind.toFile(
        'web_pages/message.tpl', {
            message: "C'è stato un errore nel server"
        },
        function (d) {
            
            response.writeHead(500, getHeaders());
            response.end(d);
        }
    );
}

/**
 * Visualizza una pagina di errore in una risposta HTTP con codice 200
 * @param {response} response la response HTTP di express
 */
function errorPageBadRequest(response){
    bind.toFile(
        'web_pages/message.tpl', {
            message: "Pagina non disponibile"
        },
        function (d) {
            var headers = {};
            //answer
            headers["Content-Type"] = "text/html";
            response.writeHead(400, getHeaders());
            response.end(d);
        }
    );
}



//Mappo la cartella contenente le pagine html ed i template su un percorso diverso per mascherare la struttura interna del server
app.use('/pages', express.static(__dirname + '/web_pages/'));
//Mappo la cartella contenente le immagini da mostrare nel client su un percorso diverso per mascherare la struttura interna del server
app.use('/photos', express.static(__dirname + '/photos/'));
//Mappo la cartella contenente gli scripts JS utilizzati nel client su un percorso diverso per mascherare la struttura interna del server
app.use('/scripts', express.static(__dirname + '/scripts/'));
//Mappo la cartella contenente gli stili css utilizzati nel client su un percorso diverso per mascherare la struttura interna del server
app.use('/styles', express.static(__dirname + '/styles/'));



/**
 * Logout.
 * Cancella la sessione e rimanda alla pagina di partenza.
 */
app.use('/logout', function (req, res) {
    delete req.session.user;
    req.session.destroy();
    res.redirect('/start');
});

/**
 * Pagina di partenza. Se non si è loggati si viene reindirizzati qua, dove si può scegliere se fare il login o la registrazione.
 */
app.use('/start', sessionManager.isNotLogged, function (req, res) {
    res.sendFile(path.join(__dirname + "/web_pages/start.html"));
});

/**
 * Login.
 * Si cerca di autenticare l'utente con le credenziali passate come parametro.
 * Nel caso l'utente venga autenticato, allora verrà reindirizzato nella homepage.
 * In caso contrario verrà reindirizzato ancora alla pagina di partenza.
 * Se si è verificato un errore, verrà reindirizzato alla pagina di errore.
 */
app.post('/login', sessionManager.isNotLogged, function (req, res) {

    var post = req.body;

    if (post != null) {
        //cerchiamo di autenticare l'utente
        sessionManager.authenticate(post.username, post.password, function (err, user) {
            if (err) {
                errorPageInternalError(response);
            } else if (user !== null) {
                req.session.user = user;

                res.redirect('/home');
            } else {
                res.redirect('/start');
            }
        });
    }else{
        errorPageBadRequest(response);
    }



});





/**
 * Creazione di un ordine.
 * Le infromazioni che descrivono l'ordine devono essere contenute nei parametri di get.
 * Se la data è specificata e valida, verrà inserito l'ordine.
 * 
 * Se si verifica un errore si sarà reindirizzati alla pagina di errore, altrimenti alla pagina corrispondente al giorno dell'ordine.
 */
app.get('/makeorder', sessionManager.isLogged, function (request, response) {

    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
    var url_parts = url.parse(request.url, true);
    //variabile che conterrà i parametri
    var getVar = url_parts.query;

    var year = getVar.year;
    var month = getVar.month;
    var day = getVar.day;

    var first = getVar.first;
    var second = getVar.second;
    var side = getVar.side;
    var dessert = getVar.dessert;
    var place = getVar.place;

    var date = new Date(parseInt(year), month - 1, day, 0, 0, 0, 0);

    //controllo se la data creata è valida (per sempio se il mese passato come parametro conteneva una stringa, il risultato non sarebbe stato valido)
    if (!utility.isValidDate(date)) {
        //in caso negativo mostro la pagina di errore
        errorPageBadRequest(response);
    } else {

        //cerco di inserire l'ordine nel database
        ordersManager.makeOrder(request.session.user.username, date, first, second, side, dessert, place, function (err) {

            if (err) {
                errorPageInternalError(response);
            } else {
                response.redirect('/day?year=' + year + '&month=' + month + '&day=' + day);
            }

        });
    }
});

/**
 * Pagina che visualizza la lista dei prossimi sette giorni.
 * 
 */
app.use('/week', sessionManager.isLogged, function (request, response) {

    ordersManager.getNearDays(request.session.user.username, new Date(), 0, 6, function (err, days) {

        if (err) {
            errorPageInternalError(response);
        } else {
            //Compilo e inserisco nella risposta il template
            bind.toFile(
                'web_pages/utente/settimana.tpl', {
                    days: days
                },
                function (d) {
                    //write response
                    response.writeHead(200, getHeaders());
                    response.end(d);
                }
            );
        }
    });


});



/**
 * Ritorna sotto forma di JSON la lista dei piatti della portata specificata nei parametri di GET nel menu del giorno specificato.
 */
app.get('/getdish', function (request, response) {
    var url_parts = url.parse(request.url, true);
    //variabile che conterrà i parametri
    var getVar = url_parts.query;

    var year = getVar.year;
    var month = getVar.month;
    var day = getVar.day;

    var dish = getVar.dish;


    var date = new Date(parseInt(year), month - 1, day, 0, 0, 0, 0);

    if (!utility.isValidDate(date) || dish == 'undefined' ||
        (dish != 'primo' && dish != 'secondo' && dish != 'contorno' && dish != 'dessert')) {
        //nel caso alcuni dei parametri non siano validi ritorniamo un oggetto con le liste vuote.
        returnJSON(response, {
            suggested: [],
            alternatives: []
        });
    } else {
        menuManager.getMenuDish(date, dish, function (err, menu) {

            returnJSON(response, menu);
        });
    }
});


/**
 * Pagina che visualizza le infromazioni relative ad un giorno.
 * In particolare mostra il menu consigliato se non è ancora stata fatta un'ordinazione.
 * In caso contrario, invece, mostra i piatti ordinati e dove è stato scelto di mangiare.
 */
app.get('/day', sessionManager.isLogged, function (request, response) {
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
    var url_parts = url.parse(request.url, true);
    //variabile che conterrà i parametri
    var getVar = url_parts.query;

    var year = getVar.year;
    var month = getVar.month;
    var day = getVar.day;



    var date = new Date(parseInt(year), month - 1, day, 0, 0, 0, 0);
    //controllo se la data creata è valida (per sempio se il mese passato come parametro conteneva una stringa, il risultato non sarebbe stato valido)
    if (!utility.isValidDate(date)) {
        errorPageBadRequest(response);
    } else {
        ordersManager.getNearDays(request.session.user.username, date, 2, 2, function (err, days) {
            if (err) {
                errorPageInternalError(response);
            } else {
                for (var i = 0; i < days.length; i++) {
                    days[i].name = days[i].name.slice(0, 3);
                }

                ordersManager.getOrder(request.session.user.username, date, function (err, order) {
                    if (err) {
                        errorPageInternalError(response);
                    } else {

                        if (order == null) {
                            //Se non è stato effettuato alcun ordine per questo giorno mostro i piatti consigliati

                            menuManager.getSuggestedMenu(date, function (err, menu) {

                                if (err || menu == null) {
                                    errorPageInternalError(response);
                                } else {
                                    //Compilo e inserisco nella risposta il template
                                    bind.toFile(
                                        'web_pages/utente/menu_non_ordinato.tpl', {
                                            y_2: days[0],
                                            y_1: days[1],
                                            day: days[2],
                                            t_1: days[3],
                                            t_2: days[4],
                                            suggested: menu,
                                            can_order: (utility.followingDay(new Date(), ordersManager.DAY_LIMIT) <= date)
                                        },
                                        function (d) {
                                            //write response
                                            response.writeHead(200, getHeaders());
                                            response.end(d);
                                        }
                                    );
                                }
                            });
                        } else {
                            //Se è stato effettuato un ordine per questo giorno, mostro i piatti ordinati

                            //Compilo e inserisco nella risposta il template
                            bind.toFile(
                                'web_pages/utente/menu_ordinato.tpl', {
                                    y_2: days[0],
                                    y_1: days[1],
                                    day: days[2],
                                    t_1: days[3],
                                    t_2: days[4],
                                    place_phrase: getPlacePhrase(order.place),
                                    order: order,
                                    can_order: (utility.followingDay(new Date(), ordersManager.DAY_LIMIT) <= date)
                                },
                                function (d) {
                                    //write response
                                    response.writeHead(200, getHeaders());
                                    response.end(d);
                                }
                            );

                        }
                    }
                });


            }

        });
    }

});



/**
 * Pagina per ordinare o modificare un'ordinazione
 */
app.get('/order', sessionManager.isLogged, function (request, response) {
    //Uso il modulo "url" per analizzare l'url della richiesta ed estrarne i parametri
    var url_parts = url.parse(request.url, true);
    //variabile che conterrà i parametri
    var getVar = url_parts.query;

    var year = getVar.year;
    var month = getVar.month;
    var day = getVar.day;

    var date = new Date(year, month - 1, day, 0, 0, 0, 0);

    //controllo se la data creata è valida (per sempio se il mese passato come parametro conteneva una stringa, il risultato non sarebbe stato valido)
    if (!utility.isValidDate(date)) {
        errorPageBadRequest(response);
    } else if (utility.followingDay(new Date(), ordersManager.DAY_LIMIT) > date) {
        //in tal caso non è più possibile modificare/inserire un'ordinazione
        bind.toFile(
            'web_pages/message.tpl', {
                message: "Non puoi più ordinare per questo giorno"
            },
            function (d) {
                //write response
                response.writeHead(200, getHeaders());
                response.end(d);
            }
        );

    } else {
        //cerco se esiste già un ordine per questo giorno
        //In tal caso nella pagina saranno evidenziate le scelte fatte in precedenza.
        //In caso contrario, l'oggetto order sarà null, e nessuna scelta sarà evidenziata
        ordersManager.getOrder(request.session.user.username, date, function (err, order) {
            if (err) {
                errorPageInternalError(response);
            } else {
                bind.toFile(
                    'web_pages/utente/menu_ordinare.tpl', {
                        order: order,
                        day: {
                            day: date.getDate(),
                            month: date.getMonth() + 1,
                            year: date.getFullYear(),
                            name: utility.toDayName(date.getDay())
                        }
                    },
                    function (d) {
                        //write response
                        response.writeHead(200, getHeaders());
                        response.end(d);
                    }
                );
            }
        });
    }

});


/**
 * Home page per l'utente normale
 */
app.use('/home', sessionManager.isLogged, function (request, response) {

    //Compilo e inserisco nella risposta il template
    bind.toFile(
        'web_pages/utente/home.tpl', {},
        function (d) {
            //write response
            response.writeHead(200, getHeaders());
            response.end(d);
        }
    );
});


app.use('/', function (request, response) {
    if (request.session && request.session.user != null) {
        response.redirect("/home");
    } else {
        response.redirect("/start");
    }
});



app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
