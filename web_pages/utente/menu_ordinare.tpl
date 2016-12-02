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
			
            <div class="jumbotron" style = "background-color: lightcyan; text-align: left; margin: 0px; padding-top: 0px">
				<form method="GET" action ="/order">
					
					<script>
						function changePlace(){
							var btn = document.getElementById("place_button");
                            var inp = document.getElementById("place");
                            
							var content = btn.innerHTML;
							
							switch(content){
								case "domicilio":
									btn.innerHTML = "mensa";
                                    inp.value = "mensa";
									break;
								default:
									btn.innerHTML = "domicilio";
                                    inp.value = "domicilio";
									break;
							}
						}
					</script>
					
					<div class="row">
						<div class="col-xs-2 col-xs-offset-10">
							<button type = "button" class="btn btn-default" id = "place_button" onclick="changePlace();">(: place ~ domicilio :)</button>
						</div>
					</div>
					
                    <input type="hidden" name="place" id="place" value='(: place ~ domicilio :)'>
					(: day ~
                        <input type="hidden" name="year" id="year" value="[: year :]">
                        <input type="hidden" name="month" id="month" value="[: month :]">
                        <input type="hidden" name="day" id="day" value="[: day :]">
                    :)
                    
                    <script>
                        function setChoice(dish, choice_id){
                            
                            
                            
                            var labels = document.getElementsByName(dish + "_dish");
                            for(var i =0; i<labels.length; i++){
                                labels[i].style.color = 'black';
                            }
                            
                            var d = document.getElementById(dish);
                            console.log(dish + "; " + choice_id + "; " + d.value);
                            if(choice_id != d.value || d.value == ''){
                                d.value = choice_id;
                                
                                var label = document.getElementById("dish" + choice_id);
                                label.style.color = 'red';
                            }else{
                                d.value = '';
                            }
                            
                        }
                    </script>
                    
					(: menu ~
                    
                        
						<div class="row">
							<h2 style="margin-top: 0px">Primi</h2>
						</div>
                        <input type="hidden" name="first" id ="first" value="[: first_ordered :]">
						[: firsts ~
							<div class="row">
								<div class="col-xs-6">
									<span style="{: ordered ~ color: red :}" name = "first_dish" id ="dish{: id :}" onclick="setChoice('first', {: id :});">
                                        <i>{: name :}</i>
                                    </span>
								</div>
								<div class="col-xs-6">
									<img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" width="150" height="90">
								</div>
							</div>
						
						:]
						<div class="row">
							<h2>Secondi</h2>
						</div>
                        <input type="hidden" name="second" id ="second" value="[: second_ordered :]">
						[: seconds ~
							<div class="row">
								<div class="col-xs-6">
									<span style="{: ordered ~ color: red :}" name = "second_dish" id ="dish{: id :}" onclick="setChoice('second', {: id :});">
                                        <i>{: name :}</i>
                                    </span>
								</div>
								<div class="col-xs-6">
									<img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" width="150" height="90">
								</div>
							</div>
						
						:]
						<div class="row">
							<h2>Contorni</h2>
						</div>
                        <input type="hidden" name="side" id ="side" value="[: side_ordered :]">
						[: sides ~
							<div class="row">
								<div class="col-xs-6">
									<span style="{: ordered ~ color: red :}" name = "side_dish" id ="dish{: id :}" onclick="setChoice('side', {: id :});">
                                        <i>{: name :}</i>
                                    </span>
								</div>
								<div class="col-xs-6">
									<img src="/photos/{: id :}.jpg" class="img-rounded" alt="{: name :}" width="150" height="90">
								</div>
							</div>
						
						:]
						

					:)
					<div class="row" style="padding: 5% 0%; margin-top: 5%">
						<div class="col-md-6 col-md-offset-3">
							<input type="submit" class="btn btn-default" style="width: 100%; padding: 10%; margin: 0px; font-size:2em" value="ORDINA">
							
						</div>
					</div>
				</form>                
            </div>
        </div>

		
	</body>
</html>