import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const registerUser = async (req,res)=>{
try{

const {username,email,password} = req.body

const exists = await User.findOne({email})

if(exists){
return res.status(400).json({
success:false,
message:"User already exists"
})
}

const user = await User.create({
username,
email,
password
})

res.status(201).json({
success:true,
message:"User registered",
user
})

}catch(err){
res.status(500).json({success:false,message:err.message})
}
}


export const loginUser = async (req,res)=>{
try{

const {email,password}=req.body

const user = await User.findOne({email}).select("+password")

if(!user){
return res.status(400).json({
success:false,
message:"Invalid email or password"
})
}

const match = await user.comparePassword(password)

if(!match){
return res.status(400).json({
success:false,
message:"Invalid email or password"
})
}

const token = createToken(user._id)

res.cookie("token",token,{
httpOnly:true,
secure:false,
maxAge:7*24*60*60*1000
})

res.json({
success:true,
message:"Login successful",
user
})

}catch(err){
res.status(500).json({success:false,message:err.message})
}
}

export const logoutUser = (req,res)=>{

res.cookie("token",null,{
expires:new Date(Date.now())
})

res.json({
success:true,
message:"Logged out"
})
}


export const forgotPassword = async (req,res)=>{
try{

const {email} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(404).json({
success:false,
message:"User not found"
})
}

const resetToken = Math.random().toString(36).slice(2)

user.resetToken = resetToken
await user.save()

const url = `http://localhost:5173/reset/${resetToken}`

await sendEmail(email,"Reset Password",`Reset here: ${url}`)

res.json({
success:true,
message:"Reset link sent"
})

}catch(err){
res.status(500).json({success:false,message:err.message})
}
}