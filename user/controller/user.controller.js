const userModel=require("../models/user.Model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const blackListTokenModel=require("../models/blackListToken.Model");
const { subscribeToQueue } = require("../service/rabbit");

module.exports.register=async(req,res)=>{
  try{
    const {name, email, password}=req.body;
    let user=await userModel.findOne({email});
    if(user) return res.status(400).send("user already exists");
    const hashedPassword=await bcrypt.hash(password,10);
    let newuser=await userModel.create({name,email,password:hashedPassword});
    let token=jwt.sign({name:newuser.name,email:newuser.email},process.env.JWT_SECRET);
    res.cookie("token",token);
    res.status(200).json({token,newuser});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  };
};

module.exports.login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid email or password"});
    const isMatch=bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:"invalid email or password"});
    let token=jwt.sign({name:user.name,email:user.email},process.env.JWT_SECRET);
    res.cookie("token",token);
    res.json({token,user});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }
}
module.exports.logout=async(req,res)=>{
  try{
    const blacklisttoken=req.cookies.token;
    await blackListTokenModel.create({token:blacklisttoken});
    res.clearCookie("token");
    res.json({message:"User logged out successfully"});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }

};

module.exports.profile=async(req,res)=>{
  try{
  res.send(req.user);
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }
}

const pendingAcceptedRequests = [];

module.exports.acceptedRide = async (req, res) => {
    // Timeout after 30 seconds
    req.setTimeout(30000, () => {
        res.status(204).end();
    });

    // Store the response so we can reply later
    pendingAcceptedRequests.push(res);
};

subscribeToQueue('ride-accepted', (msg) => {
    const data = JSON.parse(msg);

    // Reply to all pending requests
    pendingAcceptedRequests.forEach(res => {
        res.json(data);
    });

    // Clear the pending requests
    pendingAcceptedRequests.length = 0;
});
