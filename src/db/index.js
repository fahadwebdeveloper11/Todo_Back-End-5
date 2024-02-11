import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB Connected")
    } catch (error) {
        console.log(error)
    }
}

export {connectDB}