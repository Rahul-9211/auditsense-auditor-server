
const mongoose = require("mongoose");

const TokenList = new mongoose.Schema(
  {
    AuditorID: { type: Number },
    Token: { type: String },
    TokenType: { type: String },
    DateTime: { type: JSON },
  },
  { collection: "token_list" }
);

const modalTokenList = mongoose.model(
  "token_list",
  TokenList
);

module.exports = modalTokenList;
