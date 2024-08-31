
const Moment = require('moment')
let current_date = Moment().format("MMMM Do YYYY");
const dotenv = require("dotenv");
dotenv.config();

var table_of_content_page_count = 4;

var htmlRegexG = /(?<=<div.*?class="some-class".*?>)(.*?)(?=<\/div>)/g;
'<html><body>Probably.<div class="some-class">Hello, world!</div><br />Today</body></html>'


var vulberability_table_title_count = 8;
var changing_variable = 0
function get_vulberability_table_title_count() {
  changing_variable += 1;
  return `${vulberability_table_title_count}.${changing_variable}`
}




// var htmlRegexG = /<(?!(?:figure|oembed)\b)[a-z][a-z0-9]*\b[^>]*>(.*?)<\/\1>/i
const template_css = `     
html {
    -webkit-print-color-adjust: exact;
}

body {
    font-family: 'Open Sans', sans-serif;
}

#page_1::before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: -1;
    background-image: url(${process.env.AUDITOR_API_URI}/images/fingerprint.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-size: 1300px 1450px;
    opacity: 0.01;
}

.header_body {
    height: 110px;
    display: flex;
    padding-top: 40px;
    justify-content: end;
}

.header_body .logo {
    width: 130px;
}

.footer_body {
    height: 116px;
}

.sub_footer {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    align-items: center;
}

.footer_text {
    font-weight: 100;
    line-height: 1.2;
    text-align: justify;
    font-size: 11px;
}

.body_template_class {
    break-after: page;
    padding-left: 60px;
    padding-right: 60px;
    font-size: 16px;
    line-height: 24px;
    overflow: hidden;
    width: 100%;
}

.main_heading p {
    color: black;
    font-size: 40px;
    font-weight: 300 !important;
}

.sub_heading {
    padding-bottom: 45px;
}

.sub_heading p {
    color: black;
    font-size: 20px;
    padding-top: 10px;
    font-weight: 500;
}

.sub_heading small {
    padding-bottom: 10px;
    color: black;
    font-size: 10px;
    font-weight: 100;
}

.info {
    font-size: 14px;
}

.head {
    color: rgb(148, 0, 0);
    width: 150px;
}

.head2 {
    color: #fd625e;
}

/* page 2 CSS   */
.table_of_content .main_heading h2 {
    color: rgb(148, 0, 0);
    font-size: 20px;
    font-weight: 500 !important;
}

.content a {
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    line-height: 1.4;
    cursor: pointer;
    color: black;
    padding-bottom: 10px;
    page-break-inside: avoid;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.report_heading,
.report_heading {
    color: black;
}


.content .sub_content a {
    font-size: 13px;
    cursor: pointer;
    font-weight: 200;
    padding-left: 20px;
    display: flex;
    color: black;
    flex-direction: row;
    text-decoration: none;
    background-color: white;
    background-color: white;
    margin: 0;
}

.content .sub_content .sub_sub_content a {
    font-size: 12px;
    padding-left: 40px;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    font-weight: 100;
    color: rgb(141, 141, 141);
    cursor: pointer;
    background-color: white;
    background-color: white;
    margin: 0;
}

.content .sub_content_heading p {
    font-size: 12px;
}

/* page 3 */
.content_heading {
    color: rgb(148, 0, 0);
    font-size: 20px;
    margin-bottom: 15px;
    margin-top: 15px;
}

.sub_content_heading {
    color: rgb(148, 0, 0);
    font-size: 17px;
    margin-bottom: 15px;
    margin-top: 15px;
}

.sub_sub_content_heading {
    color: rgb(148, 0, 0);
    font-size: 15px;
    margin-bottom: 15px;
    margin-top: 15px;
}

.content p {
    font-weight: 100;
    text-align: justify;
    font-size: 14px !important;
    line-height: 1.4;
    margin-bottom: 2px;
    text-align: justify;
    text-align-last: left;
    color: black;
}

.content ul li {
    text-align: justify;
    font-size: 14px;
    font-weight: 100 !important;
    line-height: 1.4;
}


/* page 4 */
.content_table_grey {
    color: black;
    font-size: 13px;
    width: 30%;
    padding: 4px !important;
    font-weight: 100;
}

.content_table_white {
    padding: 4px !important;
    padding-left: 8px !important;
    font-size: 14px;
    line-height: 1.3;
    font-weight: 100;
}

.sub_content_table_grey {
    color: black;
    font-size: 13px;
    padding: 4px !important;
    font-weight: 100;
    text-align: center;
}

.sub_content_table_white {
    padding: 4px !important;
    color: black;
    text-align: center;
    font-size: 13px;
    font-weight: 100;
}

.contact_info {
    color: black;
    border: 1px solid rgb(148, 0, 0);
    padding: 10px;
    margin-top: 12px;
    text-align: center;
}

/* page 5 */
.sub_content_heading .content {
    margin-top: 15px;
    color: black;
}

.sub_content_heading .content td {
    font-size: 12px;
}


/* page 6 */
.bg-critical {
    background-color: red !important;
}

/* page 7 */
.sub_sub_content_heading .content {
    margin-top: 10px;
    color: black;
}

.sub_sub_content_heading .content td {
    font-size: 12px;
}

.bg-sky-blue {
    background-color: #4FC3F7;
}

fw-custom {
    font-weight: 500;
}

.vulnerability_dynamic_table_heading {
    font-size: 14px;
    padding : 0px !important;
}

.vulnerability_img {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    page-break-inside: avoid;
}

.vulnerability_img img{
  border:2px solid black;
}

.vulnerability_img p {
    font-size: 10px;
}
.table{
    table-layout: fixed ;
    width: 100%;
    word-wrap: break-word;
  }
  tr {
    page-break-inside: avoid;
  }
.reference_check ul {
    list-style: none !important;
  }
.reference_check ul li:before {
    content: '✓' !important;
  }
  .executive_summary_application_health {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }
  .executive_summary_ring {
    width: 120px;
    height: 120px;
    /* border-top-color: #ffc107; */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    flex-direction:column;
  }

  .executive_summary_text {
    font-size: 13px;
    font-weight: 500;
    color: #333;
    text-align:center;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
  .term_defination_legends_class .table{
    table-layout: auto !important;
  }
  .term_defination_legends_class_table_content .content_table_white{
    font-size: 14px !important;
    color:black;
  }
  #chart {
    max-width: 750px;
  }
  .toc_head{
    
    page-break-inside: avoid;
  }
  .toc_main_head a{
    display : flex;
    justify-content: space-between;
  }
  .toc_sub_head a{
    display : flex;
    justify-content: space-between;
  }
  .scope_table table td{
    font-size: 14px;
    padding: .3rem;
  
  }
`

const webAuditFrontPage = (company_logo, company_name) => {
  // console.log("company name", company_name , company_logo)
  return `
    <div class="body_template_class">
    <br />
    <br />
    <br />
    <br />
    <br />
    <div>
    <div class="company_logo" style="width: 200px; height: 200px">
      <img
        src="${process.env.AUDITOR_API_URI}/images/${company_logo}"
        style="width: 100%; height:100%;"
      />
    </div>
  </div> <br/>
            <div class="main_heading">
                <p id="logo" style="font-weight: 700; font-size : 32px;">Web Application Penetration Testing Report</p> <br /> 
            </div>
            <div class="report_for sub_heading">
            <br/>
            <div class='pageNumber'></div>
            <table style="width:400px">
                <tbody class="info">
                <tr>
                    <td class="head report_heading">Report For :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">${company_name}</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                </tbody>
            </table></div>
    
            <br><br/>
            <div class="report_by sub_heading">
            
            <table style="width:400px">
                <tbody class="info ">
                <tr>
                    <td class="head report_heading">Report By :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">Xiarch Solutions Pvt Ltd</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                    
                    <tr>
                        <td class="head">Address</td>
                        <td class="head2"> : </td>
                        <td class="data">403-404, Tower A , Spaze Edge, Sohna Road, Gurugram, Haryana 122018</td>
                    </tr>
                    <tr>
                        <td class="head">Tel</td>
                        <td class="head2"> : </td>
                        <td class="data">+91-9667916333</td>
                    </tr>
                    <tr>
                        <td class="head">Email</td>
                        <td class="head2"> : </td>
                        <td class="data">info@xiarch.com</td>
                    </tr>
                    <tr>
                        <td class="head">Web</td>
                        <td class="head2"> : </td>
                        <td class="data">www.xiarch.com</td>
                    </tr>
                </tbody>
            </table></div>
            </div>
    `
}

const mobileAuditFrontPage = (company_logo, company_name) => {
  return `
    <div class="body_template_class">
    <br />
    <br />
    <br />
    <div>
    <div class="company_logo" style="width: 200px; height: 200px">
      <img
        src="${process.env.AUDITOR_API_URI}/images/${company_logo}"
        style="width: 100%; height:100%;"
      />
    </div>
  </div> <br/>
            <div class="main_heading">
                <p id="logo"  style="font-weight: 700; font-size : 32px;">Mobile Application Penetration Testing Report</p> <br /> 
            </div>
            <div class="report_for sub_heading">
            <br><br>
            <div class='pageNumber'></div>
            <table style="width:400px">
                <tbody class="info">
                <tr>
                    <td class="head report_heading">Report For :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">${company_name}</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                </tbody>
            </table></div>
    
            <br><br>
            <div class="report_by sub_heading">
            
            <table style="width:400px">
                <tbody class="info ">
                <tr>
                    <td class="head report_heading">Report By :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">Xiarch Solutions Pvt Ltd</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                    
                    <tr>
                        <td class="head">Address</td>
                        <td class="head2"> : </td>
                        <td class="data">403-404, Tower A , Spaze Edge, Sohna Road, Gurugram, Haryana 122018</td>
                    </tr>
                    <tr>
                        <td class="head">Tel</td>
                        <td class="head2"> : </td>
                        <td class="data">+91-9667916333</td>
                    </tr>
                    <tr>
                        <td class="head">Email</td>
                        <td class="head2"> : </td>
                        <td class="data">info@xiarch.com</td>
                    </tr>
                    <tr>
                        <td class="head">Web</td>
                        <td class="head2"> : </td>
                        <td class="data">www.xiarch.com</td>
                    </tr>
                </tbody>
            </table></div>
            </div>
    `
}


const APIAuditFrontPage = (company_logo, company_name) => {
  return `
    <div class="body_template_class">
    <br />
    <br />
    <br />
    <br />
    <br />
    <div>
    <div class="company_logo" style="width: 200px; height: 200px">
      <img
        src="${process.env.AUDITOR_API_URI}/images/${company_logo}"
        style="width: 100%; height:100%;"
      />
    </div>
  </div> <br/>
            <div class="main_heading">
                <p id="logo"  style="font-weight: 700; font-size : 38px;">API Penetration Testing Report</p> <br /> 
            </div>
            <div class="report_for sub_heading">
            <br><br>
            <div class='pageNumber'></div>
            <table style="width:400px">
                <tbody class="info">
                <tr>
                    <td class="head report_heading">Report For :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">${company_name}</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                </tbody>
            </table></div>
    
            <br><br>
            <div class="report_by sub_heading">
            
            <table style="width:400px">
                <tbody class="info ">
                <tr>
                    <td class="head report_heading">Report By :</td>
                </tr>
                    <tr>
                        <td class="head">Organization Name</td>
                        <td class="head2"> : </td>
                        <td class="data">Xiarch Solutions Pvt Ltd</td>
                    </tr>
                    <tr>
                        <td class="head">Report Date</td>
                        <td class="head2"> : </td>
                        <td class="data">${current_date}</td>
                    </tr>
                    
                    <tr>
                        <td class="head">Address</td>
                        <td class="head2"> : </td>
                        <td class="data">403-404, Tower A , Spaze Edge, Sohna Road, Gurugram, Haryana 122018</td>
                    </tr>
                    <tr>
                        <td class="head">Tel</td>
                        <td class="head2"> : </td>
                        <td class="data">+91-9667916333</td>
                    </tr>
                    <tr>
                        <td class="head">Email</td>
                        <td class="head2"> : </td>
                        <td class="data">info@xiarch.com</td>
                    </tr>
                    <tr>
                        <td class="head">Web</td>
                        <td class="head2"> : </td>
                        <td class="data">www.xiarch.com</td>
                    </tr>
                </tbody>
            </table></div>
            </div>
    `
}

const networkAuditFrontPage = (company_logo, company_name) => {
  return `
    <div class="body_template_class">
    <br />
    <br />
    <br />
    <br />
    <br />
    <div>
    <div class="company_logo" style="width: 200px; height: 200px">
      <img
        src="${process.env.AUDITOR_API_URI}/images/${company_logo}"
        style="width: 100%; height:100%;"
      />
    </div>
  </div> <br/>
  
    <div class="main_heading">
      <p id="logo"  style="font-weight: 700; font-size : 38px;">Network Penetration Testing Report</p>
      <br />
    </div>
    <div class="report_for sub_heading">
      <br />
      <div class="pageNumber"></div>
      <table style="width: 400px">
        <tbody class="info">
          <tr>
            <td class="head report_heading">Report For :</td>
          </tr>
          <tr>
            <td class="head">Organization Name</td>
            <td class="head2">:</td>
            <td class="data">${company_name}</td>
          </tr>
          <tr>
            <td class="head">Report Date</td>
            <td class="head2">:</td>
            <td class="data">${current_date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  
    <br />
    <div class="report_by sub_heading">
      <table style="width: 400px">
        <tbody class="info">
          <tr>
            <td class="head report_heading">Report By :</td>
          </tr>
          <tr>
            <td class="head">Organization Name</td>
            <td class="head2">:</td>
            <td class="data">Xiarch Solutions Pvt Ltd</td>
          </tr>
          <tr>
            <td class="head">Report Date</td>
            <td class="head2">:</td>
            <td class="data">${current_date}</td>
          </tr>
  
          <tr>
            <td class="head">Address</td>
            <td class="head2">:</td>
            <td class="data">
              Suite 352, 2nd floor, Tarun, Outer Ring Road, Pitampura, New Delhi,
              Delhi 110034
            </td>
          </tr>
          <tr>
            <td class="head">Tel</td>
            <td class="head2">:</td>
            <td class="data">+91-9667916333</td>
          </tr>
          <tr>
            <td class="head">Email</td>
            <td class="head2">:</td>
            <td class="data">info@xiarch.com</td>
          </tr>
          <tr>
            <td class="head">Web</td>
            <td class="head2">:</td>
            <td class="data">www.xiarch.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
`
}


const webDisclaimer = `
<div class="body_template_class">
<div class="content_heading" id="disclaimer">Disclaimer</div>
<div class="content pt-3" >
    <p class="">All the information contained in this document is confidential to said company, disclosure and use of any information contained in this document by photographic, electronic or any other means, in whole or part, for any reason other than security enhancement is strictly prohibited without written consent of auditee organization. <br /><br />
    </p><p>  Whilst all due care and diligence has been taken in the preparation of this document it is not impossible that document of this nature may contain errors or omissions because of a misunderstanding of Clients requirements. Any recommendations are made in good faith as guidelines to assist the client in evaluation and must not be construed as warranties of any kind. Findings in this report are based on various tests conducted using manual techniques and third-party tools and Xiarch Solutions Pvt Ltd has put its best efforts to eliminate all the false positives reported by these tools.</p><br /><br />
      <p>   Xiarch Solutions Pvt Ltd shall assume no liability for any changes, omissions, or errors in this document. Xiarch Solutions Pvt Ltd shall not be liable for any damages financial or otherwise arising out of use/misuse of this report by any general member of public</p>.<br /><br />
</div>
</div>
`

const tableOfContent_network = (assessment_findings_details) => `  
<div class="body_template_class" id="table_of_content">
</div>
`


const tableOfContent_web = (assessment_findings_details) => `  
<div class="body_template_class" id="table_of_content">
</div>
`

const documentControl = (documentData, app_name, auditee_company_name, auditor_company_name , closure) => {

  let name_arr = []
  let designation_arr = []
  for (let i = 0; i < documentData.length; i++) {
    if (!name_arr.includes(documentData[i].Auditor.Name)) {
      name_arr.push(documentData[i].Auditor.Name)
      designation_arr.push(documentData[i].Auditor.Designation)
    }
    if (!name_arr.includes(documentData[i].TeamLeader.Name)) {
      name_arr.push(documentData[i].TeamLeader.Name)
      designation_arr.push(documentData[i].TeamLeader.Designation)
    }
    if (!name_arr.includes(documentData[i].ProjectManager.Name)) {
      name_arr.push(documentData[i].ProjectManager.Name)
      designation_arr.push(documentData[i].ProjectManager.Designation)
    }
  }
  return `
  <div class="body_template_class" id="document_control">
  <h3 class="content_heading" id="documentControl">1. Document Control</h3>
  <div class="content pt-3">
    <p>
      This document serves as a comprehensive report of the findings and
      recommendations resulting from the web application security assessment
      performed on ${app_name}(${auditee_company_name}) by ${auditor_company_name}.
      This report is intended for Management, and is to be used as a guide for
      improving the security posture of the web application.
    </p>
  </div>
  <h4 class="sub_content_heading">1.1 Document Version Control</h4>
  <table class="table table-bordered" style="border-color: black">
    <tbody class="info">
      <tr>
        <th width="10%" class="report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Version</th>
        <th width="20%" class="report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Report</th>
        <th width="20%" class="report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Person</th>
        <th width="20%" class="report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Action</th>
        <th width="20%" class="report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Date</th>
      </tr>

      ${documentData.map((data, index) => {
    let utcDateString = data.Auditor.DateTime;
    // let date = new Date(Date.parse(utcDateString));
    // let formattedDate = date.toISOString().substr(0, 10);


    let date = new Date(Date.parse(utcDateString));
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    let formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    // console.log(formattedDate);
    return `
      <tr >
        <td class="" style="padding:2px 6px ;"  >${index + 1}.0</td>
        <td class="" style="padding:2px 6px ;"  >${closure ? "Closure" : "Level "+ index+1}</td>
        <td class="2" style="padding:2px 6px ;" >${data.Auditor.Name}</td>
        <td class="" style="padding:2px 6px ;"  >Audit</td>
        <td class="" style="padding:2px 6px ;"  >${formattedDate}</td>
      </tr>
      <tr>
        <td class="" style="padding:2px 6px ;">${index + 1}.1</td>
        <td class="" style="padding:2px 6px ;"> ${closure ? "Closure" : "Level "+ index+1}</td>

        <td class="" style="padding:2px 6px ;">${data.TeamLeader.Name}</td>
        <td class="" style="padding:2px 6px ;">Review</td>
        <td class="" style="padding:2px 6px ;">${formattedDate}</td>
      </tr>
      <tr>
        <td class="" style="padding:2px 6px ;">${index + 1}.2</td>
        <td class="" style="padding:2px 6px ;">${closure ? "Closure" : "Level "+ index+1}</td>
        <td class="" style="padding:2px 6px ;">${data.ProjectManager.Name}</td>
        <td class="" style="padding:2px 6px ;">Final Approval</td>
        <td class="" style="padding:2px 6px ;">${formattedDate}</td>
      </tr>
      ` }).join('')}
    </tbody>
  </table>
  <br/>

  <h4 class="sub_content_heading">1.2 Document Distribution List</h4>

<table class="table table-bordered" style="border-color: black">
<tbody class="info">
  <tr>
    <th width="25%" class="head report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Name</th>
    <th width="25%" class="head report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Designation</th>
    <th width="20%" class="head report_heading" style="padding:2px 6px ; background-color: #E0E0E0" >Organization</th>
  </tr>
 
  ${name_arr.map((data, index) => {
      return `
  <tr>
  <td class="" style="padding:2px 6px ;">${data}</td>
  <td class="" style="padding:2px 6px ;">${designation_arr[index]}</td>
  <td class="" style="padding:2px 6px ;">${auditor_company_name}</td>
  </tr>
  ` }).join('')}
</tbody>
</table>
</div>

  
  `
}

const introduction = (applicationName ,mode) => {
  return ` <div class="body_template_class">
    <h3 class="content_heading" id="introduction">2. Introduction</h3>
    <h4 class="sub_content_heading">2.1 Summary</h4>
    <div class="content pt-3">
      <p class="">
        This report outlines the results of a comprehensive web application
        security assessment conducted for the ${applicationName} web application.
        The purpose of this assessment was to identify any potential security
        vulnerabilities and to provide recommendations for their mitigation.
      </p>
      <br/>
      <p>
        The assessment was conducted using a combination of manual and automated
        testing techniques, including vulnerability scanning, penetration testing,
        and code review. The scope of the assessment covered the application's
        front-end and back-end components, as well as any supporting
        infrastructure.
      </p><br/>
      <p>
        The assessment was conducted in accordance with industry-standard security
        best practices and guidelines, including the Open Web Application Security
        Project (OWASP) Top 10 list of web application security risks.
      </p><br/>
      <p>
        The results of the assessment identified a number of security
        vulnerabilities, which have been categorized according to their severity
        and impact on the application's security posture. Recommendations for
        mitigating these vulnerabilities have been provided, along with a roadmap
        for addressing any remaining security issues.
      </p><br/>
      <p>
        The findings and recommendations contained in this report are intended to
        assist the development team in improving the overall security of the web
        application, and to help ensure that it meets the necessary security
        standards and compliance requirements.
      </p><br/>
    </div>
  
    <h4 class="sub_content_heading">2.2 Assessment Objective:</h4>
    <div class="content pt-3">
      <ul>
        <li>
          Identify and assess security flaws in mobile application according to
          industry principal security standards like OWASP ${mode} Security Project
          Top 10 and SANS 25 etc.
        </li>
        <br/>
        <li>
          Provide recommendations for mitigation of risk(s) emerged during the
          identified vulnerabilities.
        </li>
      </ul>
    </div>
  </div>`


}

const scope = (applicationURL) => {
  // console.log("application url ", applicationURL)
  const appURL = applicationURL.replace(htmlRegexG, "")
  return `
    <div class="body_template_class">
    <h4 class="content_heading" id="scope">3. Scope</h4>
    <h3 class="sub_content_heading" id="scope_details">3.1  Scope Details</h3>
  <div class="content pt-3">  <p>
  The security assessment was carried out in the pre-production environment
  and it included the following scope: <br />
  ${appURL
    }
</p></div>
  
    <h4 class="sub_content_heading" id="post_assessment">3.2 Post Assessment Clean-up</h4>
 <div class="content pt-3">   <p>
 Any test accounts, which were created for the purpose of this assessment,
 should be disabled or removed, as appropriate, together with any associated
 content. 
</p></div>
  </div>
  
    `
}

const introduction_network = (applicationName) => {
  return ` <div class="body_template_class">
    <h3 class="content_heading" id="introduction">2. Introduction</h3>
    <h4 class="sub_content_heading">2.1 Summary</h4>
    <div class="content pt-3">
      <p class="">
        This report outlines the results of a comprehensive web application
        security assessment conducted for the ${applicationName} web application.
        The purpose of this assessment was to identify any potential security
        vulnerabilities and to provide recommendations for their mitigation.
      </p>
      <br/>
      <p>
        The assessment was conducted using a combination of manual and automated
        testing techniques, including vulnerability scanning, penetration testing,
        and code review. The scope of the assessment covered the application's
        front-end and back-end components, as well as any supporting
        infrastructure.
      </p><br/>
      <p>
        The assessment was conducted in accordance with industry-standard security
        best practices and guidelines, including the Open Web Application Security
        Project (OWASP) Top 10 list of web application security risks.
      </p><br/>
      <p>
        The results of the assessment identified a number of security
        vulnerabilities, which have been categorized according to their severity
        and impact on the application's security posture. Recommendations for
        mitigating these vulnerabilities have been provided, along with a roadmap
        for addressing any remaining security issues.
      </p><br/>
      <p>
        The findings and recommendations contained in this report are intended to
        assist the development team in improving the overall security of the web
        application, and to help ensure that it meets the necessary security
        standards and compliance requirements.
      </p><br/>
    </div>
  
    <h4 class="sub_content_heading">2.2 Assessment Objective:</h4>
    <div class="content pt-3">
      <ul>
        <li>
        Identify and assess security flaws in the servers & systems according to industry principal security standards.
        </li>
        <br/>
        <li>
          Provide recommendations for mitigation of risk(s) emerged during the
          identified vulnerabilities.
        </li>
      </ul>
    </div>
  </div>`


}

const term_defination_legends = `<div class="body_template_class">
  <h4 class="content_heading" id="term_defination_legends"> 4. Terms , Clarity & Legends</h4>
  <div class="content mt-3">
    <p>
      This section describes the format in which the identified
      vulnerabilities are reported in the later section of the report.
      “Vulnerability Table” shown below is used to provide the details of the
      vulnerability, its impact and the recommendations.
    </p>
    <div class="sub_content_heading" id="summary">
      <h3 class="sub_content_heading" id="scope_details"> 4.1 Vulnerability Table</h3>
      <div class="content term_defination_legends_class">
        <table class="table table-bordered mt-2" style="border-color: black">
          <tbody>
            <tr class=" vulnerability_dynamic_table_heading">
            <td colspan="1" class="content_table_white fw-bold" style="background-color:#E0E0E0;">
            Observation ID & Title :
          </td>
          <td colspan="3"></td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" width="25%" style="background-color:#E0E0E0;">
                CVSS Risk Rating :
              </td>
              <td width="25%" class="content_table_white fw-bold"></td>
              <td width="25%" class="content_table_white fw-bold" style="background-color:#E0E0E0;">Status :</td>
              <td width="25%" class="content_table_white fw-bold"></td>
            </tr>

            <tr>
              <td class="content_table_white fw-bold" colspan="4"  style="background-color:#E0E0E0;">
              Observation Details :
              </td>
            </tr>
            
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
              <br/>
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
              Risk/Impact :
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
              <br/>
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
                Recommendations :
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
              <br/>
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
                Affected URL & Parameter :
              </td>
            </tr>
            <tr>
            <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
            <br/>
            </td>
          </tr>
          <tr>
          <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
            CVSS Vector :
          </td>
        </tr>
        <tr>
        <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
        <br/>
        </td>
      </tr>
          </tbody>
        </table>
      </div>
      <div class="content term_defination_legends_class mt-2">
        <table class="table display-2 term_defination_legends_class_table_content table-borderless mt-2" style="border-color: black">
          <tbody>
            <tr>
              <td class="content_table_white" width="30%">
                Title of the Vulnerability
              </td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                A short title that describes the vulnerability
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Risk Level</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                It describes the risk level. The title bar of each
                vulnerability table is colour coded for quick identifications
                of the severity level of the vulnerabilities
              </td>
            </tr>

            <tr>
              <td class="content_table_white">Description</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                It provides a brief description of the vulnerability.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Impact</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Describes the probable impact if the vulnerability is
                successfully exploited.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Recommendations</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provide the recommendations to fix the vulnerability.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Affects</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provide the information where vulnerability is present.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Status</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provides the information whether the vulnerability is closed
                or not.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="body_template_class"></div>
    <div class="sub_content_heading">

      <h3 class="sub_content_heading" id="scope_details">4.2 Findings Ranking System</h3>

      <div class="content">
        <p>
          In order to prioritize the assessment results, each finding was
          categorized based on severity classifications. Final analysis of the
          risk or impact to the application will require an internal
          evaluation. Xiarch Labs has developed classifications using the
          severity nomenclature for ranking the issues identified within the
          various severity categories.
        </p>
        <div class="sub_sub_content_heading">
          4.2.1 Severity Categories
          <div class="content">
            <p>
              Based on Xiarch Lab analysis of the particular finding and
              assets affected, a finding will fall into one of the following
              severity level categories: <br />
              <br />
              <span class="badge bg-critical">Critical</span>
              <strong>V</strong>ulnerabilities require an immediate response
              through mitigating controls, direct remediation or a combination
              thereof. Exploitation of critical severity vulnerabilities
              results in privileged access to the target system, application
              or sensitive data and enables further access to other hosts or
              data stores within the environment. In
              general, a critical severity ranking is warranted when the issue
              has a direct impact on regulatory or compliance controls imposed
              on the environment, accesses personally identifiable information
              (PII) or financial data or could cause significant reputational
              or financial harm.
            </p> <br />
            <p>
              <span class="badge bg-danger">High</span>
              <strong>F</strong>indings with a high severity ranking require
              immediate evaluation and subsequent resolution. Exploitation of
              high severity vulnerabilities leads directly to an attacker
              gaining privileged, administrative-level access to the system,
              application or sensitive data. However, it does not enable
              further access to other hosts or data stores within the
              environment. If left unmitigated, high severity vulnerabilities
              can pose an elevated threat that could affect business
              continuity or cause significant financial loss.
            </p>
            <br />

            <p>
              <span class="badge bg-warning">Medium</span>
              <strong>A</strong> finding with a medium severity ranking
              requires review and resolution within a short time. From a
              technical perspective, vulnerabilities that warrant a medium
              severity ranking can lead directly to an attacker gaining
              non-privileged or user-level access to the system, application
              or sensitive data. Findings that can cause a denial-of-service
              (DoS) condition on the host, service or application are also
              classified as medium risk. Alternately, the vulnerability may
              provide a way for attackers to gain elevated levels of
              privilege. From a less technical perspective, observations with
              this ranking are significant, but they do not pose as much of a
              threat as high or critical severity exposures.
            </p>
            <br />

            <p>
              <span class="badge bg-success">Low</span> <strong>L</strong>ow
              severity findings should be evaluated for review and resolution
              once the remediation efforts for critical, high and medium
              severity issues are complete. From a technical perspective,
              vulnerabilities that warrant a low severity ranking may leak
              information to unauthorized or anonymous users used to launch a
              more targeted attack against the environment.
            </p>
            <br />

            <p>
              <span class="badge bg-info">Informational</span>
              <strong>A</strong>n informational finding presents no direct
              threat to the confidentiality, integrity or availability of the
              data or systems supporting the environment. These issues pose an
              inherently low threat to the organization and any proposed
              resolution should be considered as an addition to the
              information security procedures already in place.
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`


const term_defination_legends_network = `<div class="body_template_class">
  <h4 class="content_heading" id="term_defination_legends"> 4. Terms , Clarity & Legends</h4>
  <div class="content mt-3">
    <p>
      This section describes the format in which the identified
      vulnerabilities are reported in the later section of the report.
      “Vulnerability Table” shown below is used to provide the details of the
      vulnerability, its impact and the recommendations.
    </p>
    <div class="sub_content_heading" id="summary">
      <h3 class="sub_content_heading" id="scope_details"> 4.1 Vulnerability Table</h3>
      <div class="content term_defination_legends_class">
        <table class="table table-bordered mt-2" style="border-color: black">
          <tbody>
            <tr class=" vulnerability_dynamic_table_heading">
            <td colspan="1" class="content_table_white fw-bold" style="background-color:#E0E0E0;">
            Observation ID & Title :
          </td>
          <td colspan="3"></td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" width="25%" style="background-color:#E0E0E0;">
                CVSS Risk Rating :
              </td>
              <td width="25%" class="content_table_white fw-bold"></td>
              <td width="25%" class="content_table_white fw-bold" style="background-color:#E0E0E0;">Status :</td>
              <td width="25%" class="content_table_white fw-bold"></td>
            </tr>

            <tr>
              <td class="content_table_white fw-bold" colspan="4"  style="background-color:#E0E0E0;">
              Observation Details :
              </td>
            </tr>
            
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
              <br/>
              </td>
            </tr>
           
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
                Recommendations :
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
              <br/>
              </td>
            </tr>
            <tr>
              <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
              Affected IP & Port : 
              </td>
            </tr>
            <tr>
            <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
            <br/>
            </td>
          </tr>
          <tr>
          <td class="content_table_white fw-bold" colspan="4" style="background-color:#E0E0E0;">
            CVSS Vector :
          </td>
        </tr>
        <tr>
        <td class="content_table_white fw-bold" colspan="4" style="padding: 4px;">
        <br/>
        </td>
      </tr>
          </tbody>
        </table>
      </div>
      <div class="content term_defination_legends_class mt-2">
        <table class="table table-borderless mt-2" style="border-color: black">
          <tbody>
            <tr>
              <td class="content_table_white" width="30%">
                Title of the Vulnerability
              </td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                A short title that describes the vulnerability
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Risk Level</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                It describes the risk level. The title bar of each
                vulnerability table is colour coded for quick identifications
                of the severity level of the vulnerabilities
              </td>
            </tr>

            <tr>
              <td class="content_table_white">Description</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                It provides a brief description of the vulnerability.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Impact</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Describes the probable impact if the vulnerability is
                successfully exploited.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Recommendations</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provide the recommendations to fix the vulnerability.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Affects</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provide the information where vulnerability is present.
              </td>
            </tr>
            <tr>
              <td class="content_table_white">Status</td>
              <td class="content_table_white">-</td>
              <td class="content_table_white">
                Provides the information whether the vulnerability is closed
                or not.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="body_template_class"></div>
    <div class="sub_content_heading">

      <h3 class="sub_content_heading" id="scope_details">4.2 Findings Ranking System</h3>

      <div class="content">
        <p>
          In order to prioritize the assessment results, each finding was
          categorized based on severity classifications. Final analysis of the
          risk or impact to the application will require an internal
          evaluation. Xiarch Labs has developed classifications using the
          severity nomenclature for ranking the issues identified within the
          various severity categories.
        </p>
        <div class="sub_sub_content_heading">
          4.2.1 Severity Categories
          <div class="content">
            <p>
              Based on Xiarch Lab analysis of the particular finding and
              assets affected, a finding will fall into one of the following
              severity level categories: <br />
              <br />
              <span class="badge bg-critical">Critical</span>
              <strong>V</strong>ulnerabilities require an immediate response
              through mitigating controls, direct remediation or a combination
              thereof. Exploitation of critical severity vulnerabilities
              results in privileged access to the target system, application
              or sensitive data and enables further access to other hosts or
              data stores within the environment. In
              general, a critical severity ranking is warranted when the issue
              has a direct impact on regulatory or compliance controls imposed
              on the environment, accesses personally identifiable information
              (PII) or financial data or could cause significant reputational
              or financial harm.
            </p> <br />
            <p>
              <span class="badge bg-danger">High</span>
              <strong>F</strong>indings with a high severity ranking require
              immediate evaluation and subsequent resolution. Exploitation of
              high severity vulnerabilities leads directly to an attacker
              gaining privileged, administrative-level access to the system,
              application or sensitive data. However, it does not enable
              further access to other hosts or data stores within the
              environment. If left unmitigated, high severity vulnerabilities
              can pose an elevated threat that could affect business
              continuity or cause significant financial loss.
            </p>
            <br />

            <p>
              <span class="badge bg-warning">Medium</span>
              <strong>A</strong> finding with a medium severity ranking
              requires review and resolution within a short time. From a
              technical perspective, vulnerabilities that warrant a medium
              severity ranking can lead directly to an attacker gaining
              non-privileged or user-level access to the system, application
              or sensitive data. Findings that can cause a denial-of-service
              (DoS) condition on the host, service or application are also
              classified as medium risk. Alternately, the vulnerability may
              provide a way for attackers to gain elevated levels of
              privilege. From a less technical perspective, observations with
              this ranking are significant, but they do not pose as much of a
              threat as high or critical severity exposures.
            </p>
            <br />

            <p>
              <span class="badge bg-success">Low</span> <strong>L</strong>ow
              severity findings should be evaluated for review and resolution
              once the remediation efforts for critical, high and medium
              severity issues are complete. From a technical perspective,
              vulnerabilities that warrant a low severity ranking may leak
              information to unauthorized or anonymous users used to launch a
              more targeted attack against the environment.
            </p>
            <br />

            <p>
              <span class="badge bg-info">Informational</span>
              <strong>A</strong>n informational finding presents no direct
              threat to the confidentiality, integrity or availability of the
              data or systems supporting the environment. These issues pose an
              inherently low threat to the organization and any proposed
              resolution should be considered as an addition to the
              information security procedures already in place.
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`

const assessmentMethodology_network = `
<div class="body_template_class">
  <h3 class="content_heading" id="methodology">5. Assessment Methodology</h3>
  <div class="content">
  
  <h4 class="sub_content_heading">5.1 Three-step Approach </h4>
  
 <div class="sub_sub_content_heading">5.1.1 Footprint Analysis (Collection of Information) </div>
  
 <p> The first step is to gain a preliminary understanding of the target machines, such as Internet 
 connectivity, IP address, packet routing path, operating system types, and target network 
 environment. This information will help create a target profile and provide useful pointers for the 
 next stages. </p>

 
 <div class="sub_sub_content_heading">5.1.2 Vulnerability Assessment  </div>
  
 <p> The second phase involves "probing" and "scanning" HEXAWARE systems to identify possible signs of 
 vulnerability. These include querying the target machines' network port for network connection 
 statistics, the version number of running network services, and verifying the servers' security 
 settings. </p>

 
 <div class="sub_sub_content_heading">5.1.3 Usage Analysis  </div>
  
 <p>   The third phase attempts to demonstrate any plausible security weaknesses by testing the 
 exploitation of the vulnerability to some extent. Data analysis and data correlation are also 
 performed here. Data analysis aims to distinguish false alarms from true alarms, i.e. to eliminate 
 false alarms. All scanning and/or penetration tools present a large number of scan results, some of 
 which are false positives. Therefore, true alarms need to be sorted to eliminate false alarms. Data 
 correlation is required to synergize the raw data collected from various assessment tools into 
 meaningful information regarding suspected vulnerabilities.  </p>
 <br/><br/>

 <div style="text-align:center"> <img src="${process.env.AUDITOR_API_URI}/images/network.png"
 style="width:65%;  height:65% ; text-align:center"></div>
  
  
   
  
 
  </div>
</div>


`

const assessmentMethodology_web_mobile_api = (data) =>  `
<div class="body_template_class">
  <h3 class="content_heading" id="methodology">5. Assessment Methodology</h3>
  <div class="content">
    <p>
    A penetration testing methodology for ${data} typically includes the 
    following steps: <br/><br/>
     
    Probe: Involves gathering information about the target system, such as the target's IP address, server 
    type, operating system, and other details that can help identify vulnerabilities. <br/> <br/>
     
    Enumeration: In this phase, the tester tries to identify any open ports, services or applications that 
    may be running on the target system. This can be done using various tools such as port, network or 
    web application scanners. <br/> <br/>
     
    Vulnerability Scanning: Once the tester has identified the services running on the target system, they 
    can use vulnerability scanners to identify any known vulnerabilities or weaknesses that can be 
    exploited. <br/> <br/>
     
    Exploitation: After identifying vulnerabilities, the tester attempts to exploit them to gain 
    unauthorized access to the target system or its data. This can be done using various tools and 
    techniques such as SQL injection, cross-site scripting or brute force attacks. <br/> <br/>
     
    After Exploitation: After gaining access to the system, the tester attempts to maintain access and 
    escalate privileges to gain more control over the target system. <br/> <br/>
     
    Reporting: Finally, the tester documents his findings and provides the client with recommendations 
    for remediation. This report usually contains a detailed description of the vulnerabilities found, their 
    severity, and recommended steps to mitigate them. <br/> <br/>
     
    It is important to note that this methodology may vary depending on the specific target being tested 
    and the objectives of the test.  <br/> <br/>
    </p>
   <div style="text-align:center"> <img src="${process.env.AUDITOR_API_URI}/images/assessment_methodology_web_mob_api.png"
   style="width:50%;  height:50% ; text-align:center"></div>
  </div>
</div>


`

const executiveSummary = (company_name, vulnerabilities) => {
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;
  let informational = 0;
  for (let i = 0; i < vulnerabilities.length; i++) {
    // console.log("hi", vulnerabilities)
    if (vulnerabilities[i].Severity === "Critical") {
      critical++;
    } if (vulnerabilities[i].Severity === "High") {
      high++;
    } if (vulnerabilities[i].Severity === "Medium") {
      medium++;
    } if (vulnerabilities[i].Severity === "Low") {
      low++;
    } if (vulnerabilities[i].Severity === "Informational") {
      informational++;
    }
  }
  return `
    <div class="body_template_class">
      <h3 class="content_heading" id="executive_summary">6. Executive Summary</h3>
     <div class="content pt-3">
     <p>
     Xiarch conducted a comprehensive security assessment of
     <strong>${company_name}</strong> in order to determine existing
     vulnerabilities and establish the current level of security risk associated
     with the environment and the technologies in use. This assessment harnessed
     penetration testing and vulnerability assessment techniques to provide
     <strong>${company_name}</strong> management with an understanding of the
     risks and security posture of their corporate environment.
   </p>
   <h4 class="sub_content_heading">6.1 Application Health</h4>
   <br/>
   <div class="executive_summary_application_health">
       <div class="executive_summary_ring" style="border: 12px solid #ff0000">
         <p
           class="executive_summary_text"
           style="text-align: center; color: #ff0000"
         >
           Critical 
         </p>
         <p
         class="executive_summary_text"
         style="text-align: center; color: #ff0000"
       >${critical}
       </p>

       </div>
       <div class="executive_summary_ring" style="border: 12px solid #dc3545;">
         <p
           class="executive_summary_text"
           style="text-align: center; color: #dc3545"
         >
           High
         </p>
         <p class="executive_summary_text"
         style="text-align: center; color: #dc3545"
       >${high}
       </p>
       </div>
       <div class="executive_summary_ring" style="border: 12px solid #ffc107">
         <p class="executive_summary_text"
           style="text-align: center; color: #ffc107"
         >
           Medium
         </p>
         <p class="executive_summary_text"
           style="text-align: center; color: #ffc107"
         >${medium}
         </p>
       </div>
       <div class="executive_summary_ring" style="border: 12px solid #198754">
         <p
           class="executive_summary_text"
           style="text-align: center; color: #198754"
         >
           Low 
         </p>
         <p
         class="executive_summary_text"
         style="text-align: center; color: #198754"
       >${low}
       </p>
       </div>
       <div class="executive_summary_ring" style="border: 12px solid #0dcaf0">
         <p
           class="executive_summary_text"
           style="text-align: center; color: #0dcaf0"
         >
           Info. 
         </p>
         <p
         class="executive_summary_text"
         style="text-align: center; color: #0dcaf0"
       >${informational}
       </p>
       </div>
     </div>
   <div class="sub_sub_content_heading" style="text-align:center;">Severity Stats</div>
   
   <div style="text-align:center; marginRight:30px"><canvas id="chart" width="500" height="400" style="text-align : center"></canvas></div>
   
   <div class="sub_sub_content_heading" style="text-align:center;">Bar Chart - Severity Stats</div>
  <!-- <p>The vulnerabilities found during the audit are as follows:</p>
   <ul>
   ${vulnerabilities.map((data, index) => {
    if (data.Status === "Open" || data.Status === "Closed") {
      return ` <li key=${index}>${data.Title}</li>
     `
    }
  }).join('')} -->
     
    
   </ul>
   </div>
    </div>
    
    `
}

const toolsAndReferences = `
<div class="body_template_class">

    <h3 class="content_heading" id="tools_and_references">
      9. Tools & Reference <br/><br/>
    </h3>
    <h4 class="sub_content_heading">9.1 Tools </h4>
  <div class="content pt-3">  <p>The following tools were used for Application Security Testing</p>
  <ul>
    <li>Burp Suite Proxy</li>
    <li>Mozilla Web Browser with Firebug</li>
    <li>SQL Map</li>
    <li>IBM Rational AppScan</li>
    <li>Some other proprietary scripts and tools were also used.</li>
  </ul>

  <br/></div>
    <h4 class="sub_content_heading">9.2 References  </h4>
   <div class="content pt-3"> <p>The following tools were used for Application Security Testing</p>
   <ul>
     <li class="reference_check">For application security visit www.owasp.org</li>
     <ul>
       <li>http://cert.org/other_sources/tool_sources.html</li>
       <li>http://securityfocus.com/</li>
       <li>http://projects.webappsec.org/w/page/13246978/Threat Classification</li>

     </ul>
     <li>Security advisories </li>
   </ul></div>


  </div>

`
const toolsAndReferences_mobile = `
<div class="body_template_class">

    <h3 class="content_heading" id="tools_and_references">
      9. Tools & Reference <br/><br/>
    </h3>
    <h4 class="sub_content_heading">9.1 Tools </h4>
  <div class="content pt-3">  <p>The following tools were used for Application Security Testing</p>
  <ul>
    <li>NoxPlayer</li>
    <li>APK Tool</li>
    <li>ImmuniWeb MobileSuite</li>
    <li>BurpSuite</li>
    <li>Some other proprietary scripts and tools were also used.</li>
  </ul>

  <br/></div>
    <h4 class="sub_content_heading">9.2 References  </h4>
   <div class="content pt-3"> <p>The following tools were used for Application Security Testing</p>
   <ul>
     <li class="reference_check">For application security visit www.owasp.org</li>
     <ul>
       <li>http://cert.org/other_sources/tool_sources.html</li>
       <li>http://securityfocus.com/</li>
       <li>http://projects.webappsec.org/w/page/13246978/Threat Classification</li>

     </ul>
     <li>Security advisories </li>
   </ul></div>


  </div>

`


const toolsAndReferences_api = `
<div class="body_template_class">

    <h3 class="content_heading" id="tools_and_references">
      9. Tools & Reference <br/><br/>
    </h3>
    <h4 class="sub_content_heading">9.1 Tools </h4>
  <div class="content pt-3">  <p>The following tools were used for API/WebService Security Testing</p>
  <ul>
    <li>Burp Suite</li>
    <li>Soap UI</li>
    <li>Postman</li>
    <li>Accunetix Scanner</li>
    <li>Some other proprietary scripts and tools were also used.</li>
  </ul>

  <br/></div>
    <h4 class="sub_content_heading">9.2 References  </h4>
   <div class="content pt-3"> <p>The following tools were used for API/WebService Security Testing</p>
   <ul>
     <li class="reference_check">For application security visit www.owasp.org</li>
     <ul>
       <li>http://cert.org/other_sources/tool_sources.html</li>
       <li>http://securityfocus.com/</li>
       <li>http://projects.webappsec.org/w/page/13246978/Threat Classification</li>

     </ul>
     <li>Security advisories </li>
   </ul></div>


  </div>

`

const toolsAndReferences_network = `
<div class="body_template_class">

    <h3 class="content_heading" id="tools_and_references">
      9. Tools & Reference <br/><br/>
    </h3>
    <h4 class="sub_content_heading">9.1 Tools </h4>
  <div class="content pt-3">  <p>The following tools were used for Network Security Testing</p>
  <ul>
    <li>Nmap</li>
    <li>Nessus</li>
    <li>Nexpose</li>
    <li>Wireshark</li>
    <li>OpenVAS</li>
    <li>Metasplot</li>
    <li>Some other proprietary scripts and tools were also used.</li>
  </ul>

  <br/></div>
    <h4 class="sub_content_heading">9.2 References  </h4>
   <div class="content pt-3"> <p>The following tools were used for Network Security Testing</p>
   <ul>
     <li class="reference_check">For application security visit www.owasp.org</li>
     <ul>
       <li>http://cert.org/other_sources/tool_sources.html</li>
       <li>http://securityfocus.com/</li>
       <li>http://projects.webappsec.org/w/page/13246978/Threat Classification</li>

     </ul>
     <li>Security advisories </li>
   </ul></div>


  </div>

`
module.exports = {
  webAuditFrontPage,introduction_network,toolsAndReferences_network , toolsAndReferences_api , toolsAndReferences_mobile,  term_defination_legends_network,assessmentMethodology_web_mobile_api, tableOfContent_network, assessmentMethodology_network, webDisclaimer, tableOfContent_web, documentControl, template_css, introduction, scope, term_defination_legends, executiveSummary, toolsAndReferences, mobileAuditFrontPage, APIAuditFrontPage, networkAuditFrontPage
}