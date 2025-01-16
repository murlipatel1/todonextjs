import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    task: String,
    completed: Boolean,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
  },
  { timestamps: true },

);

const Task = mongoose.models.task || mongoose.model("task", todoSchema);

export default Task;
