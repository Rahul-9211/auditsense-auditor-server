
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const Organization = new mongoose.Schema(
  {
    OrganizationID: { type: String },
    OrganizationName: { type: String },
    OrganizationLogo: { type: String },
    EmployeeSize:{type : Number},
    OrganizationSector: { type: String },
    Industry: { type: String },
    Email: { type: String },
    Phone: {type : Number},
    Website: { type: String },
    Street: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    Pincode: {type : Number},
    Status: { type: String },
  },
  { collection: "auditor_organization" }
);

// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
const AuditorOrg = mongoose.model("auditor_organization", Organization);

// module.exports = modalAdmin;
module.exports = AuditorOrg;
