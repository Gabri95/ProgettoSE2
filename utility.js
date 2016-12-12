/**
 * Funzione che controlla se la stringa "str" può rappresentare un intero non negativo (un numero naturale)
 * utilizzando le Espressioni Regolari
 * 
 * @param   {string}  str stringa di cui controllare il contenuto
 * @returns {boolean} un valore booleano che indica se la stringa è o meno un numero naturale
 */
function checkIfNormalInteger(str) {
    return /^\d+$/.test(str);
}


//array contenente i nomi dei giorni della settimana
var days_name = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

/**
 * Metodo che ritorna il noem del giorno della settimana corrispondente al numero del giorno passato come parametro.
 * Si noti che la numerazione va da 0 a 6 e i giorni sono contati a partire da Domenica (perciò 0 -> 'domenica', 1 -> 'lunedì', ecc...).
 * 
 * Se l'intero passato non appartiene all'insieme [0, 6], viene restituita una stringa vuota.
 * 
 * @param   {integer} day_number intero tra 0 e 6 che indica il giorno all'interno della settimana
 * @returns {string}  nome del giorno corrispondente
 */
function toDayName(day_number) {
    if (day_number < 0 || day_number > 6) {
        //se il numero non è valido restituisco una stringa vuota
        return "";
    } else {
        //altrimenti restituisco il nome corrispondente, salvato dentro l'array "days_name"
        return days_name[day_number];
    }
}

/**
 * Metodo che dato un giorno, ne calcola l'n-esimo giorno successivo
 * @param   {Date}    day data di partenza
 * @param   {integer} n   giorni di differenza tra il giorno che si vuole ottenere e la data di partenza
 * @returns {Date}    la data calcolata
 */
function followingDay(day, n) {

    var date = new Date(day);
    date.setDate(day.getDate() + n);

    return date;
}

/**
 * Metodo che dato un giorno, ne calcola l'n-esimo giorno precedente
 * @param   {Date}    day data di partenza
 * @param   {integer} n   giorni di differenza tra la data di partenza e il giorno che si vuole ottenere
 * @returns {Date}    la data calcolata
 */
function previousDay(day, n) {

    var date = new Date(day);
    date.setDate(day.getDate() - n);
    return date;
}

/**
 * Funzione che aggiunte eventualmente gli zero di padding a sinistra di un numero di una sola cifra per matchare il formato "NN"
 * @param   {string} d stringa rappresentante un naturale di 1 o 2 cifre
 * @returns {string} il numero in formato NN
 */
function zeroPad(d) {
    return ("0" + d).slice(-2);
}

/**
 * Metodo che converte un oggetto Date di javascript nel formato postgreSql "YYYY-MM-DD"
 * @param   {Date}   date data che si vuole convertire
 * @returns {string} data convertita in formato "YYYY-MM-DD"
 */
function pgFormatDate(date) {
    var parsed = new Date(date);
    return [parsed.getFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");
}

/**
 * Metodo che controlla se l'oggetto Date passato contiene una data valida (se per esempio non è una 'Invalid Date')
 * @param   {Date}    date l'oggetto Date da controllare
 * @returns {boolean} se è valido o meno
 */
function isValidDate(date) {
    return (date != null && !isNaN(date.getTime()));
}




exports.toDayName = toDayName;
exports.checkIfNormalInteger = checkIfNormalInteger;
exports.followingDay = followingDay;
exports.previousDay = previousDay;
exports.pgFormatDate = pgFormatDate;
exports.isValidDate = isValidDate;
