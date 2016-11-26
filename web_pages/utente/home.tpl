<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css">
		
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Home Utente</title>
	</head>
	<body>
		
		
		<div class="container col-md-4 col-md-offset-4" style = "background-color: lightcyan; text-align: center; padding: 0%">
			
			(:file ~ ./web_pages/utente/header.tpl:)
            <div class="jumbotron" style = "background-color: lightcyan;">
				
				
                <div class="row">
                    <div class="col-md-8 col-md-offset-2" style = " ">
                            <h1>Food App</h1>
                            <span><h3><i>get your food</i></h3></span> 
                    </div>
                </div>
                
                <div class="row" style="padding: 5% 0%; margin-top: 20%">
                    <div class="col-md-8 col-md-offset-2">
                        <a href="/week" class="btn btn-default" style=" width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center ">Ordina</a>
                        
                    </div>
                </div>
            </div>
        </div>

		
		<!-- Inclusione dello script JavaScript che implementa le funzionalità necessarie al funzionamento della pagina-->
		<script src = "/scripts/script.js" type = "text/javascript"></script>

	</body>
</html>
