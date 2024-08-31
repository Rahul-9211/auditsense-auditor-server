// const fs = require('fs');
const Moment = require('moment')

// const image = path.join(__dirname, '../images/img.png')
// const file = fs.readFileSync(image)
//  Level_1_Approvel: req.body.l1ApprovalDate,
module.exports = (imgName, list) => {
    // const newPath = __dirname + "\\img.png";
    // console.log(`${process.env.URL}/${imgName}`)
    console.log(imgName)
    // console.log(`${process.env.URL}/${filename}`)
    const test_arr = ["test1", "test2", "test3"]
    // const today = date;
    let return_str;
    let conclutions;
    var page_no_global = 1;
    for (let i = 0; i < 4; i++) {
        conclutions += `<p class="subHeader">CONCLUSIONS : </p>`
        // console.log("data - ", page_no_global++)
    }
    // console.log(typeof(page_no_global))
    function footer_fun(page_no) {
        // console.log("data - ", page_no)
        return `
        <div class="footer">
        <div class=" sub_footer pb-3">
            <div class="client"> Private and Confidential
            </div>
            <div class="website">www.xiarch.com</div>
            <div class="page_no">Page No. ${page_no} </div>
        </div>
        <div class="footer_text">The information in this document has been classified as 'Confidential'. This
            classification
            applies to the most sensitive business
            information. Its unauthorized disclosure could seriously and adversely impact the owner, its stakeholders,
            its
            business partners, and/or its
            customers leading to legal and financial repercussions and adverse public opinion
        </div>
    </div>`
    }
    function page_1ww(page_no) {
        return `
        <div class="body_template_class">
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <div class="main_heading">
            <p id="logo">Penetration Testing Report</p>
            <small>June 30, 2021</small>
        </div>
        <br /> <br /> <br /> <br /> <br />
        <div class="sub_heading">
            <small>Report For</small>
            <p>Avendus Finance Private Limited</p>
        </div>


        <table>
            <tbody class="info">
                <tr>
                    <td class="head">Prepared by:</td>
                    <td class="data">Xiarch Solutions Private Limited</td>
                </tr>
                <tr>
                    <td class="head"> Email:</td>
                    <td class="data">info@xiarch.com</td>
                </tr>
                <tr>
                    <td class="head">Phone: </td>
                    <td class="data">+91-999999999</td>
                </tr>
            </tbody>
        </table>
    </div>
    `
    }

    function vuul_list(params, index) {
        return `${header}
    <div class="body_template_class key=${index}">
    <div class="content_heading" id="term_defination_legends">
        <div class="">
            <table class="table table-bordered" style="border-color:black;">
                <tbody>
                    <tr>
                        <td colspan="2" class="content_table_white bg-secondary text-light">9.1 Conduct Search
                            Engine Discovery and
                            Reconnaissance for Information Leakage</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Risk Level</td>
                        <td class="content_table_white align-middle text-light bg-danger">${params}</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Category</td>
                        <td class="content_table_white align-middle">Information Gathering</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Description</td>
                        <td class="content_table_white align-middle">There are direct and indirect elements to
                            search engine discovery and
                            reconnaissance. Direct methods relate to searching the indexes and the associated
                            content from caches. Indirect methods relate to gleaning sensitive design and
                            configuration information by searching forums, newsgroups, and tendering
                            websites</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Impact</td>
                        <td class="content_table_white align-middle">The attacker can able to understand what
                            sensitive design and configuration
                            information of the application/system/organisation is exposed both directly (on the
                            organisations website) or indirectly (on a third party website).</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Remediation</td>
                        <td class="content_table_white align-middle">Update the robot.txt file on your application
                            to exclude a sensitive directory from
                            the crawling of search engine spiders.</td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Reference</td>
                        <td class="content_table_white align-middle">
                            https://kennel209.gitbooks.io/owasp-testing-guide-v4/content/en/web_application
                            _security_testing/conduct_search_engine_discovery_and_reconnaissance_for_infor
                            mation_leakage_otg-info-001.html
                        </td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Affects</td>
                        <td class="content_table_white align-middle">
                            http://localhost/xiarch/office/development/App/RGS/112/pp/audit.php?pid=PID182
                            30
                        </td>
                    </tr>
                    <tr>
                        <td class="content_table_white align-middle">Status</td>
                        <td class="content_table_white align-middle" style="background-color:#eeeeee;">Open</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
${footer_fun(page_no_global++)}`
    }

    async function dynamic_pages() {
        let return_html = ``;
        for (let vul of list) {
            console.log("vul - ", vul)
            return_html += `<div>asdasd</div>`
        }
        console.log(return_html)
        return `${return_html}`;
    }

    let current_date = Moment().format("MMM Do YY");
    //  header template -----------------------:>>>>>>>>>>>>>>>
    let header = `<div class="header">
<div class="logo">   <img src="${process.env.AUDITOR_API_URI}/images/Xiarch_logo.svg"
style="width:100%; max-width:200px;"></div>
</div>`


    // Footer template --------------------->>>>>>>>>>>>

    // page 1 Template --------------------------------->>>>>>>>>>>>>>>
    let page_1 = `
    <div class="body_template_class page_1">
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <div class="main_heading">
            <p id="logo">Web Penetration Testing Report</p> <br /> 
        </div>
        <div class="report_for sub_heading">
        <br><br>
        <table style="width:400px">
            <tbody class="info">
            <tr>
                <td class="head report_heading">Report For :</td>
            </tr>
                <tr>
                    <td class="head">Organization Name</td>
                    <td class="head2"> : </td>
                    <td class="data">SampleCorp LLC</td>
                </tr>
                <tr>
                    <td class="head">Report Date</td>
                    <td class="head2"> : </td>
                    <td class="data">${current_date}</td>
                </tr>
            </tbody>
        </table></div>

        <br><br><br>
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
                    <td class="data">+91-999999999</td>
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

    let page_count_for_table_of_content = 1
    // page 2 Template --------------------------------->>>>>>>>>>>>>>>
    let page_3 = `
    <div class="body_template_class table_of_content">
        <div class="main_heading">
            <h2 class="text-start pb-4">Table Of Content</h2>
        </div>
        <div class="content">
            <a href="#document_control">1.
            Document  Control  </a>
            <a  href="#introduction">2. Introduction </a>
            <a  href="#scope">3. Scope 
            
            <div class="sub_content">
               <a  href="#version_history">3.1 Technical Summary</a>
                <a  href="#contact_info">3.2 Assumptions</a> 
            </div>
            
            </a>
            <a  href="#term_defination_legends">4. Terms, Definition & Legends</a>
           <a  href="#methodology"> 5. Assessment Methodology</a>
            <a  href="#executive_summary">6. Executive Summary               </a>
            <a  href="#assessment_findings_overview">7. Assessment Findings Overview</a>
            <a  href="#assessment_findings_details">8. Assessment Findings Details</a>
            <a  href="#tools_and_references">9. Tools & Reference</a>
        </div>
    </div>
    `
    let page_3_old = `
    <div class="body_template_class table_of_content">
        <div class="main_heading">
            <h2 class="text-start pb-4">Table Of Content</h2>
        </div>
        <div class="content">
            <a href="#document_control">1.
            Document  Control  </a>
            <div class="sub_content">
               <a  href="#version_history"> 1.1 Version History</a>
                <a  href="#contact_info">1.2 Contact Information</a> 
            </div>
            <a  href="#introduction">2. Introduction </a>
            <div class="sub_content">
               <a  href="#summary"> 2.1 Summary </a>
                <a  href="#aim">2.2 Aim</a>
                <a  href="#assessment_objective">2.3 Assesment Objective </a>
                <a  href="#xiarch_sol_pvt_ltd_audit_team">2.4 Xiarch Solutions Private Limited Security Audit Team</a>
            </div>
            <a  href="#scope">3. Scope</a>
            <a  href="#term_defination_legends">4. Terms, Definition & Legends</a>
            <div class="sub_content">
               <a  href="#vulnerability_table"> 4.1 VULNERABILITY TABLE </a>
               <a  href="#title_of_finding"> 4.2 TITLE OF THE FINDING - A SHORT TITLE THAT DESCRIBES THE FINDINGS </a>
            </div>
           <a  href="#methodology"> 5. Assessment Methodology</a>
            <div class="sub_content">
                <a  href="#reporting_and_analysis">5.1 Reporting and Analysis phase</a>
                <a  href="#testing_phase">5.2 Testing Phase </a>
                <a  href="#audit_methodology">5.3 Audit Methodology which we follow </a>
                <div class="sub_sub_content">
                    <a  href="#information_gathering">5.3.1 nformation Gathering</a>
                    <a  href="#document_control">5.3.2 Configuration and Deplyment Managment Testing </a>
                    <a  href="#document_control">5.3.3 Identity Managment Testing</a>
                    <a  href="#document_control">5.3.4 Authentication Testing </a>
                    <a  href="#document_control">5.3.5 Autherization Testing </a>
                    <a  href="#document_control">5.3.6 Session Managment Testing </a>
                    <a  href="#document_control">5.3.7 Input Validation Testing </a>
                    <a  href="#document_control">5.3.8 Testing For Error Handling  </a>
                    <a  href="#document_control">5.3.9 Testing For Week Cryptography </a>
                    <a  href="#document_control">5.3.10 Business Logic Testing  </a>
                    <a  href="#document_control">5.3.11 Client Side  Testing  </a>

                </div>
            </div>
            <a  href="#executive_summary">6. Executive Summary               </a>
            <a  href="#assessment_findings_overview">7. Assessment Findings Overview</a>
            <a  href="#assessment_findings_details">8. Assessment Findings Details</a>
            <div class="sub_content">
                <a  href="#document_control">8.1 Fingerprint Web Search </a>
            </div>
            <a  href="#tools_and_references">9. Tools & Reference</a>
        </div>
    </div>
    `

    // page 3 Template --------------------------------->>>>>>>>>>>>>>>
    let page_2 = `
    <div class="body_template_class disclaimer ">
        <div class="content_heading" id="disclaimer">Disclaimer</div>
        <div class="content pt-3">
            <p class="footer_text">All the information contained in this document is confidential to said company, disclosure and use of any information contained in this document by photographic, electronic or any other means, in whole or part, for any reason other than security enhancement is strictly prohibited without written consent of auditee organization. <br /><br />
                 Whilst all due care and diligence has been taken in the preparation of this document it is not impossible that document of this nature may contain errors or omissions because of a misunderstanding of Clients requirements. Any recommendations are made in good faith as guidelines to assist the client in evaluation and must not be construed as warranties of any kind. Findings in this report are based on various tests conducted using manual techniques and third-party tools and Xiarch Solutions Pvt Ltd has put its best efforts to eliminate all the false positives reported by these tools.<br /><br />
                 Xiarch Solutions Pvt Ltd shall assume no liability for any changes, omissions, or errors in this document. Xiarch Solutions Pvt Ltd shall not be liable for any damages financial or otherwise arising out of use/misuse of this report by any general member of public. </p><br /><br />
        </div>

        
    </div>
    `

    // page 4 Template --------------------------------->>>>>>>>>>>>>>>
    let page_4 = `  
   
    <div class="body_template_class document_control">
        <div class="body_template_class disclaimer">
            <div class="content_heading" id="document_control">1. Document Control</div>
        </div>
    </div>
    `
    // page 4 Template --------------------------------->>>>>>>>>>>>>>>
    let page_4_document_control = `  
   
    <div class="body_template_class document_control">
        <div class="body_template_class disclaimer">
            <div class="content_heading" id="document_control">1. DOCUMENT CONTROL</div>
            <div class="">
                <table class="table table-bordered mt-2" style="border-color:black;">
                    <tbody>
                        <tr>
                            <td class="content_table_grey" style="background-color:#eeeeee;">DOCUMENT NAME :</td>
                            <td class="content_table_white">Document full name</td>
                        </tr>
                        <tr>
                            <td class="content_table_grey" style="background-color:#eeeeee;">ABSTRACT : </td>
                            <td class="content_table_white">This report contains the findings of vulnerability
                                assessment of CMS
                                Dashboard conducted for Avendus Finance Private Limited.</td>
                        </tr>
                        <tr>
                            <td class="content_table_grey" style="background-color:#eeeeee;">DOCUMENT REFERENCE :</td>
                            <td class="content_table_white">With reference to vulnerability assessment of Applicatin
                                Name
                                conducted for Comapny Name.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="sub_content_heading" id="version_history">2.1 VERSION HISTORY

                <div class="">
                    <table class="table table-bordered mt-2" style="border-color:black;">
                        <tbody>
                            <tr>
                                <td class="sub_content_table_grey" style="background-color:#eeeeee;">Version</td>
                                <td class="sub_content_table_grey" style="background-color:#eeeeee;">Audit</td>
                                <td class="sub_content_table_grey" style="background-color:#eeeeee;">Person</td>
                                <td class="sub_content_table_grey" style="background-color:#eeeeee;">Action</td>
                                <td class="sub_content_table_grey" style="background-color:#eeeeee;">Date</td>
                            </tr>
                            <tr>
                                <td class="sub_content_table_white">1.0</td>
                                <td class="sub_content_table_white">Start</td>
                                <td class="sub_content_table_white">Aakash Mishra</td>
                                <td class="sub_content_table_white">Audit</td>
                                <td class="sub_content_table_white">03/06/2021</td>
                            </tr>
                            <tr>
                                <td class="sub_content_table_white">1.0</td>
                                <td class="sub_content_table_white">Start</td>
                                <td class="sub_content_table_white">Aakash Mishra</td>
                                <td class="sub_content_table_white">Report Prepration</td>
                                <td class="sub_content_table_white">03/06/2021</td>
                            </tr>
                            <tr>
                                <td class="sub_content_table_white">1.0</td>
                                <td class="sub_content_table_white">Start</td>
                                <td class="sub_content_table_white">Aakash Mishra</td>
                                <td class="sub_content_table_white">Audit</td>
                                <td class="sub_content_table_white">03/06/2021</td>
                            </tr>
                            <tr>
                                <td class="sub_content_table_white">1.0</td>
                                <td class="sub_content_table_white">Start</td>
                                <td class="sub_content_table_white">Aakash Mishra</td>
                                <td class="sub_content_table_white">Review & Final Approval </td>
                                <td class="sub_content_table_white">03/06/2021</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="sub_content_heading" id="contact_info">2.2 CONTACT INFORMATION
                <div class="contact_info">
                    <div class="name">Utsav Mittal</div>
                    <div class="designation">Principal Consultant - IS Practice</div>
                    <div class="company">Xiarch Solutions Private Limited</div>
                    <div class="email">utsav@xiarch.com</div>
                    <div class="phone">9510095100</div>
                </div>
            </div>
        </div>
    </div>
    `

    // page 5 Template --------------------------------->>>>>>>>>>>>>>>
    let page_5 = `
    
   
    <div class="body_template_class ">
        <div class="content_heading" id="introduction">2. Introduction</div>
    </div>
    `// page 5 Template --------------------------------->>>>>>>>>>>>>>>
    let page_5_introduction = `
    
   
    <div class="body_template_class ">
        <div class="content_heading" id="introduction">3. INTRODUCTION</div>
        <div class="sub_content_heading" id="summary">3.1 SUMMARY
            <div class="content">
                <p>&nbsp; &nbsp; This is the Web Application Vulnerability Assessment report for Avendus Finance Private
                    Limited (CMS
                    Dashboard) and which was performed from 03/06/2021 to 03/06/2021. <br /><br />
                    &nbsp; &nbsp; All the information contained in this document is confidential to said company,
                    disclosure and use of any
                    information conThe purpose of this exercise is to determine security vulnerabilities of the web
                    applications running on
                    the servers specified as part of the scope. These tests were carried out assuming the identity of an
                    attacker or a user with malicious intent, at the same time due care is taken not to harm the server.
                </p>
            </div>
        </div>
        <div class="sub_content_heading" id="aim">3.2 AIM
            <div class="content">
                <p>&nbsp; &nbsp; The aim of this Vulnerability Assessment was to assess the security of Web Application
                    of Avendus Finance
                    Private Limited (CMS Dashboard)
                </p>
            </div>
        </div>

        <div class="sub_content_heading" id="assessment_objective">3.3 ASSESSMENT OBJECTIVE :
            <div class="content">
                <ul>
                    <li>Identify and assess security flaws in Web Application according to industry principal security
                        standards like OWASP Top 10 etc.</li>
                    <li>Provide recommendations for mitigation of risk(s) emerged during the identified vulnerabilities
                    </li>
                    <li>Each Level of assessment is carried out with manual testing as well as automated tool testing.
                    </li>
                </ul>
            </div>
        </div>
        <div class="sub_content_heading" id="xiarch_sol_pvt_ltd_audit_team">3.4 Xiarch Solutions Private Limited SECURITY AUDIT TEAM :
            <div class="content">
                <ul>
                    <li>Aakash Mishra, Infosec Consultant</li>
                    <li>Kamalesh Maity, Sr. Infosec Consultant
                    </li>
                    <li>Utsav Mittal, Principal Consultant
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `

    // page 6 Template --------------------------------->>>>>>>>>>>>>>>
    let page_6 = `
    <div class="body_template_class">
    <div class="content_heading" id="scope">3. Scope</div>
</div>
    `
    // page 6 Template --------------------------------->>>>>>>>>>>>>>>
    let page_6_scope = `
    <div class="body_template_class">
    <div class="content_heading" id="scope">4. SCOPE</div>
    <div class="content mt-4">
        <p>Xiarch Solutions Private Limited performed the vulnerability tests for the below stated specific scope.
        </p>
        <div class="">
            <table class="table table-bordered mt-2" style="border-color:black;">
                <tbody>
                    <tr>
                        <td class="content_table_grey" style="background-color:#eeeeee;">Serial No </td>
                        <td class="content_table_grey" style="background-color:#eeeeee;">Audit Scope</td>
                    </tr>
                    <tr>
                        <td class="content_table_white">1.</td>
                        <td class="content_table_white">Audit Scope</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
    `

    // page 7 Template --------------------------------->>>>>>>>>>>>>>>
    let page_7 = `
    
  
    <div class="body_template_class">
        <div class="content_heading" id="term_defination_legends">4. Terms, Definition & Legends</div>
    </div>
    `// page 7 Template --------------------------------->>>>>>>>>>>>>>>
    let page_7_terms_and_defination = `
    
  
    <div class="body_template_class">
        <div class="content_heading" id="term_defination_legends">5. TERMS, DEFINITIONS AND LEGENDS</div>
        <div class="content mt-3">
            <p>This section describes the format in which the identified vulnerabilities are reported in the later
                section of
                the report Vulnerability Table shown below used to provide the details of the vulnerability, its impact
                and the
                recommendations.
            </p>
            <div class="sub_content_heading" id="summary">5.1 VULNERABILITY TABLE
                <div class="content">
                    <table class="table table-bordered mt-2" style="border-color:black;">
                        <tbody>
                            <tr>
                                <td colspan="2" class="content_table_white">1. Title of the Vulnerability</td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Risk Level</td>
                                <td class="content_table_white"></td>
                            </tr>

                            <tr>
                                <td class="content_table_white">Description</td>
                                <td class="content_table_white"></td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Impact
                                </td>
                                <td class="content_table_white"></td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Recommendations</td>
                                <td class="content_table_white"></td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Status</td>
                                <td class="content_table_white"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="content mt-2">
                    <table class="table table-borderless mt-2" style="border-color:black;">
                        <tbody>
                            <tr>
                                <td class="content_table_white" width="30%">Title of the Vulnerability</td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">A short title that describes the vulnerability</td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Risk Level</td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">It describes the risk level. The title bar of each
                                    vulnerability table is colour
                                    coded for quick identifications of the severity level of the vulnerabilities</td>
                            </tr>

                            <tr>
                                <td class="content_table_white">Description</td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">It provides a brief description of the vulnerability.
                                </td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Impact
                                </td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">Describes the probable impact if the vulnerability is
                                    successfully exploited.</td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Recommendations</td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">Provide the recommendations to fix the vulnerability.
                                </td>
                            </tr>
                            <tr>
                                <td class="content_table_white">Status</td>
                                <td class="content_table_white">-</td>
                                <td class="content_table_white">Provides the information whether the vulnerability is
                                    closed or not.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="sub_content_heading" id="summary">5.2 TITLE OF THE FINDING – A SHORT TITLE THAT DESCRIBES THE
                FINDINGS
                <div class="content">
                    <div class="sub_content">
                        <p>The title bar of each finding is colour coded for a quick identification of the Risk Level.
                            Title bar colour codes
                            are as follows:</p>
                    </div>
                    <table class="table table-bordered mt-2" style="border-color:black;">
                        <tbody>
                            <tr>
                                <td class=" text-white content_table_white bg-secondary text-center" width="25%">Risk
                                    Exposure</td>
                                <td class=" text-white content_table_white bg-secondary text-center">Description</td>
                            </tr>
                            <tr>
                                <td class="align-middle text-white content_table_white bg-danger text-center"
                                    width="25%">Critical</td>
                                <td class=" content_table_white text-start">The observation represents a
                                    significant weakness in the current control
                                    environment and requires management’s immediate consideration and
                                    action to meet minimum control standards.</td>
                            </tr>

                            <tr>
                                <td class="align-middle text-white content_table_white bg-high text-center"
                                    style="background-color:#b54e4b;" width="25%">High</td>
                                <td class="  content_table_white text-start">The observation represents a
                                    significant weakness in the current control
                                    environment and requires management’s immediate consideration and
                                    action to meet minimum control standards.</td>
                            </tr>
                            <tr>
                                <td class="align-middle text-white content_table_white bg-warning text-center"
                                    width="25%">Medium</td>
                                <td class="content_table_white text-start">The observation is an
                                    opportunity to improve the effectiveness of the
                                    control environment and requires management action in the near term.</td>
                            </tr>
                            <tr>
                                <td class="align-middle text-white content_table_white bg-success text-center"
                                    width="25%">Low</td>
                                <td class=" content_table_white text-start">The observation is an
                                    opportunity to improve efficiency of the control
                                    processes.
                                </td>
                            </tr>
                            <tr>
                                <td class="align-middle text-white content_table_white bg-info text-center" width="25%">
                                    Information</td>
                                <td class="content_table_white text-start">The observation is an
                                    opportunity to show additional information about the
                                    operational environment, but rarely result in the additional compromise of
                                    information or resources.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
    // let page 8 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_8 = `
    
    <div class="body_template_class">
        <div class="content_heading" id="methodology">5. Assessment Methodology</div>
    </div>
    `// let page 8 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_8_methodology = `
    
    <div class="body_template_class">
        <div class="content_heading" id="methodology">5. METHODOLODY</div>
        <div class="sub_content_heading" id="summary">5.1 REPORTING AND ANALYSIS PHASE :
            <div class="content">
                <div class="sub_content">
                    <p>This is the Vulnerability Assessment Report of a Web Application and this report is prepared
                        keeping in
                        mind both management as well as technical aspects, detailing all the findings with proper
                        graphs, figures, etc.
                        so as to convey a proper presentation of the vulnerabilities and its impact to the business
                        of the target
                        organization.<br /><br />
                        The necessary things that the report consists of are :</p>
                    <ul>
                        <li> Executive Summary</li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Recommendations</li>
                        <li>Tools and References</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="sub_content_heading" id="summary">6.2 TESTING PHASE :
        </div>
        <div class="sub_content_heading" id="summary">6.3 AUDIT METHODOLOGY WHICH WE FOLLOW :
            <div class="content">
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.1 Information Gathering :</div>
                    <ul >
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Recommendations</li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Recommendations</li>
                        <li>Tools and References</li>
                        <li>Tools and References</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.2 Configuration and Deployment Management
                        Testing:
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Recommendations</li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `    // let page 9 template ------------------------------>>>>>>>>>>>>>>>>>>

    let page_9 = `
    <div class="body_template_class">
    <div class="content_heading" id="executive_summary">6. Executive Summary</div>
</div>`

    // let page 9 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_10 = `
    <div class="body_template_class">
    <div class="content_heading" id="assessment_findings_overview">7. Assessment Findings Overview</div>
</div>
  
    `
    // let page 9 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_9_executive_summary  = `
    <div class="body_template_class">
        <div class="sub_content_heading" id="executive_summary">
            <div class="content">
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.3 IIdentity Management Testing :</div>
                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.4 Authentication Testing:
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.5 Authorization Testing :
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.6 Session Management Testing:
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                <div class="sub_sub_content_heading mb-1" id="summary">6.3.7 Input Validation Testing :</div>
                <ul>
                    <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                    </li>
                    <li> Summary of Vulnerabilities</li>
                    <li>Detailed Findings</li>
                    <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                    </li>
                    <li> Summary of Vulnerabilities</li>
                    <li>Detailed Findings</li>
                    <li> Risk level of the Vulnerabilities found</li>
                    <li>Business Impact</li>
                </ul>
            </div>
            </div>
        </div>
    </div>
    `


    // let page 10 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_11 = `
    <div class="body_template_class">
    <div class="content_heading" id="assisment_finding_interview">8. Assessment Findings Details</div>
   
</div>
    `
    // let page 10 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_10_ = `
    
    <div class="body_template_class">
        <div class="sub_content_heading" id="summary">
            <div class="content">
            <div class="sub_sub_content">
                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li> 
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.8 Testing for Error Handling :</div>
                    <ul>
                        <li> Summary of Vulnerabilities</li>
                        <li>Detailed Findings</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.9 Testing for Weak Cryptography :
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li>Detailed Findings</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.10 Business Logic Testing :
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
                <div class="sub_sub_content">
                    <div class="sub_sub_content_heading mb-1" id="summary">6.3.11 Client Side Testing:
                    </div>

                    <ul>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Conduct Search Engine Discovery and Reconnaissance for Information Leakage (OTGINFO-001)
                        </li>
                        <li> Summary of Vulnerabilities</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                        <li> Risk level of the Vulnerabilities found</li>
                        <li>Business Impact</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `

    // let page 11 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_12 = `
    <div class="body_template_class">

        <div class="content_heading" id="tools_and_references">9. Tools & Reference

        </div>
    </div>
    `
// let page 11 template ------------------------------>>>>>>>>>>>>>>>>>>
let page_11_executive  = `
<div class="body_template_class">

    <div class="content_heading" id="executive_summary">7. Executive Summary

        <div class="content mt-3">
            <p>Xiarch Solutions Private Limited performed a Web Application Assessment Test on ().<br /><br />
                This Gray Box assessment was performed to identify loopholes in the application from a security
                perspective. The aim of this assessment was to discover the vulnerabilities present in the
                application, which
                could pose an information security risk. <br /><br />
                The results show that there are some findings which can lead to security flaws in application. Our
                team
                performed analysis of functionality, manual audit and automated testing. All found issues during
                manual
                and automated analysis were manually reviewed and applicable vulnerabilities are presented in the
                summary.<br /><br />
                The vulnerabilities found during the audit are as follows:<br /><br />
                Vulnerabililty List
            </p>
        </div>
    </div>
</div>
`

    // let page 12 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_13 = `
    <div class="body_template_class">
        <div class="content_heading" id="assessment_findings_details">8.Assessment Findings Details
           
        </div>
    </div>
    `
    // let page 12 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_12_asses = `
    <div class="body_template_class">
        <div class="content_heading" id="assessment_findings_overview">8. SUMMARY OF VULNERABILITIES
            <div class="sub_content_heading">VULNERABILITIES WITH SEVERITY LEVEL
                <div class="content">
                    <p>Following table presents a list of identified vulnerabilities and their severity level with their
                        status.</p>

                    <table class="table table-bordered mt-2" style="border-color:black;">
                        <tbody>
                            <tr>
                                <td class="content_table_white bg-secondary text-light align-middle text-center" width="10%">Sr. No.</td>
                                <td class="content_table_white bg-secondary text-light align-middle">Vulnerability</td>
                                <td class="content_table_white bg-secondary text-light align-middle text-center">Severity Level</td>
                                <td class="content_table_white bg-secondary text-light align-middle text-center">Level 1- 12/06/2021</td>
                            </tr>
                            <tr>
                                <td class="content_table_white  align-middle text-center">1</td>
                                <td class="content_table_white  ">Conduct Search Engine Discovery and Reconnaissance for
                                    Information Leakage</td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>

                            <tr>
                                <td class="content_table_white  align-middle text-center">2</td>
                                <td class="content_table_white  ">Fingerprint Web Server</td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>
                            <tr>
                                <td class="content_table_white  align-middle text-center">3</td>
                                <td class="content_table_white  ">Review Webserver Metafiles for Information Leakage</td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>
                            <tr>
                                <td class="content_table_white  align-middle text-center">4</td>
                                <td class="content_table_white  ">Enumerate Applications on Webserver</td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>
                            <tr>
                                <td class="content_table_white  align-middle text-center">5</td>
                                <td class="content_table_white  ">Review Webpage Comments and Metadata for Information
                                    Leakage
                                    </td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>
                            <tr>
                                <td class="content_table_white  align-middle text-center">6</td>
                                <td class="content_table_white  ">Identify application entry points</td>
                                <td class="content_table_white  align-middle text-center bg-danger text-light">Medium</td>
                                <td class="content_table_white  align-middle text-center text-danger">Open</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `

    // let page references template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_reference_old = `
   
    <div class="body_template_class ">
        <div class="content_heading" id="tools_and_references">11. TOOLS AND REFERENCES</div>
        <div class="sub_content_heading" id="summary">TOOLS
            <div class="content">
                <p>&nbsp; &nbsp; The following tools were used for Security Testing.<br />
                </p>
                <ul>
                    <li>Identify and assess security flaws in Web Application according to industry principal security
                        standards like OWASP Top 10 etc.</li>
                    <li>Provide recommendations for mitigation of risk(s) emerged during the identified vulnerabilities
                    </li>
                    <li>Each Level of assessment is carried out with manual testing as well as automated tool testing.
                    </li>
                </ul>
            </div>
        </div>
        <div class="sub_content_heading" id="summary">REFERENCES
            <div class="content">
                <ul>
                    <li>For application security visit www.owasp.org</li>
                    
                        <ul>
                            <li>http://cert.org/other_sources/tool_sources.html</li>
                            <li>http://securityfocus.com/</li>
                            <li>http://projects.webappsec.org/w/page/13246978/Threat Classification</li>
                        </ul>
                    
                    <li>Security advisories such as SANS (www.sans.org), ISS (www.iss.net) CERTS (www.cert.org).
                    </li>
                </ul>
            </div>
        </div>

    </div>
    `
    // let page references template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_reference = `
   
    <div class="body_template_class ">
        <div class="content_heading" id="tools_and_references">9.  Tools & Reference</div>
    </div>`
    
    // let page 12 template ------------------------------>>>>>>>>>>>>>>>>>>
    let page_14 = `
   
    <div class="body_template_class">
        <div class="content_heading" id="assessment_findings_details">8. SUMMARY OF VULNERABILITIES
            <div class="">
                <table class="table table-bordered mt-4" style="border-color:black;">
                    <tbody>
                        <tr>
                            <td colspan="2" class="content_table_white bg-secondary text-light">9.1 Conduct Search Engine Discovery and
                                Reconnaissance for Information Leakage</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Risk Level</td>
                            <td class="content_table_white align-middle text-light bg-danger">Medium</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Category</td>
                            <td class="content_table_white align-middle">Information Gathering</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Description</td>
                            <td class="content_table_white align-middle">There are direct and indirect elements to
                                search engine discovery and
                                reconnaissance. Direct methods relate to searching the indexes and the associated
                                content from caches. Indirect methods relate to gleaning sensitive design and
                                configuration information by searching forums, newsgroups, and tendering
                                websites</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Impact</td>
                            <td class="content_table_white align-middle">The attacker can able to understand what
                                sensitive design and configuration
                                information of the application/system/organisation is exposed both directly (on the
                                organisation’s website) or indirectly (on a third party website).</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Remediation</td>
                            <td class="content_table_white align-middle">Update the robot.txt file on your application
                                to exclude a sensitive directory from
                                the crawling of search engine spiders.</td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Reference</td>
                            <td class="content_table_white align-middle">
                                https://kennel209.gitbooks.io/owasp-testing-guide-v4/content/en/web_application
                                _security_testing/conduct_search_engine_discovery_and_reconnaissance_for_infor
                                mation_leakage_otg-info-001.html
                            </td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Affects</td>
                            <td class="content_table_white align-middle">
                                http://localhost/xiarch/office/development/App/RGS/112/pp/audit.php?pid=PID182
                                30
                            </td>
                        </tr>
                        <tr>
                            <td class="content_table_white align-middle">Status</td>
                            <td class="content_table_white align-middle" style="background-color:#eeeeee;">Open</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `

    // let page 12 template ------------------------------>>>>>>>>>>>>>>>>>>
    // pdf complete CSS 
    let template_css = `     
    html {
        -webkit-print-color-adjust: exact;
    }
 body{
    font-family: 'Open Sans', sans-serif;
 }   

#page_1::before{
    content: "";
    position: absolute;
    top:0px;
    right: 0px;
    bottom: 0px;
    left:0px;
    z-index: -1;
    background-image: url(${process.env.AUDITOR_API_URI}/images/fingerprint.png); 
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-size: 1300px 1450px;
    opacity:0.01;
}
    .page {
        margin: auto;
        padding-left: 60px;
        padding-right: 60px;
    }


    .header {
        height: 110px;
        display: flex;
        padding-top:40px;
        justify-content: end;
    }

    .header .logo {
        width: 130px;
    }

    .footer {
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
        font-size: 16px;
        line-height: 24px;
        height: 896px !important;
        overflow: hidden;
        background-color: corol;
        width: 100%;
    }
    .main_heading p {
        color: black;
        font-size: 46px;
        font-weight: 300 !important;
    }

    .sub_heading {
        padding-bottom:45px;
    }
    .sub_heading p {
        color: black;
        font-size: 20px;
        padding-top:10px;
        font-weight: 500;
    }
    .sub_heading small {
        padding-bottom:10px;
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
        padding-bottom:10px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }

    .report_heading , .report_heading{
        color: black;
    }
    .content a p{

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
        margin-left: 15px;
    }

    .sub_sub_content_heading {
        color: rgb(148, 0, 0);
        font-size: 17px;
        margin-bottom: 15px;
        margin-top: 15px;
        margin-left: 15px;
    }

    .content p {
        font-weight: 100;
        text-align: justify;
        font-size: 14px;
        line-height: 1.4;
        margin-bottom:2px;
        color:black;
    }

    .content ul li {
        text-align: justify;
        font-size: 13px;
        font-weight: 100 !important;
        line-height: 1.4;
    }

    .disclaimer .image {
        height: 240px;
        width: 100%;
    }

    .disclaimer .image img {
        height: 100%;
        width: 100%;
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
        color: black;
        font-size: 13px;
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
        line-height: 1.3;
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
    .bg-high {
        background-color: #d43f3a;
    }

    /* page 7 */
    .sub_sub_content_heading .content {
        margin-top: 10px;
        color: black;
    }

    .sub_sub_content_heading .content td {
        font-size: 12px;
    }
`

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
    
    <!-- page one -->
    <div class="page" id="page_1">
    ${header}
    ${page_1}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page two -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_2}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page three -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_3}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page Four -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_4}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page Five -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_5}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page SIX -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_6}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page Seven -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_7}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page Eight - 8 -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_8}
    ${footer_fun(page_no_global++)}
    </div>
    
    <!-- page Nine - 9 -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_9}
    ${footer_fun(page_no_global++)}
    </div>

    <!-- page Ten - 10 -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_10}
    ${footer_fun(page_no_global++)}
    </div>

    ${dynamic_pages}

    <!-- page Eleven - 11 -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_11}
    ${footer_fun(page_no_global++)}
    </div>
    
    <!-- page twelve - 12 -->
    <div class="page" id="tableOfContent">
    ${header}
    ${page_12}
    ${footer_fun(page_no_global++)}
    </div>
       
    
    </body>     

    
    </html> `;
};