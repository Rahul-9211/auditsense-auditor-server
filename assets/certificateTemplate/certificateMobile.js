const Moment = require('moment');
module.exports = (data, checkListType, auditorName) => {
    // let current_date = Moment().format("MMM Do YY");
    console.log("data", data)
    const date = new Date()
    const current_date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    const updated_date = date.getDate() - 1;
    const updated_month = date.getMonth();
    const updated_year = date.getFullYear() + 1;
    const updated_complete_date = updated_date + "/" + updated_month + "/" + updated_year
    //    data.ScopeName = data.ScopeName.replace( /(<([^>]+)>)/ig, '')
    console.log("path", data)
    // data = data[0]
    return `<!doctype html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
    
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Didact+Gothic&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&family=Questrial&display=swap"
        rel="stylesheet">
    
        <style>

            body {
                font-family: 'Mulish',' sans-serif';
                background: url("${process.env.AUDITOR_API_URI}/images/mainBG.jpg") no-repeat ;
                height : 100%;
            }
    
    
            .mainBox {
                /* background-color: rgb(233, 233, 233); */
                /* padding: 10px; */
            }
    
            .invoice-box {
                /* height: 100vh; */
                max-width: 800px;
                padding: 50px;
                /* border: 1px solid #eee; */
                /* box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px; */
                font-size: 16px;
                line-height: 24px;
                color: #555;
                /* background: url(../Xiarch\ logo\ \ testing\ new\ .svg); */
                /* filter:alpha(opacity=60); */
            }
    
            /* .invoice-box::before {
                content: "";
                position: absolute;
                height: 200px;
                top: 50%;
                width: 500px;
                left: 38%;
                opacity: 0.1;
                background: url(../../images/Xiarch_logo_png.png);
                transform: rotate(-20deg);
                background-repeat: repeat;
            }
    
            .invoice-box::after {
                content: "";
                position: absolute;
                transform: rotate(-20deg);
                height: 200px;
                top: 10%;
                width: 500px;
                left: 38%;
                opacity: 0.1;
                background: url(../../images/Xiarch_logo_png.png);
                background-repeat: repeat;
            } */
    
            @media only screen and (max-width: 600px) {
                .invoice-box table tr.top table td {
                    width: 100%;
                    display: block;
                    text-align: center;
                }
    
                .invoice-box table tr.information table td {
                    width: 100%;
                    display: block;
                    text-align: center;
                }
            }
    
            .logo_Date {
                display: flex;
                justify-content: space-between;
            }
    
            .logo_Date .logo {
                width: 210px;
                height: 80px;
            }
    
            .logo_Date .logo img {
                width: 100%;
                height: 100%;
            }
    
    
            .main-header {
                font-weight: 700;
                font-family: 'Charm', cursive;
                font-weight: 100;
                padding-top: 60px;
                text-align: center;
                font-size: 42px;
                /* line-height: -10px; */
                word-spacing: 9px;
                letter-spacing: 1px;
                padding-bottom: 20px;
                color: black;
            }
    
            .subHeader {
                margin-top: 20px;
                font-weight: 700;
                letter-spacing: -1px;
                font-size: 19px;
    
                text-align: start;
                color: rgb(88 8 8);
            }
    
            .content {
                line-height: 1.1em;
                font-weight: 500;
                font-family: 'Mulish',' sans-serif';
                color: rgb(0, 0, 0);
            }
    
            .sub-subHeader {
                font-weight: 900;
                font-size: 11px;
                text-align: start;
                color:rgb(88 8 8);
                margin-bottom: 3px;
            }
    
            .sub-content {
                font-size: 10px;
                font-weight: 500;
                line-height: 1.3em;
                color: rgb(0, 0, 0);
            }
    
            .recommendationBox {
                border: 2px solid black;
                padding: 7px;
            }
    
            .validDate,
            .issueDate {
                border: none !important;
                outline: none !important;
                cursor: pointer;
    
                font-size: 89px;
            }
    
            input:focus {
                outline: none !important;
            }
    
            .table_content_size {
                font-size: 14px;
                font-weight: 700;
                height: 14px !important;
            }
    
            .for_table_height {
                height: 20px !important;
                line-height: 1.1em;
            }
    
            /* .date {
                font-weight: 700;
                font-size: 98px !important; 
                color: black;
            } */
            .stamp {
                height: 160px !important;
                padding-bottom: 59px;
                margin-top: -20px;
            }
    
            .qr {
                height: 160px !important;
                margin-top: 10px;
            }
            .eSign{
                width: 300px !important;
    
            }
        </style>
    </head>
    
    <body>
        <div class="mainBox">
    
            <div class="invoice-box">   
                
                <div class="logo_Date row">
                    <div class="logo col-5">
                        <img src="${process.env.AUDITOR_API_URI}/images/Xiarch_logo2.png" alt="">
                    </div>
                    <div class="date col-5">
                        <table class="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row" class="table_content_size p-0">Certificate Serial</th>
                                    <td class="table_content_size p-0">:</td>
                                    <td class="table_content_size p-0 ps-2">${data.CertificateID}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="table_content_size p-0">Certificate Issuing Date</th>
                                    <td class="table_content_size p-0">:</td>
                                    <td class="table_content_size p-0 ps-2">${current_date}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="table_content_size p-0">Valid Till</th>
                                    <td class="table_content_size p-0">:</td>
                                    <td class="table_content_size p-0 ps-2">${updated_complete_date}</td>
                                </tr>
                            </tbody>
                        </table>
    
                    </div>
                </div>
                <p class="main-header">Certificate of Mobile Application Audit</p>
    
                <p class="subHeader">For : ${data.CertificateDetails.AuditeeOrganizationDetails.OrganizationName}
                </p>
                <!-- <p class="content"> In Scope URL : http://10.153.15.173/Home/CitizenPage/ <br />
                              Main URL Hosting : http://omms.nic.in<br />
                              Scope of Audit : Web Application<br />
                              Auditor Name : ${auditorName}<br />
                              Audit Dates : 16/11/2020 to 31/12/2020
                          </p> -->
                <div class="for">
                    <table class="table table-borderless">
                        <tbody>
                     
                        <tr class="for_table_height">
                            <td scope="row" class="for_table_height p-0"> In Scope Application : </td>

                        </tr>
                        <tr class="for_table_height">
                            <td class=" p-0">${data.CertificateDetails.ScopeDetails.ScopeName}</td>
                        </tr>
                           
                         
                            <tr class="for_table_height">
                                <td scope="row" class=" p-0" width="30%">Audit Type</td>
                                <td class=" p-0">:</td>
                                <td class=" p-0 ps-2">API & Web Service Audit</td>
                            </tr>
                            <tr class="for_table_height">
                                <td scope="row" class=" p-0">Auditor Name</td>
                                <td class=" p-0">:</td>
                                <td class=" p-0 ps-2"> ${auditorName}</td>
                            </tr>
                            <tr class="for_table_height">
                                <td scope="row" class=" p-0">Audit Dates</td>
                                <td class=" p-0">:</td>
                                <td class=" p-0 ps-2">${data.CertificateDetails.ProjectStartDate} to ${data.CertificateDetails.ProjectEndDate}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    
                <p class="subHeader">Conclusion : </p>
                <p class="content">Auditing for <strong>${data.CertificateDetails.AuditeeOrganizationDetails.OrganizationName}</strong> mobile application of
                <strong>${data.CertificateDetails.ScopeDetails.ScopeName}</strong> was done from <strong>${data.CertificateDetails.ProjectStartDate}</strong> to <strong>${data.CertificateDetails.ProjectEndDate}</strong> as per
                the CERT-In Mobile Application Audit guidelines, by Xiarch Solutions as per the scope. As on
                <strong>${current_date}</strong>, there are no pending nonconformity w.r.t mobile application Audit.
                 <br /><br />
                    The mobile application is free from OWASP
                    Mobile Security Project  (and any other Known) vulnerabilities and is safe for hosting.<br /><br />
                    The clearance for the above mobile application is given taking into consideration that the
                    OWASP Mobile Security Project (and any other Known) vulnerabilities do not exist in the mobile application. Any
                    unapproved changes to the mobile application will void the certificate.<br />
                    
                </p> 
                
                <div class="recommendationBox">
                    <p class="sub-subHeader">Recommendation : </p>
                    <p class="sub-content">I. Mobile Application audit should be done at least once a year or when there is any change in the application.<br />
                        II. No new functionalities are to be added without proper security audit.<br />
                        III. No new web pages are to be added without proper security audit.<br />
                        IV. Mobile Application backend server audit certificate should be in place.<br /><br />
    
                    </p>
                </div>
    
               <div class="logo_Date row ">
                    <div class="logo stamp">
                        <img src="${process.env.AUDITOR_API_URI}/assets/images/xiarch_e-sign.png" class="eSign" alt="">
                        <img src="${process.env.AUDITOR_API_URI}/assets/images/stamp.png" alt="">
                    </div>
                 <!--   <div class="logo qr col-8">
                        <img src="${process.env.AUDITOR_API_URI}/assets/images/qr.png" alt="">
                    </div> -->
                </div> 
            </div>
        </div>
    </body>
    <script>
    
    const canvas = document.getElementById("chart");
    var ctx = canvas.getContext("2d");
    
    // Define the data for the bar graph
    var data = [2,2,2,2,9];
    
    // Define the size of the bars and the gap between them
    var barWidth = 50;
    var barGap = 10;
    var barMargin = 5; // Specify the margin between bars
    
    // Define the starting position of the bars
    var xPos = 70;
    var yPos = 320;
    
    // Define an array of colors to use for each bar
    var colors = ['#ff0000', '#dc3545', '#ffc107', '#198754', '#0dcaf0'];
    
    // Find the maximum value in the data
    var maxData = Math.max.apply(null, data);
    
    // Calculate the scaling factor for the data
    var scale = 0;
    var yInterval = Math.ceil(maxData / 5);
    if (maxData > 0) {
      scale = 250 / maxData;
      // Calculate the y-axis interval difference
      while (maxData % yInterval != 0) {
        yInterval--;
      }
    }
    
    // Draw the y-axis
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(60, 320);
    ctx.strokeStyle = "grey";
    ctx.stroke();
    
    // Draw the arrow design at the end of the y-axis
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(55, 30);
    ctx.lineTo(65, 30);
    ctx.closePath();
    ctx.fillStyle = "grey";
    ctx.fill();
    
    // Draw the x-axis with arrowheads
    ctx.beginPath();
    ctx.moveTo(60, 320);
    ctx.lineTo(410, 320);
    ctx.strokeStyle = "grey";
    ctx.stroke();
    
    // Draw the arrowhead on the right side of the x-axis
    ctx.beginPath();
    ctx.moveTo(410, 320);
    ctx.lineTo(400, 315);
    ctx.lineTo(400, 325);
    ctx.closePath();
    ctx.fillStyle = "grey";
    ctx.fill();
    
    // Draw the value labels for the y-axis
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    if (maxData > 0) {
      for (var i = 1; i <= maxData / yInterval; i++) {
        ctx.fillText(i * yInterval, 55, yPos - i * yInterval * scale);
      }
    }
    ctx.fillText("0", 55, 320);
    
    // Define the labels for the x-axis
    var categories = ['Critical', 'High', 'Medium', 'Low', 'Info.'];
    
    // Draw the labels for the x-axis
    ctx.font = "14px Arial bold";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    for (var i = 0; i < categories.length; i++) {
      ctx.fillStyle = "white";
      ctx.fillRect(xPos, 325, barWidth, 20);
      ctx.fillStyle = "black";
      ctx.fillText(categories[i], xPos + barWidth / 2, 340);
      xPos += barWidth + barGap;
    }
    
    // Loop through the data and draw each bar with a cubical 3D effect
    xPos = 70;
    for (var i = 0; i < data.length; i++) {
      var barHeight = data[i] * scale;
      // Draw the front face of the bar
    ctx.fillStyle = colors[i];
    ctx.fillRect(xPos + barMargin, yPos - barHeight, barWidth - barMargin * 2, barHeight);
    
    // Draw the top face of the bar
    ctx.beginPath();
    ctx.moveTo(xPos + barMargin, yPos - barHeight);
    ctx.lineTo(xPos + barMargin + 10, yPos - barHeight - 10);
    ctx.lineTo(xPos + barWidth - barMargin + 15, yPos - barHeight - 10);
    ctx.lineTo(xPos + barWidth - barMargin, yPos - barHeight);
    ctx.closePath();
    ctx.fillStyle = shadeColor(colors[i], -20);
    ctx.fill();
    
    // Draw the right face of the bar
    ctx.beginPath();
    ctx.moveTo(xPos + barWidth - barMargin, yPos - barHeight);
    ctx.lineTo(xPos + barWidth + 10, yPos - barHeight - 10);
    ctx.lineTo(xPos + barWidth + 10, yPos - 10);
    ctx.lineTo(xPos + barWidth - barMargin, yPos);
    ctx.closePath();
    ctx.fillStyle = shadeColor(colors[i], -30);
    ctx.fill();
    
    // Draw the value label for this bar
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(data[i], xPos + barWidth / 2, yPos - barHeight - 5);
    
    xPos += barWidth + barGap;
    }
    
    // Function to shade a color
    function shadeColor(color, percent) {
    var num = parseInt(color.slice(1), 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var B = (num >> 8 & 0x00FF) + amt;
    var G = (num & 0x0000FF) + amt;
    return "#" + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 +
    (G < 255 ? G < 1 ? 0 : G : 255)
    ).toString(16).slice(1);
    }
    
    </script>
    
    </html>`
}