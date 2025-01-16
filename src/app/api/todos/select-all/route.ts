import Task from "@/models/todoModels";
import { NextRequest, NextResponse } from "next/server";

// PATCH Route: Select all tasks (mark all as completed)
export async function PATCH(request: NextRequest) {
    try {
      const updatedTasks = await Task.updateMany({}, { completed: true });
  
      return NextResponse.json({
        message: "All tasks marked as completed.",
        success: true,
        tasks: updatedTasks,
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
  }
  