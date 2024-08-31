const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
// pdf generation using puppeteer------------>>>>>>>>>>>>>>>
const fs = require('fs')
const path = require('path') //  used to load invoice.html file from local 
const utils = require('util')
const readFile = utils.promisify(fs.readFile)
const puppeteer = require('puppeteer') // library to create pdf 
const hb = require('handlebars') // handles puppeter functions and could be implemented without this 
const crypto = require("crypto");
const webAuditTemplate = require('./assets/auditTemplate/WebAuditTemplate')
// const webAuditTemplate = require('./assets/auditTemplate/WebAuditTemplate')
const mobileAuditTemplate = require('./assets/auditTemplate/MobileAuditTemplate');
const APIAuditTemplate = require('./assets/auditTemplate/APIAuditTemplate');
const sendWelcomeEmail = require("./utils/sendWelcomeEmail");


// run static frontend too
const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/build")


// testing puppeteer 
// const locateChrome = require('locate-chrome');


// const htmlToText = require('html-to-text');
// const { PDFDocument } = require('pdf-lib');
const pdf = require('pdf-parse');



const template = require('./assets/auditTemplate/old')
const networkAuditTemplate = require('./assets/auditTemplate/NetworkAuditTemplate');
// pdf generation using puppeteer------------>>>>>>>>>>>>>>>


// xiarch logo base64 image
var encoded_img = require('./assets/images/xiarch_logo_base64');

// comman header and footer for audit template 
const footerTemplate = require('./assets/auditTemplate/Footer')
const headerTemplate = require('./assets/auditTemplate/Header')

const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fileupload = require("express-fileupload")
const TokenList = require("./modals/tokenList.modal");
const AuditorUsers = require('./modals/modal.auditor_users')
const AuditorOrg = require("./modals/modal.auditor_org");
const AuditeeOrg = require("./modals/modal.auditee_org");
const AuditeeUser = require("./modals/modal.auditee_users");
require("./connection/db")
const dotenv = require("dotenv");
const CheckList = require("./modals/modal.cheklistdb");
// const CheckListTemplate = require("./modals/modal.checklist.template");
// const CheckListReportTemplate = require("./modals/modal.checklist.report");
// const CheckListCertificateTemplate = require("./modals/modal.checklist.certificate");
dotenv.config();
const cookieParser = require("cookie-parser");
const session = require('express-session');
const ProjectList = require("./modals/modal.projects");
const AuditTableModal = require("./modals/modal.audit_table");
const CheckListReportData = require('./modals/modal.checklist.report')
const CheckListCertificateTemplate = require('./modals/modal.checklist.certificate')
// const ProjectList = require("./modals/modal.projects");
const store = new session.MemoryStore();

// const certificate = require('./certificate');
const certificateAPI = require('./assets/certificateTemplate/certificateAPI');
const certificateWeb = require('./assets/certificateTemplate/certificateWeb');
const certificateMobile = require('./assets/certificateTemplate/certificateMobile');
const certificateNetwork = require('./assets/certificateTemplate/certificateNetwork');
const SendSuccessFullEmail = require("./utils/SendSuccessFullEmail");
const SendEmailAddedResponse = require("./utils/SendEmailAddedResponse");
const auth = require("./middleware/auth");
// const MobileAuditTemplate = require("./assets/auditTemplate/MobileAuditTemplate");

// MongoDB connection ------------------------------------------------------>
// mongo local ------------------>
let customer, admin;
// const con1  = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true });
// const con2  = mongoose.createConnection(process.env.MONGO_URI2, { useNewUrlParser: true });
// try {
//  admin =  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
//   // customer =  mongoose.connect(process.env.MONGO_URI2, { useNewUrlParser: true }); // another DB 
//   console.log("mongo connected : ", process.env.MONGO_URI);
//   // console.log("customer", customer);
// } catch (error) {
//   console.log("mongo not connected : ", error);
// }


// mongodb+srv://rahul-xiarch:Rahu-9211@cluster0.ojvyark.mongodb.net/auditsense_technical?retryWrites=true&w=majority

//mongo cloud Atlas  ------------>
// mongoose.connect("mongodb+srv://AuditSense:AuditSense@cluster0.wx09g.mongodb.net/Table" , { useNewUrlParser: true })
// mongodb://localhost:27017/Table
// MongoDB connection ------------------------------------------------------>

//To remove Cors Policy error  or To give access to this URL from other links
// app.use(cors());
app.use(express.json());
app.use(fileupload());
// app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'))



// Important point ----------------------->
app.use(cookieParser());
app.use(cors({
  origin: [`${process.env.APP_URI}`],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(session({
  secret: process.env.LOGIN_SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: store,
  cookie: {
    maxAge: Number(process.env.LOGIN_SESSION_AGE), // 1 
  },
}));

//old 

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', `${process.env.APP_URI}`);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', `${process.env.APP_URI}`);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Authorization');
  next();
});


// Global function to check the audit table and change project status on behalf of vulnerability status 
async function setProjectStatus(projectID) {
  try {
    const auditTable = await AuditTableModal.find({
      ProjectID: projectID,
    })
    // get checklist type
    const checklistType = await CheckList.findOne({
      ChecklistDatabaseID: auditTable.ChecklistDatabaseID
    })
    // console.log("audit table", auditTable);
    let Initiated_flag = false;
    let InProgress_flag = false;
    let Completed_flag = false;
    let counter = 0;

    const vul_length = auditTable[0].Vulnerability_Details.length

    for (let i = 0; i < vul_length; i++) {
      let last_node_index = auditTable[0].Vulnerability_Details[i].Vulnerability_Timeline.length - 1
      let vul_Timeline = auditTable[0].Vulnerability_Details[i].Vulnerability_Timeline[last_node_index];

      // console.log(vul_Timeline);
      if (vul_Timeline.VulnerabilityStatus != null) {
        InProgress_flag = true;
      }
      if (vul_Timeline.VulnerabilityStatus === "Closed" || vul_Timeline.VulnerabilityStatus === "Not Applicable") {
        counter++;
      }
    }

    // here if counter is equal to length of audit list means all vul status is closed or not Aplicable 
    if (counter === vul_length) {
      InProgress_flag === false;
      const project_list = await ProjectList.findOne({
        ProjectID: projectID,
      })
      console.log("project ID -- Completed_flag")

      let project_detail_last_node = project_list.ProjectDetails.length - 1;
      let project_detail = project_list.ProjectDetails[project_detail_last_node];

      if (project_detail.ProjectStatus != "Completed") {
        let new_project_details = {
          ProjectTitle: project_detail.ProjectTitle,
          ProjectDescription: project_detail.ProjectDescription,
          ScopeDetails: project_detail.ScopeDetails,
          AuditorDetails: project_detail.AuditorDetails,
          AuditeeDetails: project_detail.AuditeeDetails,
          StartDate: project_detail.StartDate,
          EndDate: project_detail.EndDate,
          ProjectStatus: "Completed",
          ModifiedBy: project_detail.ModifiedBy, // id of role - login user 
          DateTime: project_detail.DateTime
        }

        await ProjectList.updateMany({
          ProjectID: projectID
        }, {
          $push: {
            ProjectDetails: new_project_details,
          }
        })
      }
      return;
    }

    // console.log("counter - ", counter)
    // console.log("vul_length - ", vul_length)

    // if counter is not equal to vul_length and any one of vul status is not equal to null then INprogress will call 
    if (InProgress_flag) {
      const project_list = await ProjectList.findOne({
        ProjectID: projectID,
      })
      console.log("project ID  - InProgress_flag")

      let project_detail_last_node = project_list.ProjectDetails.length - 1;
      let project_detail = project_list.ProjectDetails[project_detail_last_node];

      if (project_detail.ProjectStatus != "InProgress") {
        // if (checklistType.ChecklistDatabaseType === "Web Application Audit") {
        // }
        let new_project_details = {
          ProjectTitle: project_detail.ProjectTitle,
          ProjectDescription: project_detail.ProjectDescription,
          ScopeDetails: project_detail.ScopeDetails,
          AuditorDetails: project_detail.AuditorDetails,
          AuditeeDetails: project_detail.AuditeeDetails,
          StartDate: project_detail.StartDate,
          EndDate: project_detail.EndDate,
          ProjectStatus: "InProgress",
          ModifiedBy: project_detail.ModifiedBy, // id of role - login user 
          DateTime: project_detail.DateTime
        }

        // project_detail.ProjectStatus == "InProgress"
        console.log("project details", project_detail)

        await ProjectList.updateMany({
          ProjectID: projectID
        }, {
          $push: {
            ProjectDetails: new_project_details,
          }
        })
      }
      return;
    }

  } catch (error) {
    console.error(error)
  }
}


//To remove Cors Policy error  or To give access to this URL from other links
// Random Number 10 unique ID Generator  --------------------------------->
function uniqueIdGenerator() {
  const uniqueID = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${uniqueID}`;
}



// function to load html Template // this will return template on the behalf of checklist type 
async function getTemplateHtml(reportID, projectID , closure) {
  console.log("Loading template file in memory")
  let arr = new Array("informational", "medium", "low", "critical", "high", "medium", "low");
  // arr.push("Critical")
  // arr.push("Medium")
  // arr.push("High")
  // arr.push("Low")
  // arr.push("Medium")
  // arr.push("Informational")
  // arr.push("Informational")
  // let arr = ["informationla" , "medium" , "low" , "critical" , "high" , "medium" , "low"];
  let imgName = "testName "
  // try {
  //   const invoicePath = path.resolve("./invoice.html");
  //   return await readFile(invoicePath, 'utf8');
  // } catch (err) {
  //   return Promise.reject("Could not load html template");
  // }
  // getting vulnerability from databaase -->
  // const web_vulnerability = await CheckList.find({
  //   ChecklistDatabaseID : ChecklistDatabaseID
  // })
  // using report ID fetch data and pass to tempate 
  const reportData = await CheckListReportData.findOne({
    ReportID: reportID
  })
  const project = await ProjectList.findOne({
    ProjectID: projectID
  })
  // console.log("ChecklistDatabaseID", project)
  // check checklist type 
  const checklist = await CheckList.findOne({
    ChecklistDatabaseID: project.ChecklistDatabaseID
  })
  // console.log("checklist", checklist)
  if (checklist.ChecklistDatabaseType === "Web Application Audit") {
    console.log("web Applicati")
    return webAuditTemplate(reportData , closure)
  }
  if (checklist.ChecklistDatabaseType === "Mobile Application Audit") {
    console.log("Mobile Applicati")
    return mobileAuditTemplate(reportData, closure)
  }
  if (checklist.ChecklistDatabaseType === "API Audit") {
    console.log("API Applicati")
    return APIAuditTemplate(reportData, closure)
  }
  if (checklist.ChecklistDatabaseType === "Network Audit") {
    console.log("Network Applicati")
    return networkAuditTemplate(reportData, closure)
  }

}

// function to return html template  
async function getCertificateTemplate(certificateID, projectID) {
  console.log("Loading template file in memory")
  let arr = new Array("informational", "medium", "low", "critical", "high", "medium", "low");
  // arr.push("Critical")
  // arr.push("Medium")
  // arr.push("High")
  // arr.push("Low")
  // arr.push("Medium")
  // arr.push("Informational")
  // arr.push("Informational")
  // let arr = ["informationla" , "medium" , "low" , "critical" , "high" , "medium" , "low"];
  let imgName = "testName "
  // try {
  //   const invoicePath = path.resolve("./invoice.html");
  //   return await readFile(invoicePath, 'utf8');
  // } catch (err) {
  //   return Promise.reject("Could not load html template");
  // }
  // getting vulnerability from databaase -->
  // const web_vulnerability = await CheckList.find({
  //   ChecklistDatabaseID : ChecklistDatabaseID
  // })
  // using report ID fetch data and pass to tempate 
  const certificateData = await CheckListCertificateTemplate.findOne({
    CertificateID: certificateID
  })
  // console.log("memeeeeeeeeeeee", certificateData)
  // get auditor name ,
  const AuditorDetail = await AuditorUsers.findOne({
    AuditorID: certificateData.CertificateDetails.AuditorOrganizationDetails.AuditorDetails.Auditor.AssignedTo
  })
  const auditorName = AuditorDetail.FirstName + " " + AuditorDetail.LastName

  // get checklist Type
  const ChecklistDetail = await CheckList.findOne({
    ChecklistDatabaseID: certificateData.ChecklistDatabaseID
  })
  const checkListType = ChecklistDetail.ChecklistDatabaseType

  const project = await ProjectList.findOne({
    ProjectID: projectID
  })
  // console.log("ChecklistDatabaseID", project)
  // check checklist type 
  const checklist = await CheckList.findOne({
    ChecklistDatabaseID: project.ChecklistDatabaseID
  })
  // console.log("checklist", checklist)
  if (checklist.ChecklistDatabaseType === "Web Application Audit") {
    console.log("web Applicati")
    return certificateWeb(certificateData, "Web Application Audit", auditorName)
  }
  if (checklist.ChecklistDatabaseType === "Mobile Application Audit") {
    console.log("Mobile Applicati")
    return certificateMobile(certificateData, "Mobile Application Audit", auditorName)
  }
  if (checklist.ChecklistDatabaseType === "API Audit") {
    console.log("API Applicati")
    return certificateAPI(certificateData, "API Audit", auditorName)
  }
  if (checklist.ChecklistDatabaseType === "Network Audit") {
    console.log("Network Applicati")
    return certificateNetwork(certificateData, "Network Audit", auditorName)
  }

  // return certificate(vulnerability_list)
}

//get certificateID  with all status approved and vulnerability closed
async function get_certificateID_with_all_approvedStatus(projectID, userCheck) {

  try {
    const auditList = await AuditTableModal.findOne({
      ProjectID: projectID
    })
    const projectList = await ProjectList.findOne({
      ProjectID: projectID
    })
    const auditeeOrg = await AuditeeOrg.findOne({
      OrganizationID: projectList.AuditeeOrganizationID
    })
    const checklistDB = await CheckList.findOne({
      ChecklistDatabaseID: projectList.ChecklistDatabaseID
    })

    const certificateChecklistType = checklistDB.ChecklistDatabaseType
    // console.log("certificateChecklistType", certificateChecklistType)
    const auditorOrg = await AuditorOrg.findOne({})
    // console.log("project ", auditList)
    if (auditList) {
      const checklistType = auditList.Vulnerability_Details
      // console.log("checklist", checklistType)
      let NotCheckedList = []
      let j = 0;
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];
        if (checkList.Status === "Approved") {

          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          NotCheckedList[j++] = auditDetails;
        }
      }

      // auditScope temp variable -------> this could be dynamic on the behalf of checklist type 

      let auditScope_TempData = {}
      if (certificateChecklistType === "Web Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (certificateChecklistType === "Mobile Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (certificateChecklistType === "API Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (certificateChecklistType === "Network Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      let reviewStatus = {
        CreatedBy: userCheck,
        ReviewedBy: null,
        Status: "Draft",
        DateTime: new Date().toUTCString()
      }
      // console.log(auditScope_TempData)
      // here save data at report data of mongoDB
      const certificateID = uniqueIdGenerator()
      await CheckListCertificateTemplate.create({
        CertificateID: certificateID,
        AuditID: auditList.AuditID,
        ProjectID: projectList.ProjectID,
        ChecklistDatabaseID: auditList.ChecklistDatabaseID,
        CertificateDetails: {
          ScopeDetails: auditScope_TempData,
          AuditeeOrganizationDetails: {
            OrganizationID: auditeeOrg.OrganizationID,
            OrganizationName: auditeeOrg.OrganizationName,
            Address: auditeeOrg.Street + auditeeOrg.State + auditeeOrg.Pincode + auditeeOrg.City + auditeeOrg.Country,
            Email: auditeeOrg.Email,
            Contact: auditeeOrg.Phone,
            Website: auditeeOrg.Website,
            AuditeeDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditeeDetails
          },
          AuditorOrganizationDetails: {
            OrganizationID: auditorOrg.OrganizationID,
            OrganizationName: auditorOrg.OrganizationName,
            Address: auditorOrg.Street + auditorOrg.State + auditorOrg.Pincode + auditorOrg.City + auditorOrg.Country,
            Email: auditorOrg.Email,
            Contact: auditorOrg.Phone,
            Website: auditorOrg.Website,
            AuditorDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails
          },
          ProjectStartDate: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].StartDate,
          ProjectEndDate: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].EndDate,
          CertificateIssueDate: new Date().toUTCString()
        },
        ReviewStatus: reviewStatus
      })
      if (NotCheckedList == []) {
        return null;
      }
      else return certificateID;
    }
  } catch (error) {
    console.error(error)
  }
}


// get vulberability list with status approved 
async function get_vulnerabilityList_with_status_is_approved(projectID, userCheck) {
  try {
    const auditList = await AuditTableModal.findOne({
      ProjectID: projectID
    })
    const projectList = await ProjectList.findOne({
      ProjectID: projectID
    })
    const auditeeOrg = await AuditeeOrg.findOne({
      OrganizationID: projectList.AuditeeOrganizationID
    })
    const checklistDB = await CheckList.findOne({
      ChecklistDatabaseID: projectList.ChecklistDatabaseID
    })

    const reportChecklistType = checklistDB.ChecklistDatabaseType
    // console.log("reportChecklistType", reportChecklistType)
    const auditorOrg = await AuditorOrg.findOne({})
    // console.log("project ", auditList)
    if (auditList) {
      const checklistType = auditList.Vulnerability_Details
      // console.log("checklist", checklistType)
      let critical_arr = []
      let high_arr = []
      let medium_arr = []
      let low_arr = []
      let informational_arr = []

      let j = 0;
      let critical_index = 0;
      let high_index = 0;
      let medium_index = 0;
      let low_index = 0;
      let informational_index = 0;

      // loop to insert
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];

        if (checkList.Severity === "Critical") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          critical_arr[critical_index++] = auditDetails;
        }


        if (checkList.Severity === "High") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          high_arr[high_index++] = auditDetails;
        }



        if (checkList.Severity === "Medium") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          medium_arr[medium_index++] = auditDetails;
        }



        if (checkList.Severity === "Low") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          low_arr[low_index++] = auditDetails;
        }



        if (checkList.Severity === "Informational") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          informational_arr[informational_index++] = auditDetails;
        }


        // if (checkList.Status === "Approved") {

        //   let auditDetails = {
        //     VulnerabilityID: checklistType[i].VulnerabilityID,
        //     CheckListID: checklistType[i].CheckListID,
        //     Title: checkList.Title,
        //     Severity: checkList.Severity,
        //     Description: checkList.Description,
        //     Impact: checkList.Impact,
        //     Remediation: checkList.Remediation,
        //     Affects: checkList.Affects,
        //     Status: checkList.VulnerabilityStatus,
        //     POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
        //     DateTime: checkList.DateTime,
        //   }
        //   NotCheckedList[j++] = auditDetails;
        // }
        // else{
        //   return "all status is not approved";
        // }
      }

      let NotCheckedList = critical_arr.concat(high_arr, medium_arr, low_arr, informational_arr) // global array 
      // auditScope temp variable -------> this could be dynamic on the behalf of checklist type 

      let auditScope_TempData = {}
      if (reportChecklistType === "Web Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "Mobile Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "API Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "Network Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      let reviewStatus = {
        CreatedBy: userCheck,
        ReviewedBy: null,
        Status: "Draft",
        DateTime: new Date().toUTCString()
      }

      // loop to check the level of report 
      const reports = await CheckListReportData.find({
        ProjectID: projectID
      });
      let last_updated_report;
      let reportLevelCount = 1;
      for (let i = 0; i < reports.length; i++) {
        // console.log("this is me ", reports[i])
        if (reports[i].ReviewStatus[reports[i].ReviewStatus.length - 1].Status === "Approved") {
          reportLevelCount++;
          last_updated_report = reports[i];
        }
      }


      // document control
      // console.log("usercheck", userCheck)

      //current TL , PM , and Auditor 
      const current_auditorID = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo;
      const current_teamLeader = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo;
      const current_projectManager = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedTo;


      const current_auditor_details = await AuditorUsers.findOne({
        AuditorID: current_auditorID
      })
      const current_teamLeader_details = await AuditorUsers.findOne({
        AuditorID: current_teamLeader
      })
      const current_projectManager_details = await AuditorUsers.findOne({
        AuditorID: current_projectManager
      })

      let documentControl = []

      if (reportLevelCount === 1) {
        const document_obj = {
          Auditor: {
            ID: current_auditor_details.AuditorID,
            Name: current_auditor_details.FirstName + " " + current_auditor_details.LastName,
            Designation: current_auditor_details.Designation,
            Role: current_auditor_details.Role,
            DateTime: new Date().toUTCString(),
          },
          TeamLeader: {
            ID: current_teamLeader_details.AuditorID,
            Name: current_teamLeader_details.FirstName + " " + current_teamLeader_details.LastName,
            Designation: current_teamLeader_details.Designation,
            Role: current_teamLeader_details.Role,
            DateTime: new Date().toUTCString(),
          },
          ProjectManager: {
            ID: current_projectManager_details.AuditorID,
            Name: current_projectManager_details.FirstName + " " + current_projectManager_details.LastName,
            Designation: current_projectManager_details.Designation,
            Role: current_projectManager_details.Role,
            DateTime: new Date().toUTCString(),
          }
        }
        documentControl.push(document_obj)
      }
      if (reportLevelCount > 1) {
        // console.log("last_updated_report", last_updated_report)
        documentControl = last_updated_report.ReportDetails.DocumentControl
        const document_obj = {
          Auditor: {
            ID: current_auditor_details.AuditorID,
            Name: current_auditor_details.FirstName + " " + current_auditor_details.LastName,
            Designation: current_auditor_details.Designation,
            Role: current_auditor_details.Role,
            DateTime: new Date().toUTCString(),
          },
          TeamLeader: {
            ID: current_teamLeader_details.AuditorID,
            Name: current_teamLeader_details.FirstName + " " + current_teamLeader_details.LastName,
            Designation: current_teamLeader_details.Designation,
            Role: current_teamLeader_details.Role,
            DateTime: new Date().toUTCString(),
          },
          ProjectManager: {
            ID: current_projectManager_details.AuditorID,
            Name: current_projectManager_details.FirstName + " " + current_projectManager_details.LastName,
            Designation: current_projectManager_details.Designation,
            Role: current_projectManager_details.Role,
            DateTime: new Date().toUTCString(),
          }
        }
        documentControl.push(document_obj)
      }


      // console.log(auditScope_TempData)
      // here save data at report data of mongoDB
      const reportID = uniqueIdGenerator()
      await CheckListReportData.create({
        ReportID: reportID,
        AuditID: auditList.AuditID,
        ProjectID: projectList.ProjectID,
        ChecklistDatabaseID: auditList.ChecklistDatabaseID,
        ReportDetails: {
          ReportLevel: reportLevelCount,
          ScopeDetails: auditScope_TempData,
          DocumentControl: documentControl,
          AuditeeOrganizationDetails: {
            OrganizationID: auditeeOrg.OrganizationID,
            OrganizationLogo: auditeeOrg.OrganizationLogo,
            OrganizationName: auditeeOrg.OrganizationName,
            Address: auditeeOrg.Street + auditeeOrg.State + auditeeOrg.Pincode + auditeeOrg.City + auditeeOrg.Country,
            Email: auditeeOrg.Email,
            Contact: auditeeOrg.Phone,
            Website: auditeeOrg.Website,
            AuditeeDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditeeDetails
          },
          AuditorOrganizationDetails: {
            OrganizationID: auditorOrg.OrganizationID,
            OrganizationName: auditorOrg.OrganizationName,
            Address: auditorOrg.Street + auditorOrg.State + auditorOrg.Pincode + auditorOrg.City + auditorOrg.Country,
            Email: auditorOrg.Email,
            Contact: auditorOrg.Phone,
            Website: auditorOrg.Website,
            AuditorDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails
          },
          AuditDetails: NotCheckedList,
        },
        ReviewStatus: reviewStatus
      })
      if (NotCheckedList == []) {
        return null;
      }
      else return reportID;
    }
  } catch (error) {
    console.error(error)
  }
}

// get vulberability list with status approved - exclusing not checked 
async function get_vulnerabilityList_with_status_is_approved_excluding_not_checked(projectID, userCheck) {
  try {
    const auditList = await AuditTableModal.findOne({
      ProjectID: projectID
    })
    const projectList = await ProjectList.findOne({
      ProjectID: projectID
    })
    const auditeeOrg = await AuditeeOrg.findOne({
      OrganizationID: projectList.AuditeeOrganizationID
    })
    const checklistDB = await CheckList.findOne({
      ChecklistDatabaseID: projectList.ChecklistDatabaseID
    })

    const reportChecklistType = checklistDB.ChecklistDatabaseType
    // console.log("reportChecklistType", reportChecklistType)
    const auditorOrg = await AuditorOrg.findOne({})
    // console.log("project ", auditList)
    if (auditList) {
      const checklistType = auditList.Vulnerability_Details
      // console.log("checklist", checklistType)
      let critical_arr = []
      let high_arr = []
      let medium_arr = []
      let low_arr = []
      let informational_arr = []

      let j = 0;
      let critical_index = 0;
      let high_index = 0;
      let medium_index = 0;
      let low_index = 0;
      let informational_index = 0;

      // loop to insert
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];

        if (checkList.Severity === "Critical" && checkList.VulnerabilityStatus != "Not Applicable" && checkList.Status === "Approved") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          critical_arr[critical_index++] = auditDetails;
        }


        if (checkList.Severity === "High" && checkList.VulnerabilityStatus != "Not Applicable" && checkList.Status === "Approved") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          high_arr[high_index++] = auditDetails;
        }



        if (checkList.Severity === "Medium" && checkList.VulnerabilityStatus != "Not Applicable" && checkList.Status === "Approved") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          medium_arr[medium_index++] = auditDetails;
        }



        if (checkList.Severity === "Low" && checkList.VulnerabilityStatus != "Not Applicable" && checkList.Status === "Approved") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          low_arr[low_index++] = auditDetails;
        }



        if (checkList.Severity === "Informational" && checkList.VulnerabilityStatus != "Not Applicable" && checkList.Status === "Approved") {
          let auditDetails = {
            VulnerabilityID: checklistType[i].VulnerabilityID,
            CheckListID: checklistType[i].CheckListID,
            Title: checkList.Title,
            Severity: checkList.Severity,
            CVSS_Vector: checkList.CVSS_Vector,
            Description: checkList.Description,
            Impact: checkList.Impact,
            Remediation: checkList.Remediation,
            Affects: checkList.Affects,
            Status: checkList.VulnerabilityStatus,
            POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
            DateTime: checkList.DateTime,
          }
          informational_arr[informational_index++] = auditDetails;
        }


        // if (checkList.Status === "Approved") {

        //   let auditDetails = {
        //     VulnerabilityID: checklistType[i].VulnerabilityID,
        //     CheckListID: checklistType[i].CheckListID,
        //     Title: checkList.Title,
        //     Severity: checkList.Severity,
        //     Description: checkList.Description,
        //     Impact: checkList.Impact,
        //     Remediation: checkList.Remediation,
        //     Affects: checkList.Affects,
        //     Status: checkList.VulnerabilityStatus,
        //     POC: checkList.VulnerabilityStatus === "Open" ? checkList.OpenPOC : checkList.ClosedPOC,
        //     DateTime: checkList.DateTime,
        //   }
        //   NotCheckedList[j++] = auditDetails;
        // }
        // else{
        //   return "all status is not approved";
        // }
      }

      let NotCheckedList = critical_arr.concat(high_arr, medium_arr, low_arr, informational_arr) // global array 
      // auditScope temp variable -------> this could be dynamic on the behalf of checklist type 

      let auditScope_TempData = {}
      if (reportChecklistType === "Web Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "Mobile Application Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "API Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      if (reportChecklistType === "Network Audit") {
        auditScope_TempData = {
          ScopeName: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeName,
          ReportScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ReportScope,
          CertificateScope: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.CertificateScope,
          ScopeEnvironment: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeEnvironment,
          ScopeAccess: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeAccess,
          ScopeScreenshot: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].ScopeDetails.ScopeScreenshot,
        }
      }
      let reviewStatus = {
        CreatedBy: userCheck,
        ReviewedBy: null,
        Status: "Draft",
        DateTime: new Date().toUTCString()
      }
      // console.log(auditScope_TempData)

      // loop to check the level of report 
      const reports = await CheckListReportData.find({
        ProjectID: projectID
      });
      let last_updated_report;
      let reportLevelCount = 1;
      for (let i = 0; i < reports.length; i++) {
        // console.log("this is me ", reports[i])
        if (reports[i].ReviewStatus[reports[i].ReviewStatus.length - 1].Status === "Approved") {
          reportLevelCount++;
          last_updated_report = reports[i];
        }
      }

      // document control
      console.log("usercheck", userCheck)

      //current TL , PM , and Auditor 
      const current_auditorID = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo;
      const current_teamLeader = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo;
      const current_projectManager = projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedTo;


      const current_auditor_details = await AuditorUsers.findOne({
        AuditorID: current_auditorID
      })
      const current_teamLeader_details = await AuditorUsers.findOne({
        AuditorID: current_teamLeader
      })
      const current_projectManager_details = await AuditorUsers.findOne({
        AuditorID: current_projectManager
      })

      let documentControl = []

      if (reportLevelCount === 1) {
        const document_obj = {
          Auditor: {
            ID: current_auditor_details.AuditorID,
            Name: current_auditor_details.FirstName + " " + current_auditor_details.LastName,
            Designation: current_auditor_details.Designation,
            Role: current_auditor_details.Role,
            DateTime: new Date().toUTCString(),
          },
          TeamLeader: {
            ID: current_teamLeader_details.AuditorID,
            Name: current_teamLeader_details.FirstName + " " + current_teamLeader_details.LastName,
            Designation: current_teamLeader_details.Designation,
            Role: current_teamLeader_details.Role,
            DateTime: new Date().toUTCString(),
          },
          ProjectManager: {
            ID: current_projectManager_details.AuditorID,
            Name: current_projectManager_details.FirstName + " " + current_projectManager_details.LastName,
            Designation: current_projectManager_details.Designation,
            Role: current_projectManager_details.Role,
            DateTime: new Date().toUTCString(),
          }
        }
        documentControl.push(document_obj)
      }
      if (reportLevelCount > 1) {
        // console.log("last_updated_report", last_updated_report)
        documentControl = last_updated_report.ReportDetails.DocumentControl
        const document_obj = {
          Auditor: {
            ID: current_auditor_details.AuditorID,
            Name: current_auditor_details.FirstName + " " + current_auditor_details.LastName,
            Designation: current_auditor_details.Designation,
            Role: current_auditor_details.Role,
            DateTime: new Date().toUTCString(),
          },
          TeamLeader: {
            ID: current_teamLeader_details.AuditorID,
            Name: current_teamLeader_details.FirstName + " " + current_teamLeader_details.LastName,
            Designation: current_teamLeader_details.Designation,
            Role: current_teamLeader_details.Role,
            DateTime: new Date().toUTCString(),
          },
          ProjectManager: {
            ID: current_projectManager_details.AuditorID,
            Name: current_projectManager_details.FirstName + " " + current_projectManager_details.LastName,
            Designation: current_projectManager_details.Designation,
            Role: current_projectManager_details.Role,
            DateTime: new Date().toUTCString(),
          }
        }
        documentControl.push(document_obj)
      }

      // console.log("reports - ", reports)
      // here save data at report data of mongoDB
      const reportID = uniqueIdGenerator()
      await CheckListReportData.create({
        ReportID: reportID,
        AuditID: auditList.AuditID,
        ProjectID: projectList.ProjectID,
        ChecklistDatabaseID: auditList.ChecklistDatabaseID,
        ReportDetails: {
          ReportLevel: reportLevelCount,
          ScopeDetails: auditScope_TempData,
          DocumentControl: documentControl,
          AuditeeOrganizationDetails: {
            OrganizationID: auditeeOrg.OrganizationID,
            OrganizationLogo: auditeeOrg.OrganizationLogo,
            OrganizationName: auditeeOrg.OrganizationName,
            Address: auditeeOrg.Street + auditeeOrg.State + auditeeOrg.Pincode + auditeeOrg.City + auditeeOrg.Country,
            Email: auditeeOrg.Email,
            Contact: auditeeOrg.Phone,
            Website: auditeeOrg.Website,
            AuditeeDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditeeDetails
          },
          AuditorOrganizationDetails: {
            OrganizationID: auditorOrg.OrganizationID,
            OrganizationName: auditorOrg.OrganizationName,
            Address: auditorOrg.Street + auditorOrg.State + auditorOrg.Pincode + auditorOrg.City + auditorOrg.Country,
            Email: auditorOrg.Email,
            Contact: auditorOrg.Phone,
            Website: auditorOrg.Website,
            AuditorDetails: projectList.ProjectDetails[projectList.ProjectDetails.length - 1].AuditorDetails
          },
          AuditDetails: NotCheckedList,
        },
        ReviewStatus: reviewStatus
      })
      if (NotCheckedList == []) {
        return null;
      }
      else return reportID;
    }
  } catch (error) {
    console.error(error)
  }
}

// async function to get data from project using PROject ID
async function get_certificate_data(projectID) {
  const projectList = await ProjectList.findOne({
    ProjectID: projectID
  })
  // console.log("project ", projectList)
  if (projectList) {
    const checklistType = projectList
    // console.log("checklist type", checklistType)
    // const checkList = await CheckList.find({
    //   ChecklistDatabaseType: checklistType
    // })
    // console.log("checklist", checklistType)
    let NotCheckedList // empty obj to stored required data 
    let projectList_length = projectList.ProjectDetails.length - 1;
    let j = 0;
    // console.log('cehckliststatus ', CheckList.Status)
    NotCheckedList = projectList.ProjectDetails[projectList_length]
    // NotCheckedList = projectList.ProjectDetails[projectList_length];
    // if (checkList.Status === "Approved") {
    // }
    // getting auditor detatils ----->
    // let auditorList_length = projectList.Auditor.length - 1;
    // NotCheckedList = {...NotCheckedList , "name " : projectList.Auditor[auditorList_length].AssignedTo }

    // console.log(NotCheckedList[0])
    if (NotCheckedList == []) {
      return null;
    }
    else return NotCheckedList;
  }
}

// API to get data for backup 
app.post("/getChecklistDatabase", auth, async (req, res) => {
  console.log("this is me ")
  try {
    const data = await CheckList.find({
      ChecklistDatabaseID: req.body.checklistDatabaseID
    })
    res.json({
      data
    })
  } catch (error) {
    console.log(error)
    res.json({ message: "not loaded ", status: false })
  }
})

// API to get data from atlas cloud 
app.get('/get-data', async (req, res) => {
  console.log("this is me ");

  const data = await AuditeeOrg.find({})
  console.log("data", data)
  // var writeStream = fs.createWriteStream("auditeeORG.json");
  // writeStream.write(data.toString());
  // writeStream.end();


  res.json({ message: "okf" })
})

// API to edit report table 
app.post('/edit-auditor-project-report-table', auth, async (req, res) => {
  console.log(req.body.reportID)
  try {
    const reviewStatus = {
      CreatedBy: req.body.createdBy,
      ReviewedBy: req.body.auditorID,
      Status: req.body.status,
      DateTime: new Date().toUTCString()
    }
    await CheckListReportData.updateMany({
      ReportID: req.body.reportID
    }, { $push: { ReviewStatus: reviewStatus } })
    res.json({ status: true })
  } catch (error) {
    console.log(error);
    res.json({ status: false })
  }
})

// API to edit certificate table 
app.post('/edit-auditor-project-certificate-table', auth, async (req, res) => {
  console.log(req.body.certificateID)
  try {
    const reviewStatus = {
      CreatedBy: req.body.createdBy,
      ReviewedBy: req.body.auditorID,
      Status: req.body.status,
      DateTime: new Date().toUTCString()
    }
    await CheckListCertificateTemplate.updateMany({
      CertificateID: req.body.certificateID
    }, { $push: { ReviewStatus: reviewStatus } })
    res.json({ status: true })
  } catch (error) {
    console.log(error);
    res.json({ status: false })
  }
})

// API to get report data
app.post('/get-auditor-project-report-data', auth, async (req, res) => {
  // console.log('re data', req.body)
  try {
    const reportID = req.body.projectID
    const reportData = await CheckListReportData.find({
      ProjectID: reportID
    })
    let responseData = []
    for (let i = 0; i < reportData.length; i++) {

      const createdBy = await AuditorUsers.findOne({
        AuditorID: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].CreatedBy
      })
      // let ReviewedBy = {}
      const reviewedBy = await AuditorUsers.findOne({
        AuditorID: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].ReviewedBy
      })
      // console.log("certificateData", reportData)
      let tempData = {}
      if (reviewedBy != null && reviewedBy != "null") {
        tempData = {
          ReportID: reportData[i].ReportID,
          Level: reportData[i].ReportDetails.ReportLevel,
          CreatedBy: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].CreatedBy,
          Date: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].DateTime,
          CreatedByName: createdBy.FirstName + " " + createdBy.LastName,
          ReviewedBy: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].ReviewedBy,
          ReviewedByName: reviewedBy.FirstName + " " + reviewedBy.LastName,
          Status: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].Status,
        }
      }
      else {
        tempData = {
          ReportID: reportData[i].ReportID,
          Level: reportData[i].ReportDetails.ReportLevel,
          CreatedBy: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].CreatedBy,
          Date: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].DateTime,
          CreatedByName: createdBy.FirstName + " " + createdBy.LastName,
          ReviewedBy: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].ReviewedBy,
          ReviewedByName: null,
          Status: reportData[i].ReviewStatus[reportData[i].ReviewStatus.length - 1].Status,
        }
      }

      responseData[i] = tempData;
    }
    res.json({ status: true, data: responseData })
  } catch (error) {
    console.error(error)
    let resData = []
    res.json({ status: false, message: "data not loaded", data: resData })
  }
})

// API to get certificate data
app.post('/get-auditor-project-certificate-data', auth, async (req, res) => {
  console.log('re data', req.body)
  try {
    const projectID = req.body.projectID
    const certificateData = await CheckListCertificateTemplate.find({
      ProjectID: projectID
    })
    let responseData = []
    for (let i = 0; i < certificateData.length; i++) {

      const createdBy = await AuditorUsers.findOne({
        AuditorID: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].CreatedBy
      })
      // let ReviewedBy = {}
      const reviewedBy = await AuditorUsers.findOne({
        AuditorID: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].ReviewedBy
      })
      // console.log("reviewdby", reviewedBy)
      // console.log("certificateData", certificateData)
      let tempData = {}
      if (reviewedBy != null && reviewedBy != "null") {
        tempData = {
          CertificateID: certificateData[i].CertificateID,
          CreatedBy: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].CreatedBy,
          Date: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].DateTime,
          CreatedByName: createdBy.FirstName + " " + createdBy.LastName,
          ReviewedBy: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].ReviewedBy,
          ReviewedByName: reviewedBy.FirstName + " " + reviewedBy.LastName,
          Status: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].Status,
        }
      }
      else {
        tempData = {
          CertificateID: certificateData[i].CertificateID,
          CreatedBy: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].CreatedBy,
          Date: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].DateTime,
          CreatedByName: createdBy.FirstName + " " + createdBy.LastName,
          ReviewedBy: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].ReviewedBy,
          ReviewedByName: null,
          Status: certificateData[i].ReviewStatus[certificateData[i].ReviewStatus.length - 1].Status,
        }
      }

      responseData[i] = tempData;
    }
    res.json({ status: true, data: responseData })
  } catch (error) {
    console.error(error)
    let responseData = []
    res.json({ status: false, message: "data not loaded", data: responseData })
  }
})

function generateTableOfContents(html) {
  const headings = html.match(/<h\d.*?>(.*?)<\/h\d>/gi);
  console.log("heading , ", headings)
  let toc = '';
  let counter = 1;
  if (headings && headings.length > 0) {
    toc += '<div class="body_template_class"><div class="content"><ul>';
    for (let i = 0; i < headings.length; i++) {
      const text = headings[i].replace(/<\/?[^>]+(>|$)/g, '');
      const tag = headings[i].match(/<h(\d).*?>/i)[1];
      toc += `<li style="list-style:none"><a style="text-decoration:none" href="#heading-${i + 1}" >`;
      toc += `${text}</a></li>`;
      // html = html.replace(headings[i], `<h${tag} id="heading-${i + 1}">${text}-> ${counter}</h${tag}>`);
      // console.log("counter ", counter)
      counter++;
    }
    toc += '</ul></div></div>';
  }
  modifiedHtml = html.replace('<body>', `<body>${toc}`);
  fs.writeFileSync("test2.html", modifiedHtml)
  return { html: modifiedHtml, toc };
}


// async function generateTableOfContents(page, html) {
//   const headings = html.match(/<h\d.*?>(.*?)<\/h\d>/gi);
//   let toc = '<h1>Table of Contents</h1>';
//   if (headings && headings.length > 0) {
//     toc += '<ul>';
//     for (let i = 0; i < headings.length; i++) {
//       const text = headings[i].replace(/<\/?[^>]+(>|$)/g, '');
//       const tag = headings[i].match(/<h(\d).*?>/i)[1];
//       const anchor = `<a href="#heading-${i + 1}-page-1">${text}</a>`;
//       toc += `<li>${anchor}</li>`;
//       html = html.replace(headings[i], `<h${tag} id="heading-${i + 1}">${text}</h${tag}>`);
//       await page.evaluate((i, anchor) => {
//         const heading = document.querySelector(`#heading-${i + 1}`);
//         const boundingRect = heading.getBoundingClientRect();
//         const pageHeight = window.innerHeight;
//         const pageNum = Math.ceil((boundingRect.top + window.pageYOffset) / pageHeight);
//         anchor.href = `#heading-${i + 1}-page-${pageNum}`;
//       }, i, anchor);
//     }
//     toc += '</ul>';
//   }
//   return { html, toc };
// }

function generateTableOfContents(pdfBuffer) {
  return pdf(pdfBuffer).then(function (data) {
    const headings = [];
    const pageRanges = [];

    // Extract headings and their page numbers
    const headingsRegex = /(h[1-5])\s*(.*?)\s*(?=h[1-5]|\s*$)/gs;
    let match;
    while ((match = headingsRegex.exec(data.text)) !== null) {
      headings.push(match[2]);
      const pageIndex = data.text.slice(0, match.index).split('\n').length - 1;
      pageRanges.push(pageIndex + 1);
      console.log(`Found heading "${match[2]}" on page ${pageIndex + 1}`);
    }

    console.log(`Found ${headings.length} headings`);

    // Print table of contents
    console.log('Table of Contents\n');
    for (let i = 0; i < headings.length; i++) {
      console.log(`${headings[i]}...............${pageRanges[i]}`);
    }
  });
}

async function testMain(dataBuffer, titles) {
  // console.log("titles", titles)
  let toc = [], page;
  const data = await pdf(dataBuffer);
  const pagePattern = /Page (\d+)/;
  titles.forEach(title => {
    const topicPattern = title;
    // console.log("title", topicPattern)
    const lines = data.text.split('\n');
    lines.forEach(chunk => {
      // console.log(chunk)
      if (chunk.match(pagePattern)) {
        page = chunk.match(/Page (\d+)/)[1];
      }
      let newChunk = chunk.toString()
      // console.log(newChunk)
      if (newChunk.includes(topicPattern) && !toc[newChunk]) {
        // console.log("title", title)
        // console.log("page", page)
        toc[topicPattern] = Number(page) + 1;
        // console.log("toc", toc)
      }

      // else {
      //   if (newChunk.match(topicPattern)) {
      //     console.log(newChunk,  newChunk.match(topicPattern))
      //   }
      // }
    });

  });
  return toc;
}

// API to generate report on behalf of report ID for report dataTable 
app.post('/create-auditor-project-audit-generate-report', auth, async (req, res) => {
  console.log("rew.body -------", req.body.projectID)
  console.log("rew.body ", req.body.reportID)
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', `${process.env.APP_URI}`);
  //   res.header('Access-Control-Allow-Credentials', true);
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   next();
  // });
  try {
    const checklistDatabaseID = await ProjectList.find({
      ProjectID: req.body.projectID
    })
    const reportID = req.body.reportID
    let data = {};
    // console.log("vulnerability_list", vulnerability_list)
    if (reportID != null) {
      getTemplateHtml(reportID, req.body.projectID).then(async (data) => {




        // testing ------------------>
        // const html = data
        // const { html: modifiedHtml, toc } = generateTableOfContents(html);
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(modifiedHtml);
        // const pdfOptions = {
        //   format: 'A4',
        //   margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        //   printBackground: true,
        //   displayHeaderFooter: true,
        //   headerTemplate: '',
        //   footerTemplate: '<span class="pageNumber"></span>/<span class="totalPages"></span>',
        //   preferCSSPageSize: true
        // };
        // const pdfBuffer = await page.pdf(pdfOptions);
        // await browser.close();
        // fs.writeFileSync('output.pdf', pdfBuffer);
        // testing ------------------>

        // working ----------->
        // Now we have the html code of our template in data object
        // you can check by logging it on console
        // console.log(data)
        console.log("Compiing the template with handlebars");
        // const template = hb.compile(data, { strict: true });
        // we have compile our code with handlebars
        // const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = data;
        // we are using headless mode

        const browser = await puppeteer.launch({
          // headless: true,
          // args: [
          //   '--no-sandbox',
          //   '--disable-web-security',
          //   // '--disable-features=IsolateOrigins,site-per-process',
          //   ' --disable-site-isolation-trials',
          //   '--disable-setuid-sandbox',
          // ]


          args: [
            '-no-sandbox',
            '--disable-setuid-sandbox'
          ],

          // devtools: true,
          // args: [
          //   '--disable-web-security',
          //   '--disable-features=IsolateOrigins,site-per-process',
          // ]
          // devtools: true, 
          // defaultViewport: { 
          //   hasTouch: true, 
          //   isMobile: true, 
          //   height: 1080, 
          //   width: 1920, 
          // },
        });
        const page = await browser.newPage()
        // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        // We set the page content as the generated html by handlebars
        await page.setContent(html)

        let titles = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("h3, h4"),
            title => title.innerText.trim());
        });
        // console.log("🚀 ~ titles ~ titles:", titles)
        const newtitles = titles.map(section => section.split(' ')[0]);
        // console.log("title", newtitles)


        fs.writeFileSync("newfile.html", html)
        // We use pdf function to generate the pdf in the same folder as this file.
        const created_pdf = await page.pdf({
          printBackground: true,
          format: "A4",
          headerTemplate: headerTemplate,
          footerTemplate: footerTemplate,
          displayHeaderFooter: true,
          margin: {
            top: "100px",
            bottom: "100px"
          },
          timeout: 0
        }) // pdf function takes {path : "" , format : "A4"}
        fs.writeFileSync('./temp.pdf', created_pdf)

        let toc_sub_heading = (heading, page) => `<div class="sub_content">
      
        <div class="d-flex justify-content-between toc_head toc_sub_head">
          <a href="#version_history">${heading}</a>
          <a href="#version_history">${page} </a>
        </div>
      </div>`
        let toc_main_heading = (heading, page) => `
      <div class="d-flex justify-content-between toc_head toc_main_head">
      <a href="#version_history">${heading}</a>
      <a href="#version_history">${page} </a>
      </div>`

        let toc_HTML = `
        <div class="body_template_class table_of_content" id="table_of_content">
        
        <div class="main_heading">
        <h2 class="text-start pb-4">Table Of Content</h2>
      </div>
      <div class="content" id="toc_content">
    `
        let dataBuffer = fs.readFileSync('./temp.pdf');
        console.log("🚀 ~ getTemplateHtml ~ dataBuffer:", dataBuffer)

        testMain(dataBuffer, titles).then(async (toc) => {
          // console.log(toc);
          let regex = /\d+(\.\d+)?(?!\.)/;
          for (let key in toc) {
            if (toc.hasOwnProperty(key)) {
              if (key.match(regex)) {
                toc_HTML += toc_sub_heading(key, toc[key])
                // console.log("🚀 ~ testMain ~ key:", toc)
              }
              else {
                toc_HTML += toc_main_heading(key, toc[key])
              }
            }
          }

          toc_HTML += '</div>';
          // console.log("🚀 ~ testMain ~ toc_HTML:", toc_HTML)
          // console.log("tocHTM", toc_HTML)
          let finalHTMl = html.replace(/<div class="body_template_class" id="table_of_content">/g, toc_HTML)
          // console.log("final html", toc_HTML)
          fs.writeFileSync('./toc_HTML.html', toc_HTML)
          fs.writeFileSync("./filePath.html", finalHTMl);

          const page1 = await browser.newPage() // by this u can create multiple pages 
          await page1.setContent(finalHTMl)
          const finalPDF = await page1.pdf({
            printBackground: true,
            format: "A4",
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            displayHeaderFooter: true,
            margin: {
              top: "100px",
              bottom: "100px"
            },
            timeout: 0
          })
          fs.writeFileSync('./final.pdf', finalPDF)

          res.set({ 'Content-Type': 'application/pdf', 'Content-Length': finalPDF.length }) // here this is use to set content header for pdf 
          res.send(finalPDF)
          // main_page_arr =  toc ;

        }).catch(error => {
          console.error(error);
        });



        // pdf(dataBuffer).then(function(data) {
        //     let toc ={}, page;
        //     const pagePattern = /Page (\d+)/;
        //     const topicPattern = /1. Document Control/i;
        //     const lines = data.text.split('\n');
        //     lines.forEach((chunk, i, lines) => {
        //       // console.log("chunk", chunk)
        //         if(chunk.match(pagePattern)) {
        //             page = chunk.match(/Page (\d+)/)[1]
        //             console.log(":page ", page)
        //         }
        //         if(chunk.match(topicPattern) && !toc[chunk]) {
        //             toc[chunk] = page
        //         }
        //     });
        //     console.log(toc); // Use this object to fill in values for your table of content
        // });

        // / Load the buffer containing the PDF data
        // const pdf_buffer = created_pdf;


        // async function getTitlePageNumber(title) {
        //   // Load the PDF document using pdf-lib
        //   const pdfDoc = await PDFDocument.load(pdf_buffer);

        //   // Loop through the pages to find the page number where the title is located
        //   for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        //     const page = await pdfDoc.getPage(i);
        //     const page_text = await page.getText();

        //     if (page_text.includes(title)) {
        //       console.log('Title:', title);
        //       console.log('Page number:', i + 1);
        //       return i + 1;
        //     }
        //   }

        //   // If the title is not found, return -1
        //   console.log('Title not found');
        //   return -1;
        // }

        // // Call the function and pass the title string as a parameter
        // getTitlePageNumber('Document Control').catch(error => {
        //   console.log(error);
        // });


        // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': created_pdf.length }) // here this is use to set content header for pdf 
        // res.send(created_pdf)

        // working ----------->


        // console.log("PDF Generated" , created_pdf)

        // const newpath = __dirname;
        // res.sendFile('report.pdf', { root: __dirname });
        // res.status(200).sendFile(`http://localhost:1338/report.pdf`);
        // return res.json({ message: "pdf created", status: true  , data :  created_pdf})
      })
    }
    else {
      console.log("we are inside else ")
      const response = {
        message: "vulnerability not found",
        status: false
      }
      res.set({ 'Content-Type': 'application/json' }) // here this is use to set content header for pdf 
      res.send(response)
    }
  } catch (error) {
    console.error(err)
    return res.json({ message: "error occured in pdf creation", status: false })
  }
})

// API to generate report on behalf of report ID for certificate dataTable 
app.post('/create-auditor-project-audit-generate-certificate', auth, async (req, res) => {
  console.log("rew.body ", req.body.projectID)
  console.log("rew.body ", req.body.certificateID)
  console.log("rew.boasdasdasdasdasddy ", req.body.certificateID)
  try {
    const checklistDatabaseID = await ProjectList.find({
      ProjectID: req.body.projectID
    })
    const certificateID = req.body.certificateID
    let data = {};
    // console.log("vulnerability_list", vulnerability_list)
    if (certificateID != null) {
      getCertificateTemplate(certificateID, req.body.projectID).then(async (data) => {
        // Now we have the html code of our template in data object
        // you can check by logging it on console
        // console.log(data)
        console.log("Compiing the template with handlebars for certificate");
        const template = hb.compile(data, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = result;
        // we are using headless mode
        // const chromeArgs = [
        //   '--disable-background-timer-throttling',
        //   '--disable-backgrounding-occluded-windows',
        //   '--disable-renderer-backgrounding'
        // ];
        // const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
        console.log("Hi I am before launch ");
        const browser = await puppeteer.launch({
          args: [
            '-no-sandbox',
            '--disable-setuid-sandbox'
          ]
        });
        console.log("after launch ")
        const page = await browser.newPage()
        const page1 = await browser.newPage() // by this u can create multiple pages 
        // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // await page1.setContent()
        // await page.emulateMedia('screen');
        // await console.log("encode", encoded_file)



        // We use pdf function to generate the pdf in the same folder as this file.
        const created_pdf = await page.pdf({
          printBackground: true,
          format: "A4",
          // headerTemplate: headerTemplate,
          // footerTemplate: footerTemplate,
          // displayHeaderFooter: true,
          // margin: {
          //   top: "100px",
          //   bottom: "100px"
          // }

        }) // pdf function takes {path : "" , format : "A4"}
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': created_pdf.length }) // here this is use to set content header for pdf 
        res.send(created_pdf)
        // console.log("PDF Generated" , created_pdf)

        // const newpath = __dirname;
        // res.sendFile('report.pdf', { root: __dirname });
        // res.status(200).sendFile(`http://localhost:1338/report.pdf`);
        // return res.json({ message: "pdf created", status: true  , data :  created_pdf})
      })
    }
    else {
      console.log("we are inside else ")
      const response = {
        message: "vulnerability not found",
        status: false
      }
      res.set({ 'Content-Type': 'application/json' }) // here this is use to set content header for pdf 
      res.send(response)
    }
  } catch (error) {
    console.error(err)
    return res.json({ message: "error occured in pdf creation", status: false })
  }
})

// API to generate report on basic of Status - working
app.post('/edit-auditor-project-audit-generate-report-not-checked', auth, async (req, res) => {
  console.log("rew.body --->", req.body.projectID)
  try {
    const checklistDatabaseID = await ProjectList.find({
      ProjectID: req.body.projectID
    })
    const closureStatus = req.body.closureStatus
    console.log("🚀 ~ app.post ~ closureStatus:", closureStatus)
    const reportID = await get_vulnerabilityList_with_status_is_approved(req.body.projectID, req.body.userCheck)
    let data = {};
    // console.log("vulnerability_list", vulnerability_list)
    if (reportID != null) {
      getTemplateHtml(reportID, req.body.projectID , closureStatus).then(async (data) => {
        // Now we have the html code of our template in data object
        // you can check by logging it on console
        // console.log(data)
        console.log("Compiing the template with handlebars");
        const template = hb.compile(data, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ]
        });
        const page = await browser.newPage()
        // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // await page1.setContent()
        // await page.emulateMedia('screen');
        // await console.log("encode", encoded_file)

        titles = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("h3, h4"),
            title => title.innerText.trim());
        });
        // console.log("title", titles)


        fs.writeFileSync("newfile.html", html)

        // We use pdf function to generate the pdf in the same folder as this file.
        const created_pdf = await page.pdf({
          printBackground: true,
          format: "A4",
          headerTemplate: headerTemplate,
          footerTemplate: footerTemplate,
          displayHeaderFooter: true,
          margin: {
            top: "100px",
            bottom: "100px"
          }

        }) // pdf function takes {path : "" , format : "A4"}

        fs.writeFileSync('./temp.pdf', created_pdf)

        let toc_sub_heading = (heading, page) => `<div class="sub_content">
      
        <div class="d-flex justify-content-between toc_head toc_sub_head">
          <a href="#version_history">${heading}</a>
          <a href="#version_history">${page} </a>
        </div>
      </div>`
        let toc_main_heading = (heading, page) => `
      <div class="d-flex justify-content-between toc_head toc_main_head">
      <a href="#version_history">${heading}</a>
      <a href="#version_history">${page} </a>
      </div>`

        let toc_HTML = `
        <div class="body_template_class table_of_content" id="table_of_content">
        
        <div class="main_heading">
        <h2 class="text-start pb-4">Table Of Content</h2>
      </div>
      <div class="content" id="toc_content">
    `

        let dataBuffer = fs.readFileSync('./temp.pdf');

        testMain(dataBuffer, titles).then(async (toc) => {
          // console.log(toc);
          let regex = /\d+(\.\d+)?(?!\.)/;
          for (let key in toc) {
            if (toc.hasOwnProperty(key)) {
              if (key.match(regex)) {
                toc_HTML += toc_sub_heading(key, toc[key])
              }
              else {
                toc_HTML += toc_main_heading(key, toc[key])
              }
            }
          }

          toc_HTML += '</div>';
          // console.log("tocHTM", toc_HTML)
          let finalHTMl = html.replace(/<div class="body_template_class" id="table_of_content">/g, toc_HTML)
          fs.writeFileSync("filePath.html", finalHTMl);

          const page1 = await browser.newPage() // by this u can create multiple pages 
          await page1.setContent(finalHTMl)
          const finalPDF = await page1.pdf({
            printBackground: true,
            format: "A4",
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            displayHeaderFooter: true,
            margin: {
              top: "100px",
              bottom: "100px"
            }
          })

          res.set({ 'Content-Type': 'application/pdf', 'Content-Length': finalPDF.length }) // here this is use to set content header for pdf 
          res.send(finalPDF)
          // main_page_arr =  toc ;

        }).catch(error => {
          console.error(error);
        });


        // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': created_pdf.length }) // here this is use to set content header for pdf 
        // res.send(created_pdf)
        // console.log("PDF Generated" , created_pdf)

        // const newpath = __dirname;
        // res.sendFile('report.pdf', { root: __dirname });
        // res.status(200).sendFile(`http://localhost:1338/report.pdf`);
        // return res.json({ message: "pdf created", status: true  , data :  created_pdf})
      })
    }
    else {
      console.log("we are inside else ")
      const response = {
        message: "vulnerability not found",
        status: false
      }
      res.set({ 'Content-Type': 'application/json' }) // here this is use to set content header for pdf 
      res.send(response)
    }
  } catch (error) {
    console.error(err)
    return res.json({ message: "error occured in pdf creation", status: false })
  }
})

// API to generate report on basic of Status - working - for only working vulberaibilities
app.post('/edit-auditor-project-audit-generate-report', auth, async (req, res) => {
  console.log("rew.body -----------", req.body.projectID)
  try {
    const checklistDatabaseID = await ProjectList.find({
      ProjectID: req.body.projectID
    })
    const reportID = await get_vulnerabilityList_with_status_is_approved_excluding_not_checked(req.body.projectID, req.body.userCheck)
    let data = {};
    // console.log("vulnerability_list", vulnerability_list)
    if (reportID != null) {

      // // Launch a headless browser
      // const browser = await puppeteer.launch();
      // // Open a new page
      // const page = await browser.newPage();

      // // Read the HTML template file
      // const html = fs.readFileSync('template.html', 'utf8');

      // // Set up a content variable to hold the dynamic table of contents
      // let content = '<h1>Table of Contents</h1>\n';

      // // Use the evaluate function to find all the headings in the HTML file and create a dynamic table of contents
      // const headings = await page.evaluate(() => {
      //   const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      //   const headingList = [];
      //   let counter = 1;
      //   headings.forEach((heading) => {
      //     const text = heading.textContent;
      //     const level = heading.tagName.slice(1);
      //     heading.setAttribute('id', `heading-${counter}`);
      //     headingList.push({ text, level, counter });
      //     counter++;
      //   });
      //   return headingList;
      // });

      // // Loop through the headings and add them to the content variable
      // headings.forEach((heading) => {
      //   const { text, level, counter } = heading;
      //   content += `${' '.repeat((level - 1) * 2)}${level}. <a href="#heading-${counter}">${text}</a><br>\n`;
      // });

      // // Inject the table of contents into the HTML template
      // const finalHtml = html.replace('<div id="content"></div>', `<div id="content">${content}</div>`);

      // // Set up the PDF generation options
      // const options = {
      //   format: 'A4',
      //   printBackground: true,
      //   margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
      //   displayHeaderFooter: true,
      //   headerTemplate: '<div></div>',
      //   footerTemplate: '<div style="text-align:right;font-size:10px;padding-right:10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
      // };

      // // Generate the PDF file
      // await page.setContent(finalHtml);
      // // await page.emulateMedia('screen');
      // await page.pdf({ path: 'output.pdf', ...options });

      // // Close the browser
      // await browser.close();

      getTemplateHtml(reportID, req.body.projectID).then(async (data) => {
        // Now we have the html code of our template in data object
        // you can check by logging it on console
        // console.log(data)

        // fs.appendFile('mynewfile1.html', data, function (err) {
        //   if (err) throw err;
        //   console.log('Saved!');
        // });

        console.log("Compiing the template with handlebars - only selected vulnerabilities");
        const template = hb.compile(data, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ]
        });
        const page = await browser.newPage()
        // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // await page1.setContent()
        // await page.emulateMedia('screen');
        // await console.log("encode", encoded_file)

        titles = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("h3, h4"),
            title => title.innerText.trim());
        });
        // console.log("title", titles)


        fs.writeFileSync("newfile.html", html)

        // We use pdf function to generate the pdf in the same folder as this file.
        const created_pdf = await page.pdf({
          printBackground: true,
          format: "A4",
          headerTemplate: headerTemplate,
          footerTemplate: footerTemplate,
          displayHeaderFooter: true,
          margin: {
            top: "100px",
            bottom: "100px"
          }

        }) // pdf function takes {path : "" , format : "A4"}

        fs.writeFileSync('./temp.pdf', created_pdf)

        let toc_sub_heading = (heading, page) => `<div class="sub_content">
      
        <div class="d-flex justify-content-between toc_head toc_sub_head">
          <a href="#version_history">${heading}</a>
          <a href="#version_history">${page} </a>
        </div>
      </div>`
        let toc_main_heading = (heading, page) => `
      <div class="d-flex justify-content-between toc_head toc_main_head">
      <a href="#version_history">${heading}</a>
      <a href="#version_history">${page} </a>
      </div>`

        let toc_HTML = `
        <div class="body_template_class table_of_content" id="table_of_content">
        
        <div class="main_heading">
        <h2 class="text-start pb-4">Table Of Content</h2>
      </div>
      <div class="content" id="toc_content">
    `

        let dataBuffer = fs.readFileSync('./temp.pdf');

        testMain(dataBuffer, titles).then(async (toc) => {
          // console.log(toc); 
          let regex = /\d+(\.\d+)?(?!\.)/;
          for (let key in toc) {
            if (toc.hasOwnProperty(key)) {
              if (key.match(regex)) {
                toc_HTML += toc_sub_heading(key, toc[key])
              }
              else {
                toc_HTML += toc_main_heading(key, toc[key])
              }
            }
          }

          toc_HTML += '</div>';
          // console.log("tocHTM", toc_HTML)
          let finalHTMl = html.replace(/<div class="body_template_class" id="table_of_content">/g, toc_HTML)
          fs.writeFileSync("./filePath.html", finalHTMl);

          const page1 = await browser.newPage() // by this u can create multiple pages 
          await page1.setContent(finalHTMl)
          const finalPDF = await page1.pdf({
            printBackground: true,
            format: "A4",
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            displayHeaderFooter: true,
            margin: {
              top: "100px",
              bottom: "100px"
            }
          })
          fs.writeFileSync("./final.pdf", finalPDF)

          res.set({ 'Content-Type': 'application/pdf', 'Content-Length': finalPDF.length }) // here this is use to set content header for pdf 
          res.send(finalPDF)
          // main_page_arr =  toc ;

        }).catch(error => {
          console.error(error);
        });

        // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': created_pdf.length }) // here this is use to set content header for pdf 
        // res.send(created_pdf)
        // console.log("PDF Generated" , created_pdf)

        // const newpath = __dirname;
        // res.sendFile('report.pdf', { root: __dirname });
        // res.status(200).sendFile(`http://localhost:1338/report.pdf`);
        // return res.json({ message: "pdf created", status: true  , data :  created_pdf})
      })
    }
    else {
      console.log("we are inside else ")
      const response = {
        message: "vulnerability not found",
        status: false
      }
      res.set({ 'Content-Type': 'application/json' }) // here this is use to set content header for pdf 
      res.send(response)
    }
  } catch (err) {
    console.error(err)
    return res.json({ message: "error occured in pdf creation", status: false })
  }
})

// API to get genrated PDF --- unUsed
app.get('/get-auditor-project-audit-generate-report', async (req, res) => {
  const newpath = __dirname;
  res.sendFile('report.pdf', { root: __dirname });
  // res.status(200).sendFile(`${newpath}/report.pdf`);
})

// API TO create certificate 
app.post('/create-auditor-project-audit-certificate', auth, async (req, res,) => {
  console.log("rew.body certificate ---", req.body.projectID)
  try {
    // const checklistDatabaseID = await ProjectList.find({
    //   ProjectID: req.body.projectID
    // })
    // function to check vulnerability status 
    const audit_list = await AuditTableModal.findOne({
      ProjectID: req.body.projectID
    })
    // console.log("this is em ", audit_list.Vulnerability_Details[0])

    const certificate_data = await CheckListCertificateTemplate.find({
      ProjectID: req.body.projectID
    })

    for (let i = 0; i < certificate_data.length; i++) {
      if (certificate_data[i].ReviewStatus[certificate_data[i].ReviewStatus.length - 1].Status === "Approved") {
        // console.log("I printed")
        return res.json({ status: false, message: "Certificate Already Exists" })
      }
    }

    // its to check all Status is approved or not
    for (let i = 0; i < audit_list.Vulnerability_Details.length; i++) {
      if (audit_list.Vulnerability_Details[i].Vulnerability_Timeline[audit_list.Vulnerability_Details[i].Vulnerability_Timeline.length - 1].Status != "Approved") {
        // console.log("I am back")
        return res.json({ status: false, message: "All vulnerabilities are not approved" })
      }
    }


    // its to check all vulnerability status is closed not open or null
    for (let i = 0; i < audit_list.Vulnerability_Details.length; i++) {
      if (audit_list.Vulnerability_Details[i].Vulnerability_Timeline[audit_list.Vulnerability_Details[i].Vulnerability_Timeline.length - 1].VulnerabilityStatus == "Open" || audit_list.Vulnerability_Details[i].Vulnerability_Timeline[audit_list.Vulnerability_Details[i].Vulnerability_Timeline.length - 1].VulnerabilityStatus == null) {
        return res.json({ status: false, message: "Vulberability status is open" })
      }
    }

    // get all certifcate table list 
    const certificateTable = await CheckListCertificateTemplate.find({})
    // console.log("this is ")
    // for (let i = 0; i < certificateTable.length; i++) {
    //   if (certificateTable[i].ReviewStatus[certificateTable[i].ReviewStatus.length - 1].Status == "Approved") {
    //     return res.json({ status: false , message: "Certificate Already Exists" })
    //   }
    // }

    const certificateID = await get_certificateID_with_all_approvedStatus(req.body.projectID, req.body.userCheck)
    // const vulnerability_list = [ "date"]
    // console.log("certificate ID", certificateID)

    // console.log("vulnerability_list", vulnerability_list)
    if (certificateID != null) {

      getCertificateTemplate(certificateID, req.body.projectID).then(async (data) => {
        // Now we have the html code of our template in data object
        // you can check by logging it on console
        // console.log(data)
        console.log("Compiing the template with handlebars");
        const template = hb.compile(data, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ]
        });
        const page = await browser.newPage()
        const page1 = await browser.newPage() // by this u can create multiple pages 
        // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // await page1.setContent()
        // await page.emulateMedia('screen');
        // await console.log("encode", encoded_file)



        // We use pdf function to generate the pdf in the same folder as this file.
        const created_pdf = await page.pdf({
          printBackground: true,
          format: "A4",
          // headerTemplate : headerTemplate,
          // footerTemplate: footerTemplate,
          // displayHeaderFooter: true,
          // margin: {
          //   top:"100px",
          //   bottom: "100px"
          // }

        }) // pdf function takes {path : "" , format : "A4"}
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': created_pdf.length }) // here this is use to set content header for pdf 
        res.send(created_pdf)
        // console.log("PDF Generated" , created_pdf)

        // const newpath = __dirname;
        // res.sendFile('report.pdf', { root: __dirname });
        // res.status(200).sendFile(`http://localhost:1338/report.pdf`);
        // return res.json({ message: "pdf created", status: true  , data :  created_pdf})
      })
    }
    else {
      console.log("we are inside else ")
      const response = {
        message: "vulnerability not found",
        status: false
      }
      res.set({ 'Content-Type': 'application/json' }) // here this is use to set content header for pdf 
      res.send(response)
    }
  } catch (error) {
    console.error(error)
    return res.json({ message: "error occured in pdf creation", status: false })
  }
})

// API to assign auditor using project 
app.post('/edit-auditor-project-auditor', auth, async (req, res) => {
  console.log("data", req.body)
  try {
    const AuditorTimeline = {
      AssignedTo: req.body.projectAssignTo, // dynamic could be changed 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    await ProjectList.updateMany({
      ProjectID: req.body.projectID
    }, { $push: { AuditorTimeline: AuditorTimeline } })
    res.json({ status: true, data: "Auditor ID updated " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "error occured while assigning " })

  }
})

// API to get User by ID 
app.post('/get-user-by-id', async (req, res) => {
  try {
    const user = await AuditorUsers.find({
      AuditorID: req.body.id
    })
    res.json({ status: true, name: user.FirstName })
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "user not found" })
  }
})

// API to get checlist on bsis of project ID 
app.post('/get-auditor-project-auditlist', auth, async (req, res) => {
  // console.log("project id ", req.body.projectID)
  try {

    const auditList = await AuditTableModal.find({
      ProjectID: req.body.projectID
    })
    // console.log("project ", auditList[0].Vulnerability_Details[0].Vulnerability_Timeline)
    if (auditList) {
      const checklistType = auditList[0].Vulnerability_Details
      // console.log("checklist type", checklistType)
      // const checkList = await CheckList.find({
      //   ChecklistDatabaseType: checklistType
      // })
      // console.log("checklist", checklistType)
      let NotCheckedList = []
      let j = 0;
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        // console.log("last index", lastIndex)
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];

        // const open_POC_last_index = checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC.length - 1;
        // const open_POC_data = checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[open_POC_last_index];

        let OpenPOC_list = []
        // for (let j = 0; j < open_POC_last_index; j++) {
        //   OpenPOC_list[j] = {
        //     POCFilename: checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].POCFilename ? checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].POCFilename : null,
        //     POCDescription: checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].POCDescription ? checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].POCDescription : "null",
        //     DateTime: checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].DateTime ? checklistType[i].Vulnerability_Timeline[lastIndex].OpenPOC[j].DateTime : "null"
        //   }
        // }
        const Modifier = await AuditorUsers.find({
          AuditorID: checkList.ModifiedBy
        })

        NotCheckedList[j++] = { ...checkList, "Modifier_Name": Modifier[0].FirstName + " " + Modifier[0].LastName, "CheckListID": auditList[0].Vulnerability_Details[i].CheckListID, "VulnerabilityID": auditList[0].Vulnerability_Details[i].VulnerabilityID, "open_POC": OpenPOC_list }
      }
      // console.log("NotCheckedList", NotCheckedList)
      res.json({ status: true, data: NotCheckedList })
    }
  } catch (error) {
    console.log(error)
    let emptyList = []
    res.json({ status: false, data: "some error occured", data: emptyList })
  }
})


// API to get checklits type using projectID
app.post('/get-auditor-project-checkListType', auth, async (req, res) => {
  // console.log("data", req.body)
  try {
    const checkList = await ProjectList.find({
      ProjectID: req.body.projectID
    });
    // console.log(checkList.Checklist)
    res.json({ status: true, data: checkList[0].AuditType })
  } catch (error) {
    console.log(error)
    let emptyList = []
    res.json({ status: false, message: "checkList not added ", data: emptyList })
  }
})

// API to get list to audit whose status is NOt checked 
app.post('/get-auditor-project-auditlist-notChecked', auth, async (req, res) => {
  // console.log("project ID", req.body.projectID);
  try {
    const auditList = await AuditTableModal.find({
      ProjectID: req.body.projectID
    })
    // console.log("project ", project)
    if (auditList) {
      const checklistType = auditList[0].Vulnerability_Details
      // console.log("checklist type", checklistType)
      // const checkList = await CheckList.find({
      //   ChecklistDatabaseType: checklistType
      // })
      // console.log("checklist", checklistType[0].Vulnerability_Timeline)
      let NotCheckedList = []
      let j = 0;
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        // console.log("last index", lastIndex)
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];
        // console.log("checklist--->", checkList)
        if (checkList.Status === "Not Checked") {
          NotCheckedList[j++] = { ...checkList, "CheckListID": auditList[0].Vulnerability_Details[i].CheckListID, "VulnerabilityID": auditList[0].Vulnerability_Details[i].VulnerabilityID }
          // NotCheckedList[j++] = temp;
          // console.log("temp", temp)
        }
      }
      // console.log("temp", NotCheckedList)
      res.json({ status: true, data: NotCheckedList })
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "audit list not there" })
  }
})

// API to get review all the vulnerabilities
app.post('/get-auditor-project-auditlist-for-auditor', auth, async (req, res) => {
  console.log("project ID", req.body.projectID);
  try {
    const auditList = await AuditTableModal.find({
      ProjectID: req.body.projectID
    })
    // console.log("project ", project)
    if (auditList) {
      const checklistType = auditList[0].Vulnerability_Details
      // console.log("checklist type", checklistType)
      // const checkList = await CheckList.find({
      //   ChecklistDatabaseType: checklistType
      // })
      // console.log("checklist", checklistType)
      let NotCheckedList = []
      let j = 0;
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        // console.log("last index", lastIndex)
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];
        const Modifier = await AuditorUsers.find({
          AuditorID: checkList.ModifiedBy
        })

        NotCheckedList[j++] = { ...checkList, "Modifier_Name": Modifier[0].FirstName + " " + Modifier[0].LastName, "CheckListID": auditList[0].Vulnerability_Details[i].CheckListID, "VulnerabilityID": auditList[0].Vulnerability_Details[i].VulnerabilityID }
      }
      res.json({ status: true, data: NotCheckedList })
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "audit list not there" })
  }
})

// API to get review all the vulnerabilities for team leader Review 
app.post('/get-auditor-project-auditlist-for-team-leader', auth, async (req, res) => {
  console.log("project ID", req.body.projectID);
  try {
    const auditList = await AuditTableModal.find({
      ProjectID: req.body.projectID
    })
    // console.log("project ", project)
    if (auditList) {
      const checklistType = auditList[0].Vulnerability_Details
      // console.log("checklist type", checklistType)
      // const checkList = await CheckList.find({
      //   ChecklistDatabaseType: checklistType
      // })
      // console.log("checklist", checklistType)
      let NotCheckedList = []
      let j = 0;
      for (let i = 0; i < checklistType.length; i++) {
        const lastIndex = checklistType[i].Vulnerability_Timeline.length - 1
        // console.log("last index", lastIndex)
        const checkList = checklistType[i].Vulnerability_Timeline[lastIndex];

        if (checkList.Status === "Draft") {
          const Modifier = await AuditorUsers.find({
            AuditorID: checkList.ModifiedBy
          })

          NotCheckedList[j++] = { ...checkList, "Modifier_Name": Modifier[0].FirstName + " " + Modifier[0].LastName, "CheckListID": auditList[0].Vulnerability_Details[i].CheckListID, "VulnerabilityID": auditList[0].Vulnerability_Details[i].VulnerabilityID }
          // NotCheckedList[j++] = temp;
          // console.log("temp", temp)
        }

      }
      res.json({ status: true, data: NotCheckedList })
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "audit list not there" })
  }
})

// API to edit project audit checklist vulnerabilities auditor 
app.post('/edit-auditor-project-audit-vulnerability-latest', auth, async (req, res) => {

  // console.log("audit data", req.body)
  // console.log("audit data", req.files)
  // console.log("object length", req.files.length)

  let prev_open_poc = new Array();
  let prev_closed_poc = new Array();

  // if condition if all the OpnePOC is available 
  if (req.files) {
    console.log("inside if if iff fif ")

    // condition for OPEN POC 
    const prev_data = await AuditTableModal.findOne({
      ProjectID: req.body.projectID,
    },)
    // console.log("prev_Data", prev_data)

    /// loop to get previous state of CLosed and OPEN POC 
    // for (let i = 0; i < prev_data.Vulnerability_Details.length; i++) {
    //   if (prev_data.Vulnerability_Details[i].VulnerabilityID === req.body.vulnerabilityID) {
    //     let last_node_index = prev_data.Vulnerability_Details[i].Vulnerability_Timeline.length - 1

    //     // condition to get data for OPEN POC 
    //     if (prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC != "null") {
    //       prev_open_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC;
    //       // console.log("prev_opne_poc-- inside", prev_open_poc)
    //     }

    //     // condition to get data for closed POC \
    //     if (prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC != "null") {
    //       prev_closed_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC;
    //       // console.log("prev_closed_poc-- inside", prev_closed_poc)
    //     }
    //   }
    // }


    // console.log("prev_open_poc[0]", prev_open_poc[0])
    // if (JSON.stringify(prev_open_poc) == null) {
    //   // console.log("inside true- prev_open_poc[0] && req.files.openPOC_file_one")
    //   let filename = "POC_";
    //   // filename = filename.split(' ').join('_');
    //   const entries = Object.entries(req.files);
    //   entries.forEach(([key, value]) => {
    //     console.log(`${key}: ${value}`);
    //   });
    //   for (const prop in req.files) {
    //     console.log(`${prop}:=> ${req.files[prop]}`);
    //     let value = req.files.openPOC_file_one;
    //     let ext = value.mimetype.split("/")
    //     const file = req.files.openPOC_file_one
    //     const newpath = __dirname;
    //     filename += uniqueIdGenerator();
    //     filename += `.${ext[1]}`;
    //     // console.log(`filename`, filename)
    //     file.mv(`${newpath}/images/${filename}`, (err) => {
    //       if (err) {
    //         console.log(err)
    //       }
    //       // console.log(key, value)
    //     })
    //     prev_open_poc[0] = {
    //       POCFilename: filename,
    //       POCDescription: value.name,
    //       DateTime: new Date().toUTCString()
    //     };
    //   }
    // }
    // else {
    // console.log("inside else- prev_open_poc[0] && req.files.openPOC_file_one")

    if (req.files.openPOC_file) {
      if (req.files.openPOC_file.length > 1) {
        const entries = Object.entries(req.files.openPOC_file);
        console.log("entries", entries)
        entries.forEach(([key, data]) => {
          // console.log(`${key}: ${data.name}`);

          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = data;
          console.log("inside else key", key, "value", value)
          let ext = value.mimetype.split("/")
          const file = data
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
        });
      }
      else {
        let filename = "POC_";
        // filename = filename.split(' ').join('_');
        let value = req.files.openPOC_file;
        // console.log("inside else key", key, "value", value)
        let ext = value.mimetype.split("/")
        const file = req.files.openPOC_file
        const newpath = __dirname;
        filename += uniqueIdGenerator();
        filename += `.${ext[1]}`;
        // console.log(`filename`, filename)
        file.mv(`${newpath}/images/${filename}`, (err) => {
          if (err) {
            console.log(err)
          }
          // console.log(key, value)
        })
        prev_open_poc.push({
          POCFilename: filename,
          POCDescription: value.name,
          DateTime: new Date().toUTCString()
        })



      }
    }

    if (req.files.ClosedPOC_file) {
      // 
      if (req.files.ClosedPOC_file.length > 1) { // this condition is created for more than one file

        // condition for Closed POC 
        const prev_data = await AuditTableModal.findOne({
          ProjectID: req.body.projectID,
        },)


        const entries = Object.entries(req.files.ClosedPOC_file);
        console.log("closed entries", entries)
        entries.forEach(([key, data]) => {
          // console.log(`${key}: ${data.name}`);

          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = data;
          // console.log("inside else key", key, "value", value)
          let ext = value.mimetype.split("/")
          const file = data
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
        });
      }
      else {
        let filename = "POC_";
        // filename = filename.split(' ').join('_');
        let value = req.files.ClosedPOC_file;
        // console.log("inside else key", key, "value", value)
        let ext = value.mimetype.split("/")
        const file = req.files.ClosedPOC_file
        const newpath = __dirname;
        filename += uniqueIdGenerator();
        filename += `.${ext[1]}`;
        // console.log(`filename`, filename)
        file.mv(`${newpath}/images/${filename}`, (err) => {
          if (err) {
            console.log(err)
          }
          // console.log(key, value)
        })
        prev_closed_poc.push({
          POCFilename: filename,
          POCDescription: value.name,
          DateTime: new Date().toUTCString()
        })
      }

      // let filename = "POC_";
      // // filename = filename.split(' ').join('_');
      // let value = req.files.openPOC_file_one;
      // let ext = value.mimetype.split("/")
      // const file = req.files.openPOC_file_one
      // const newpath = __dirname;
      // filename += uniqueIdGenerator();
      // filename += `.${ext[1]}`;
      // // console.log(`filename`, filename)
      // file.mv(`${newpath}/images/${filename}`, (err) => {
      //   if (err) {
      //     console.log(err)
      //   }
      //   // console.log(key, value)
      // })
      // prev_open_poc.push({
      //   POCFilename: filename,
      //   POCDescription: value.name,
      //   DateTime: new Date().toUTCString()
      // })


      // console.log("prev_open_poc[0]", prev_closed_poc)
      // }


    }

    if (req.body.oldOpenPOCimages != [] && req.body.oldOpenPOCimages != "[]") {
      const OldPOCArray = JSON.parse(req.body.oldOpenPOCimages)
      for (let k = 0; k < OldPOCArray.length; k++) {
        prev_open_poc.push(OldPOCArray[k])
      }
    }
    if (req.body.oldClosedPOCimages != [] && req.body.oldClosedPOCimages != "[]") {
      const OldPOCArray = JSON.parse(req.body.oldClosedPOCimages)
      for (let k = 0; k < OldPOCArray.length; k++) {
        prev_closed_poc.push(OldPOCArray[k])
      }
    }

    // let filename = "POC_";
    // // filename = filename.split(' ').join('_');
    // let value = req.files.openPOC_file_one;
    // let ext = value.mimetype.split("/")
    // const file = req.files.openPOC_file_one
    // const newpath = __dirname;
    // filename += uniqueIdGenerator();
    // filename += `.${ext[1]}`;
    // // console.log(`filename`, filename)
    // file.mv(`${newpath}/images/${filename}`, (err) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   // console.log(key, value)
    // })
    // prev_open_poc.push({
    //   POCFilename: filename,
    //   POCDescription: value.name,
    //   DateTime: new Date().toUTCString()
    // })


    console.log("prev_open_poc[0]", prev_open_poc)
    // // }

    console.log("prev_clsoed_Poc", prev_closed_poc)
    let new_Vulnerability_Timeline_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      VulnerabilityStatus: req.body.checkListTemplateStatus,
      Status: "Draft",
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Affects: req.body.affects,
      OpenPOC: prev_open_poc,
      ClosedPOC: prev_closed_poc,
      ModifiedBy: req.body.userCheck, // id of role - login user 
      DateTime: new Date().toUTCString()
    }
    await AuditTableModal.updateMany({
      ProjectID: req.body.projectID,
      "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
    }, {
      $push: {
        "Vulnerability_Details.$.Vulnerability_Timeline": new_Vulnerability_Timeline_node,
      },
    })

    await setProjectStatus(req.body.projectID);
    res.json({ status: true, data: "success" })

  }

  // if condition if all the  ClosedPOC is available 


  else {
    console.log("else else else")
    // const prev_data = await AuditTableModal.findOne({
    //   ProjectID: req.body.projectID,
    // },)
    // console.log("prev_Data", prev_data)
    // for (let i = 0; i < prev_data.Vulnerability_Details.length; i++) {
    //   if (prev_data.Vulnerability_Details[i].VulnerabilityID === req.body.vulnerabilityID) {
    //     let last_node_index = prev_data.Vulnerability_Details[i].Vulnerability_Timeline.length - 1
    //     prev_open_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC
    //     prev_closed_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC
    //   }
    // }
    // this is updated images data
    if (req.body.oldOpenPOCimages != [] && req.body.oldOpenPOCimages != "[]") {
      const OldPOCArray = JSON.parse(req.body.oldOpenPOCimages)
      for (let k = 0; k < OldPOCArray.length; k++) {
        prev_open_poc.push(OldPOCArray[k])
      }
    }
    if (req.body.oldClosedPOCimages != [] && req.body.oldClosedPOCimages != "[]") {
      const OldPOCArray = JSON.parse(req.body.oldClosedPOCimages)
      for (let k = 0; k < OldPOCArray.length; k++) {
        prev_closed_poc.push(OldPOCArray[k])
      }
    }
    let new_Vulnerability_Timeline_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      VulnerabilityStatus: req.body.checkListTemplateStatus,
      Status: "Draft",
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Affects: req.body.affects,
      OpenPOC: prev_open_poc,
      ClosedPOC: prev_closed_poc,
      ModifiedBy: req.body.userCheck, // id of role - login user 
      DateTime: new Date().toUTCString()
    }
    console.log("new bul node", new_Vulnerability_Timeline_node)
    try {
      await AuditTableModal.updateOne({
        ProjectID: req.body.projectID,
        "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
      }, {
        $push: {
          "Vulnerability_Details.$.Vulnerability_Timeline": new_Vulnerability_Timeline_node,
        },

      }, (err, result) => {
        if (err) throw err;
        console.log(result);
      }).clone()
    } catch (error) {
      console.log("error", error)
    }

    // .then((res) => console.log("updated", res)).catch((err) => console.log("error", err))
    console.log("data updated")
    // function call to set status of project on global level 
    await setProjectStatus(req.body.projectID);
    res.json({ status: true, data: "success" })
    // console.log("prev_Data", prev_data)
  }
  // console.log("prev_img", prev_closed_poc)
  // let new_Vulnerability_Timeline_node = {
  //   Title: req.body.Title,
  //   Severity: req.body.Severity,
  //   VulnerabilityStatus: req.body.checkListTemplateStatus,
  //   Status: "Draft",
  //   Tags: req.body.CheckListTag,
  //   Description: req.body.description,
  //   Impact: req.body.impact,
  //   Remediation: req.body.remediation,
  //   Affects: req.body.affects,
  //   OpenPOC: prev_open_poc,
  //   ClosedPOC: prev_closed_poc,
  //   ModifiedBy: req.body.userCheck, // id of role - login user 
  //   DateTime: new Date().toUTCString()
  // }
  // await AuditTableModal.updateMany({
  //   ProjectID: req.body.projectID,
  //   "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
  // }, {
  //   $push: {
  //     "Vulnerability_Details.$.Vulnerability_Timeline": new_Vulnerability_Timeline_node,
  //   },
  // })

  // await setProjectStatus(req.body.projectID);
  // res.json({ status: true, data: "success" })




})


// API to edit project audit checklist vulnerabilities auditor 
app.post('/edit-auditor-project-audit-vulnerability', auth, async (req, res) => {
  // console.log("audit data", req.body)
  // console.log("audit data", req.files)
  try {
    // opne POC check for OPEN POC btn 

    let prev_open_poc = new Array();
    let prev_closed_poc = new Array();

    // if request has image files 
    if (req.files != null) {

      // condition for OPEN POC 
      const prev_data = await AuditTableModal.findOne({
        ProjectID: req.body.projectID,
      },)
      // console.log("prev_Data", prev_data)

      /// loop to get previous state of CLosed and OPEN POC 
      for (let i = 0; i < prev_data.Vulnerability_Details.length; i++) {
        if (prev_data.Vulnerability_Details[i].VulnerabilityID === req.body.vulnerabilityID) {
          let last_node_index = prev_data.Vulnerability_Details[i].Vulnerability_Timeline.length - 1

          // condition to get data for OPEN POC 
          if (prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC != "null") {
            prev_open_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC;
            // console.log("prev_opne_poc-- inside", prev_open_poc)
          }

          // condition to get data for closed POC \
          if (prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC != "null") {
            prev_closed_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC;
            // console.log("prev_closed_poc-- inside", prev_closed_poc)
          }
        }
      }

      // if condition if all the OpnePOC is available 
      if (req.files.openPOC_file_one) {
        // console.log("prev_open_poc[0]", prev_open_poc[0])
        if (JSON.stringify(prev_open_poc) == null) {
          // console.log("inside true- prev_open_poc[0] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_one;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_one
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc[0] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[0] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_one;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_one
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_open_poc[0]", prev_open_poc)
        }

      }
      if (req.files.openPOC_file_two) {
        // console.log("prev_open_poc[0]", prev_open_poc[0])
        if (prev_open_poc[1]) {
          // console.log("inside true- prev_open_poc[1] && req.files.openPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_two;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_two
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc[1] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[1] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_two;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_two
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          // let prev_open_poc_length = prev_open_poc.length -1

          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_open_poc[0]", prev_open_poc)
        }
      }
      if (req.files.openPOC_file_three) {
        if (prev_open_poc[2]) {
          // console.log("inside true- prev_open_poc[1] && req.files.openPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_three;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_three
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc[2] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[1] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_three;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_three
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_open_poc[0]", prev_open_poc)
        }

      }
      if (req.files.openPOC_file_four) {
        if (prev_open_poc[3]) {
          // console.log("inside true- prev_open_poc[1] && req.files.openPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_four;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_four
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc[3] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[1] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_four;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_four
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_open_poc[0]", prev_open_poc)
        }
      }
      if (req.files.openPOC_file_five) {
        if (prev_open_poc[4]) {
          // console.log("inside true- prev_open_poc[1] && req.files.openPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_five;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_five
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc[4] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[1] && req.files.openPOC_file_five")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.openPOC_file_five;
          let ext = value.mimetype.split("/")
          const file = req.files.openPOC_file_five
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_open_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_open_poc[0]", prev_open_poc)
        }
      }

      // if condition if all the Closed POC  is available
      if (req.files.closedPOC_file_one) {
        // console.log("prev_open_poc[0]", prev_open_poc[0])
        if (JSON.stringify(prev_closed_poc) == null) {
          // console.log("inside true- prev_open_poc[0] && req.files.closedPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_one;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_one
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc[0] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_open_poc[0] && req.files.closedPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_one;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_one
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_closed_poc[0]", prev_closed_poc)
        }

      }
      if (req.files.closedPOC_file_two) {
        // console.log("prev_closed_poc[0]", prev_closed_poc[0])
        if (prev_closed_poc[1]) {
          // console.log("inside true- prev_closed_poc[1] && req.files.closedPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_two;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_two
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc[1] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_closed_poc[1] && req.files.openPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_two;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_two
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          // let prev_closed_poc_length = prev_closed_poc.length -1

          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_closed_poc[0]", prev_closed_poc)
        }
      }
      if (req.files.closedPOC_file_three) {
        if (prev_closed_poc[2]) {
          // console.log("inside true- prev_closed_poc[1] && req.files.closedPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_three;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_three
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc[2] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_closed_poc[1] && req.files.closedPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_three;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_three
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_closed_poc[0]", prev_closed_poc)
        }

      }
      if (req.files.closedPOC_file_four) {
        if (prev_closed_poc[3]) {
          // console.log("inside true- prev_closed_poc[1] && req.files.closedPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_four;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_four
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc[3] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_closed_poc[1] && req.files.closedPOC_file_one")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_four;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_four
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_closed_poc[0]", prev_closed_poc)
        }
      }
      if (req.files.closedPOC_file_five) {
        if (prev_closed_poc[4]) {
          // console.log("inside true- prev_closed_poc[1] && req.files.closedPOC_file_one");
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_five;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_five
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc[4] = {
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          };
        }
        else {
          // console.log("inside else- prev_closed_poc[1] && req.files.closedPOC_file_five")
          let filename = "POC_";
          // filename = filename.split(' ').join('_');
          let value = req.files.closedPOC_file_five;
          let ext = value.mimetype.split("/")
          const file = req.files.closedPOC_file_five
          const newpath = __dirname;
          filename += uniqueIdGenerator();
          filename += `.${ext[1]}`;
          // console.log(`filename`, filename)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          prev_closed_poc.push({
            POCFilename: filename,
            POCDescription: value.name,
            DateTime: new Date().toUTCString()
          })
          // console.log("prev_closed_poc[0]", prev_closed_poc)
        }
      }

      else {
        console.log("no query ")
      }

      // console.log("prev_img", prev_closed_poc)
      let new_Vulnerability_Timeline_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        VulnerabilityStatus: req.body.checkListTemplateStatus,
        Status: "Draft",
        Tags: req.body.CheckListTag,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Affects: req.body.affects,
        OpenPOC: prev_open_poc,
        ClosedPOC: prev_closed_poc,
        ModifiedBy: req.body.userCheck, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
      await AuditTableModal.updateMany({
        ProjectID: req.body.projectID,
        "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
      }, {
        $push: {
          "Vulnerability_Details.$.Vulnerability_Timeline": new_Vulnerability_Timeline_node,
        },
      })

      await setProjectStatus(req.body.projectID);
      res.json({ status: true, data: "success" })
    }
    // if images are not edited 
    else {
      const prev_data = await AuditTableModal.findOne({
        ProjectID: req.body.projectID,
      },)
      // console.log("prev_Data", prev_data)
      for (let i = 0; i < prev_data.Vulnerability_Details.length; i++) {
        if (prev_data.Vulnerability_Details[i].VulnerabilityID === req.body.vulnerabilityID) {
          let last_node_index = prev_data.Vulnerability_Details[i].Vulnerability_Timeline.length - 1
          prev_open_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].OpenPOC
          prev_closed_poc = prev_data.Vulnerability_Details[i].Vulnerability_Timeline[last_node_index].ClosedPOC
        }
      }
      let new_Vulnerability_Timeline_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        VulnerabilityStatus: req.body.checkListTemplateStatus,
        Status: "Draft",
        Tags: req.body.CheckListTag,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Affects: req.body.affects,
        OpenPOC: prev_open_poc,
        ClosedPOC: prev_closed_poc,
        ModifiedBy: req.body.userCheck, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
      await AuditTableModal.updateMany({
        ProjectID: req.body.projectID,
        "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
      }, {
        $push: {
          "Vulnerability_Details.$.Vulnerability_Timeline": new_Vulnerability_Timeline_node,
        },
      })
      console.log("data updated")
      // function call to set status of project on global level 
      await setProjectStatus(req.body.projectID);
      res.json({ status: true, data: "success" })
      // console.log("prev_Data", prev_data)
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "error in save of vulnerability " })
  }
})

// API to edit project audit checklist vulnerabilities -Team leader API to Approve and reject --- used only by TEAM Leader Role 
app.post('/edit-auditor-project-audit-vulnerability-status', auth, async (req, res) => {
  // we can do this by filerting data using project id and vulnerabilityID
  console.log("audit data", req.body)
  try {
    // let new_Vulnerability_Timeline_node = {
    //   Title: req.body.Title,
    //   Severity: req.body.Severity,
    //   VulnerabilityStatus: req.body.checkListTemplateStatus,
    //   Status: req.body.ApproveStatus,
    //   Tags: req.body.CheckListTag,
    //   Description: req.body.description,
    //   Impact: req.body.impact,
    //   Remediation: req.body.remediation,
    //   OpenPOC: "null",
    //   ClosedPOC: "null",
    //   ModifiedBy: req.body.userCheck, // id of role - login user 
    //   DateTime: new Date().toUTCString()
    // }
    // console.log("req.body.vulnerabilityID", req.body.vulnerabilityID)
    let old_data = await AuditTableModal.findOne({
      ProjectID: req.body.projectID,
      "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
    })
    // console.log('data', old_data)
    // console.log("old_data", old_data[0].Vulnerability_Details)
    // let new_arr = new Array(old_data[0].Vulnerability_Details)
    // console.log("new", old_data.Vulnerability_Details)

    let new_obj
    let new_node;
    for (let i = 0; i < old_data.Vulnerability_Details.length; i++) {
      if (old_data.Vulnerability_Details[i].VulnerabilityID === req.body.vulnerabilityID) {
        console.log("id-matched ", old_data.Vulnerability_Details[i].VulnerabilityID)
        const vulnerability_Timeline_length = old_data.Vulnerability_Details[i].Vulnerability_Timeline.length - 1
        new_node = old_data.Vulnerability_Details[i].Vulnerability_Timeline[vulnerability_Timeline_length]
        break;
      }
    }
    // console.log("newnode ", new_node)

    // let vulnerability_list_length = old_data[0].Vulnerability_Details.length -1
    // let new_arr = old_data[0].Vulnerability_Details[vulnerability_list_length]
    // console.log(typeof(new_arr))
    // console.log("old, data before", old_data)
    new_node.Status = req.body.ApproveStatus;
    new_node.Tags = req.body.CheckListTag;
    new_node.Affects = req.body.affects;
    new_node.ModifiedBy = req.body.userCheck;
    // console.log("old, data after ", old_data)
    await AuditTableModal.updateMany({
      ProjectID: req.body.projectID,
      "Vulnerability_Details.VulnerabilityID": req.body.vulnerabilityID
    }, {
      $push: {
        "Vulnerability_Details.$.Vulnerability_Timeline": new_node,
      },
    })
    // console.log("data updated")
    // await setProjectStatus(req.body.projectID);
    res.json({ status: true, data: "success" })

  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "error in save of vulnerability " })
  }
})

// API To get auditor Projects -- old - dump
app.post('/get-auditor-projects-old', auth, async (req, res) => {
  console.log("user", req.body.userCheck)
  try {

    const user = await AuditorUsers.find({
      AuditorID: req.body.userCheck
    })
    // condition if TL login Projects
    if (user[0].Role === "Team Leader") {
      const projectList = await ProjectList.find({
        TeamLeaderID: req.body.userCheck
      });
      // console.log("project manager role ", projectList)

      let updatedProjectList = []
      for (let element in projectList) {
        // find name of organization 
        const organization = await AuditeeOrg.find({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })
        // console.log("audiotrid", projectList[element].TeamLeaderID != null ? projectList[element].TeamLeaderID : projectList[element].AuditorID)
        if (projectList[element].AuditorID != null) {
          const auditorOrTL = await AuditorUsers.find({
            AuditorID: projectList[element].AuditorID
          })
          // console.log("audiorortl", auditorOrTL)
          let tempObj = {
            AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
            ProjectID: projectList[element].ProjectID,
            ProjectTitle: projectList[element].ProjectTitle,
            AuditType: projectList[element].AuditType,
            AssetsName: projectList[element].AssetsName,
            ProjectManagerID: projectList[element].ProjectManagerID,
            TeamLeaderID: projectList[element].TeamLeaderID,
            AuditorID: projectList[element].AuditorID,
            StartDate: projectList[element].StartDate,
            EndDate: projectList[element].EndDate,
            ProjectScope: projectList[element].ProjectScope,
            ProjectDescription: projectList[element].ProjectDescription,
            ProjectStatus: projectList[element].ProjectStatus,
            OrganizationName: organization[0].OrganizationName,
            Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
          }
          updatedProjectList[element] = tempObj;
        }
        else {
          let tempObj = {
            AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
            ProjectID: projectList[element].ProjectID,
            ProjectTitle: projectList[element].ProjectTitle,
            AuditType: projectList[element].AuditType,
            AssetsName: projectList[element].AssetsName,
            ProjectManagerID: projectList[element].ProjectManagerID,
            TeamLeaderID: projectList[element].TeamLeaderID,
            AuditorID: projectList[element].AuditorID,
            StartDate: projectList[element].StartDate,
            EndDate: projectList[element].EndDate,
            ProjectScope: projectList[element].ProjectScope,
            ProjectDescription: projectList[element].ProjectDescription,
            ProjectStatus: projectList[element].ProjectStatus,
            OrganizationName: organization[0].OrganizationName,
            Name: null,
          }
          updatedProjectList[element] = tempObj;
        }
      }
      res.json({ status: true, data: updatedProjectList })
    }

    // condition if Auditor login Projects
    if (user[0].Role === "Auditor") {
      const projectList = await ProjectList.find({
        AuditorID: req.body.userCheck
      });

      let updatedProjectList = []
      for (let element in projectList) {
        // find name of organization 
        const organization = await AuditeeOrg.find({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })
        const auditorOrTL = await AuditorUsers.find({
          AuditorID: projectList[element].AuditorID
        })

        // check 
        // console.log("audiorortl", auditorOrTL)
        let tempObj = {
          AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
          ProjectID: projectList[element].ProjectID,
          ProjectTitle: projectList[element].ProjectTitle,
          AuditType: projectList[element].AuditType,
          AssetsName: projectList[element].AssetsName,
          ProjectManagerID: projectList[element].ProjectManagerID,
          TeamLeaderID: projectList[element].TeamLeaderID,
          AuditorID: projectList[element].AuditorID,
          StartDate: projectList[element].StartDate,
          EndDate: projectList[element].EndDate,
          ProjectScope: projectList[element].ProjectScope,
          ProjectDescription: projectList[element].ProjectDescription,
          ProjectStatus: projectList[element].ProjectStatus,
          OrganizationName: organization[0].OrganizationName,
          Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
        }
        updatedProjectList[element] = tempObj;
        // console.log("after", tempObj)
      }
      res.json({ status: true, data: updatedProjectList })
    }

    // condition if PM or Admin login Projects
    if (user[0].Role === "Project Manager" || user[0].Role === "Admin") {
      const projectList = await ProjectList.find({
      });
      // console.log("project manager role ", projectList)
      let updatedProjectList = []
      for (let element in projectList) {
        // find name of organization 
        const organization = await AuditeeOrg.find({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })
        // console.log("audiotrid", projectList[element].TeamLeaderID != null ? projectList[element].TeamLeaderID : projectList[element].AuditorID)
        const auditorOrTL = await AuditorUsers.find({
          AuditorID: projectList[element].TeamLeaderID != null ? projectList[element].TeamLeaderID : projectList[element].AuditorID
        })

        // check 
        // console.log("audiorortl", auditorOrTL)
        let tempObj = {
          AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
          ProjectID: projectList[element].ProjectID,
          ProjectTitle: projectList[element].ProjectTitle,
          AuditType: projectList[element].AuditType,
          AssetsName: projectList[element].AssetsName,
          ProjectManagerID: projectList[element].ProjectManagerID,
          TeamLeaderID: projectList[element].TeamLeaderID,
          AuditorID: projectList[element].AuditorID,
          StartDate: projectList[element].StartDate,
          EndDate: projectList[element].EndDate,
          ProjectScope: projectList[element].ProjectScope,
          ProjectDescription: projectList[element].ProjectDescription,
          ProjectStatus: projectList[element].ProjectStatus,
          OrganizationName: organization[0].OrganizationName,
          Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
        }
        updatedProjectList[element] = tempObj;
        // console.log("after", tempObj)
      }
      res.json({ status: true, data: updatedProjectList })
    }
  } catch (error) {
    console.log(error)
    let emptyData = []
    res.json({ status: false, message: "error in geting project list ", data: emptyData })
  }
})

// API To get auditor Projects - working
app.post('/get-auditor-projects', auth, async (req, res) => {
  console.log()
  const page = parseInt(req.query.page) || 1;
  console.log("🚀 ~ app.post ~ page:", page)
  const limit = parseInt(req.query.limit) || 10;
  console.log("🚀 ~ app.post ~ limit:", limit)
  const userCheck = req.query.userCheck;
  console.log("🚀 ~ app.post ~ userCheck:", userCheck)
  const orgID = req.query.orgID;
  console.log("🚀 ~ app.post ~ orgID:", orgID)

  
  console.log("bodyu", req.body)
  try {
    const user = await AuditorUsers.find({
      AuditorID: req.body.userCheck
    })
    // console.log("role ", user[0])
    // condition if TL login Projects
    if (user[0].Role === "Team Leader") {
      const projectList = await ProjectList.find({
      });
      // console.log("project manager role ", projectList)
      let updatedProjectList = []
      let pointer1 = 0;
      let j = 0;
      for (let element in projectList) {
        // find name of organization 
        // console.log("element", element)


        // variable to store last length arr - last index of an arr
        let ProjectDetailsArr = projectList[element].ProjectDetails.length - 1
        // let ProjectManagerTimelineArr = projectList[element].AuditorDetails.ProjectManager.length - 1
        // let TeamLeaderTimelineArr = projectList[element].AuditorDetails.TeamLeader.length - 1
        // let AuditorTimelineArr = projectList[element].AuditorDetails.Auditor.length - 1

        // console.log("AuditorTimelineArr" , AuditorTimelineArr)
        // console.log("ProjectDetailsArr" , ProjectDetailsArr)
        // console.log("ProjectManagerTimelineArr" , ProjectManagerTimelineArr)
        // console.log("TeamLeaderTimelineArr" , TeamLeaderTimelineArr)




        const organization = await AuditeeOrg.findOne({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })
        if (organization) {
          const auditor = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo,
          })

          const TeamLeader = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo
          })

          const projectManager = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedTo
          })
          // console.log("project manager name", projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedBy)

          // get its checklIst type 
          const checklistType = await CheckList.findOne({
            ChecklistDatabaseID: projectList[element].ChecklistDatabaseID
          })

          if (user[0].AuditorID === projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo) {
            // console.log("checklist Type ", checklistType) 
            if (checklistType.ChecklistDatabaseType === "Web Application Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "Mobile Application Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "Network Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "API Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }


          }

        }

        // if (projectList[element].AuditorID != null && projectList[element].TeamLeaderID != null) {
        //   const auditor = await AuditorUsers.find({
        //     AuditorID: projectList[element].AuditorID
        //   })
        //   const TeamLeader = await AuditorUsers.find({
        //     AuditorID: projectList[element].TeamLeaderID
        //   })
        //   let tempObj = {
        //     AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
        //     ProjectID: projectList[element].ProjectID,
        //     ProjectTitle: projectList[element].ProjectTitle,
        //     AuditType: projectList[element].AuditType,
        //     AssetsName: projectList[element].AssetsName,
        //     ProjectManagerID: projectList[element].ProjectManagerID,
        //     TeamLeaderID: projectList[element].TeamLeaderID,
        //     AuditorID: projectList[element].AuditorID,
        //     StartDate: projectList[element].StartDate,
        //     Name: auditor[0].FirstName + " " + auditor[0].LastName,
        //     EndDate: projectList[element].EndDate,
        //     ProjectScope: projectList[element].ProjectScope,
        //     ProjectDescription: projectList[element].ProjectDescription,
        //     ProjectStatus: projectList[element].ProjectStatus,
        //     OrganizationName: organization.OrganizationName,
        //     AuditorName: auditor[0].FirstName + " " + auditor[0].LastName,
        //     TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
        //     ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName
        //   }
        //   updatedProjectList[element] = tempObj;
        // }
      }
      res.json({ status: true, data: updatedProjectList })
    }

    // condition if Auditor login Projects
    if (user[0].Role === "Auditor") {
      const projectList = await ProjectList.find({
        AuditorID: req.body.userCheck
      });
      // console.log("project List", projectList)

      let updatedProjectList = []
      let pointer1 = 0;
      let j = 0;
      for (let element in projectList) {
        // find name of organization 
        // console.log("element", element)\


        // variable to store last length arr - last index of an arr
        let ProjectDetailsArr = projectList[element].ProjectDetails.length - 1
        // let ProjectManagerTimelineArr = projectList[element].AuditorDetails.ProjectManager.length - 1
        // let TeamLeaderTimelineArr = projectList[element].AuditorDetails.TeamLeader.length - 1
        // let AuditorTimelineArr = projectList[element].AuditorDetails.Auditor.length - 1

        // console.log("AuditorTimelineArr" , AuditorTimelineArr)
        // console.log("ProjectDetailsArr" , ProjectDetailsArr)
        // console.log("ProjectManagerTimelineArr" , ProjectManagerTimelineArr)
        // console.log("TeamLeaderTimelineArr" , TeamLeaderTimelineArr)


        // console.log("orgna", projectList[element].AuditeeOrganizationID)
        const organization = await AuditeeOrg.findOne({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })

        if (organization) {
          // console.log("orgna", organization)
          // console.log("type of", typeof(organization))
          const auditor = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo,
          })

          const TeamLeader = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo
          })

          const projectManager = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedTo
          })

          // get its checklIst type 
          const checklistType = await CheckList.findOne({
            ChecklistDatabaseID: projectList[element].ChecklistDatabaseID
          })
          // console.log("checklist Type ", checklistType)

          if (user[0].AuditorID === projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo) {
            // console.log("checklist Type ", checklistType) 
            if (checklistType.ChecklistDatabaseType === "Web Application Audit") {
              // console.log("inside weba pp")
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0]?.FirstName + " " + projectManager[0]?.LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "Mobile Application Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "Network Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }

            if (checklistType.ChecklistDatabaseType === "API Audit") {
              let tempObj = {
                AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
                ProjectID: projectList[element].ProjectID,
                AuditType: projectList[element].AuditType,
                ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
                ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
                ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
                ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
                ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
                CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
                ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
                ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
                ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
                StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
                EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
                ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
                TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
                AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
                // ProjectScope: projectList[element].ProjectScope,
                OrganizationName: organization.OrganizationName,
                // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
                ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
                TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
                AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
              }
              updatedProjectList[pointer1++] = tempObj;
            }
          }
        }

      }
      res.json({ status: true, data: updatedProjectList })
    }

    // condition if PM or Admin login Projects
    if (user[0].Role === "Project Manager" || user[0].Role === "Admin") {
      const projectList = await ProjectList.find({
      });

      // console.log("project manager role ", projectList)
      let updatedProjectList = []
      let pointer1 = 0
      for (let element in projectList) {
        // find name of organization 
        // console.log("element", projectList[element])
        // variable to store last length arr - last index of an arr
        let ProjectDetailsArr = projectList[element].ProjectDetails.length - 1
        // let ProjectManagerTimelineArr = projectList[element].ProjectDetails.AuditorDetails.ProjectManager.length - 1
        // let TeamLeaderTimelineArr = projectList[element].AuditorDetails.TeamLeader.length - 1
        // let AuditorTimelineArr = projectList[element].AuditorDetails.Auditor.length - 1

        // console.log("AuditorTimelineArr" , AuditorTimelineArr)
        // console.log("ProjectDetailsArr" , ProjectDetailsArr)
        // console.log("ProjectManagerTimelineArr" , ProjectManagerTimelineArr)
        // console.log("TeamLeaderTimelineArr" , TeamLeaderTimelineArr)


        const organization = await AuditeeOrg.findOne({
          OrganizationID: projectList[element].AuditeeOrganizationID
        })
        // console.log("organizaton", organization , )
        if (organization) {
          const auditor = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.Auditor.AssignedTo,
          })

          const TeamLeader = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.TeamLeader.AssignedTo
          })

          const projectManager = await AuditorUsers.find({
            AuditorID: projectList[element].ProjectDetails[projectList[element].ProjectDetails.length - 1].AuditorDetails.ProjectManager.AssignedTo
          })

          // get its checklIst type 
          const checklistType = await CheckList.findOne({
            ChecklistDatabaseID: projectList[element].ChecklistDatabaseID
          })

          // console.log("checklist Type ", checklistType) 
          if (checklistType.ChecklistDatabaseType === "Web Application Audit") {
            // console.log("inside weba pp", projectList[element].ProjectDetails[ProjectDetailsArr])
            let tempObj = {
              AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
              ProjectID: projectList[element].ProjectID,
              AuditType: projectList[element].AuditType,
              ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
              ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
              ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
              ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
              ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
              CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
              ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
              ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
              ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
              StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
              EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
              ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
              TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
              AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
              // ProjectScope: projectList[element].ProjectScope,
              OrganizationName: organization.OrganizationName,
              // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
              ProjectManagerName: projectManager[0]?.FirstName + " " + projectManager[0]?.LastName,
              TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
              AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
            }
            updatedProjectList[pointer1++] = tempObj;
          }

          if (checklistType.ChecklistDatabaseType === "Mobile Application Audit") {
            let tempObj = {
              AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
              ProjectID: projectList[element].ProjectID,
              AuditType: projectList[element].AuditType,
              ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
              ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
              ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
              ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
              ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
              CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
              ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
              ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
              ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
              StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
              EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
              ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
              TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
              AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
              // ProjectScope: projectList[element].ProjectScope,
              OrganizationName: organization.OrganizationName,
              // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
              ProjectManagerName: projectManager[0]?.FirstName + " " + projectManager[0]?.LastName,
              TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
              AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
            }
            updatedProjectList[pointer1++] = tempObj;
          }

          if (checklistType.ChecklistDatabaseType === "Network Audit") {
            let tempObj = {
              AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
              ProjectID: projectList[element].ProjectID,
              AuditType: projectList[element].AuditType,
              ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
              ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
              ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
              ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
              ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
              CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
              ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
              ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
              ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
              StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
              EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
              ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
              TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
              AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
              // ProjectScope: projectList[element].ProjectScope,
              OrganizationName: organization.OrganizationName,
              // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
              ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
              TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
              AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
            }
            updatedProjectList[pointer1++] = tempObj;
          }

          if (checklistType.ChecklistDatabaseType === "API Audit") {
            let tempObj = {
              AuditeeOrganizationID: projectList[element].AuditeeOrganizationID,
              ProjectID: projectList[element].ProjectID,
              AuditType: projectList[element].AuditType,
              ProjectTitle: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectTitle,
              ScopeScreenshot: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeScreenshot,
              ScopeName: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeName,
              ReportScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ReportScope,
              ScopeEnvironment: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeEnvironment,
              CertificateScope: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.CertificateScope,
              ScopeAccess: projectList[element].ProjectDetails[ProjectDetailsArr].ScopeDetails.ScopeAccess,
              ProjectDescription: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectDescription,
              ProjectStatus: projectList[element].ProjectDetails[ProjectDetailsArr].ProjectStatus,
              StartDate: projectList[element].ProjectDetails[ProjectDetailsArr].StartDate,
              EndDate: projectList[element].ProjectDetails[ProjectDetailsArr].EndDate,
              ProjectManagerID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.ProjectManager.AssignedTo,
              TeamLeaderID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.TeamLeader.AssignedTo,
              AuditorID: projectList[element].ProjectDetails[ProjectDetailsArr].AuditorDetails.Auditor.AssignedTo,
              // ProjectScope: projectList[element].ProjectScope,
              OrganizationName: organization.OrganizationName,
              // Name: auditorOrTL[0].FirstName + " " + auditorOrTL[0].LastName,
              ProjectManagerName: projectManager[0].FirstName + " " + projectManager[0].LastName,
              TeamLeaderName: TeamLeader[0].FirstName + " " + TeamLeader[0].LastName,
              AuditorName: auditor[0].FirstName + " " + auditor[0].LastName
            }
            updatedProjectList[pointer1++] = tempObj;
          }
        }

      }
      res.json({ status: true, data: updatedProjectList })
    }

  } catch (error) {
    console.log(error)
    let dataEmpty = []
    res.json({ status: false, message: "error in geting project list ", data: dataEmpty })
  }
})

// API To add auditor Projects 
app.post('/add-auditor-projects', auth, async (req, res) => {
  console.log("project data", req.body)
  console.log("project data", req.files)
  try {
    const ModificationTimeline = {
      // Status: req.body.defaultProjectStatus,
      ModifiedBy: req.body.auditorID, // id of role - login user 
      DateTime: new Date().toUTCString()
    }
    // save application screentshot image 
    const appScreenshot_img = req.files.applicationScreenshot;
    // console.log("appScreenshot_img", appScreenshot_img)
    const dir_path = __dirname;
    let img_extension = appScreenshot_img.mimetype.split("/")
    let filename = `App_screenshot_${uniqueIdGenerator()}.${img_extension[1]}`;
    appScreenshot_img.mv(`${dir_path}/images/${filename}`, (err) => {
      console.log(err)
    })
    const ProjectID = uniqueIdGenerator();

    const ProjectManager = {
      AssignedTo: req.body.projectManagerAssignedTo, // self assign here 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    const TeamLeader = {
      AssignedTo: req.body.projectAssignTo, // same team leader 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    const Auditor = {
      AssignedTo: req.body.projectAssignToAuditor, // dynamic could be changed 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    const checklistType = req.body.checkList_Type;
    // console.log("checklistType", checklistType)


    if (checklistType === "Mobile Application Audit") {
      // console.log("inside mobile application audit ")
      const ProjectDetails_MobileAppAudit = {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: "Initiated",
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }

      await ProjectList.create({
        ProjectID: ProjectID,
        AuditeeOrganizationID: req.body.companyName,
        ChecklistDatabaseID: req.body.checklistDatabaseID,
        AuditType: req.body.checkList_Type,
        ProjectDetails: ProjectDetails_MobileAppAudit,

      })
    }

    if (req.body.checkList_Type === "Web Application Audit") {
      const ProjectDetails_WebAppAudit = {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: "Initiated",
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
      await ProjectList.create({
        ProjectID: ProjectID,
        AuditeeOrganizationID: req.body.companyName,
        ChecklistDatabaseID: req.body.checklistDatabaseID,
        AuditType: req.body.checkList_Type,
        ProjectDetails: ProjectDetails_WebAppAudit,
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
      })
    }

    if (req.body.checkList_Type === "API Audit") {
      const ProjectDetails_ApiAudit = {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: "Initiated",
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
      await ProjectList.create({
        ProjectID: ProjectID,
        AuditeeOrganizationID: req.body.companyName,
        ChecklistDatabaseID: req.body.checklistDatabaseID,
        AuditType: req.body.checkList_Type,
        ProjectDetails: ProjectDetails_ApiAudit,
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
      })
    }

    if (req.body.checkList_Type === "Network Audit") {
      const ProjectDetails_NetworkAudit = {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: "Initiated",
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
      await ProjectList.create({
        ProjectID: ProjectID,
        AuditeeOrganizationID: req.body.companyName,
        ChecklistDatabaseID: req.body.checklistDatabaseID,
        AuditType: req.body.checkList_Type,
        ProjectDetails: ProjectDetails_NetworkAudit,
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
      })
    }


    // here audit_table collection is genrating ------------------->>>>>>>>
    // console.log("checklistDatabaseID",  req.body.checklistDatabaseID)
    const checklist = await CheckList.find({
      ChecklistDatabaseID: req.body.checklistDatabaseID,
    })
    // console.log("checklist", checklist)
    // loop to save each checklist as vulnaribilites in audit_table 
    let Main_Vulnerability_Details = []
    let i = 0;
    for (let element_loop of checklist[0].Checklist) {
      let last_node_index = element_loop.ChecklistDetail.length - 1;
      let element = element_loop.ChecklistDetail[last_node_index];
      let vulnerability_node = {
        Title: element.Title,
        Severity: element.Severity,
        CVSS_Vector: element.CVSS_Vector,
        Tags: element.Tags,
        Description: element.Description,
        Impact: element.Impact,
        Remediation: element.Remediation,
        Affects: null,
        VulnerabilityStatus: null,
        Status: "Not Checked",
        OpenPOC: "null",
        ClosedPOC: "null",
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }

      // console.log("element_loop", element_loop.CheckListID)
      let Temp_Vulnerability_Details = {
        VulnerabilityID: uniqueIdGenerator(), // each node has unique vulnerability id 
        CheckListID: element_loop.ChecklistID, // checklistID 
        Vulnerability_Timeline: [vulnerability_node]
      }

      Main_Vulnerability_Details[i++] = Temp_Vulnerability_Details
    }

    // Store data in audit Table 
    await AuditTableModal.create({
      AuditID: uniqueIdGenerator(),
      ProjectID: ProjectID,
      ChecklistDatabaseID: req.body.checklistDatabaseID,
      Vulnerability_Details: Main_Vulnerability_Details
    })

    res.json({ status: true, data: "project added " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "project not added " })
  }
})

// API To update details 
app.post('/edit-auditor-projects', auth, async (req, res) => {
  // console.log("edit data ", req.body);
  try {
    const ModificationTimeline = {
      // Status: req.body.defaultProjectStatus,
      ModifiedBy: req.body.auditorID, // id of role - login user 
      DateTime: new Date().toUTCString()
    }
    let filename;
    if (req.files) {

      // save application screentshot image 
      const appScreenshot_img = req.files.applicationScreenshot;
      // console.log("appScreenshot_img", appScreenshot_img)
      const dir_path = __dirname;
      let img_extension = appScreenshot_img.mimetype.split("/")
      filename = `App_screenshot_${uniqueIdGenerator()}.${img_extension[1]}`;
      appScreenshot_img.mv(`${dir_path}/images/${filename}`, (err) => {
        console.log(err)
      })
    }
    const projectList = await ProjectList.findOne({
      ProjectID: req.body.projectID
    })
    const ProjectManager = {
      AssignedTo: req.body.projectManagerAssignedTo, // self assign here 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    const TeamLeader = {
      AssignedTo: req.body.projectAssignTo, // same team leader 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    const Auditor = {
      AssignedTo: req.body.projectAssignToAuditor, // dynamic could be changed 
      AssignedBy: req.body.projectAssignBy,
      DateTime: new Date().toUTCString()
    }
    let ProjectDetails = {}
    const old_project_details = projectList.ProjectDetails[projectList.ProjectDetails.length - 1]

    if (req.body.checkList_Type === "Mobile Application Audit") {
      ProjectDetails = req.files ? {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      } : {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: old_project_details.ScopeDetails.ScopeScreenshot,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
    }

    if (req.body.checkList_Type === "Web Application Audit") {
      ProjectDetails = req.files ? {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      } : {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: old_project_details.ScopeDetails.ScopeScreenshot,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
    }

    if (req.body.checkList_Type === "API Audit") {
      ProjectDetails = req.files ? {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      } : {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: old_project_details.ScopeDetails.ScopeScreenshot,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }

    }

    if (req.body.checkList_Type === "Network Audit") {
      ProjectDetails = req.files ? {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: filename,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess,
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      } : {
        ProjectTitle: req.body.projectName,
        ProjectDescription: req.body.projectDescription,
        ScopeDetails: {
          ScopeName: req.body.applicationName,
          ReportScope: req.body.applicationURL,
          CertificateScope: req.body.certificateScope,
          ScopeScreenshot: old_project_details.ScopeDetails.ScopeScreenshot,
          ScopeEnvironment: req.body.applicationEnvironment,
          ScopeAccess: req.body.applicationAccess
        },
        AuditorDetails: {
          ProjectManager: ProjectManager,
          TeamLeader: TeamLeader,
          Auditor: Auditor
        },
        AuditeeDetails: {
          Admin: null,
          Procurement: null,
          Technical: null,
          Finance: null
        },
        StartDate: req.body.projectStartDate,
        EndDate: req.body.projectEndDate,
        ProjectStatus: req.body.defaultProjectStatus,
        ModifiedBy: req.body.auditorID, // id of role - login user 
        DateTime: new Date().toUTCString()
      }
    }



    await ProjectList.updateMany({
      ProjectID: req.body.projectID
    }, {
      $set: {
        AuditeeOrganizationID: req.body.companyName,
        ProjectTitle: req.body.projectName,
      },
      $push: {
        ProjectDetails: ProjectDetails,
        "AuditorDetails.ProjectManager": ProjectManager,
        "AuditorDetails.TeamLeader": TeamLeader,
        "AuditorDetails.Auditor": Auditor,
        ModificationTimeline: ModificationTimeline
      }
    })
    res.json({ status: true, message: "user updated" })

  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "user not updated" })
  }
})

//API TO delete auditor project
app.post('/delete-auditor-project', async (req, res) => {
  try {
    await ProjectList.deleteOne({
      ProjectID: req.body.ProjectID
    })
    // delete report 
    await AuditTableModal.deleteMany({
      ProjectID: req.body.ProjectID
    })
    // delete report 
    await CheckListReportData.deleteMany({
      ProjectID: req.body.ProjectID
    })

    // delete report 
    await CheckListCertificateTemplate.deleteMany({
      ProjectID: req.body.ProjectID
    })
    res.json({ status: true, data: "project deleted" })
  } catch (error) {
    console.log(error)
    res.json({ status: false, data: "project not deleted" })
  }
})


// API to delete auditor auditee users 
app.post('/delete-auditor-auditee-user', auth, async (req, res) => {
  // console.log("data", req.body)
  try {
    await AuditeeUser.deleteOne({
      AuditeeID: req.body.ID
    })
    res.json({ status: true, data: "user deleted " })

  } catch (error) {
    console.error(error)
    res.json({ status: false, data: "user not deleted " })
  }
})

// API to delete auditor auditee organization 
app.post('/delete-auditor-auditee-org', auth, async (req, res) => {
  console.log("data", req.body)
  try {

    // delete auditee users --------------->>>>
    await AuditeeUser.deleteMany({
      OrganizationID: req.body.ID
    })

    // get project ------------------>>>>>>>
    const project = await ProjectList.find({
      AuditeeOrganizationID: req.body.ID
    })
    console.log("project List", project)

    // delete audit list 

    // using project iD delete report and certificate 
    if (project) {
      for (let i = 0; i < project.length; i++) {

        // delete report 
        await AuditTableModal.deleteMany({
          ProjectID: project[i].ProjectID
        })
        // delete report 
        await CheckListReportData.deleteMany({
          ProjectID: project[i].ProjectID
        })

        // delete report 
        await CheckListCertificateTemplate.deleteMany({
          ProjectID: project[i].ProjectID
        })
      }
    }

    // delete project 
    await ProjectList.deleteMany({
      AuditeeOrganizationID: req.body.ID
    })

    //delete auditee organization 
    await AuditeeOrg.deleteOne({
      OrganizationID: req.body.ID
    })
    res.json({ status: true, data: "user deleted " })

  } catch (error) {
    console.error(error)
    res.json({ status: false, data: "user not deleted " })
  }
})

//API to get auditee company details 
app.post('/get-auditor-auditee-companylist', auth, async (req, res) => {
  try {
    const companyList = await AuditeeOrg.find({
    });
    let list = []
    let j = 0;
    for (let i = 0; i < companyList.length; i++) {
      list[j++] = {
        name: companyList[i].OrganizationName,
        ID: companyList[i].OrganizationID
      }
    }
    // console.log("list", list)
    res.json({ status: true, data: list })
  } catch (error) {
    console.log(error)
    let list = []
    res.json({ status: false, message: "checkList  not added ", data: list })
  }
})

// API to get user  
app.post('/get-auditor-users', auth, async (req, res) => {
  try {
    const auditorList = await AuditorUsers.find({
    });
    let list = []
    let j = 0;
    for (let i = 0; i < auditorList.length; i++) {
      if (auditorList[i].Role === "Team Leader") {
        list[j++] = {
          name: auditorList[i].FirstName + " " + auditorList[i].LastName,
          ID: auditorList[i].AuditorID
        }
      }
    }
    // console.log("list", list)
    res.json({ status: true, data: list })
  } catch (error) {
    console.log(error)
    let emptyData = []
    res.json({ status: false, message: "checkList  not added ", data: emptyData })
  }
})

// API to get project manager  
app.post('/get-project-manager', auth, async (req, res) => {
  try {
    const auditorList = await AuditorUsers.find({
    });
    let list = []
    let j = 0;
    for (let i = 0; i < auditorList.length; i++) {
      if (auditorList[i].Role === "Project Manager") {
        list[j++] = {
          name: auditorList[i].FirstName + " " + auditorList[i].LastName,
          ID: auditorList[i].AuditorID
        }
      }
    }
    // console.log("list", list)
    res.json({ status: true, data: list })
  } catch (error) {
    console.log(error)
    let emptyData = []
    res.json({ status: false, message: "checkList  not added ", data: emptyData })
  }
})

// API to get user  
app.post('/get-auditor-auditor-users', auth, async (req, res) => {
  try {
    const auditorList = await AuditorUsers.find({
    });
    let list = []
    let j = 0;
    for (let i = 0; i < auditorList.length; i++) {
      if (auditorList[i].Role === "Auditor") {
        list[j++] = {
          name: auditorList[i].FirstName + " " + auditorList[i].LastName,
          ID: auditorList[i].AuditorID
        }
      }
    }
    // console.log("list", list)
    res.json({ status: true, data: list })
  } catch (error) {
    console.log(error)
    let list = []
    res.json({ status: false, message: "checkList  not added ", data: list })
  }
})

// API to add auditor User 
app.post("/add-auditor-user", auth, async (req, res) => {
  const newPassword = await bcrypt.hash(req.body.empPassword, 10);
  const mdificationTimeline = {
    Status: req.body.empStatus,
    ModifiedBy: req.body.loginUser, // id of role - login user 
    DateTime: new Date().toUTCString()
  }
  try {
    await AuditorUsers.create({
      OrganizationID: req.body.organizationId,
      AuditorID: uniqueIdGenerator(),
      FirstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
      LastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
      Designation: req.body.jobTitle,
      Role: req.body.role,
      Mobile: req.body.empPhone,
      Gender: req.body.gender,
      Email: req.body.empEmail,
      Password: newPassword,
      ModificationTimeline: mdificationTimeline
    });

    const login = `${process.env.APP_URI}/login`;
    const body = `<body style="margin: 0; padding: 0;" bgcolor="#FFFFFF">
    <table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0">
        <tr height="32" style="height: 32px;">
            <td></td>
        </tr>
        <tr align="center">
            <td>
                <table border="0" cellspacing="0" cellpadding="0"
                    style="padding-bottom: 20px; max-width: 516px; min-width: 220px;">
                    <tr>
                        <td width="8" style="width: 8px;"></td>
                        <td>
                            <div style="border-style: solid; border-width:thin; border-color:#dadce0; border-radius:8px; padding:40px 20px;"
                                align="left"><img
                                    src="https://i.imgur.com/ai1Cv7W.png"
                                    style="height:34px;widht:auto;">
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; padding-top: 30px; text-align: left; word-break: break-word;">
                                    <div style="font-size: 16px;">Hi ${req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1)},</div>


                                </div>
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                    Your new account has been created for auditor pannel .  If you have query , contact on help@xiarch.com

                                    <div style="padding-top: 32px; text-align: center;">
                                        <a href=${login} target="_blank" link-id="main-button-link" style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 16px;display:inline-block;padding: 15px 30px;background-color: #007EE6; border-radius: 2px; min-width: 90px; text-align:center;">Login 
                                        </a>
                                    </div>
                                </div>

                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px;padding-bottom: 20px; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.87); letter-spacing: 0.3px; text-align: left">
                                    Login Email: ${req.body.empEmail}<br/>
Login Password:${req.body.empPassword}
                                </div>

                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                    Best Regards,
                                    <br><br>
                                    — Team AuditSense
                                </div>
                            </div>
                        </td>
                        <td width="8" style="width: 8px;"></td>
                    </tr>
                    <tr height="32" style="height: 32px;">
                </table>
            </td>
        </tr>
    </table>
</body`;

    // const sendGridAPIKey = process.env.EMAIL_PASSWORD;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    try {
      await SendEmailAddedResponse({
        // sendGridAPIKey: sendGridAPIKey,
        EMAIL_FROM: EMAIL_FROM,
        to: req.body.empEmail,
        subject: "Your Email has been added to auditor pannel",
        text: body,
      });
    } catch (error) {
      console.log("inside error", error)
      // res.json({ status: false, data: "not valid email" });
      // user.registrationVerificationToken = undefined;
      // user.registrationVerificationExpire = undefined;
      // console.log("main error ", error);
      // await user.save(); // this is not called
    }
    res.json({ status: true, message: "admin user created" });
  } catch (error) {
    console.error("error", error)
    res.json({ status: false, message: "some error occured" });
  }
})

//API to edit auditor User 
app.post("/edit-auditor-user", auth, async (req, res) => {
  // console.log("data---", req.body)
  const mdificationTimeline = {
    Status: req.body.empStatus,
    ModifiedBy: req.body.loginUser, // id of role - login user 
    ModifiedDateTime: new Date().toUTCString()
  }
  try {
    await AuditorUsers.updateMany({
      AuditorID: req.body.formUserID,
    }, {
      $set: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Designation: req.body.jobTitle,
        Role: req.body.role,
        Mobile: req.body.empPhone,
        Gender: req.body.gender,
        Status: req.body.empStatus,
      },
      $push: {
        ModificationTimeline: mdificationTimeline
      }
    })
    res.json({ status: true, message: "user updated" });
  } catch (error) {
    res.json({ status: false, message: "some error occured while editing" });
  }
})

//API to disable  auditor User 
app.post("/change-status-auditor-user", auth, async (req, res) => {
  console.log("data---", req.body)
  const mdificationTimeline = {
    Status: req.body.status === "Disabled" ? "Enabled" : "Disabled",
    ModifiedBy: req.body.loginUser, // id of role - login user 
    DateTime: new Date().toUTCString()
  }
  try {
    await AuditorUsers.updateMany({
      AuditorID: req.body.auditorID,
    }, {
      $set: {
        Status: req.body.status === "Disabled" ? "Enabled" : "Disabled",
      },
      $push: {
        ModificationTimeline: mdificationTimeline
      }
    })
    res.json({ status: true, message: "user updated" });

  } catch (error) {
    res.json({ status: false, message: "some error occured while editing" });
  }
})

//API to delete auditor User 


// API to get auditor User List 
app.post('/get-auditor-userlist', auth, async (req, res) => {
  // console.log("data", req.body)
  try {
    const checkList = await AuditorUsers.find({
      OrganizationID: req.body.organizationId,
      AuditorID: { $nin: [req.body.AuditorID] },
    });
    let status;
    // console.log(checkList)
    if (checkList) {
      let result_arr = []

      for (let i = 0; i < checkList.length; i++) {
        let last_node_index = checkList[i].ModificationTimeline.length - 1
        status = checkList[i].ModificationTimeline[last_node_index].Status

        result_arr[i] = {
          OrganizationID: checkList[i].OrganizationID,
          AuditorID: checkList[i].AuditorID,
          FirstName: checkList[i].FirstName,
          LastName: checkList[i].LastName,
          Designation: checkList[i].Designation,
          Role: checkList[i].Role,
          Mobile: checkList[i].Mobile,
          Gender: checkList[i].Gender,
          Email: checkList[i].Email,
          Status: status
        }
      }


      res.json({ status: true, data: result_arr })
    }
  } catch (error) {
    console.log(error)
    let result_arr = []
    res.json({ status: false, message: "checkList  not added ", data: result_arr })
  }
})

// API to delete auditor User  
app.post('/delete-auditor-user', async (req, res) => {
  console.log("data", req.body)
  try {
    await AuditorUsers.deleteOne({
      AuditorID: req.body.auditorID
    })
    res.json({ status: true, data: "user deleted " })

  } catch (error) {
    console.error(error)
    res.json({ status: false, data: "user not deleted " })
  }
})


//API to add auditor checklist certificate Template 
app.post('/add-auditor-checklist-certificate-template', auth, async (req, res) => {
  // console.log("data", req.body)
  const mdificationTimeline = {
    Status: req.body.cerificateStatus,
    ModifiedBy: req.body.auditorID,
    ModifiedDateTime: new Date().toUTCString()
  }
  try {
    await CheckListCertificateTemplate.create({
      ChecklistDatabaseID: req.body.checkListID,
      CertificateTemplateID: uniqueIdGenerator(),
      TemplateName: req.body.TemplateName,
      Status: req.body.cerificateStatus,
      ModificationTimeline: mdificationTimeline
    })
    res.json({ status: true, message: "checkList report templacte added " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList report templacte not added " })
  }
})

//API to get auditor checklist certificate Template 
app.post('/get-auditor-checkList-certificate-template', auth, async (req, res) => {
  try {
    const checkList = await CheckListCertificateTemplate.find({
      ChecklistDatabaseID: req.body.checkListID
    });
    res.json({ status: true, data: checkList })
  } catch (error) {
    console.log(error)
    let checkList = []
    res.json({ status: false, message: "checkList  not added ", data: checkList })
  }
})

//API to add auditor checklist report Template 
app.post('/add-auditor-checklist-report-template', auth, async (req, res) => {
  console.log("data", req.body)

  const mdificationTimeline = {
    Status: req.body.reportStatus,
    ModifiedBy: req.body.auditorID,
    ModifiedDateTime: new Date().toUTCString()
  }
  try {
    await CheckListReportTemplate.create({
      ChecklistDatabaseID: req.body.checkListID,
      ReportTemplateID: uniqueIdGenerator(),
      TemplateName: req.body.TemplateName,
      Status: req.body.reportStatus,
      ModificationTimeline: mdificationTimeline
    })
    res.json({ status: true, message: "checkList report templacte added " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList report templacte not added " })
  }
})

//API to get auditor checklist report Template 
// app.post('/get-auditor-checkList-report-template', async (req, res) => {
//   try {
//     const checkList = await CheckListReportTemplate.find({
//       ChecklistDatabaseID: req.body.checkListID
//     });
//     res.json({ status: true, data: checkList })
//   } catch (error) {
//     console.log(error)
//     res.json({ status: false, message: "checkList  not added " })
//   }
// })



//API to add auditor checklist Template 
app.post('/add-auditor-checklist-template', auth, async (req, res) => {
  console.log("data", req.body)
  if (req.body.checklistType === "Web Application Audit") {
    const sub_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Reference: req.body.reference,
      Status: req.body.checkListTemplateStatus,
      ModifiedBy: req.body.auditorID,
      DateTime: new Date().toUTCString()
    }

    const node = {
      ChecklistID: uniqueIdGenerator(),
      ChecklistDetail: [sub_node]
    }

    try {
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID
      }, { $push: { Checklist: node } })


      res.json({ status: true, message: "checkList added " })
    } catch (error) {
      console.log(error)
    }
  }

  if (req.body.checklistType === "Mobile Application Audit") {
    const sub_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Reference: req.body.reference,
      Status: req.body.checkListTemplateStatus,
      ModifiedBy: req.body.auditorID,
      DateTime: new Date().toUTCString()
    }

    const node = {
      ChecklistID: uniqueIdGenerator(),
      ChecklistDetail: [sub_node]
    }

    try {
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID
      }, { $push: { Checklist: node } })


      res.json({ status: true, message: "checkList added " })
    } catch (error) {
      console.log(error)
    }
  }


  if (req.body.checklistType === "API Audit") {
    const sub_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Reference: req.body.reference,
      Status: req.body.checkListTemplateStatus,
      ModifiedBy: req.body.auditorID,
      DateTime: new Date().toUTCString()
    }

    const node = {
      ChecklistID: uniqueIdGenerator(),
      ChecklistDetail: [sub_node]
    }

    try {
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID
      }, { $push: { Checklist: node } })


      res.json({ status: true, message: "checkList added " })
    } catch (error) {
      console.log(error)
    }
  }


  if (req.body.checklistType === "Network Audit") {
    const sub_node = {
      Title: req.body.Title,
      Severity: req.body.Severity,
      Tags: req.body.CheckListTag,
      CVSS_Vector: req.body.CVSS_vector,
      Description: req.body.description,
      Impact: req.body.impact,
      Remediation: req.body.remediation,
      Reference: req.body.reference,
      Status: req.body.checkListTemplateStatus,
      ModifiedBy: req.body.auditorID,
      DateTime: new Date().toUTCString()
    }

    const node = {
      ChecklistID: uniqueIdGenerator(),
      ChecklistDetail: [sub_node]
    }

    try {
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID
      }, { $push: { Checklist: node } })


      res.json({ status: true, message: "checkList added " })
    } catch (error) {
      console.log(error)

    }
  }
})

//API to add auditor checklist Template 
app.post('/edit-auditor-checklist-template', auth, async (req, res) => {
  console.log("data", req.body)

  try {
    if (req.body.checklistType === "Web Application Audit") {
      const new_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        Tags: req.body.CheckListTag,
        CVSS_Vector: req.body.CVSS_vector,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Reference: req.body.reference,
        Status: req.body.checkListTemplateStatus,
        ModifiedBy: req.body.auditorID,
        DateTime: new Date().toUTCString()
      }
      try {
        await CheckList.findOneAndUpdate({
          ChecklistDatabaseID: req.body.checkListID,
          "Checklist.ChecklistID": req.body.CheckListTemplateID
        }, {
          $push: {
            "Checklist.$.ChecklistDetail": new_node,
          }
        })
      } catch (error) {
        console.log(error)
      }
      console.log("success")
      res.json({ status: true, message: "checkList template Edited" })
    }

    if (req.body.checklistType === "Mobile Application Audit") {
      const new_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        Tags: req.body.CheckListTag,
        CVSS_Vector: req.body.CVSS_vector,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Reference: req.body.reference,
        Status: req.body.checkListTemplateStatus,
        ModifiedBy: req.body.auditorID,
        DateTime: new Date().toUTCString()
      }
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID,
        "Checklist.ChecklistID": req.body.CheckListTemplateID
      }, {
        $push: {
          "Checklist.$.ChecklistDetail": new_node,
        }
      })
      // console.log("success")
      res.json({ status: true, message: "checkList template Edited " })
    }

    if (req.body.checklistType === "API Audit") {
      const new_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        Tags: req.body.CheckListTag,
        CVSS_Vector: req.body.CVSS_vector,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Reference: req.body.reference,
        Status: req.body.checkListTemplateStatus,
        ModifiedBy: req.body.auditorID,
        DateTime: new Date().toUTCString()
      }
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID,
        "Checklist.ChecklistID": req.body.CheckListTemplateID
      }, {
        $push: {
          "Checklist.$.ChecklistDetail": new_node,
        }
      })
      // console.log("success")
      res.json({ status: true, message: "checkList template Edited " })
    }

    if (req.body.checklistType === "Network Audit") {
      const new_node = {
        Title: req.body.Title,
        Severity: req.body.Severity,
        Tags: req.body.CheckListTag,
        CVSS_Vector: req.body.CVSS_vector,
        Description: req.body.description,
        Impact: req.body.impact,
        Remediation: req.body.remediation,
        Reference: req.body.reference,
        Status: req.body.checkListTemplateStatus,
        ModifiedBy: req.body.auditorID,
        DateTime: new Date().toUTCString()
      }
      await CheckList.updateMany({
        ChecklistDatabaseID: req.body.checkListID,
        "Checklist.ChecklistID": req.body.CheckListTemplateID
      }, {
        $push: {
          "Checklist.$.ChecklistDetail": new_node,
        }
      })
      // console.log("success")
      res.json({ status: true, message: "checkList template Edited " })
    }

  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList template Not edited " })
  }
})

//API to delete auditor checklist Template 
app.post('/delete-auditor-checklist-template', auth, async (req, res) => {
  console.log("data", req.body)

  try {
    await CheckList.updateOne({
      ChecklistDatabaseID: req.body.checkListID
    }, { $pull: { Checklist: { ChecklistID: req.body.CheckListTemplateID } } })
    // await CheckList.deleteOne({})
    console.log("success")
    res.json({ status: true, message: "checkList template deleted " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList template Not deleted " })
  }
})

//API to get auditor checklist Template 
app.post('/get-auditor-checkList-template', auth, async (req, res) => {
  // console.log("data", req.body)
  try {
    const checkList = await CheckList.find({
      ChecklistDatabaseID: req.body.checkListID
    });
    // console.log("checkList", checkList)
    let result_arr = [];
    for (let i = 0; i < checkList[0].Checklist.length; i++) {
      let last_index = checkList[0].Checklist[i].ChecklistDetail.length - 1
      let temp_obj = {
        ChecklistID: checkList[0].Checklist[i].ChecklistID,
        Title: checkList[0].Checklist[i].ChecklistDetail[last_index].Title,
        Severity: checkList[0].Checklist[i].ChecklistDetail[last_index].Severity,
        Tags: checkList[0].Checklist[i].ChecklistDetail[last_index].Tags,
        CVSS_Vector: checkList[0].Checklist[i].ChecklistDetail[last_index].CVSS_Vector,
        Description: checkList[0].Checklist[i].ChecklistDetail[last_index].Description,
        Impact: checkList[0].Checklist[i].ChecklistDetail[last_index].Impact,
        Remediation: checkList[0].Checklist[i].ChecklistDetail[last_index].Remediation,
        Reference: checkList[0].Checklist[i].ChecklistDetail[last_index].Reference,
        Status: checkList[0].Checklist[i].ChecklistDetail[last_index].Status,
        ModifiedBy: checkList[0].Checklist[i].ChecklistDetail[last_index].ModifiedBy,
        DateTime: checkList[0].Checklist[i].ChecklistDetail[last_index].DateTime,
      }
      result_arr[i] = temp_obj;
    }
    res.json({ status: true, data: result_arr })
  } catch (error) {
    console.log(error)
    let result_arr = [];
    res.json({ status: false, message: "checkList not added ", data: result_arr })
  }
})


//API to get auditor checklist Template 
app.post('/get-auditor-specific-checkList-template', auth, async (req, res) => {
  // console.log("data", req.body.checkList_Type)
  try {
    const checkList = await CheckList.find({
      ChecklistDatabaseType: req.body.checkList_Type
    });
    let result_arr = []
    for (let i = 0; i < checkList.length; i++) {
      let temp_arr = {
        ChecklistDatabaseName: checkList[i].ChecklistDatabaseName,
        ChecklistDatabaseID: checkList[i].ChecklistDatabaseID
      }
      result_arr[i] = temp_arr;
    }
    res.json({ status: true, data: result_arr })
  } catch (error) {
    console.log(error)
    let result_arr = []
    res.json({ status: false, message: "checkList not added ", data: result_arr })
  }
})

app.post('/get-checklist-type', auth, async (req, res) => {
  console.log("data", req.body)
  try {
    const checkList = await CheckList.find({
      ChecklistDatabaseID: req.body.checkListID
    });
    console.log(checkList.Checklist)
    res.json({ status: true, data: checkList[0].ChecklistDatabaseType })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList not added " })
  }
})


//add Aufitor checkLISt 
app.post('/add-auditor-checklist', auth, async (req, res) => {
  // console.log("data", req.body)

  const mdificationTimeline = {
    Status: req.body.checkLIstStatus,
    ModifiedBy: req.body.auditorID,
    DateTIme: new Date().toUTCString()

  }
  try {
    await CheckList.create({
      ChecklistDatabaseID: uniqueIdGenerator(),
      ChecklistDatabaseType: req.body.checkLIstType,
      ChecklistDatabaseName: req.body.checkListName,
      ChecklistDatabaseVersion: req.body.checkListVersion,
      ChecklistDatabaseYear: req.body.checkListYear,
      ModificationTimeline: mdificationTimeline
    })
    res.json({ status: true, message: "checkList added " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList not added " })
  }
})


//edit  auditor checkLISt 
app.post('/edit-auditor-checklist', auth, async (req, res) => {
  // console.log("data", req.body)

  const mdificationTimeline = {
    Status: req.body.checkLIstStatus,
    ModifiedBy: req.body.auditorID,
    ModifiedDateTime: new Date().toUTCString()
  }
  try {
    await CheckList.updateMany({
      ChecklistDatabaseID: req.body.checkListDbId
    }, {
      $set: {
        ChecklistDatabaseID: req.body.checkListDbId,
        ChecklistDatabaseType: req.body.checkLIstType,
        ChecklistDatabaseName: req.body.checkListName,
        ChecklistDatabaseVersion: req.body.checkListVersion,
        ChecklistDatabaseYear: req.body.checkListYear,
        Status: req.body.checkLIstStatus,
      },
      $push: {
        ModificationTimeline: mdificationTimeline
      }
    })
    res.json({ status: true, message: "checkList edited " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList not edited " })
  }
})

// delete auditor Checklist 
app.post('/delete-auditor-checklist', auth, async (req, res) => {
  console.log(req.body)
  try {
    await CheckList.deleteOne({
      ChecklistDatabaseID: req.body.checkListDbId
    })
    res.json({ status: true, message: "checkList deleted " })
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: "checkList not deleted " })
  }
})


// api to get auditor checklist 
app.post('/get-auditor-checkList', auth, async (req, res) => {
  try {
    const checkList = await CheckList.find({});
    // console.log("checklist ", checkList)
    if (checkList) {
      let result_checklist = []
      for (let i = 0; i < checkList.length; i++) {
        let length_of_modification_timeline = checkList[i].ModificationTimeline.length - 1
        // console.log("time", checkList[i].ModificationTimeline)
        let temp_obj = {
          ChecklistDatabaseID: checkList[i].ChecklistDatabaseID,
          ChecklistDatabaseType: checkList[i].ChecklistDatabaseType,
          ChecklistDatabaseName: checkList[i].ChecklistDatabaseName,
          ChecklistDatabaseVersion: checkList[i].ChecklistDatabaseVersion,
          ChecklistDatabaseYear: checkList[i].ChecklistDatabaseYear,
          Status: checkList[i].ModificationTimeline[length_of_modification_timeline].Status
        }
        result_checklist[i] = temp_obj;
      }
      res.json({ status: true, data: result_checklist })
    }
  } catch (error) {
    console.log(error)
    let result_checklist = []
    res.json({ status: false, message: "error in getting checklist ", data: result_checklist })
  }
})

// GEt auditee-user  List 
app.post('/get-auditee-user-list', auth, async (req, res) => {
  try {
    const data = await AuditeeUser.find({
      OrganizationID: req.body.organizationId
    })
    res.json({ message: "success", status: true, data: data })
  } catch (error) {
    let result_checklist = []
    res.json({ message: "failure", status: false, data: result_checklist })
  }
})

// GEt auditee-user  List 
app.post('/get-auditee-org-list', auth, async (req, res) => {
  try {
    const data = await AuditeeOrg.find({})
    let result_data = []
    if (data) {
      for (let i = 0; i < data.length; i++) {

        // get project count 
        const project_list = await ProjectList.find({
          AuditeeOrganizationID: data[i].OrganizationID
        })
        let prj_count = project_list.length

        // get user count 
        const user_count = await AuditeeUser.find({
          OrganizationID: data[i].OrganizationID
        })

        let last_node_index = data[i].ModificationTimeline.length - 1
        let temp_arr = {
          OrganizationID: data[i].OrganizationID,
          OrganizationName: data[i].OrganizationName,
          OrganizationLogo: data[i].OrganizationLogo,
          EmployeeSize: data[i].EmployeeSize,
          OrganizationSector: data[i].OrganizationSector,
          Industry: data[i].Industry,
          Email: data[i].Email,
          Phone: data[i].Phone,
          Website: data[i].Website,
          Street: data[i].Street,
          City: data[i].City,
          State: data[i].State,
          Country: data[i].Country,
          Pincode: data[i].Pincode,
          OtherDetails: data[i].OtherDetails,
          Status: data[i].ModificationTimeline[last_node_index].Status,
          ProjectCount: prj_count,
          UserCount: user_count.length
        }
        result_data[i] = temp_arr
      }
    }
    res.json({ message: "success", status: true, data: result_data })
  } catch (error) {
    let result_data = []
    res.json({ message: "failure", status: false, data: result_data })

  }
})

// APi to create auditee--- Users
app.post('/add-auditee-user', auth, async (req, res) => {
  console.log("data ", req.body)
  const newPassword = await bcrypt.hash(req.body.empPassword, 10);

  try {
    // to check existing email
    const userCheck = await AuditeeUser.find({
      Email: req.body.empEmail
    })
    console.log("usercheck", userCheck) // here if email exist it will got to catch , as its schema has unique email code
    // if(!userCheck){
    //  return  res.json({ status: false, message: "user email already exist" })
    // }
    if (req.body.role === "Admin") {
      const checkAdminUser = await AuditeeUser.findOne({
        OrganizationID: req.body.organizationId,
        Role: "Admin"
      })
      if (!checkAdminUser) {
        await AuditeeUser.create({
          OrganizationID: req.body.organizationId,
          AuditeeID: uniqueIdGenerator(),
          Designation: req.body.jobType,
          FirstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
          LastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
          Role: req.body.role,
          EmployeeType: req.body.empType,
          Mobile: req.body.empPhone,
          Gender: req.body.gender,
          Status: req.body.empStatus,
          Email: req.body.empEmail,
          Password: newPassword,
        })

        const login = `${process.env.AUDITEE_APP_URI}/login`;
        const body = `<body style="margin: 0; padding: 0;" bgcolor="#FFFFFF">
    <table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0">
        <tr height="32" style="height: 32px;">
            <td></td>
        </tr>
        <tr align="center">
            <td>
                <table border="0" cellspacing="0" cellpadding="0"
                    style="padding-bottom: 20px; max-width: 516px; min-width: 220px;">
                    <tr>
                        <td width="8" style="width: 8px;"></td>
                        <td>
                            <div style="border-style: solid; border-width:thin; border-color:#dadce0; border-radius:8px; padding:40px 20px;"
                                align="left"><img
                                    src="https://i.imgur.com/ai1Cv7W.png"
                                    style="height:34px;widht:auto;">
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; padding-top: 30px; text-align: left; word-break: break-word;">
                                    <div style="font-size: 16px;">Hi ${req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1)},</div>
  
  
                                </div>
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                Your AuditSense account is ready to use. Kindly check the below login details.
  
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px;padding-bottom: 20px; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.87); letter-spacing: 0.3px; text-align: left">
                                 Email: ${req.body.empEmail}<br/><br/> Password:${req.body.empPassword}
                            </div>
                                    <div style="padding-top: 32px; text-align: center;">
                                        <a href=${login} target="_blank" link-id="main-button-link" style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 16px;display:inline-block;padding: 15px 30px;background-color: #007EE6; border-radius: 2px; min-width: 90px; text-align:center;">Login 
                                        </a>
                                    </div>
                                </div>
                                <br/><br/>
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;"> If you have query , contact at admin@auditsense.in
                                </div>
                                <br/>
  
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                    Best Regards,
                                    <br><br>
                                    — Team AuditSense
                                </div>
                            </div>
                        </td>
                        <td width="8" style="width: 8px;"></td>
                    </tr>
                    <tr height="32" style="height: 32px;">
                </table>
            </td>
        </tr>
    </table>
  </body`;

        // const sendGridAPIKey = process.env.EMAIL_PASSWORD;
        const EMAIL_FROM = process.env.EMAIL_FROM;
        try {
          await SendEmailAddedResponse({
            // sendGridAPIKey: sendGridAPIKey,
            EMAIL_FROM: EMAIL_FROM,
            to: req.body.empEmail,
            subject: "Your AuditSense Account is Ready!",
            text: body,
          });
        } catch (error) {
          console.log("inside error", error)
          // res.json({ status: false, data: "not valid email" });
          // user.registrationVerificationToken = undefined;
          // user.registrationVerificationExpire = undefined;
          // console.log("main error ", error);
          // await user.save(); // this is not called
        }
        return res.json({ status: true, message: "Admin User created" })
      }
      else {
        return res.json({ status: false, message: "Admin User exist" })
      }
    }
    else {
      await AuditeeUser.create({
        OrganizationID: req.body.organizationId,
        AuditeeID: uniqueIdGenerator(),
        Designation: req.body.jobType,
        FirstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
        LastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
        Role: req.body.role,
        EmployeeType: req.body.empType,
        Mobile: req.body.empPhone,
        Gender: req.body.gender,
        Status: req.body.empStatus,
        Email: req.body.empEmail,
        Password: newPassword,
      })

      const login = `${process.env.AUDITEE_APP_URI}/login`;
      const body = `<body style="margin: 0; padding: 0;" bgcolor="#FFFFFF">
  <table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0">
      <tr height="32" style="height: 32px;">
          <td></td>
      </tr>
      <tr align="center">
          <td>
              <table border="0" cellspacing="0" cellpadding="0"
                  style="padding-bottom: 20px; max-width: 516px; min-width: 220px;">
                  <tr>
                      <td width="8" style="width: 8px;"></td>
                      <td>
                          <div style="border-style: solid; border-width:thin; border-color:#dadce0; border-radius:8px; padding:40px 20px;"
                              align="left"><img
                                  src="https://i.imgur.com/ai1Cv7W.png"
                                  style="height:34px;widht:auto;">
                              <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; padding-top: 30px; text-align: left; word-break: break-word;">
                                  <div style="font-size: 16px;">Hi ${req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1)},</div>


                              </div>
                              <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                              Your AuditSense account is ready to use. Kindly check the below login details.

                              <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px;padding-bottom: 20px; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.87); letter-spacing: 0.3px; text-align: left">
                               Email: ${req.body.empEmail}<br/>
 Password:${req.body.empPassword}
                          </div>
                                  <div style="padding-top: 32px; text-align: center;">
                                      <a href=${login} target="_blank" link-id="main-button-link" style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 16px;display:inline-block;padding: 15px 30px;background-color: #007EE6; border-radius: 2px; min-width: 90px; text-align:center;">Login 
                                      </a>
                                  </div>
                              </div>

                              <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;"> If you have query , contact at admin@auditsense.in
                              </div>

                              <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                  Best Regards,
                                  <br><br>
                                  — Team AuditSense
                              </div>
                          </div>
                      </td>
                      <td width="8" style="width: 8px;"></td>
                  </tr>
                  <tr height="32" style="height: 32px;">
              </table>
          </td>
      </tr>
  </table>
</body`;
      // const sendGridAPIKey = process.env.EMAIL_PASSWORD;
      const EMAIL_FROM = process.env.EMAIL_FROM;
      try {
        await SendEmailAddedResponse({
          // sendGridAPIKey: sendGridAPIKey,
          EMAIL_FROM: EMAIL_FROM,
          to: req.body.empEmail,
          subject: "Your AuditSense Account is Ready!",
          text: body,
        });
      } catch (error) {
        console.log("inside error", error)
        // res.json({ status: false, data: "not valid email" });
        // user.registrationVerificationToken = undefined;
        // user.registrationVerificationExpire = undefined;
        // console.log("main error ", error);
        // await user.save(); // this is not called
      }
      return res.json({ status: true, message: "user created" })
    }

    // res.json({ status: true, message: "auditor  user created" })
  } catch (error) {
    console.log("error", error)
    res.json({ status: false, message: "Email already exist" })
  }
})

// API to updated auditor - auditee-users
app.post('/edit-auditee-user', auth, async (req, res) => {
  try {
    let mofification = {
      Status: req.body.empStatus,
      ModifiedBy: req.body.loginUser, // auditor id will be there using session 
      ModifiedDateTime: new Date().toUTCString()
    }
    await AuditeeUser.updateMany({
      AuditeeID: req.body.UserID
    }, {
      $set: {
        Designation: req.body.jobType,
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Role: req.body.role,
        EmployeeType: req.body.empType,
        Mobile: req.body.empPhone,
        Gender: req.body.gender,
        Status: req.body.empStatus,
      },
      $push: {
        ModificationTimeline: mofification
      }
    })
    res.json({ status: true, message: "user updated" })
  } catch (error) {
    console.log("error", error)
    res.json({ status: false, message: "user creation error" })
  }
})

// APi to create auditiee--organization 
app.post('/add-auditee-organization', auth, async (req, res) => {
  // console.log("files", req.files);
  // console.log("body", req.body);
  const image = req.files;
  const newpath = __dirname;
  let vulnerability_status_img;
  try {
    Object.entries(image).forEach(
      async ([key, value]) => {
        // console.log(key, value)
        let filename = "CompanyLogo" + "_";
        filename = filename.split(' ').join('_');
        const file = value;
        let tempFileName = value.name
        filename += uniqueIdGenerator();
        filename += ".png";
        console.log(`filename`, filename)
        file.mv(`${newpath}/images/${filename}`, (err) => {
          if (err) {
            console.log(err)
          }
          // console.log(key, value)
        })
        vulnerability_status_img = filename;
      }
    );
    let mofification = {
      Status: req.body.companyStatus,
      ModifiedBy: req.body.auditorID, // auditor id will be there using session 
      DateTime: new Date().toUTCString()
    }
    await AuditeeOrg.create({
      OrganizationID: uniqueIdGenerator(),
      OrganizationName: req.body.companyName,
      OrganizationLogo: vulnerability_status_img,
      EmployeeSize: req.body.empSize,
      OrganizationSector: req.body.organizationSector,
      Industry: req.body.industry,
      Email: req.body.companyEmail,
      Phone: req.body.companyPhone,
      Website: req.body.companyWebsite,
      Street: req.body.street,
      City: req.body.city,
      State: req.body.state,
      Country: req.body.country,
      Pincode: req.body.pincode,
      OtherDetails: req.body.otherDetails,
      ModificationTimeline: mofification
    })
    res.json({ message: "data inserted", Status: true })
  } catch (error) {
    console.log(error)
  }
})

// APi to edit auditiee--organization 
app.post('/edit-auditee-organization', auth, async (req, res) => {
  console.log("files", req.files);
  console.log("body", req.body);
  const image = req.files;
  const newpath = __dirname;
  let vulnerability_status_img;
  try {
    let mofification = {
      Status: req.body.companyStatus,
      ModifiedBy: req.body.loginUser, // auditor id will be there using session 
      ModifiedDateTime: new Date().toUTCString
    }


    if (image === null) {
      await AuditeeOrg.updateMany({
        OrganizationID: req.body.organizaionID
      }, {
        $set: {
          OrganizationName: req.body.companyName,
          EmployeeSize: req.body.empSize,
          OrganizationSector: req.body.organizationSector,
          Industry: req.body.industry,
          Email: req.body.companyEmail,
          Phone: req.body.companyPhone,
          Website: req.body.companyWebsite,
          City: req.body.city,
          State: req.body.state,
          Country: req.body.country,
          Pincode: req.body.pincode,
          Status: req.body.companyStatus,
          OtherDetails: req.body.otherDetails,
        },
        $push: {
          ModificationTimeline: mofification
        }
      })
      res.json({ message: "data updated without images", Status: true })
    }
    else {
      // function to read array images but for now its one image reader
      Object.entries(image).forEach(
        async ([key, value]) => {
          // console.log(key, value)
          // let filename = uniqueIdGenerator();
          const file = value;
          let tempFileName = value.name
          let filename = "CompanyLogo" + "_" + uniqueIdGenerator();
          // console.log(`${newpath}/images/${filename}`)
          file.mv(`${newpath}/images/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
            // console.log(key, value)
          })
          if (tempFileName == "companyLogo.png") {
            vulnerability_status_img = filename;
          }
        }
      );
      await AuditeeOrg.updateMany({
        OrganizationID: req.body.organizaionID
      }, {
        $set: {
          OrganizationName: req.body.companyName,
          OrganizationLogo: vulnerability_status_img,
          EmployeeSize: req.body.empSize,
          OrganizationSector: req.body.organizationSector,
          Industry: req.body.industry,
          Email: req.body.companyEmail,
          Phone: req.body.companyPhone,
          Website: req.body.companyWebsite,
          City: req.body.city,
          State: req.body.state,
          Country: req.body.country,
          Pincode: req.body.pincode,
          Status: req.body.companyStatus,
          OtherDetails: req.body.otherDetails,
          ModificationTimeline: mofification
        },
        $push: {
          ModificationTimeline: mofification
        }
      })
      res.json({ message: "data updated", Status: true })
    }
  } catch (error) {
    console.log(error)
    res.json({ message: "data not updated", Status: false })
  }
})

// Api to Hard code auditor user 

// Api to Hard code auditor organization 
app.post('/add-auditor-organization', async (req, res) => {
  console.log("response", req.body)
  try {
    await AuditorOrg.create({
      OrganizationID: req.body.OrganizationID,
      OrganizationName: req.body.OrganizationName,
      OrganizationLogo: req.body.OrganizationLogo,
      EmployeeSize: req.body.EmployeeSize,
      OrganizationSector: req.body.OrganizationSector,
      Industry: req.body.Industry,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Website: req.body.Website,
      Street: req.body.Street,
      City: req.body.City,
      State: req.body.State,
      Country: req.body.Country,
      Pincode: req.body.Pincode,
      Status: req.body.Status,
    })
    res.json({ message: "data inserted", Status: true })
  } catch (error) {
    console.log(error)
  }
})



// update user details 
app.post("/updateuser", async (req, res) => {
  // console.log("user ", req.body)
  try {
    await AuditorUsers.updateMany({
      UserID: req.body.userID
    },
      { $set: { FirstName: req.body.fname, LastName: req.body.lname, JobTitle: req.body.jobTitle, Phone: req.body.phone, Status: req.body.status } })
    res.json({ status: true })
  } catch (error) {
    console.error(error)
    res.json({ status: false })
  }
})

// update organization  details 
app.post("/auditee-list", async (req, res) => {
  // console.log("org ", req.body)
  try {
    await Organization.updateMany({
      OrganizationID: req.body.OrgID
    },
      { $set: { OrganizationName: req.body.OrgName, Status: req.body.status } })
    res.json({ status: true })
  } catch (error) {
    console.error(error)
    res.json({ status: false })
  }
})

// get userlist 
app.post("/get-auditor-userlist", auth, async (req, res) => {
  // console.log("organizationid", req.body.organizationId);
  try {
    const userList = await AuditorUser.find({
      OrganizationID: req.body.organizationId
    })
    console.log("userList", userList)
    if (userList) {
      res.json({
        status: true,
        data: userList
      })
    } else {

      res.json({
        status: false,
        data: null
      })
    }
  } catch (error) {
    console.error(error);
    res.json({
      status: false,
      data: null
    })
  }
})

// Data mongodb testing api
app.get("/getcustomers", async (req, res) => {
  // console.log("data", req.body.orgID)
  try {
    const organization = await AuditeeOrg.find({
    })
    var desiredData = [];
    // console.log("organization", organization);
    for (let i = 0; i < organization.length; i++) {

      var obj = {
        OrganizationID: organization[i].OrganizationID,
        OrganizationName: organization[i].OrganizationName,
        Status: organization[i].Status,
        UserCount: []
      }
      obj.UserCount = await AuditorUsers.find({
        OrganizationID: organization[i].OrganizationID
      })
      desiredData[i] = obj;
      // console.log(`desired Data - ${i}`, desiredData[i]);

    }
    res.json({
      status: true, data: desiredData
    })
    // console.log("customer", customer);
  } catch (error) {
    console.log("customers are unable to fetch : ", error);
  }
})

// Api to get Login Match ------------------------------------------------->
app.post("/login", async (req, res) => {
  // check email existence
  // console.log("data", req.body)
  // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  const checkUser = await AuditorUsers.findOne({
    Email: req.body.email,
  });
  // console.log("cehckuser", checkUser)

  if (!checkUser) {
    console.log("user not their")
    return res.json({ message: "Invalid Email and Password", checkUser: false });
  }

  // compare input pass with stored pass using bcrypt ---->
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    checkUser.Password
  );
  // const isPasswordValid = checkUser.Password === req.body.password ? true : false;
  // console.log(isPasswordValid)
  if (!isPasswordValid) {
    return res.json({ message: "Invalid Email and Password ", checkUser: false });
  }
  // create JWT token if pass is matched ---->
  // console.log("checkuser", checkUser)
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        OrganizationID: checkUser.OrganizationID,
        AuditeeID: checkUser.AuditorID,
      },
      process.env.JWT_SECRET
      , {
        expiresIn: process.env.JWT_EXPIRE
      }
    );

    req.session.user = checkUser;
    // console.log("req.user.session", req.session.user);
    console.log("token", token);
    req.session.save()
    await TokenList.create({
      UserID: checkUser.UserID,
      Token: token,
      TokenType: "loginAuth",
      DateTime: new Date().toUTCString(),
    });
    return res.json({
      status: true,
      token: token,
      AuditorID: checkUser.AuditorID,
      orgID: checkUser.OrganizationID,
      Role: checkUser.Role,
    });
  } else {
    return res.json({ message: "Login after 10 min", checkUser: false });
  }
});
// Api to get Login ------------------------------------------------------->

// API to send role based conditio 
app.post('/check-login-role', auth, async (req, res) => {
  // console.log("store", store.sessions)
  // console.log("session", req.session)
  // console.log("cookie", req.session.cookie)
  // console.log("user ",req.session.adsdasd )
  // console.log("user -", req.session.user)
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  }
  else {
    res.send({ loggedIn: false })
  }
})
// API to send role based conditio 

// APII to destroy sessions 
app.get('/destroy-session', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      console.log("user - sessions fail", req.session.user)
      res.send({ sessionDestroyed: false })
    }

    console.log("user - sessions success")
    return res.send({ sessionDestroyed: true })
    // return res.redirect("/auth/login")
  })
})

// APII to destroy sessions 


// Jwt auth to stay token up  ---------------------------------------------->
app.post("/jwtauth", async (req, res) => {
  // console.log("data", req.body)
  try {
    const checkUser = await TokenList.findOne({
      Token: req.body.token,
    });
    const verify = jwt.verify(checkUser.Token,
      "secret123"
    )
    res.json({ status: true, message: verify })
  } catch (error) {
    // console.log(error)
    res.json({ status: false })
  }
})
// Jwt auth to stay token up  ---------------------------------------------->

// Api to get data for profile Page  -------------------------------------->
app.post("/user-profile", auth, async (req, res) => {
  // console.log("req. data", req.body);
  const userexist = await AuditorUsers.findOne({
    AuditorID: req.body.userCheck,
  });
  if (!userexist) {
    return { status: "error", error: "Invalid login" };
  }
  if (userexist) {
    // console.log("mera data",userexist)
    res.json({ status: "ok", user: userexist });
  } else {
    res.json({ status: "error", user: false });
  }
});
// Api to get data for profile Page  -------------------------------------->





// Api to check email for forgot password------------------------------>
app.post("/forgotpassword", async (req, res) => {
  // console.log("this is me email ", req.body.email);
  try {
    const users = await AuditorUsers.find({ Email: req.body.email });
    // console.log("email", users)
    if (users) {
      // console.log("user exist", users)
      // email verification task
      const forgotPasswordToken = crypto.randomBytes(20).toString("hex");
      // const registrationVerificationToken = crypto
      //   .createHash("sha256")
      //   .update(forgotPasswordToken)
      //   .digest("hex");
      const forgotPasswordTokenExpire = Date.now() + 10 * (60 * 1000);
      // console.log("token", forgotPasswordToken);

      const resetUrl = `${process.env.APP_URI}/account-password-reset/${forgotPasswordToken}`;
      // console.log("resetUrl", resetUrl);

      // body as per send grid message = body
      const body = `<body style="margin: 0; padding: 0;" bgcolor="#FFFFFF">
      <table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0">
          <tr height="32" style="height: 32px;">
              <td></td>
          </tr>
          <tr align="center">
              <td>
                  <table border="0" cellspacing="0" cellpadding="0"
                      style="padding-bottom: 20px; max-width: 516px; min-width: 220px;">
                      <tr>
                          <td width="8" style="width: 8px;"></td>
                          <td>
                              <div style="border-style: solid; border-width:thin; border-color:#dadce0; border-radius:8px; padding:40px 20px;"
                                  align="left"><img
                                      src="https://i.imgur.com/ai1Cv7W.png"
                                      style="height:34px;widht:auto;">
                                  <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; padding-top: 30px; text-align: left; word-break: break-word;">
                                      <div style="font-size: 16px;">Hi ${users[0].FirstName},</div>


                                  </div>
                                  <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                      Someone recently requested a password change for your Auditsense account. If this was you, you can set a new password here:

                                      <div style="padding-top: 32px; text-align: center;">
                                          <a href=${resetUrl} target="_blank" link-id="main-button-link" style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 16px;display:inline-block;padding: 15px 30px;background-color: #007EE6; border-radius: 2px; min-width: 90px; text-align:center;">Reset Password
                                          </a>
                                      </div>
                                  </div>

                                  <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px;padding-bottom: 20px; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.87); letter-spacing: 0.3px; text-align: left">
                                      If you don't want to change your password or didn't request this, just ignore and delete this message.
                                  </div>

                                  <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                      Best Regards,
                                      <br><br>
                                      — Team AuditSense
                                  </div>
                              </div>
                          </td>
                          <td width="8" style="width: 8px;"></td>
                      </tr>
                      <tr height="32" style="height: 32px;">
                  </table>
              </td>
          </tr>
      </table>
  </body`;

      // console.log("user", users);
      await TokenList.create({
        AuditorID: users[0].AuditorID,
        Token: forgotPasswordToken,
        TokenType: "ForgotPassword",
        DateTime: forgotPasswordTokenExpire,
      });

      const sendGridAPIKey = process.env.EMAIL_PASSWORD;
      const EMAIL_FROM = process.env.EMAIL_FROM;
      // console.log("user", user);
      try {
        await sendWelcomeEmail({
          sendGridAPIKey: sendGridAPIKey,
          EMAIL_FROM: EMAIL_FROM,
          to: users[0].Email,
          subject: "Reset Your AuditSense Account Password",
          text: body,
        });
      } catch (error) {
        res.json({ status: false, data: "not valid email" });
        // user.registrationVerificationToken = undefined;
        // user.registrationVerificationExpire = undefined;
        // console.log("main error ", error);
        // await user.save(); // this is not called
      }
      // email verification task
      // console.log("email Id exist and mail sent", users[0].Email);
      res.json({ status: true, data: users });
    }
    else {
      res.json({ status: false, error: "Email doesn't exist" });
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, error: "Email doesn't exist" });
    // res.json({ status: false, error: "email not sent" });
  }
});
// Api to check email for forgot password------------------------------>

// Api to change status of user ------------------------------>
// app.post("/changestatus", async (req, res) => {
//   // console.log("this is me token-register ", req.body.token);
//   // console.log("this is taskName", req.body.taskName);

//   // An function to get data at initial stage
//   try {
//     // console.log(" brfor inside try ");
//     const user = await TokenList.findOne({
//       Token: req.body.token,
//       DateTime: { $gt: Date.now() },
//     });
//     // console.log(" after inside try ");
//     if (!user) {
//       res.json({ status: false, data: "invalid reset token" });
//     } else {
//       const userID = user.UserID;
//       // const newPassword = await bcrypt.hash(req.body.password, 10);
//       await UserData.updateMany(
//         { UserID: userID },
//         { $set: { Status: "Active" } }
//       );
//       // console.log("status change occus", user.userID)

//       const matchUser = await UserData.findOne({
//         UserID: userID,
//       });
//       if (!matchUser) {
//         res.json({ status: false, data: "invalid reset token" });
//       }

//       //  to get domain from email  ----->
//       const Y = "@";
//       const str = matchUser.Email;
//       const address = str.slice(str.indexOf(Y) + Y.length);

//       const orgID = matchUser.OrganizationID;

//       const feature = await FeatureList.find({
//         Method: "Domain",
//       });
//       // console.log("feature length", feature.length);

//       const checkOrg = await OrganizationAsset.findOne({
//         OrganizationID: orgID,
//       });
//       const value = checkOrg.Asset[0].Value;
//       // console.log("value ", value);

//       for (var i = 0; i < feature.length; i++) {
//         // console.log("feature data", feature[i].FeatureName);
//         const featureName = feature[i].FeatureName;
//         const featureID = feature[i].FeatureID;
//         await createScanProfile(featureName, orgID, featureID, address);
//         await callJob(featureName, value, featureID, orgID);
//       }

//       // console.log("feature", feature);
//       // const dnsrecords = "dnsrecords";
//       // await callJob(dnsrecords, userID);

//       // user.password = req.body.password;
//       // user.resetPasswordExpire = undefined;
//       // user.resetPasswordToken = undefined;

//       // await user.save();
//       res.json({ status: true, data: "status activated success fully" });
//     }
//   } catch (error) {
//     res.json({ status: false, data: "error occured" })
//   }
// });
// Api to change status of user ------------------------------>

// API to validate Forgot password Token 
app.post("/check-forgot-password-token", async (req, res) => {
  try {

    const user = await TokenList.findOne({
      Token: req.body.token,
      DateTime: { $gt: Date.now() },
    })
    if (user) {
      return res.json({ status: true, message: "token verified", userID: user.AuditorID })
    }
    else {
      return res.json({ status: false, message: "token note verified" })
    }
  } catch (error) {
    return res.json({ status: false, message: "token note verified" })
  }
})
// API to validate Forgot password Token 

// Api to check token and change password------------------------------>
app.post("/setnewpassword", async (req, res) => {
  console.log("this is me token ", req.body.userID);
  console.log("this is me token ", req.body.password);
  // console.log("this is me pass ", req.body);
  try {
    const matchUser = await AuditorUsers.findOne({
      AuditorID: req.body.userID,
    });
    console.log("major ", matchUser)
    if (!matchUser) {
      res.json({ status: false, data: "user doesn't exist" });
    }
    else {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      await AuditorUsers.updateMany(
        { AuditorID: req.body.userID },
        { $set: { Password: newPassword } }
      );
    }  // body as per send grid message = body
    const login = `${process.env.APP_URI}/login`;
    const body = `<body style="margin: 0; padding: 0;" bgcolor="#FFFFFF">
    <table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0">
        <tr height="32" style="height: 32px;">
            <td></td>
        </tr>
        <tr align="center">
            <td>
                <table border="0" cellspacing="0" cellpadding="0"
                    style="padding-bottom: 20px; max-width: 516px; min-width: 220px;">
                    <tr>
                        <td width="8" style="width: 8px;"></td>
                        <td>
                            <div style="border-style: solid; border-width:thin; border-color:#dadce0; border-radius:8px; padding:40px 20px;"
                                align="left"><img
                                    src="https://i.imgur.com/ai1Cv7W.png"
                                    style="height:34px;widht:auto;">
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; padding-top: 30px; text-align: left; word-break: break-word;">
                                    <div style="font-size: 16px;">Hi ${matchUser.FirstName},</div>


                                </div>
                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                    Someone recently changed a password for your Auditsense account. If this was not you, email on help@xiarch.com

                                    <div style="padding-top: 32px; text-align: center;">
                                        <a href=${login} target="_blank" link-id="main-button-link" style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 16px;display:inline-block;padding: 15px 30px;background-color: #007EE6; border-radius: 2px; min-width: 90px; text-align:center;">Login 
                                        </a>
                                    </div>
                                </div>

                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px;padding-bottom: 20px; font-size: 16px; line-height: 16px; color: rgba(0,0,0,0.87); letter-spacing: 0.3px; text-align: left">
                                    If you don't want to change your password or didn't request this, just ignore and delete this message.
                                </div>

                                <div style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;padding-top: 30px; font-size: 16px; color: rgba(0,0,0,0.87); line-height: 20px; text-align: left;">
                                    Best Regards,
                                    <br><br>
                                    — Team AuditSense
                                </div>
                            </div>
                        </td>
                        <td width="8" style="width: 8px;"></td>
                    </tr>
                    <tr height="32" style="height: 32px;">
                </table>
            </td>
        </tr>
    </table>
</body`;

    // const sendGridAPIKey = process.env.EMAIL_PASSWORD;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    try {
      await SendSuccessFullEmail({
        // sendGridAPIKey: sendGridAPIKey,
        EMAIL_FROM: EMAIL_FROM,
        to: matchUser.Email,
        subject: "Password has been changed successFully ",
        text: body,
      });
    } catch (error) {
      console.log("inside error", error)
      // res.json({ status: false, data: "not valid email" });
      // user.registrationVerificationToken = undefined;
      // user.registrationVerificationExpire = undefined;
      // console.log("main error ", error);
      // await user.save(); // this is not called
    }
    res.json({ status: true, data: "Password reset success" });
    // user.password = req.body.password;
    // user.resetPasswordExpire = undefined;
    // user.resetPasswordToken = undefined;

    // await user.save();


  } catch (error) {
    console.log("error", error)
    res.json({ status: false, data: "Invalid Token" });
  }
});

// Api to check token and change password------------------------------>



// function to randomize  alll checklist ID 
app.post("/update-checklist-id", async (req, res) => {
  console.log("body", req.body)
  const { ChecklistDatabaseID } = req.body

  try {
    const checkBD = await CheckList.findOne({
      ChecklistDatabaseID: ChecklistDatabaseID
    })

    checkBD.Checklist
    for (let i = 0; i < checkBD.Checklist.length; i++) {
      checkBD.Checklist[i].ChecklistID = uniqueIdGenerator();
    }

    await CheckList.updateOne({
      ChecklistDatabaseID: ChecklistDatabaseID
    }, { $set: { Checklist: checkBD.Checklist } }).then((res => { console.log("updated", res) })).catch((res) => console.log("update error", res))
    res.json({ data: checkBD, status: true })
  } catch (error) {
    console.log("error", error)
    res.json({ error: error, status: false })
  }
})

// this is an api to get vulnerability list 
// app.post("/get-vul", async (req, res) => {
//   // console.log("body", .id)
//   const {id} =  req.body
//   const checkDB =  await CheckList.findOne({
//     ChecklistDatabaseID : id
//   }) 
// })

// an api to updated personal Details From user-page ------------------->
app.post('/user-profile/updatepersonaldetails', async (req, res) => {
  console.log(req.body)
  const { fname, lname, userCheck } = req.body

  var name_regx = /^[A-Za-z ]{3,20}$/;
  try {
    if (fname == "" || lname == "") throw new Error("Name can'nt be Empty")
    if (!name_regx.test(fname) || !name_regx.test(lname)) throw new Error("Incorrect name format")
    await AuditorUsers.updateMany({
      AuditorID: userCheck
    },
      { $set: { FirstName: fname, LastName: lname } })
    res.status(200).json({
      message: "updated",
      status: true
    })
  } catch (error) {
    console.error(error)
    res.status(401).json({
      message: error.message,
      status: false
    })
  }
})
// an api to updated personal Details -------------------------------->

// API to change password from user-Profile page ------------------------------->
app.post("/user-profile/updatepass", auth, async (req, res) => {
  // console.log("passwords", req.body);
  const { pass, newPass, confirmPass, userCheck } = req.body;

  const password_regx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

  const userexist = await AuditorUsers.findOne({
    AuditorID: userCheck,
  });

  try {

    if (!password_regx.test(pass)) throw new Error("Incorrect Current Password format")

    // compare input pass with stored pass using bcrypt ---->
    const isPasswordValid = await bcrypt.compare(
      pass,
      userexist.Password
    );

    if (!isPasswordValid) throw new Error("Current password did'nt matched")

    if (!password_regx.test(newPass) || !password_regx.test(confirmPass)) throw new Error("Incorrect Password format")

    if (newPass !== confirmPass) throw new Error("Confirm Password did'nt matched")


    // hash the password using bcrypt --->
    const newPassword = await bcrypt.hash(newPass, 10);

    await AuditorUsers.updateOne({
      AuditorID: userCheck,
    }, { $set: { Password: newPassword } })

    return res.status(200).json({ status: true, message: "Password has been changed " })

  } catch (error) {
    console.error(error.message)
    return res.status(401).json({ status: false, message: error.message })
  }

});
// API to change password from Profile page ------------------------------->

// Api to get data for profile Page  -------------------------------------->
// app.post("/user-profile", async (req, res) => {
//   const userexist = await UserData.findOne({
//     UserID: req.body.userCheck,
//   });
//   if (!userexist) {
//     return { status: "error", error: "Invalid login" };
//   }
//   if (userexist) {
//     // console.log("mera data",userexist)
//     res.json({ status: "ok", user: userexist });
//   } else {
//     res.json({ status: "error", user: false });
//   }
// });
// Api to get data for profile Page  -------------------------------------->



app.use(express.static(buildPath))
// 1337 PoRT to listen APP ------------------------------------------------>
const PORT = 1338;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Started at PORTssss : ${process.env.PORT}`);
});
