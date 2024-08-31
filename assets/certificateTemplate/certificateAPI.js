const Moment = require('moment');
module.exports = (data, checkListType, auditorName) => {
    // let current_date = Moment().format("MMM Do YY");
    const date = new Date()
    const current_date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    const updated_date = date.getDate() - 1;
    const updated_month = date.getMonth();
    const updated_year = date.getFullYear() + 1;
    const updated_complete_date = updated_date + "/" + updated_month + "/" + updated_year
    //    data.CertificateScope = data.ApplicationURL.replace( /(<([^>]+)>)/ig, '')
    console.log("data", data)
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
                <p class="main-header">Certificate of Web Service Audit</p>
    
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
                        <td scope="row" class="for_table_height p-0" width="30%"> In Scope URL :</td>
                    </tr>
                    <tr class="for_table_height">
                        <td class=" p-0">${data.CertificateDetails.ScopeDetails.CertificateScope}</td>
                    </tr>
                        <tr class="for_table_height">
                            <td scope="row" class="for_table_height p-0"> Main Hosting URL : </td>

                        </tr>
                        <tr class="for_table_height">
                            <td class=" p-0">${data.CertificateDetails.ScopeDetails.CertificateScope}</td>
                        </tr>
                           
                         
                            <tr class="for_table_height">
                                <td scope="row" class=" p-0" width="20%">Audit Type</td>
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
                <p class="content">Auditing for <strong>${data.CertificateDetails.AuditeeOrganizationDetails.OrganizationName}</strong> web service of
                <strong>${data.CertificateDetails.ScopeDetails.ScopeName}</strong> was done from <strong>${data.CertificateDetails.ProjectStartDate}</strong> to <strong>${data.CertificateDetails.ProjectEndDate}</strong> as per
                the CERT-In Audit guidelines, by Xiarch Solutions as per the scope. As on
                <strong>${current_date}</strong>, there are no pending nonconformity w.r.t Web Service Audit.
                 <br /><br />
                    The site is free from OWASP
                    (and any other Known) vulnerabilities and is safe for hosting.<br /><br />
                    The clearance for the above web service is given taking into consideration that the
                    OWASP (and any other Known) vulnerabilities do not exist in the web service. Any
                    unapproved changes to the web service will void the certificate.<br />
                    
                </p> 
                <p class="subHeader">Hosting Permission :</p>
                <p class="content">I. Site may be considered safe for hosting with Read and Script Execute permission only.
                    <br />
                </p>
                <div class="recommendationBox">
                    <p class="sub-subHeader">Recommendation : </p>
                    <p class="sub-content">I. Web Server Audit certificate, web server and OS level hardening need to be in
                        place for the production server before making the
                        application live.<br />
                        II. Website audit should be done at least once a year or when there is any change in the
                        application.<br />
                        III. No new web pages are to be added without proper security audit.<br />
                        IV. Server side issue should be taken care by hosting provider.<br /><br />
    
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
    
    </html>`
}