
//connect DB
var pg = require('pg');
function Dish(id, name, description){
	this.id = id;
	this.name = name;
	this.description = description;
}


function getDish(id, callback){
	//connect to database
	pg.connect(
		//enviromental variable, set by heroku when first databse is created
		process.env.DATABASE_URL, 
		function(err, client, done) {
		//query
		client.query('SELECT * FROM foodapp.dishes WHERE id = $1 LIMIT 1', [id], function(err, result) {
			//release the client back to the pool
			done();
			var dish = null;
			//manages err
			if (err){ 
				console.error(err); 
                
		  	} else if(result.rows.length > 0){
                var r = result.rows[0];
                
                dish = new Dish(id, r.name, r.description);
                
		  	}
            callback(err, dish);
            
		});
  	});
}





exports.Dish = Dish;

exports.getDish = getDish;

