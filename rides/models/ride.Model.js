const mongoose=require("mongoose");

const rideSchema=mongoose.Schema({
  captain:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"captain",
    default:null
  },
  user
  : {
    type:mongoose.SchemaTypes.ObjectId,
    ref:"user",
    required:true
  },
  pickup:{
    type:String,
    required:true,
    unique:true
  },
  destination:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['requested','accepted','started','completed'],
    default:"requested"
  }
},
  {
    timestamps:true
  });

module.exports=mongoose.model("ride",rideSchema);