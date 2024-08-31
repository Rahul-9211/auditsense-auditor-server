const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MadalcheckListTemplate  = new mongoose.Schema(
  {
    ChecklistDatabaseID: {type : String},
    CheckID:  {type : String},
    Title:  {type : String},
    Severity:  {type : JSON},
    Status:  {type : String},
    Tags: {type : String},
    Description: {type : String},
    Impact: {type : String},
    Remediation: {type : String},
    Reference: {type : String},
    ModificationTimeline: [
      JSON
    ]
  },
  { collection: "checklist_template" }
);


// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
// const modalOrganization = mongoose.Table.model("Organization", Organization);

// const modalAdmin = mongoose.model("admin", AdminData);
const CheckListTemplate = mongoose.model("checklist_template", MadalcheckListTemplate);

// module.exports = modalAdmin;
module.exports = CheckListTemplate;


