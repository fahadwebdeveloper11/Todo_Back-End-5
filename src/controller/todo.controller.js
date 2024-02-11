import { Todo } from "../models/todo/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const addTodo = asyncHandler(async (req, res,) => {
    const createdBy = req.user
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "title and desc are required")
    }

    const todo = await Todo.create({
        title,
        content,
        createdBy,
    })

    const todoCreated = await Todo.findById(todo._id)

    if (!todoCreated) {
        throw new ApiError(500, "Something went wrong")
    }

    res.status(201).json(
        new ApiResponse(200, todoCreated, "Todo succefully reated")
    )
})

const myTodo = asyncHandler(async (req, res) => {
    const id = req.user._id

    const myTodos = await Todo.find({ createdBy: id });

    if (!myTodos) {
        throw new ApiError(404, "no todos");
    }

    res.status(201).json(
        new ApiResponse(201, myTodos, "Todo found successfully")
    )
})

const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params
    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
        throw new ApiError(404, "Todo not found");
    }

    existingTodo.isCompleted = !existingTodo.isCompleted;

    const updatedTodo = await existingTodo.save();

    if (!updatedTodo) {
        throw new ApiError(500, "Something went wrong")
    }

    res.status(201).json(
        new ApiResponse(201, updatedTodo, "Update Successfully")
    )
})
const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params
    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
        throw new ApiError(404, "Todo not found");
    }

    const deletedTodo = await existingTodo.deleteOne(existingTodo);

    if (!deletedTodo) {
        throw new ApiError(500, "Something went wrong")
    }

    res.status(201).json(
        new ApiResponse(201, deletedTodo, "Delete Successfully")
    )
})

export { addTodo, updateTodo, deleteTodo, myTodo }