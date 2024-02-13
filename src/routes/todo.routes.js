import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addTodo, deleteTodo, editTodo, myTodo, updateTodo, updateTodoContent } from "../controller/todo.controller.js";

const router = Router()

router.route("/add").post(isAuthenticated, addTodo)
router.route("/mytodos").get(isAuthenticated, myTodo)
router.route("/:id").put(isAuthenticated, updateTodo)
router.route("/update/:id").put(isAuthenticated, updateTodoContent)
router.route("/edit/:id").put(isAuthenticated, editTodo)
router.route("/:id").delete(isAuthenticated, deleteTodo)

export default router