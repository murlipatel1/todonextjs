
"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";
import {useFormik} from "formik";
import {BiLoaderAlt} from "react-icons/bi";
import {useTodos} from "@/context/todo";

type User ={
	email: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();
	const {isLoading: loginLoading, setIsLoading: setLoginLoading} = useTodos();
	const {isLoading: guestLoading, setIsLoading: setGuestLoading} = useTodos();

	const onLogin = async (values: User) => {
		try {
			setLoginLoading(true);
			const response = await axios.post("/api/users/login", values);
			const responseData = response.data;
			if (!responseData.error) {
				router.push("/");
                console.log(responseData.message);
			}
		} catch (error) {
            console.error("An error occurred during login:", error);
		} finally {
			setLoginLoading(false);
		}
	};

	const guestLogin = async () => {
		setValues({email: "example@gmail.com", password: "Example@2003"});
		try {
			setGuestLoading(true);
			const response = await axios.post("/api/users/login", {
				email: "Example@gmail.com",
				password: "Example@2003",
			});
			const responseData = response.data;
			if (!responseData.error) {
				router.push("/");
                console.log(responseData.message);
			}
		} catch (error) {
			console.error("An error occurred during guest login:", error);
		} finally {
			setGuestLoading(false);
			resetForm();
		}
	};

	const {
		handleSubmit,
		values,
		handleChange,
		errors,
		touched,
		setFieldTouched,
		isValid,
		isSubmitting,
		setValues,
		resetForm,
	} = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values, {resetForm}) => {
			if (isValid) {
				await onLogin(values);
				resetForm();
			}
		},
	});

	const handleTouched = (field: string) => {
		setFieldTouched(field, true);
	};
	return (
		<>
			<div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<p className="mx-auto h-10 w-auto flex justify-center items-center font-black text-blue-500 text-2xl">
						TodoApp
					</p>
					<h2 className="mt-5 text-center text-2xl font-medium leading-9 tracking-tight ">
						Login to your account
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit} noValidate>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 "
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									value={values.email}
									onChange={handleChange}
									onBlur={() => handleTouched("email")}
									placeholder="rahul@xyz.com"
									autoComplete="email"
									required
									className={`w-full border-2 border-white-600 rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
										touched.email && errors.email
											? " focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all"
											: ""
									}  `}
								/>
								{touched.email && (
									<p className="text-red-600 mt-2 text-sm">{errors.email}</p>
								)}
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 "
								>
									Password
								</label>
								<div className="text-sm">
									<Link
										href="#"
										className="font-semibold text-blue-600 hover:text-blue-500"
									>
										Forgot password?
									</Link>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									value={values.password}
									onChange={handleChange}
									onBlur={() => handleTouched("password")}
									placeholder="rahul@1999"
									required
									className={`w-full border-2 border-white-600 rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
										touched.password && errors.password
											? " focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all"
											: ""
									}  `}
								/>
								{touched.password && (
									<p className="text-red-600 mt-2 text-sm">{errors.password}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button
								type="submit"
								disabled={!isValid || isSubmitting}
								className="cursor-pointer flex items-center gap-2 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								{isSubmitting && loginLoading ? (
									<>
										Logging in...
										<BiLoaderAlt className="text-lg animate-spin" />
									</>
								) : (
									"Log in"
								)}
							</button>
							<button
								onClick={guestLogin}
								type="button"
								disabled={!isValid || isSubmitting}
								className="text-white cursor-pointer flex items-center gap-2 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								{isSubmitting && guestLoading ? (
									<>
										Logging in...
										<BiLoaderAlt className="text-lg animate-spin" />
									</>
								) : (
									"Guest login"
								)}
							</button>
						</div>
					</form>
					<p className="mt-10 text-center text-sm text-gray-500">
						Not a member? &nbsp;
						<Link
							href="/signup"
							className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
						>
							Sign in now
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
