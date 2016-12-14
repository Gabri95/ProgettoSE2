Progetto di Software Engineering 2 di Gabriele Cesa.


L'applicazione si può trovare al seguente indirizzo:

	https://stark-falls-43532.herokuapp.com/


Per lanciare, invece, l'applicazione in locale usare il seguente comando:

	DATABASE_URL=$(heroku config:get DATABASE_URL) node index.js

dopo aver impostato il parametro DATABASE_URL di heroku (sotto config) a:
	postgres://ebtwbubvxnygck:Ef6lKXjUliOyDPbAodCnfnxD0P@ec2-54-246-82-155.eu-west-1.compute.amazonaws.com:5432/dbpf7tc6imjv69

Anche per poter eseguire i test con jasmine sarà necessario specificare il DATABASE_URL come sopra. Pertanto, andrà lanciato il comando:
	DATABASE_URL=$(heroku config:get DATABASE_URL) node_modules/jasmine/bin/jasmine.js

È possibile trovare al seguente indirizzo il documento di code review insieme ai file ai quali si riferisce:
    https://drive.google.com/drive/folders/0B_rqFnxIXgjCdjZXVzdHY1N4eEk?usp=sharing
    
Gli utenti inseriti attualmente sono (username, password):

    - 'gabri', 'prova'
    - 'pinco', 'prova'
    - 'mario', 'password'
    