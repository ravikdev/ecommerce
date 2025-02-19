import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            trim:true
        },
        phone:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            require:true,
            trim:true
        },
        password:{
            type:String,
            require:true
        },
        address:{
            type:String,
            require:true
        },
        role:{
            type:Number,
            require:true
        }   
     }
)

export default mongoose.model("users",userSchema);