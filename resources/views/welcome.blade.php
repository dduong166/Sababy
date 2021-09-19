<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta property="description" content="Trao đổi sản phẩm mẹ và bé đã qua sử dụng"> 
        <meta property="og:description" content="Trao đổi sản phẩm mẹ và bé đã qua sử dụng" />
        <meta property="og:title" content="Trao đổi sản phẩm mẹ và bé đã qua sử dụng" />
        <meta property="og:image" content="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1613919232/27b6792e-38bd-471c-b46e-177a0e5a1af0_200x200_lb4mcd.png" />

        <title>Sababy</title>
        <link rel="stylesheet" type="text/css" href="/css/app.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link rel="shortcut icon" href="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1613919232/27b6792e-38bd-471c-b46e-177a0e5a1af0_200x200_lb4mcd.png" type="image/x-icon" /> 
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
        <script type="text/javascript" src="/js/app.js"></script>
        <script src="{{mix("js/manifest.js")}}"></script>
        <script src="{{mix("js/vendor.js")}}"></script>
    </body>
</html>
