

//connect DB
var pg = require('pg');




function User(username, password, name, surname, address, phone, type, doctor){
	this.username = username;
	this.password = password;
	this.name = name;
	this.surname = surname;
	this.address = address;
    this.phone = phone;
    this.type = type;
    this.doctor = doctor;
};


function authenticate(username, password, callback){
    //connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
        if(err){
            console.log(err);
        }
		//query
		client.query("(SELECT *, 'user' as type FROM foodapp.users WHERE username = $1 AND password = $2 LIMIT 1) " + 
                    "UNION " + 
                    "(SELECT *, null as doctor, 'doctor' as type FROM foodapp.doctors WHERE username = $1 AND password = $2 LIMIT 1) ",
                     [username, password], 
                     function(err, result) {
			//release the client back to the pool
			done();
			var u = null;
			//manages err
			if (err){ 
				console.error(err); 
		  	} else if(result.rows.length > 0){
                var r = result.rows[0];
                u = new User(r.username, r.password, r.name, r.surname, r.address, r.phone, r.type, r.doctor);
		  	}
            
            callback(err, u);
            
            
            
		});
  	});
}

function insertUser(user, callback){
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		

		//add element
		client.query('INSERT INTO foodapp.users VALUES ($1, $2, $3, $4, $5, $6, $7)', [user.username, user.password, user.name, user.surname, user.address, user.phone, user.doctor], function(err, result) {
            done();
            if (err) { 
              console.error(err);
            }else {
              console.log(user + "inserted");
            }
            callback(err);
		});
  	}); 
}



function isLogged(req, res, next) {
	
	if (req.session && req.session.user != null ) {
		next();
	} else {
		res.redirect('/start');
	}
}

function isNotLogged(req, res, next) {
	
	if(req.session && req.session.user != null ) {
		res.redirect('/');
	} else {
		next();
	}
}


exports.User = User;

exports.authenticate = authenticate;
exports.insertUser = insertUser;
exports.isLogged = isLogged;
exports.isNotLogged = isNotLogged;

