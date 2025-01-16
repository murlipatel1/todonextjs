import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Task from "@/models/todoModels";

// POST Route: Add a new task with userId from token
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Token missing." }, { status: 401 });
        }

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY!);
        const userId = decodedToken.id;

        const reqBody = await request.json();
        const { task } = reqBody;

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

// GET Route: Fetch count of completed tasks
export async function GET() {
    try {
        const completedTasksCount = await Task.countDocuments({ completed: true });
        return NextResponse.json({ count: completedTasksCount });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
