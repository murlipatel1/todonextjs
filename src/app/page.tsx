"use client";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const onLogin = () => {
        router.push("/login");
    }
    return (
        <>
		<h1>Home Page</h1>
        <button onClick={onLogin}>Login Page</button>
        </>
    );
};

export default Page;
