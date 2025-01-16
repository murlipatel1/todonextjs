import Task from "@/models/todoModels";
import { NextRequest, NextResponse } from "next/server";


// DELETE Route: Delete all completed tasks
export async function DELETE(request: NextRequest) {
    try {
      // Delete all tasks where completed is true
      const deletedTasks = await Task.deleteMany({ completed: true });
  
      return NextResponse.json({
        message: `${deletedTasks.deletedCount} completed task(s) deleted.`,
        success: true,
        tasks: deletedTasks,
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
  }
  