const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const UserData = new mongoose.Schema(
  {
    OrganizationID: { type: String },
    AuditorID: { type: String },
    FirstName: { type: String },
    LastName: { type: String },
    Designation: { type: String },
    Role: { type: String },
    Mobile: { type: String },
    Gender: { type: String },
    Email: { type: String, unique: true },
    Password: { type: String },
    ModificationTimeline: [
      JSON
    ]
  },
  { collection: "auditor_users" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const AuditorUsers = mongoose.model("auditor_users", UserData);

// module.exports = modalAdmin;
module.exports = AuditorUsers;


