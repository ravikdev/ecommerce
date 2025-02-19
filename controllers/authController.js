import userModel from "../models/usermodel.js";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authhelper.js";
// const { JsonWebTokenError } = pkg;


export const registerController =async(req,res)=>{
try{

    const {name,email,phone,address,password,role} =req.body;

    if(!name){
        return res.message("name is required");
    }
    if(!email){
        return res.message("email is required");
    }
    if(!phone){
        return res.message("phone is required");
    }
    if(!address){
        res.message("address is required");
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
    const hashedPassword = await hashPassword(password);
    //Save
    const user = await new userModel({name,email,phone,password:hashedPassword,address,role}).save();
    res.status(200).send({
        success:true,
        message:'User Register Successfully',
        user
    })

} catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController =async(req,res)=>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            res.status(404).send({
                message:'invvalid email id or password',
                success: false
            })
        }
        // check user
        const user = await userModel.findOne({email})
        //User model is an object which have findOne method
        if (!user){
            res.status(404).send({
                message:'Email not register'
            })
        }
        const match = await comparePassword(password,user.password);
        if (!match) {
            return res.status(200).send({
              success: false,
              message: "Invalid Password",
            });
          }

        //Token
        // User Id will be included in the payload.
        const token= await JWT.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })
        res.status(200).send({
            success : true,
            message: 'Login successful',
            user :{
                _id: user._id,
                name : user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });
    

} catch (error) {
    console.log("error in login",error);
    res.status(400).send({
      success: false,
      message: "error in login",
      error,
    });
  }};
  
  export const testController = async(req,res)=>{
    try{
        res.send("protected route");
     }
    catch(error){
        console.log(error);
    }
  }
gsg
