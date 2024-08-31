const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MadalcheckListReportData = new mongoose.Schema(
  {
    ReportID: { type: String },
    AuditID: { type: String },
    ProjectID: { type: String },
    ChecklistDatabaseID: { type: String },
    ReportDetails: {
      ReportLevel : {type : Number},
      ScopeDetails: { type: JSON }, 
      DocumentControl: [JSON],
      AuditeeOrganizationDetails: {
        OrganizationID: { type: String },
        OrganizationLogo: { type: String },
        OrganizationName: { type: String },
        Address: { type: String },
        Email: { type: String },
        Contact: { type: String },
        Website: { type: String },
        AuditeeDetails: { type: JSON },
      },
      AuditorOrganizationDetails: {
        OrganizationID: { type: String },
        OrganizationName: { type: String },
        Address: { type: String },
        Email: { type: String },
        Contact: { type: String },
        Website: { type: String },
        AuditorDetails: { type: JSON },
      },
      AuditDetails: [JSON]
    },
    ReviewStatus: [JSON],
  },
  { collection: "report_table" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const CheckListReportData = mongoose.model("report_table", MadalcheckListReportData);

// module.exports = modalAdmin;
module.exports = CheckListReportData;


