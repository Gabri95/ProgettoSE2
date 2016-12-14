<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css">
		
        <link rel="stylesheet" href="/styles/style.css">
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Menu</title>
	</head>
	<body>
		<div class="container col-md-4 col-md-offset-4">
			(:file ~ ./web_pages/utente/header.tpl:)
			(:file ~ ./web_pages/utente/menu_header.tpl:)
			
            <div class="container-fluid">
                <div class="row">
                    <div class="panel">
                        <div class="panel-heading">
                            <h2><i>(: place_phrase :)</i></h2>
                        </div>
                        <div class="panel-body">
                        (: order ~
                            [: first ~
                                <div class="row">
                                    <div class="col-xs-6">
                                        <span><h3><i>{: name :}</i></h3></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" title="{: name :}" width="150" height="90">
                                    </div>
                                </div>
                            :]
                            [: second ~
                                <div class="row">
                                    <div class="col-xs-6">
                                        <span><h3><i>{: name :}</i></h3></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}"  title="{: name :}" width="150" height="90">
                                    </div>
                                </div>
                            :]
                            [: side ~
                                <div class="row">
                                    <div class="col-xs-6">
                                        <span><h3><i>{: name :}</i></h3></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" title="{: name :}" width="150" height="90">
                                    </div>
                                </div>
                            :]
                            [: dessert ~
                                <div class="row">
                                    <div class="col-xs-6">
                                        <span><h3><i>{: name :}</i></h3></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" title="{: name :}" width="150" height="90">
                                    </div>
                                </div>
                            :]
                        :)
                        </div>
                    </div>
                </div>
                (: can_order ~ 
                    <div class="row centeredButton">
                        <a href="[: day ~ /order?year={: year :}&month={: month :}&day={: day :} :]" 
                           class="btn btn-default">
                            MODIFICA
                        </a>
                    </div>
                :)
                
            </div>
        </div>

		
	</body>
</html>
