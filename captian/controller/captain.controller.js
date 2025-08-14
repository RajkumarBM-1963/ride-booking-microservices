const captainModel=require("../models/captain.Model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const blackListTokenModel=require("../models/blackListToken.Model");
const {subscribeToQueue}=require("../service/rabbit");
const pendingRequests = [];

module.exports.register=async(req,res)=>{
  try{
    const {name, email, password}=req.body;
    let captain=await captainModel.findOne({email});
    if(captain) return res.status(400).send("captain already exists");
    const hashedPassword=await bcrypt.hash(password,10);
    let newcaptain=await captainModel.create({name,email,password:hashedPassword});
    let ctoken=jwt.sign({name:newcaptain.name,email:newcaptain.email},process.env.JWT_SECRET);
    res.cookie("captaintoken",ctoken);
    res.status(200).json({ctoken,newcaptain});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  };
};

module.exports.login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const captain=await captainModel.findOne({email});
    if(!captain) return res.status(400).json({message:"Invalid email or password"});
    const isMatch=bcrypt.compare(password,captain.password);
    if(!isMatch) return res.status(400).json({message:"invalid email or password"});
    let ctoken=jwt.sign({name:captain.name,email:captain.email},process.env.JWT_SECRET);
    res.cookie("captaintoken",ctoken);
    res.json({ctoken,captain});
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
    res.json({message:"captain logged out successfully"});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }

};

module.exports.profile=async(req,res)=>{
  try{
  res.send(req.captain);
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }
}

module.exports.toggleAvailability=async(req,res)=>{
try{
  const captain=await captainModel.findById(req.captain._id);
  if(!captain) return res.status(404).json({message:"Captain not found"});
  captain.isAvailable=!captain.isAvailable;
  await captain.save();
  res.json({message:"Availability toggled successfully"});
}
catch(err){
  console.log(err.message);
  res.status(500).json({message:"Internal server error"});   
}

}

module.exports.waitForNewRide = async (req, res) => {
    // Set timeout for long polling (e.g., 30 seconds)
    req.setTimeout(30000, () => {
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        res.json(rideData);
    });

    // Clear the pending requests
    pendingRequests.length = 0;
});