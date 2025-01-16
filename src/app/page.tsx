"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
import axios from "axios";
import { Suspense } from "react";
const Page = () => {
    const router = useRouter();
    const logout = async () => {
        try {
            await axios.get("api/users/logout");
            router.push("/login");
        } catch (error) {
            console.log("Error logging out:", error);
        }
    };

    return (
        <>
		<Suspense fallback={<div>Loading...</div>}>
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
                <TodoList />
            </main>
			</Suspense>
        </>
    );
};

export default Page;
