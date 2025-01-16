"use client";

import { useState, useEffect } from "react";
import { Todo } from "../context/todo";
import { useSearchParams, useRouter } from "next/navigation";
import { useTodos as useTodo } from "@/context/todo";
import axios from "axios";
import { useFormik } from "formik";
import { BiLoaderAlt } from "react-icons/bi";
import * as yup from "yup";

const taskSchema = yup.object().shape({
  todo: yup.string().min(5).required("Valid task is required"),
});


const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const searchParams = useSearchParams();
  const todosFilter = searchParams.get("todos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, setIsLoading } = useTodo();
  const router = useRouter();

  const onTaskAdded = async (todo: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/todos", {
        task: todo,
      });
      if (response.data) {
        console.log("Task added successfully:", response.data);
        fetchTodos();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      todo: "",
    },
    validationSchema: taskSchema,
    onSubmit: async (values, formikHelpers) => {
      await onTaskAdded(values.todo);
      formikHelpers.resetForm();
    },
  });

  useEffect(() => {
    
    setIsSubmitting(formik.isValid);
    console.log(isSubmitting);
  }, [formik.isValid]);

  async function fetchTodos() {
    const response = await fetch("/api/todos");
    const data = await response.json();
    if (data.success) {
      setTodos(data.tasks);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todosFilter === "completed"
    ? todos.filter((todo) => todo.completed)
    : todosFilter === "active"
    ? todos.filter((todo) => !todo.completed)
    : todos;

  const handleSelectAll = async () => {
    const response = await fetch("/api/todos/select-all", {
      method: "PATCH",
    });
    const data = await response.json();
    if (data.success) {
      setTodos(data.tasks);
      router.refresh();
    }
  };

  const handleDeleteAll = async () => {
    const response = await fetch("/api/todos/delete-all-completed", {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) {
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      router.refresh();
    }
  };

  const toggleTodoCompleted = async (id: string) => {
    const response = await fetch(`/api/todos?id=${id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (data.success) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: data.task.completed } : todo
        )
      );
    }
  };

  const handleTodoDelete = async (id: string) => {
    const response = await fetch(`/api/todos?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      router.refresh();
    }
  };

  return (
    <>
      <form
        className="grid gap-4 grid-cols-1 lg:grid-cols-2 my-8"
        onSubmit={formik.handleSubmit}
      >
        <input
          className={`rounded-lg p-3 w-auto text-black ${
            formik.errors.todo && formik.touched.todo
              ? "border-red-600"
              : "border-gray-600"
          }`}
          type="text"
          name="todo"
          placeholder="Write your task...."
          value={formik.values.todo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="submit"
          className={`w-full lg:w-40 mx-auto sm:mx-0 md:ml-auto rounded-full ${
            formik.errors.todo && formik.touched.todo
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {isLoading ? <BiLoaderAlt className="animate-spin" /> : "Add Task"}
        </button>
        {formik.errors.todo && formik.touched.todo && (
          <p className="text-red-600 col-span-2">{formik.errors.todo}</p>
        )}
      </form>

      <div className="p-4 space-y-4">
        <div className="flex gap-4 justify-between flex-wrap">
          <button
            onClick={() => {
              handleSelectAll();
            
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full sm:w-auto"
          >
            Select All
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-auto"
          >
            Delete All
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTodos.map((todo: Todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-2 rounded-md"
            >
              <div className="flex items-center text-3xl">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    toggleTodoCompleted(todo._id);
                
                  }}
                  className="mr-6 w-5 h-5"
                />
                <span className={todo.completed ? "line-through text-gray-500" : ""}>
                  {todo.task}
                </span>
              </div>
              <button
                onClick={() => {
                  handleTodoDelete(todo._id);
                 
                }}
                className="bg-gray-200 rounded-xl p-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
