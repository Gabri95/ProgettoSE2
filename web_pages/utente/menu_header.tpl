<div class="container-fluid" id = "menu_header">
	<div class="row">
		<div class="col-xs-1" style="padding: 0px;">
			<a href="(: y_1 ~ /day?year=[: year :]&month=[: month :]&day=[: day :] :)"
			 class="navbar-brand" 
			 style="line-height: 100px; padding: 0px; float: none;">
				<span class="glyphicon glyphicon-chevron-left" style="font-size:1.5em; text-align: center;"/>
			</a>
		</div>
		(:y_2 ~
			<div class="col-xs-2" style="padding: 5px;">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]" 
						style="width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center;">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:y_1 ~
			<div class="col-xs-2" style="padding: 5px;">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]" 
						style="width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center;">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:day ~
			<div class="col-xs-2" style="padding: 0px;">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]" 
						style="width: 100%; padding: 10%; margin: 0px; font-size:2.2em; text-align: center;">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:t_1 ~
			<div class="col-xs-2" style="padding: 5px;">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]" 
						style="width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center;">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:t_2 ~
			<div class="col-xs-2" style="padding: 5px;">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]" 
						style="width: 100%; padding: 10%; margin-bottom: 10%;font-size:2em; text-align: center;">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		
		<div class="col-xs-1" style="padding: 0px;">
				<a href="(: t_1 ~ /day?year=[: year :]&month=[: month :]&day=[: day :] :)"
				 class="navbar-brand"
				 style="line-height: 100px; padding: 0px; float: none;">
					<span class="glyphicon glyphicon-chevron-right" style="font-size:1.5em; text-align: center;"/>
				</a>
		</div>
		
	</div>
</div>
