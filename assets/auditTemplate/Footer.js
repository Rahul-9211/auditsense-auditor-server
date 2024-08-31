module.exports = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>

    @font-face {
        font-family: "updated";
        src:  url("../../fonts/CedarvilleCursive-Regular.ttf") format('truetype');
        font-weight: 400;
        font-style: normal;
    }
    


        body {
            font-family: updated;
        }

        .footer {
            -webkit-print-color-adjust: exact;
            font-size: 10px;
            padding: 0 46px;
            margin: 15px 0;
            clear: both;
            position: relative;
            top: 20px;
            font-family:updated
        }

        .sub_footer {
            display: flex;
            justify-content: space-between;
            font-size: smaller;
            align-items: center;
            padding-bottom: 8px;
            padding-top: 20px;
        }

        .page_no {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer_text {
            font-weight: 100;
            line-height: 1.2;
            text-align: justify;
            font-size: smaller;
            padding-bottom: 12px;
        }
    </style>
</head>

<body>
    <div class="footer">
        <div>
            <div class="footer_body">
                <div class=" sub_footer pb-3">
                    <div class="client"> Private and Confidential</div>
                    <div class="Mobilesite">www.xiarch.com&nbsp;</div>
                    <div class="page_no">Page&nbsp;<div class='pageNumber'></div>
                    </div>
                </div>
                <div class="footer_text" style="font-family: updated !important;">
                    The information in this document has been classified as 'Confidential'. This classification applies
                    to the most sensitive business information. Its unauthorized disclosure could seriously and
                    adversely impact the owner, its stakeholders, its business partners, and/or its bolders leading to
                    legal and financial repercussions and adverse public opinion. </div>
            </div>
        </div>
    </div>
</body>

</html>`