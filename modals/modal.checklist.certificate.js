const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MadalcheckListCertificateData = new mongoose.Schema(
  {
    CertificateID: { type: String },
    AuditID: { type: String },
    ProjectID: { type: String },
    ChecklistDatabaseID: { type: String },
    CertificateDetails: {
      ScopeDetails: {type : JSON },
      AuditeeOrganizationDetails: {
        OrganizationID: { type: String },
        OrganizationName: { type: String },
        Address:{ type: String },
        Email:{ type: String },
        Contact: { type: String },
        Website: { type: String },
        AuditeeDetails :{ type: JSON },
      },
      AuditorOrganizationDetails: {
        OrganizationID: { type: String },
        OrganizationName: { type: String },
        Address:{ type: String },
        Email:{ type: String },
        Contact: { type: String },
        Website: { type: String },
        AuditorDetails :{ type: JSON },
      },
      ProjectStartDate : {type : String},
      ProjectEndDate: {type : String},
      CertificateIssueDate: {type : String},
    },
    ReviewStatus: [JSON],
  },
  { collection: "certificate_table" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const CheckListCertificateData = mongoose.model("certificate_table", MadalcheckListCertificateData);

// module.exports = modalAdmin;
module.exports = CheckListCertificateData;


