import usermodel from '../models/user.model.js';

async function registerUser(req,res) {
    try {
        const {name,email,password}=req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }   

        const user=await usermodel.create({name,email,password});
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User registration failed",
            error:error.message
        })
    }
}

export {registerUser}   