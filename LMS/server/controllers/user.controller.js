import User from "../models/user.model.js";

async function registerUser(req,res){

try{

const {username,email,password}=req.body;

if(!username || !email || !password){
return res.status(400).json({
success:false,
message:"All fields required"
});
}

const user = await User.create({
username,
email,
password
});

res.status(201).json({
success:true,
user
});

}catch(err){

res.status(500).json({
success:false,
message:err.message
});

}

}

export { registerUser };