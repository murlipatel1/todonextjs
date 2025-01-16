import Task from "@/models/todoModels";
import { NextResponse } from "next/server";

// PATCH Route: Select all tasks (mark all as completed)
export async function PATCH() {
    try {
      const updatedTasks = await Task.updateMany({}, { completed: true });
  
      return NextResponse.json({
        message: "All tasks marked as completed.",
        success: true,
        tasks: updatedTasks,
      });
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  