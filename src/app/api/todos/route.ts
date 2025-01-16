import { Connect } from "@/db/dbConfig";
import Task from "@/models/todoModels";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Todo } from "@/context/todo";

Connect();

// GET Route: Retrieve all tasks
export async function GET() {
    try {
      const tasks = await Task.find();
      return NextResponse.json({
        message: "Tasks retrieved successfully.",
        success: true,
        tasks,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  

// POST Route: Add a new task// POST Route: Add a new task
export async function POST(request: NextRequest) {
  try {
      const reqBody = await request.json();
      const { task } = reqBody;
      const token = request.cookies.get("token")?.value;

      if (!token) {
          return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
      }

      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY!) as Todo;
      console.log(decodedToken);
      const userId = decodedToken._id;

      if (!task) {
          return NextResponse.json({ error: "Task is required." }, { status: 400 });
      }

      const newTask = new Task({ task, completed: false, userId });
      const savedTask = await newTask.save();

      return NextResponse.json({
          message: "Task added successfully.",
          success: true,
          task: savedTask,
      });
  } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
  }
}

// PATCH Route: Toggle the completion status of a task by ID
export async function PATCH(request: NextRequest) {
    try {
      const id = request.nextUrl.searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
      }
  
      const task = await Task.findById(id);
  
      if (!task) {
        return NextResponse.json({ error: "Task not found." }, { status: 404 });
      }
  
      task.completed = !task.completed;
      await task.save();
  
      return NextResponse.json({
        message: "Task completion status toggled successfully.",
        success: true,
        task,
      });
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  
// DELETE Route: Delete a task by ID
export async function DELETE(request: NextRequest) {
    try {
      const id = request.nextUrl.searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
      }
  
      const deletedTask = await Task.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return NextResponse.json({ error: "Task not found." }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "Task deleted successfully.",
        success: true,
        task: deletedTask,
      });
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  