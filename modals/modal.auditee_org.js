
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const AuditeeOrganization = new mongoose.Schema(
  {
    OrganizationID: { type: String },
    OrganizationName: { type: String },
    OrganizationLogo: { type: String },
    EmployeeSize:{type : String},
    OrganizationSector: { type: String },
    Industry: { type: String },
    Email: { type: String },
    Phone: {type : String},
    Website: { type: String },
    Street: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    Pincode: {type : String},
    OtherDetails: { type: String },
    ModificationTimeline : [JSON]
  },
  { collection: "auditee_organization" }
);

// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
const AuditeeOrg = mongoose.model("auditee_organization", AuditeeOrganization);

// module.exports = modalAdmin;
module.exports = AuditeeOrg;
