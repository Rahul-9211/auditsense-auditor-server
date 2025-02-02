const encoded_img = require('../images/xiarch_logo_base64')

module.exports = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .header {
            -webkit-print-color-adjust: exact;
            display: flex;
            justify-content: end;
            text-align: end;
            width: 100%;
            padding: 0 46px;
            font-size: smaller;
        }

        .headerLogo {
            width: 100px;
        }

        .headerLogo img {
            width: 100%;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="headerLogo">
             <img src="data:image/svg+xml;base64,${encoded_img}" />

        </div>
    </div>
</body>

</html>
`