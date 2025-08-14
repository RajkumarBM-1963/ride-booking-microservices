const mongoose=require("mongoose");

const blackListTokenSchema=mongoose.Schema({
  token:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires:3600
  }
});

const model=mongoose.model("blackListToken",blackListTokenSchema);
module.exports=model;