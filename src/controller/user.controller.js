import { User } from "../models/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


/*const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token")
    }
}
*/

const userRegister = asyncHandler(async (req, res, next) => {
    // retrieving data from frontend

    const { username, fullName, password, email } = req.body

    // chek all inputs are fullfilled

    if (
        [username, password, fullName, email].some((fields) => fields?.trim() === "")
    ) {
        res.status(401).json(new ApiError(401, "All fields are required"))
    }

    // chek if user already exist

    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExist) {
        res.status(401).json(new ApiError(401, "user already exist with the email or username"))
    }

    // create user and store in db

    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        fullName
    })

    // chek user created succefully or not

    const createdUser = await User.findById(user._id).select("-pasword")

    if (!createdUser) {
        res.status(401).json(new ApiError(401, "Something went wrong"))
    }

    // return response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created Successfully")
    )
})

const userLogin = asyncHandler(async (req, res, next) => {
    // retrieving data from frontend
    const { username, email, password } = req.body

    // check username or email are not empty

    if (!username && !email) {
        res.status(401).json(new ApiError(401, "username or email is required"))

    }

    // chek user exist or not

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        res.status(401).json(new ApiError(401, "Invalid Credintials"))
    }

    // chekck password matched

    const isPassMatched = await user.isPasswordCorrect(password)
    if (!isPassMatched) {
        res.status(401).json(new ApiError(401, "Invalid Password"))
    }


    // generate access token and send user

    const accessToken = await user.generateAccessToken(user._id)

    // send cookies 

    const loggedInUser = await User.findById(user._id).select("-password")

    if (!loggedInUser || !accessToken) {
        throw new ApiError(500, "Something went wrong")
    }


    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        secure: true
    }

    // response user successfully login

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                { user: loggedInUser, accessToken, },
                "User logged in successfully",)
        )
})

const userLogout = (req, res,) => {
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(201)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(201, "Successfully logout")
        )
}

const getMyDetail = asyncHandler(async (req, res,) => {

    const userId = req.user._id
    const userExist = await User.findById(userId)
    if (!userExist) {
        throw new ApiError(404, "Rgister first")
    }
    return res.status(201)
        .json(
            new ApiResponse(200, userExist, "Successfully found")
        )
})

export { userRegister, userLogin, userLogout, getMyDetail }