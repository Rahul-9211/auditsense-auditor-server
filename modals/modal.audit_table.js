const mongoose = require("mongoose")

const AuditTableSchema = new mongoose.Schema({
    AuditID: { type: String },
    ProjectID: { type: String },
    ChecklistDatabaseID: { type: String },
    Vulnerability_Details: [JSON]
}, { collection: "audit_table" })

const AuditTableModal = mongoose.model("audit_table", AuditTableSchema);
module.exports = AuditTableModal;