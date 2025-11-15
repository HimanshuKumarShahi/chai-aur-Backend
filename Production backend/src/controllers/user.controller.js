import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken;
        const refreshToken = user.generateRefreshToken;

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something Went wrong While generating refresh and access token. ")
    }
}



const registerUser = asyncHandler(async (req, res, next) => {
    //get user details from frontend.
    // validation-not empty
    //check user exist : username or email
    // check images or avatar
    //upload on cloudinary,avatar
    // create user-object- create entry in db
    //remove password and refresh token from response
    // check for user creation
    // return res 


    const { fullName, email, username, password } = req.body || {};
    // console.log("fullname:", fullName);
    // console.log("email", email);


    // if(fullName ===""){
    //     throw new ApiError(400,"fullname is required.")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required.")
    }

    // const existedUser = await User.findOne({
    //     $or: [{ username }, { email }]
    // });
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });



    if (existedUser) {
        throw new ApiError(409, "User with email or username exists.")
    }


    // const avatarLocalpath = req.files?.avatar?.[0]?.path;

    const avatarLocalpath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if (req.files?.coverImage?.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;

    }



    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath);

    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const coverImage = coverImageLocalPath ? (await uploadOnCloudinary(coverImageLocalPath)) : null;

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-refreshToken -password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went Wrong while registering the user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully.")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //req.bodt->data
    // username or email
    //find the user
    // password check
    // acess and refresh token
    // send cookie

    const { email, username, password } = req.body
    console.log(email);
    
    if (!username && !email) {
        throw new ApiError(400, "username or password is required.")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(400, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials/ password may be wrong.")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessTokens", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User Logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
        req.user._id
        ,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"user logged out "))
})


export {
    registerUser,
    loginUser,
    logoutUser
}