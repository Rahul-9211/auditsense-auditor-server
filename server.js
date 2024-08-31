const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
// const AdminData = require("./modals/user.modal");
// const User = require("./modals/demo.user");
// const Org = require("./modals/demo.org");
// const Organization = require("./modals/organization.modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/Table", { useNewUrlParser: true });

app.use(cors());
app.use(express.json());

// app.post('/api/register' , (req, res)=>{
//     console.log("data at server",req.body);
//     res.json({status:'ok'})
// })

app.post("/register", async (req, res) => {
  var data = req.body;
  
  const newPassword = await bcrypt.hash(data.password, 10);

  var newID = new Date().getTime();
  console.log(newID);

    //  for email domain
    const Y = "@";
    const str = req.body.email;
    var address = str.slice(str.indexOf(Y) + Y.length);
    console.log("domain", address);


  user_data(data);
  async function user_data(data){
    console.log("data",data)
        User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      organizationID: newID,
      jobTitle: req.body.jobTitle,
      phone: req.body.phone,
      email: req.body.email,
      password: newPassword,
      userID: newID,
      twitterProfile: null,
      linkedinProfile: null,
      facebookProfile: null,
      status: "inactive",
    });
  } 
  try {
    // const user = await User.findOne({ email: req.body.email });

    // console.log("email mil gya", user);
    var userss = await Org.findOne({ domain: address });
    if (userss != null) {
      console.log("mwerwe");
      newID = userss.organizationID;
      console.log("org-id", userss.organizationID);
    }
    console.log("user---", userss);
    // if(user){
    //     console.log("mwerwe");
    //     newID = user.organizationID;
    //     console.log("org-id", user.organizationID);
    // }

    if (userss === null) {
      await Org.create({
        city: null,
        state: null,
        domain: address,
        street: null,
        zipcode: null,
        country: null,
        industry: null,
        organizationName: req.body.organization,
        organizationID: newID,
        twitterProfile: null,
        linkedinProfile: null,
        facebookProfile: null,
        status: "inactive",
      });
    }
    res.json({ status: "ok", mesg: "user_done" });
  } catch (err) {
  }
  try {
    console.log("try neww", newID);
    await User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      organizationID: newID,
      jobTitle: req.body.jobTitle,
      phone: req.body.phone,
      email: req.body.email,
      password: newPassword,
      userID: newID,
      twitterProfile: null,
      linkedinProfile: null,
      facebookProfile: null,
      status: "inactive",
    });
  } catch (error) {
    res.json({ status: "error", error: "duplicate email" });
  }
});

// without JWT
// app.post('/api/login' , async (req, res)=>{
//     console.log("data at server-login",req.body);
//     const user = await User.findOne({
//         email : req.body.email,
//         password : req.body.password,
//     })
//     if(user){
//         res.json({status:"ok" , user:true})
//     }
//     else{
//         res.json({status:"error" , user:false})
//     }

// })

// With JWT
app.post("/api/login", async (req, res) => {
  console.log("data at server-login", req.body);
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return { status: "error", error: "Invalid login" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.listen(1337, () => {
  console.log("server started at 1337");
});
