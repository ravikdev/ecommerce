import userModel from "../models/usermodel.js";

import { comparePassword, hashPassword } from "../helpers/authhelper.js";
import e from "express";

export const registerController =async(req,res)=>{
try{

    const {name,email,phone,address} =req.body;

    if(!name){
        return res.send("name is required");
    }

    if(!email){
        return res.send("email is required");
    }
    if(!phone){
        return res.send("phone is required");
    }
    if(!address){
        res.send("address is required");
    }
    // check user
    const exisitingUser = await userModel.findOne({email})
    //
    if(exisitingUser){
        res.status(200).send({
            success:false,
            message:'aleardy register user'
        })
    }
    // Register User
    const hashedPassword = await hashPassword();
    //Save
    const user = await new userModel({name,email,phone,password:hashedPassword,address}).save();
    res.status(200).send({
        success:true,
        message:'User Register Successfully',
        user
    })
    }
catch(error){
    console.log(error);
    res.status(500).send({
        success: false,
        message:'Error in rigistration',
        error
    })
}
}

