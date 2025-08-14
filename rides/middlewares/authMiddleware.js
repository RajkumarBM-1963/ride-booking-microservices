const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const response = await axios.get(`${process.env.BASE_URL}/user/profile`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    const user = response.data;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next(); 
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.captainAuth=async(req,res,next)=>{
  try{
    const token=req.cookies.captaintoken||req.headers.authorization?.split(" ")[1];
    console.log(token);
    if(!token){
  return res.status(401).json({message:"Unauthorized-No token"});
  }
  const decoded=jwt.verify(token,process.env.JWT_SECRET1);
  const response=await axios.get(`${process.env.BASE_URL}/captain/profile`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
  const captain=response.data;
  if(!captain){
    return res.status(401).json({message:"Unauthorized-captain not found"});
  }
  const {password,...captainWithoutPassword}=captain;
  req.captain=captainWithoutPassword;
  next();
  }
  catch(err){
    console.error("Auth Middleware Error:",err.message);
res.status(500).json({message:"Internal server error"});
  }
}
