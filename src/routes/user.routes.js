import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getMyDetail, userLogin, userLogout, userRegister } from "../controller/user.controller.js";

const router = Router()

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(isAuthenticated, userLogout)
router.route("/me").post(isAuthenticated, getMyDetail)


export default router