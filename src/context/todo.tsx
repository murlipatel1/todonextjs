"use client";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";

export type Todo = {
	
	_id: string;
	task: string;
	completed: boolean;
	createdAt: Date;
};

export type TodoContext = {
	todos: Todo[];
	handleAddTodo: (task: string) => void;
	toggleTodoCompleted: (id: string) => void;
	handleTodoDelete: (id: string) => void;
	handleSelectAll: () => void;
	handleDeleteAll: () => void;
	isLoading: boolean;
	setIsLoading: (value: boolean) => void;
};

export const todosContext = createContext<TodoContext | null>(null);

const TodoProvider = ({ children }: { children: ReactNode }) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchTodos = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/todos");
				const data = await response.json();
				setTodos(data.tasks);
			} catch (error) {
				console.error("Failed to fetch todos:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTodos();
	}, []);

	// Handle selecting or unselecting all tasks
	const handleSelectAll = async () => {
		try {
			// Toggle completion for all tasks
			const allCompleted = todos.every((task) => task.completed);
			const updatedTodos = todos.map((task) => ({
				...task,
				completed: !allCompleted,
			}));

			// Update tasks on the backend if needed
			await fetch("/api/todos", { method: "PATCH" });

			// Update state
			setTodos(updatedTodos);
		} catch (error) {
			console.error("Failed to select all todos:", error);
		}
	};

	// Handle deleting all completed tasks
	const handleDeleteAll = async () => {
		try {
			await fetch("/api/todos", { method: "DELETE" });
			setTodos((prev) => prev.filter((task) => !task.completed));
		} catch (error) {
			console.error("Failed to delete all todos:", error);
		}
	};

	// Handle adding a new task
	const handleAddTodo = async (task: string) => {
		try {
			const response = await fetch("/api/usertask", {
				method: "POST",
				body: JSON.stringify({ task }),
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			setTodos((prev) => [data.task, ...prev]);
		} catch (error) {
			console.error("Failed to add todo:", error);
		}
	};

	// Handle toggling a todo's completion
	const toggleTodoCompleted = async (id: string) => {
		try {
			await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
			setTodos((prev) =>
				prev.map((task) => (task._id === id ? { ...task, completed: !task.completed } : task))
			);
		} catch (error) {
			console.error("Failed to toggle todo:", error);
		}
	};

	// Handle deleting a specific todo
	const handleTodoDelete = async (id: string) => {
		try {
			await fetch(`/api/todos/${id}`, { method: "DELETE" });
			setTodos((prev) => prev.filter((task) => task._id !== id));
		} catch (error) {
			console.error("Failed to delete todo:", error);
		}
	};

	return (
		<todosContext.Provider
			value={{
				todos,
				handleAddTodo,
				toggleTodoCompleted,
				handleTodoDelete,
				handleSelectAll,
				handleDeleteAll,
				isLoading,
				setIsLoading,
			}}
		>
			{children}
		</todosContext.Provider>
	);
};


export default TodoProvider;

export function useTodos() {
	const todosContextValue = useContext(todosContext);
	if (!todosContextValue) {
		throw new Error("useTodos used outside of provider");
	}
	return todosContextValue;
}
