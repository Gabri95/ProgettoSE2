<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css">
        
        <link rel="stylesheet" href="/styles/style.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<title>Settimana</title>
	</head>
	<body>
		
		
		<div class="container col-md-4 col-md-offset-4">
			(:file ~ ./web_pages/utente/header.tpl:)
			
            <div class="panel dishesView">
                <div class="panel-heading">
                    (: day ~
                        <h2>[: name :] [: day :]/[: month :]</h2>
                    :)
                </div>
                
                <div class="panel-body choice_list">
                    <div class="col-xs-3 ordine" id="primo_choice">
                        <div class="tumbnail">
                            <img src="" class="img-rounded" alt="" title="">
                            <span class="badge">Primo</span>
                        </div>
                    </div>
                    <div class="col-xs-3 ordine" id="secondo_choice">
                        <div class="tumbnail">
                            <img src="" class="img-rounded" alt="" title="">
                            <span class="badge">Secondo</span>
                        </div>
                    </div>
                    <div class="col-xs-3 ordine" id="contorno_choice">
                        <div class="tumbnail">
                            <img src="" class="img-rounded" alt="" title="">
                            <span class="badge">Contorno</span>
                        </div>
                    </div>
                    <div class="col-xs-3 ordine" id="dessert_choice">
                        <div class="tumbnail">
                            <img src="" class="img-rounded" alt="" title="">
                            <span class="badge">Dessert</span>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="container-fluid dishesView">
				
                <div class="row">
                    <div class="panel" id="menu">
                        <div class="panel-heading">
                            <h2 id="dishTitle"></h2>
                        </div>

                        <div class="panel-body" id = "suggestedDishes">
                            
                            
                        </div>

                        <div class="panel-heading alternativa">
                            <h2>In Alternativa</h2>
                        </div>

                        <div class="panel-body alternativa" id = "alternativeDishes">
                            
                        </div>
                    </div>
                </div>
                <div class="row centeredButton">
                    <button type="button"
                           class="btn btn-default"
                           id="orderButton">
                        Conferma Scelta
                    </button>
                </div>
            </div>
            
            
            <div class="container-fluid" id ="resumeView">
                <div class="row">
                    <div class="panel">
                        <div class="panel-heading">
                            <h2><i>La tua ordinazione</i></h2>
                        </div>
                        <div class="panel-body" id="resumeDishes">
                            
                        </div>
                        
                    </div>
                </div>
                <div class="row">
                    <h2>Dove preferisci mangiare?</h2>
                </div>
                <div class="row">
                    <div class="col-xs-6">
                        <button type="button" class="btn btn-default placeBtn" id="domicilio">Domicilio</button>
                    </div>
                    <div class="col-xs-6">
                        <button type="button" class="btn btn-default placeBtn" id="mensa">Mensa</button>
                    </div>
                </div>
                <div class="row centeredButton">
                    <form method='GET' action="/makeorder">
                        <input type="hidden" id="luogo" name="place" value="domicilio">
                        <input type="hidden" id="primo" name="first">
                        <input type="hidden" id="secondo" name="second">
                        <input type="hidden" id="contorno" name="side">
                        <input type="hidden" id="dessert" name="dessert">
                        (: day ~
                            <input type="hidden" name="day" value="[: day :]">
                            <input type="hidden" name="month" value="[: month :]">
                            <input type="hidden" name="year" value="[: year :]">
                        :)
                        
                        
                        <button type="submit" 
                               class="btn btn-default"
                               id="completeButton">
                            Conferma Ordine
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        
        <!-- Inclusione dello script JavaScript che implementa le funzionalità necessarie al funzionamento della pagina-->
		<script src = "/scripts/order.js" type = "text/javascript"></script>
        
        (: day ~
            <script>   
                setDate('[: day :]', '[: month :]', '[: year :]');
            </script>
        :)
        (: order ~
            <script>
                setOrder(
                    new Dish('[: first ~ {: id :} :]', '[: first ~ {: name :} :]'),
                    new Dish('[: second ~ {: id :} :]', '[: second ~ {: name :} :]'),
                    new Dish('[: side ~ {: id :} :]', '[: side ~ {: name :} :]'),
                    new Dish('[: dessert ~ {: id :} :]', '[: dessert ~ {: name :} :]'),
                    '[: place :]'
                );
            </script>
        :)
        
	</body>
</html>