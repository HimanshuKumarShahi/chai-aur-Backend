import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res, next, err) => {
    //get user details from frontend.
    // validation-not empty
    //check user exist : username or email
    // check images or avatar
    //upload on cloudinary,avatar
    // create user-object- create entry in db
    //remove password and refresh token from response
    // check for user creation
    // return res 


    const {fullName,email,username,password}=req.body
    console.log("fullname:",fullName);
    console.log("email",email);
    console.log("username",username);
    console.log("password:",password);
    
})

export {
    registerUser,
}