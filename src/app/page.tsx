"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
import axios from "axios";

type Props = {};

const Page = (props: Props) => {
    const router = useRouter();

    const logout = async () => {
        try {
            await axios.get("api/users/logout");
            router.push("/login");
        } catch (error: any) {
            console.log("Error logging out:", error.message);
        }
    };

    // Reload the entire page when Navbar or AddTodo changes
    const triggerFullPageReload = () => {
        router.refresh();  // This will refresh the entire page.
    };

    return (
        <>
            <main className="p-5 inset-0 mx-auto md:w-[75vh]">
                <div className="flex justify-end p-2">
                    <button onClick={logout} className="bg-red-600 rounded-md p-2">
                        Logout
                    </button>
                </div>
                <h1 className="font-bold text-2xl flex flex-col justify-center items-center border-b my-5 py-5 border-gray-600 ">
                    TODO APP
                </h1>
                <Navbar />
                <TodoList/>
            </main>
        </>
    );
};

export default Page;
