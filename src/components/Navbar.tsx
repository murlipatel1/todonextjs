"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";


const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const todosFilter = searchParams.get("todos");
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  async function fetchTodos() {
    const response = await fetch("/api/todos");
    const data = await response.json();
    if (data.success) {
      console.log("success")
    }
  }

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get("/api/todos/completed");
        setCompletedTasks(response.data.count);
        fetchTodos();
      } catch (error) {
        console.error("Error fetching completed tasks count", error);
      }
    };
    fetchCompletedTasks();
  }, []);

  const handleNavigation = (filter: string | null) => {
    router.push(filter ? `/?todos=${filter}` : "/");
  };

  return (
    <nav className="mt-5 min-h-full flex md:flex-wrap flex-col-reverse items-center justify-between py-5 px-4 md:px-8">
      <button
        onClick={() => { handleNavigation(null); }}
        className={`${
          todosFilter === null
            ? `text-blue-500 px-4 py-2 bg-slate-900 rounded-md`
            : "px-4 py-2 text-gray-500 hover:border-b border-blue-400"
        }`}
      >
        All Tasks
      </button>
      <button
        onClick={() => { handleNavigation("active"); }}
        className={`${
          todosFilter === "active"
            ? `text-blue-500 px-4 py-2 bg-slate-900 rounded-md`
            : "px-4 py-2 text-gray-500 hover:border-b border-blue-400"
        }`}
      >
        Active Tasks
      </button>
      <button
        onClick={() => { handleNavigation("completed"); }}
        className={`${
          todosFilter === "completed"
            ? `text-blue-500 px-4 py-2 bg-slate-900 rounded-md`
            : "px-4 py-2 text-gray-500 hover:border-b border-blue-400"
        }`}
      >
        Completed Tasks ({completedTasks})
      </button>
    </nav>
  );
};

export default Navbar;
