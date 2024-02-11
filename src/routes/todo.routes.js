import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addTodo, deleteTodo, myTodo, updateTodo } from "../controller/todo.controller.js";

const router = Router()

router.route("/add").post(isAuthenticated, addTodo)
router.route("/mytodos").get(isAuthenticated, myTodo)
router.route("/:id").put(isAuthenticated, updateTodo)
router.route("/:id").delete(isAuthenticated, deleteTodo)

export default router