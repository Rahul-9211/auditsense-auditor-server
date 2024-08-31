const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const ModalcheckList = new mongoose.Schema(
  {
    ChecklistDatabaseID: { type: String },
    ChecklistDatabaseType: { type: String },
    ChecklistDatabaseName: { type: String },
    ChecklistDatabaseVersion: { type: String },
    ChecklistDatabaseYear: { type: JSON },
    Checklist: [
      JSON
    ],
    ModificationTimeline: [
      JSON
    ]
  },
  { collection: "checklist_database" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const CheckList = mongoose.model("checklist_database", ModalcheckList);

// module.exports = modalAdmin;
module.exports = CheckList;


