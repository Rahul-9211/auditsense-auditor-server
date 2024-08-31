const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const ModalAuditorUser = new mongoose.Schema(
  {
    OrganizationID: { type: String },
    AuditeeID: { type: String },
    FirstName: { type: String },
    LastName: { type: String },
    Designation: { type: String },
    Role: { type: String },
    EmployeeType: { type: String },
    Mobile: { type: Number },
    Gender: { type: String },
    Status: { type: String },
    Email: { type: String, unique: true },
    Password: { type: String },
    ModificationTimeline: [
      JSON
    ]
  },
  { collection: "auditee_users" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const AuditeeUser = mongoose.model("auditee_users", ModalAuditorUser);

// module.exports = modalAdmin;
module.exports = AuditeeUser;


