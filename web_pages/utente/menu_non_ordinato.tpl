<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
        
        <link rel="stylesheet" href="/styles/style.css">
		
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Settimana</title>
	</head>
	<body>
		
		
		<div class="container col-md-4 col-md-offset-4">
			(:file ~ ./web_pages/utente/header.tpl:)
            (:file ~ ./web_pages/utente/menu_header.tpl:)
			
            
            
			
            <div class="container-fluid" id ="startView">
				
                <div class="row">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h2><i>Lo Chef consiglia...</i></h2>
                        </div>
                        <div class="panel-body">
                            
                            (: suggested ~
                                <div class ="row">
                                    <div class="col-xs-6">
                                        <span><h3><i>[: name :]</i></h3></span> 
                                    </div>
                                    <div class="col-xs-6">
                                        <img src="/photos/[: id :].jpg" class="img-rounded" alt="[: name :]" width="150" height="90">
                                    </div>
                                </div>

                            :)
                            
                        </div>
                        
                    </div>
                </div>
                
                <div class="row centeredButton">
                    <a href="(: day ~ /order?year=[: year :]&month=[: month :]&day=[: day :] :)" 
                       class="btn btn-default">
                        ORDINA
                    </a>
                </div>
            </div>
            
        </div>
	</body>
</html>