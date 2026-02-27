import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const isAuthenticate=async (req,res,next)=>{
    try{
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({success:false, message: "Please log in to access this resource." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();

    }catch(err){
        res.status(401).json({success:fale , message:"Invalid or Session Time UP. Please log in again."})
    }
};