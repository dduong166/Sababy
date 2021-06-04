<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Sababy</title>
        <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link rel="shortcut icon" href="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1611499902/latner-logo_d0ohbi.png" type="image/x-icon" /> 
        <script type="text/javascript">
            window.Laravel = {!! json_encode([
                'baseUrl' => url('/'),
                'csrfToken' => csrf_token(),
            ]) !!};
        </script>
        <script src="//widget.cloudinary.com/global/all.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="app"></div>
        <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ9plyaJ15PWpNBnrLd47SpeD3tiDWzwY&libraries=places&language=vi"></script>
    </body>
</html>