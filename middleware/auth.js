const jwt = require("jsonwebtoken");
// const { decode } = require("querystring");
// const User = require("../modals/User.modal");
// const ErrorResponse = require("../utils/errorResponse");

// exports.protect = async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return next(new ErrorResponse("not authorized to access this route ", 401));
//   }

//   try {
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     // console.log("protected-- ", decoded);
//     // console.log("decode", user);
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return next(new ErrorResponse("No user found with this id", 404));
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     return next(new ErrorResponse("Not authorized to access this route", 401));
//   }
// };


const auth = async (req, res, next) => {
  const {userCheck , orgID} = req.body
  console.log("req.body auth ", req.body)
  // console.log("auth - ", req.headers.authorization.split(' ')[1])
  try {
    const token = req.headers.authorization.split(' ')[1] || "temptojen";
    // const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(verifyUser)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // var userId = decoded.id  
    // console.log()
    if(decoded.OrganizationID == orgID && decoded.AuditeeID == userCheck){
      next()
    }
    else{
      res.status(401).json({ message: "Invalid Request" })
    }
  } catch (error) {
    // console.error(error)
    // res.json({message : "token expired"})
    res.status(401).json({ loggedIn: false , message : "Token Expired" })
    // res.status(401).json({message : "token expired"})
  }
}

module.exports = auth;