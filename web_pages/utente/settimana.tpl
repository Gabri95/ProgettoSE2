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
            <div class="jumbotron" style = "background-color: lightcyan;">
				
				
				(:days ~
				
					<div class="row">
						<div class="col-md-10 col-md-offset-1">
								<a href="#" 
									class="btn [: class :]" 
									style=" width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center ">
										[: name :] [: day :]/[: month :]
								</a>
						</div>
					</div>
				
				:)
				
                
            </div>
        </div>

		
	</body>
</html>
