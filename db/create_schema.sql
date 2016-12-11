CREATE SCHEMA foodapp;

CREATE TYPE dish_type AS ENUM ('primo', 'secondo', 'contorno', 'dessert');
CREATE TYPE place_type AS ENUM ('mensa', 'domicilio');

CREATE TABLE foodapp.dishes	        (id		INTEGER,
					name		varchar(64),
					description	varchar(1024),
					recipe		varchar(8192),
					PRIMARY KEY (id));


CREATE TABLE foodapp.users	        (username	varchar(64),
					password	varchar(32) NOT NULL,
					name		varchar(32) NOT NULL,
					surname		varchar(32) NOT NULL,
					address		varchar(256),
					phone		varchar(16),
					PRIMARY KEY (username));

CREATE TABLE foodapp.orders	        (username	varchar(64) REFERENCES foodapp.users(username),
					date		date,
					first		INTEGER REFERENCES foodapp.dishes(id),
					second		INTEGER REFERENCES foodapp.dishes(id),
					side		INTEGER REFERENCES foodapp.dishes(id),
					dessert		INTEGER REFERENCES foodapp.dishes(id),
					place		place_type NOT NULL,
					PRIMARY KEY (username, date));

CREATE TABLE foodapp.menu		(date	date,
					dish	dish_type NOT NULL,
					suggested	BOOLEAN,
					dish_id	INTEGER NOT NULL REFERENCES foodapp.dishes(id),
					PRIMARY KEY (date, dish_id));


CREATE INDEX user_idx ON foodapp.users (username);
CREATE INDEX menu_idx ON foodapp.menu (date, dish, suggested, dish_id);


