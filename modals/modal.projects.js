
const mongoose = require("mongoose");
const dotenv = require("dotenv");


const ProjectModal = new mongoose.Schema(
  {
    ProjectID: { type: String },
    AuditeeOrganizationID: { type: String },
    ChecklistDatabaseID: { type: String },
    AuditType:{type : String},
    ProjectDetails : [JSON],

   
  },
  { collection: "projects_table" }
);

// get access to another DB 
// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true });
const ProjectList = mongoose.model("projects_table", ProjectModal);

// module.exports = modalAdmin;
module.exports = ProjectList;
