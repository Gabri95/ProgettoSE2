<div class="container-fluid" id = "menu_header">
	<div class="row">
		<div class="col-xs-1 col-md-1 arrow">
			<a href="(: y_1 ~ /day?year=[: year :]&month=[: month :]&day=[: day :] :)"
			 class="navbar-brand">
				<span class="glyphicon glyphicon-chevron-left"/>
			</a>
		</div>
		(:y_2 ~
			<div class="col-xs-2 col-md-2 day">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:y_1 ~
			<div class="col-xs-2 col-md-2 day">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:day ~
			<div class="col-xs-2 col-md-2 today">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:t_1 ~
			<div class="col-xs-2 col-md-2 day">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		(:t_2 ~
			<div class="col-xs-2 col-md-2 day">
					<a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" 
						class="btn [: class :]">
							[: name :]<br>[: day :]/[: month :]
					</a>
			</div>
		:)
		
		<div class="col-xs-1 col-md-1 arrow">
				<a href="(: t_1 ~ /day?year=[: year :]&month=[: month :]&day=[: day :] :)"
				 class="navbar-brand">
					<span class="glyphicon glyphicon-chevron-right"/>
				</a>
		</div>
		
	</div>
</div>
