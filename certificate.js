module.exports = (data) => {
//    data.ApplicationURL = data.ApplicationURL.replace( /(<([^>]+)>)/ig, '')
//    console.log("path", data)
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
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
      
          <style>
               body {
          font-family: 'Open Sans', sans-serif;
      }
      
      
              .mainBox {
                  /* background-color: rgb(233, 233, 233); */
                  padding: 10px;
              }
      
              .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  /* height: 100vh; */
                  padding: 30px;
                  border: 1px solid #eee;
                  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
                  font-size: 16px;
                  line-height: 24px;
                  color: #555;
                  /* background: url(../Xiarch\ logo\ \ testing\ new\ .svg); */
                  /* filter:alpha(opacity=60); */
              }
      
              .invoice-box::before {
                  content: "";
                  position: absolute;
                  height: 200px;
                  top: 50%;
                  width: 500px;
                  left: 38%;
                  opacity: 0.1;
                  background: url(../assets/logo.svg);
                  background-position: center;
                  background-repeat: no-repeat;
              }
      
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
      
              .date {
                  font-weight: 900;
                  font-size: 16px;
                  color: black;
              }
      
              .main-header {
                  font-weight: 700;
                  margin-top: 30px;
                  text-align: center;
                  font-size: 32px;
                  color: black;
                  text-shadow: 1px 1px 1px #aaa;
              }
      
              .subHeader {
                  margin-top: 20px;
                  font-weight: 900;
                  font-size: 15px;
                  text-align: start;
                  color: rgb(136, 1, 1);
              }
      
              .content {
                  font-weight: 500;
                  color: rgb(0, 0, 0);
              }
      
              .sub-subHeader {
                  font-weight: 900;
                  font-size: 11px;
                  text-align: start;
                  color: rgb(136, 1, 1);
                  margin-bottom: 3px;
              }
      
              .sub-content {
                  font-size: 10px;
                  font-weight: 500;
                  line-height: 1.6;
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
                  font-size: 12px;
                  font-weight: 900;
                  height: 14px !important;
              }
              .for_table_height{
               height: 20px !important;
              }
          </style>
      </head>
      
      <body>
          <div class="mainBox">
      
              <div class="invoice-box">
                  <div class="logo_Date row">
                      <div class="logo col-8">
                          <img src="${process.env.AUDITOR_API_URI}/images/Xiarch_logo_png.png" alt="">
                      </div>
                      <div class="date col-4">
                          <table class="table table-borderless">
                              <tbody>
                                  <tr>
                                      <th scope="row" class="table_content_size p-0" width="55%">Serial</th>
                                      <td class="table_content_size p-0">:</td>
                                      <td class="table_content_size p-0 ps-2">2019/T10441</td>
                                  </tr>
                                  <tr>
                                      <th scope="row" class="table_content_size p-0">Issuing Date</th>
                                      <td class="table_content_size p-0">:</td>
                                      <td class="table_content_size p-0 ps-2">17/05/2019</td>
                                  </tr>
                                  <tr>
                                      <th scope="row" class="table_content_size p-0">Valid Till</th>
                                      <td class="table_content_size p-0">:</td>
                                      <td class="table_content_size p-0 ps-2">16/05/2020</td>
                                  </tr>
                              </tbody>
                          </table>
      
                      </div>
                  </div>
                  <p class="main-header">Certificate of Web Application Audit</p>
      
                  <p class="subHeader">FOR : National Rural Infrastructure Development Agency, Ministry of Rural Development
                  </p>
                  <!-- <p class="content"> In Scope URL : http://10.153.15.173/Home/CitizenPage/ <br />
                      Main URL Hosting : http://omms.nic.in<br />
                      Scope of Audit : Web Application<br />
                      Auditor Name : Mr. Sanjay Kumar<br />
                      Audit Dates : 16/11/2020 to 31/12/2020
                  </p> -->
                  <div class="for">
                      <table class="table table-borderless">
                          <tbody>
                              <tr class="for_table_height">
                                  <td scope="row" class="for_table_height p-0" widtd="20%"> In Scope URL</td>
                                  <td class=" p-0">:</td>
                                  <td class=" p-0 ps-2">${data.ApplicationURL}</td>
                              </tr>
                              <tr class="for_table_height">
                                  <td scope="row" class=" p-0">Main URL Hosting</td>
                                  <td class=" p-0">:</td>
                                  <td class=" p-0 ps-2">${data.ApplicationURL}</td>
                              </tr>
                              <tr class="for_table_height">
                                  <td scope="row" class=" p-0">Scope of Audit</td>
                                  <td class=" p-0">:</td>
                                  <td class=" p-0 ps-2">${data.ProjectTitle}</td>
                              </tr>
                              <tr class="for_table_height">
                                  <td scope="row" class=" p-0">Auditor Name</td>
                                  <td class=" p-0">:</td>
                                  <td class=" p-0 ps-2">Mr. Sanjay Kumar</td>
                              </tr>
                              <tr class="for_table_height">
                                  <td scope="row" class=" p-0">Audit Dates</td>
                                  <td class=" p-0">:</td>
                                  <td class=" p-0 ps-2">${data.StartDate} to ${data.EndDate}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
      
                  <p class="subHeader">CONCLUSIONS : </p>
                  <p class="content">Auditing for <strong>Citizen Section of OMMAS</strong> web application of
                      <strong>National
                          Rural Infrastructure
                          Development Agency, Ministry of Rural Development</strong> was done from <strong>16/11/2020</strong>
                      to
                      <strong>16/11/2020</strong> <br /><br />
                      The site is free from OWASP
                      (and any other Known) vulnerabilities and is safe for hosting.<br /><br />
                      The clearance for the above application is given taking into consideration that the
                      OWASP (and any other Known) vulnerabilities do not exist in the application. Any
                      unapproved changes to the web application will void the certificate.<br />
                      <strong> Application Source Code Hash (MD5):</strong> 7957ca707a6294077d6de613c822f497
                  </p>
                  <p class="subHeader">HOSTING PERMISSION :</p>
                  <p class="content">I. Site may be considered safe for hosting with Read and Script Execute permission only
                  </p>
                  <div class="recommendationBox">
                      <p class="sub-subHeader">RECOMMENDATIONS : </p>
                      <p class="sub-content">I. Web Server Audit certificate, web server and OS level hardening need to be in
                          place for the production server before making the
                          application live.<br />
                          II. Website audit should be done at least once a year or when there is any change in the
                          application.<br />
                          III. No new web pages are to be added without proper security audit.<br />
                          IV. Server side issue should be taken care by hosting provider.<br />
                          V. Secure Sockets Layer (SSL) should be implemented on the main hosting URL (including
                          sub-folders).<br />
      
                      </p>
                  </div>
                  
                  <div class="logo_Date row mt-5">
                      <div class="logo col-8">
                          <img src="${process.env.AUDITOR_API_URI}/images/Xiarch_logo_png.png" alt="">
                      </div>
                      <div class="logo col-8">
                          <img src="${process.env.AUDITOR_API_URI}/images/Xiarch_logo_png.png" alt="">
                      </div>
                  </div>
              </div>
          </div>
      </body>
      
      </html>`
}