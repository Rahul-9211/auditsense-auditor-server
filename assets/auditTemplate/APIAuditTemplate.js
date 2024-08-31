const Moment = require('moment');
const { APIAuditFrontPage, webDisclaimer, tableOfContent_web, documentControl, introduction, scope, term_defination_legends, toolsAndReferences, executiveSummary, template_css, assessmentMethodology_web_mobile_api, toolsAndReferences_api } = require('../json/auditJSON');
// import webAuditFrontPage from "../json/auditJSON"


module.exports =  (reportData, closure) => {
    // console.log("reportData", reportData.ReportDetails.DocumentControl)
    let current_date = Moment().format("MMM Do YY");
    var figure_count = 1;
    var page_no_global = 1;
    var table_of_content_page_count = 4;
    // console.log("list - ", list)
    // console.log("listmain - ", list)

    const vulnerabilities =  reportData.ReportDetails.AuditDetails;

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

    // loop to store vulnerabilities with order ->
    // critical -> high -> medium -> low -> informational
    // let newList = new Array()
    // for(let i =0 ; i< 5 ; i++){
    //     for(let j=0 ; j<list.length ; j++){
    //         if(list[j])
    //     }
    // }

    // Footer template --------------------->>>>>>>>>>>>
    // Footer Function 
    function footer_fun(page_no) {
        // console.log("data - ", page_no)
        return ``
    }

    function getlist(page_no) {
        return `
        <div class="d-flex justify-content-between ">
        <a  href="#contact_info">3.2 Assumptions
        <a href="#contact_info">${table_of_content_page_count++}  </a>
        </div>`
    }

    var table_count = 1;

    var vulberability_table_title_count = 8;
    var changing_variable = 1

    function get_vulberability_table_title_count() {
        changing_variable += 1;
        return `${vulberability_table_title_count}.${changing_variable}`
    }

    function print_all_vulnerability_POC(data) {
        // console.log("data", data)
        var result = ``;
        if (data === "null" || data === undefined) {
            return ``;
        }
        else {
            for (let i = 0; i < data.length; i++) {
                result += ` <div class="vulnerability_img">
                <img src="${process.env.AUDITOR_API_URI}/images/${data[i].POCFilename}"
                style="width:100%; max-height:380px;">
                <p style="color:black;">Figure ${figure_count++} - ${data[i].POCDescription}</p>
                </div>`
            }
            // console.log("main", result)
            return result;
        }
    }

    function get_vulnerability_table2(data) {
        return `
        <div class="body_template_class">
        <div class="content_heading" id="assessment_findings_details"></div>
        <div class="">
            <table class="table table-bordered mt-4" style="border-color:black;">

            <tbody>
            <tr  class="bg-sky-blue" >
            <td colspan="4" class="">
            <h3 class="content_table_white vulnerability_dynamic_table_heading fw-bold" style="margin : 0px" id=""> ${get_vulberability_table_title_count()} ${data.Title}</h3></td>
            </tr>
            <tr>
                <td class="content_table_white align-middle fw-bold">Risk Level</td>
                <td class="content_table_white align-middle text-dark fw-normal ${data.Severity === "Informational" ? "bg-info" : data.Severity === "Critical" ? "bg-critical" : data.Severity === "High" ? "bg-danger" : data.Severity === "Medium" ? "bg-warning" : "bg-success"}">${data.Severity}</td>
                
            <td class="content_table_white align-middle fw-bold">Status</td>
            <td class="content_table_white align-middle fw-normal ${data.Status === "Open" ? "text-danger" : data.Status === "Closed" ? "text-success" : "text-dark"} " >${data.Status}</td>
            </tr>
            <tr>
                <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Description : </strong>  ${data.Description}</td>
            </tr>
            <tr>
                <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Impact : </strong>  ${data.Impact}</td>
            </tr>
            <tr>
                <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Remediation : </strong>  ${data.Remediation}</td>
            </tr>
            <tr>
                <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Affects : </strong>   ${data.Affects}
                </td>
            </tr>
            
            <tr>
            <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">CVSS Vector : </strong>   ${data.CVSS_Vector}
            </td>
        </tr>
           
        </tbody>
            </table>
            ${data.Status === "Closed" ? print_all_vulnerability_POC(data.POC) : ""}
            ${data.Status === "Open" ? print_all_vulnerability_POC(data.POC) : ""}
    </div>
   
    </div> 
    
`
    }
    function get_vulnerability_table(data) {
        return `
        <div class="body_template_class">
        <div class="content_heading" id="">
        
        <div class="">
            <table class="table table-bordered mt-4" style="border-color:black;">
                <tbody>
                    <tr  class="">
                    
        <td colspan="4"  style="background-color:#E0E0E0;" class="content_table_white align-middle fw-bold">Observation ID & Title </td>
                        <td colspan="8" class="p-2" >
                        
        <h3 class="content_table_white vulnerability_dynamic_table_heading fw-bold" style="margin : 0px" id="">${get_vulberability_table_title_count()} ${data.Title}</h3>
        </td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="3" style="background-color:#E0E0E0;">CVSS Risk Rating </td>
                        <td colspan="3" class="content_table_white align-middle text-light fw-bold ${data.Severity === "Informational" ? "bg-info" : data.Severity === "Critical" ? "bg-critical" : data.Severity === "High" ? "bg-danger" : data.Severity === "Medium" ? "bg-warning" : "bg-success"}">${data.Severity}</td>
                        <td colspan="3" class="content_table_white align-middle fw-bold" style="background-color:#E0E0E0;">Status  </td>
                    <td colspan="3" class="content_table_white align-middle fw-bold ${data.Status === "Open" ? "bg-danger" : data.Status === "Closed" ? "bg-success" : "bg-dark"} " style="color:white;">${data.Status}</td>
                        </tr>
                    <tr>
                    
                </tr>
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Observation Details </td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle" colspan="12" > ${data.Description}</td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Risk </td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle" colspan="12" > ${data.Impact}</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Recommendations </td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle" colspan="12" > ${data.Remediation}</td>
                    </tr>
    
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Affected URL & Parameter </td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle" colspan="12" > ${data.Affects}</td>
                    </tr>
    
                    <tr>
                        <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">CVSS Vector </td>
                    </tr>
                    
                    <tr>
                        <td class="content_table_white align-middle" colspan="12" > ${data.CVSS_Vector}</td>
                    </tr>
                  
                </tbody>
            </table>
            ${data.Status === "Closed" ? print_all_vulnerability_POC(data.POC) : ""}
            ${data.Status === "Open" ? print_all_vulnerability_POC(data.POC) : ""}
    </div>
    </div>
    </div>
`
    }

    // pdf 
    async function get_rows() {
        let result = '';
        list.map((data) => {
            result += ` <tr>
            <td class="content_table_white  align-middle text-center">${table_count++}</td>
            <td class="content_table_white  ">Conduct Search Engine Discovery and Reconnaissance for
                Information Leakage</td>
            <td class="content_table_white  align-middle text-center bg-danger text-light">${data}</td>
            <td class="content_table_white  align-middle text-center text-danger">Open</td>
        </tr>`
        })
        console.log("result", result)
        return result;
    }

    //  header template -----------------------:>>>>>>>>>>>>>>>
    let header = `	
    `


    // let assessment_findings_overview template ------------------------------>>>>>>>>>>>>>>>>>>
    let assessmentFindingsOverview = `
    <div class="body_template_class">
    <h4 class="content_heading " id="assessment_findings_overview">7. Assessment Findings Overview</h4>
   
    <div class="content pt-2">  <p>The table below provides a summary of the assessment findings categorized by group and ranked by severity. The table provides an overview of all of the findings from the assessment and allows the remediation team to focus efforts on the areas of highest severity as determined by Xiarch Labs. Click the individual link below to go directly to that finding.</p>
    <table class="table table-bordered mt-3" style="border-color:black;">
    <tbody>
        <tr class="bg-sky-blue">
            <td class="content_table_white  fw-bold  align-middle text-center" width="10%">S. No.</td>
            <td class="content_table_white fw-bold  align-middle" width="50%">Vulnerability Title</td>
            <td class="content_table_white fw-bold  align-middle text-center">Severity</td>
            <td class="content_table_white fw-bold  align-middle text-center">Status</td>
        </tr>
        ${reportData.ReportDetails.AuditDetails.map((data, index) => {
        return `<tr>
           <td class="content_table_white  align-middle text-center  fw-bold">${table_count++}</td>
           <td class="content_table_white  ">${data.Title} </td>
           <td class="content_table_white  align-middle text-center fw-bold ${data.Severity === "Informational" ? "bg-info" : data.Severity === "Critical" ? "bg-critical" : data.Severity === "High" ? "bg-danger" : data.Severity === "Medium" ? "bg-warning" : "bg-success"} text-dark">${data.Severity}</td>
           <td class="content_table_white  fw-bold align-middle text-center ${data.Status === "Open" ? "text-danger" : data.Status === "Closed" ? "text-success" : "text-dark"} " >${data.Status}</td>
       </tr>`
    }).join('')}
      
    </tbody>
</table>
    </div>
</div>
    `

    // let assisment_finding_interviewtemplate ------------------------------>>>>>>>>>>>>>>>>>>
    let assismentFindingDetails2 = `
    <div class="body_template_class">
    <h4 class="content_heading" id="assessment_findings_details">8. Assessment Findings Details</h4>
    <div class="">
        <table class="table table-bordered mt-4" style="border-color:black;">
            <tbody>
                <tr  class="bg-sky-blue" >
                    <td colspan="4" class="">
                    <h3 class="content_table_white vulnerability_dynamic_table_heading fw-bold" style="margin : 0px" id="">8.1 ${reportData.ReportDetails.AuditDetails[0].Title}</h3></td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle fw-bold">Risk Level</td>
                    <td class="content_table_white align-middle text-dark fw-bold ${reportData.ReportDetails.AuditDetails[0].Severity === "Informational" ? "bg-info" : reportData.ReportDetails.AuditDetails[0].Severity === "Critical" ? "bg-critical" : reportData.ReportDetails.AuditDetails[0].Severity === "High" ? "bg-danger" : reportData.ReportDetails.AuditDetails[0].Severity === "Medium" ? "bg-warning" : "bg-success"}">${reportData.ReportDetails.AuditDetails[0].Severity}</td>
                    
                    <td class="content_table_white align-middle fw-bold">Status</td>
                    <td class="content_table_white align-middle fw-bold ${reportData.ReportDetails.AuditDetails[0].Status === "Open" ? "text-danger" : reportData.ReportDetails.AuditDetails[0].Status === "Closed" ? "text-success" : "text-dark"} " >${reportData.ReportDetails.AuditDetails[0].Status}</td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Description : </strong>  ${reportData.ReportDetails.AuditDetails[0].Description}</td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Impact : </strong>  ${reportData.ReportDetails.AuditDetails[0].Impact}</td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Remediation : </strong>  ${reportData.ReportDetails.AuditDetails[0].Remediation}</td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">Affects : </strong>   ${reportData.ReportDetails.AuditDetails[0].Affects}
                    </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="4"><strong class="fw-bold">CVSS Vector : </strong>   ${reportData.ReportDetails.AuditDetails[0].CVSS_Vector}
                    </td>
                </tr>
                
            </tbody>
        </table>
        ${reportData.ReportDetails.AuditDetails[0].Status === "Closed" ? print_all_vulnerability_POC(reportData.ReportDetails.AuditDetails[0].POC) : ""}
        ${reportData.ReportDetails.AuditDetails[0].Status === "Open" ? print_all_vulnerability_POC(reportData.ReportDetails.AuditDetails[0].POC) : ""}
</div>
</div>
    `
    let assismentFindingDetails = `
    <div class="body_template_class">
    <div class="content_heading" id="">
    <h4 class="content_heading" id="assessment_findings_details">8. Assessment Findings Details</h4></div>
    <div class="">
        <table class="table table-bordered mt-4" style="border-color:black;">
            <tbody>
                <tr  class="">
                
    <td colspan="4"  style="background-color:#E0E0E0;" class="content_table_white align-middle fw-bold">Observation ID & Title </td>
                    <td colspan="8" class="p-2" >
                    
    <h3 class="content_table_white vulnerability_dynamic_table_heading fw-bold" style="margin : 0px" id="">8.1 ${reportData.ReportDetails.AuditDetails[0].Title}</h3>
    </td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="3" style="background-color:#E0E0E0;">CVSS Risk Rating </td>
                    <td colspan="3" class="content_table_white align-middle text-light fw-bold ${reportData.ReportDetails.AuditDetails[0].Severity === "Informational" ? "bg-info" : reportData.ReportDetails.AuditDetails[0].Severity === "Critical" ? "bg-critical" : reportData.ReportDetails.AuditDetails[0].Severity === "High" ? "bg-danger" : reportData.ReportDetails.AuditDetails[0].Severity === "Medium" ? "bg-warning" : "bg-success"}">${reportData.ReportDetails.AuditDetails[0].Severity}</td>
                    <td colspan="3" class="content_table_white align-middle fw-bold" style="background-color:#E0E0E0;">Status  </td>
                <td colspan="3" class="content_table_white align-middle fw-bold ${reportData.ReportDetails.AuditDetails[0].Status === "Open" ? "bg-danger" : reportData.ReportDetails.AuditDetails[0].Status === "Closed" ? "bg-success" : "bg-dark"} "  style="color:white;">${reportData.ReportDetails.AuditDetails[0].Status}</td>
                    </tr>
                <tr>
                
            </tr>
                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Observation Details </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="12" > ${reportData.ReportDetails.AuditDetails[0].Description}</td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Risk </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="12" > ${reportData.ReportDetails.AuditDetails[0].Impact}</td>
                </tr>
                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Recommendations </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="12" > ${reportData.ReportDetails.AuditDetails[0].Remediation}</td>
                </tr>

                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">Affected URL & Parameter </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="12" > ${reportData.ReportDetails.AuditDetails[0].Affects}</td>
                </tr>

                <tr>
                    <td class="content_table_white align-middle fw-bold" colspan="12" style="background-color:#E0E0E0;">CVSS Vector </td>
                </tr>
                
                <tr>
                    <td class="content_table_white align-middle" colspan="12" > ${reportData.ReportDetails.AuditDetails[0].CVSS_Vector}</td>
                </tr>
              
            </tbody>
        </table>
        ${reportData.ReportDetails.AuditDetails[0].Status === "Closed" ? print_all_vulnerability_POC(reportData.ReportDetails.AuditDetails[0].POC) : ""}
        ${reportData.ReportDetails.AuditDetails[0].Status === "Open" ? print_all_vulnerability_POC(reportData.ReportDetails.AuditDetails[0].POC) : ""}
</div>
</div>
    `

    // let tools_and_references template ------------------------------>>>>>>>>>>>>>>>>>>


    return `<!doctype html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <title>A simple, clean, and responsive HTML invoice template</title>
       
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">

        <style>

        ${template_css}
        </style>
    </head>
    
    <body>
    

    <!--FRont  page -->
    ${APIAuditFrontPage(reportData.ReportDetails.AuditeeOrganizationDetails.OrganizationLogo , reportData.ReportDetails.AuditeeOrganizationDetails.OrganizationName)}

    <!-- page disclaimer -->
    ${webDisclaimer}

    <!-- page tableOfContent_web -->
    ${tableOfContent_web(reportData.ReportDetails.AuditDetails)}

    <!-- page documentControl -->
    ${documentControl(reportData.ReportDetails.DocumentControl,reportData.ReportDetails.ScopeDetails.APIName,  reportData.ReportDetails.AuditeeOrganizationDetails.OrganizationName, reportData.ReportDetails.AuditorOrganizationDetails.OrganizationName, closure)}
    <!-- page introduction -->
    ${introduction(reportData.ReportDetails.ScopeDetails.APIName, "API")}

    <!-- page scope -->
    ${scope(reportData.ReportDetails.ScopeDetails.ReportScope)}

    <!-- page term_defination_legends -->
    ${term_defination_legends}

    <!-- page assessmentMethodology -->
    ${assessmentMethodology_web_mobile_api("APIs")}
    
    <!-- page executiveSummary - 9 -->
    ${executiveSummary(reportData.ReportDetails.AuditeeOrganizationDetails.OrganizationName, reportData.ReportDetails.AuditDetails)}

    <!-- page assessmentFindingsOverview -->
    ${assessmentFindingsOverview}

    <!-- page assismentFindingDetails-->
    ${assismentFindingDetails}

    <!-- pagedynamic pages  -->
    ${reportData.ReportDetails.AuditDetails.map((data, index) => {
        if (index != 0) {
            return ` <div class="page" >
        ${get_vulnerability_table(data)}
         </div>`
        }
    }).join('')} 
    
    <!-- page twelve - 12 -->
    <div class="page" id="">
    ${toolsAndReferences_api}
    </div>
       
    </body>     
    <script>
    const canvas = document.getElementById("chart");
    var ctx = canvas.getContext("2d");
    
    // Define the data for the bar graph
    var data = [${critical}, ${high}, ${medium}, ${low}, ${informational}];
    
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
    </html> `;
};