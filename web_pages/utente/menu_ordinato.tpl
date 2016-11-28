<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css">
		
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Settimana</title>
	</head>
	<body>
		
		
		<div class="container col-md-4 col-md-offset-4" style = "background-color: lightcyan; text-align: center; padding: 0%">
			(:file ~ ./web_pages/utente/header.tpl:)
			(:file ~ ./web_pages/utente/menu_header.tpl:)
			
            <div class="jumbotron" style = "background-color: lightcyan; text-align: left; margin: 0px;">
				(: order ~
					[: first ~
						<div class="row">
							<h2>Primi</h2>
						</div>
						<div class="row">
							<div class="col-xs-6">
								<span><h3><i>{: name :}</i></h3></span> 
							</div>
							<div class="col-xs-6">
								<img src="{: photo :}" class="img-rounded" alt="{: name :}" width="150" height="90">
							</div>
						</div>
					
					:]
					[: second ~
						<div class="row">
							<h2>Secondi</h2>
						</div>
						<div class="row">
							<div class="col-xs-6">
								<span><h3><i>{: name :}</i></h3></span> 
							</div>
							<div class="col-xs-6">
								<img src="{: photo :}" class="img-rounded" alt="{: name :}" width="150" height="90">
							</div>
						</div>
					
					:]
					[: side ~
						<div class="row">
							<h2>Contorni</h2>
						</div>
						<div class="row">
							<div class="col-xs-6">
								<span><h3><i>{: name :}</i></h3></span> 
							</div>
							<div class="col-xs-6">
								<img src="{: photo :}" class="img-rounded" alt="{: name :}" width="150" height="90">
							</div>
						</div>
					
					:]
					

				:)
				<div class="row" style="padding: 5% 0%; margin-top: 5%">
                    <div class="col-md-6 col-md-offset-3">
                        <a href="#" class="btn btn-default" style="width: 100%; padding: 10%; margin: 0px; font-size:2em" >MODIFICA</a>
                        
                    </div>
                </div>
                
            </div>
        </div>

		
	</body>
</html>
