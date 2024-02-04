"use client"

import React, { useState, FormEvent } from 'react';
import { Navbar } from "@/components/navbar";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import {Spinner} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"
import Footer from './Home/Footer/Footer';
import { ApiRequestService } from '@/services/apiRequest.service';
import Link from 'next/link';

interface ResponseDataItem {
    status: string;
    message: string;
    token: string
}

const Login: React.FC = () => {

  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    localStorage.setItem("token", "");
    setIsLoading(true);

    try {
        // Send a POST request to your backend with the login data
        const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "auth/login");
        if (response.status === 200) {
            const responseData = response.data;
            console.log("Data ", responseData)
            setIsLoading(false);
            if (responseData.status === "error") {
                toast.error("Error occurred: " + responseData.message)
            } else if (responseData.status === "success") {
                toast.success("Login successfully")
                if (responseData.token) {
                    localStorage.setItem("token", responseData.token);
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify(responseData.userinfo)
                )
                push("/account/my_orders");
            }
        } else {
            setIsLoading(false);
            if (response.status === 400) {
                const responseData = response.data
                toast.error(responseData.message)
            }
        }
    } catch (error) {
        setIsLoading(false);
        toast.error("An error occurred while logging in.")
        
    }
}

  const selectedSearchedItems = (selectedItem: any) => {
    // console.log("Selected Item from Search on product page", selectedItem);
  };

  return (
    <div
      className="relative flex flex-col h-screen"
      style={{
        backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
        backgroundPosition: 'right bottom',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
        <Navbar onSelectedCategoriesChange={selectedSearchedItems} hideUserMenus={true}/>
      <div className="mt-4"></div>
      <div className="w-full  flex justify-center center sm:h-[100%] lg:h-[800px] p-5 bg-gray-100">
    
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								Sign in
							</h1>
							<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
								<div>
									<label
										htmlFor="email"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Email or mobile phone number
									</label>
									<input
										type="text"
										name="username"
										id="username"
										value={formData.username}
										onChange={handleChange}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-600 focus:border-yellow-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="Email or mobile phone number"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Password
									</label>
									<input
										type="password"
										name="password"
										id="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="••••••••"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-600 focus:border-yellow-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-start">
										<div className="flex items-center h-5">
											<input
												id="remember"
												aria-describedby="remember"
												type="checkbox"
												className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-yellow-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-yellow-600 dark:ring-offset-gray-800"
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="remember"
												className="text-gray-500 dark:text-gray-300"
											>
												Remember me
											</label>
										</div>
									</div>
									<a
										href="#"
										className="text-sm font-medium text-yellow-600 hover:underline dark:text-yellow-500"
									>
										Forgot password?
									</a>
								</div>
								<button
									type="submit"
									className="w-full text-white  bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none 
                                    focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 
                                    dark:hover-bg-yellow-700 dark:focus:ring-yello-800 yellow-btn flex center justify-center gap-4"
                                    disabled={isLoading}
								>
									{isLoading && <Spinner size="sm" />}
							        {isLoading ? 'Signing In...' : 'Sign In'}
								</button>
								<p className="text-sm font-light text-gray-500 dark:text-gray-400">
									Don’t have an account yet?{" "}
									<Link
										href="/register"
										className="font-medium text-yellow-600 hover:underline dark:text-yellow-500"
									>
										Sign up
									</Link>
								</p>
							</form>
						</div>
					</div>
    </div>
    <ToastContainer />
      <Footer />
    </div>
  );
};

export default Login;
