
function User(id, username, password, name, surname, address){
	this.id = id;
	this.username = username;
	this.password = password;
	this.name = name;
	this.surname = surname;
	this.address = address;
};

var users = [
	new User(0, "gabri", "prova", "Gabriele", "Cesa", "via Benzoni, 36 Mantova")
];





function authenticate(username, password){
	var u = null;
	

	for(var i=0; i< users.length; i++){
		if(users[i].username == username && users[i].password == password){
			
			u = users[i]
			break;
		}
	}
	return u;
	
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
exports.isLogged = isLogged;
exports.authenticate = authenticate;

