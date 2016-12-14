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

        <div class="container col-xs-4 col-xs-offset-4 col-xs-4 col-xs-offset-4">

            (:file ~ ./web_pages/utente/header.tpl:)
            <div class="jumbotron week">
                (:days ~
                    <div class="row">
                        <div class="day col-xs-12 col-md-12">
                            <a href="/day?year=[: year :]&month=[: month :]&day=[: day :]" class="btn [: class :]">
                                    [: name :] [: day :]/[: month :]
                            </a>
                        </div>
                    </div>
                :)
            </div>
        </div>
    </body>
</html>
