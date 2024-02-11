import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            throw new ApiError(404, "Unauthorized request")
        }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decode._id).select("-password")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Login first")
    }
})