"use client"

import React, { useState, FormEvent, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import {Spinner} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"
import Footer from './Home/Footer/Footer';
import { ApiRequestService } from '@/services/apiRequest.service';
import Link from 'next/link';
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service";

interface ResponseDataItem {
    status: string;
    message: string;
    token: string
}

const RegisterComponent: React.FC = () => {

  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter()

  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("")
    const [states, setStates] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    email: "",
    phone: "",
    company: "",
    selectedCountry: "",
    state: "",
    street: "",
    city: "",
    zip: "",
    password: "",
    cpassword: "",
})

const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target
    setFormData({
        ...formData,
        [name]: value,
    })
}

useEffect(() => {
    fetchCountries()
        .then((data) => {
            setCountries(data)
        })
        .catch((error) => {
            console.log("Error occurred " + error)
        })
}, [])



const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    const selectedCountry = e.target.value;
    setFormData({
        ...formData,
        selectedCountry,
    });

    fetchStatesByCountry(e.target.value)
        .then((data) => {
            setStates(data);
        })
        .catch((error) => {
            console.log("Error occurred " + error);
        });
};



const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem("token", "");
    setIsLoading(true);

    try {
        // Send a POST request to your backend with the login data
        const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "auth/register");
        if (response.status === 200) {
            const responseData = response.data;
            
            setIsLoading(false);
            if (responseData.status === "error") {
                toast.error("Error occurred: " + responseData.message)
            } else if (responseData.status === true) {
                toast.success("Registration successful")
                setFormData({
                    last_name: "",
                    first_name: "",
                    email: "",
                    phone: "",
                    company: "",
                    selectedCountry: "",
                    state: "",
                    street: "",
                    city: "",
                    zip: "",
                    password: "",
                    cpassword: "",
                });
                push("/login");
            }
        } else {
            setIsLoading(false);
            if (response.status === 400) {
                const responseData = response.data
                if (responseData.status === "error") {
                    toast.error(responseData.message)
                } else if (responseData.status === true) {
                    toast.success("Unknown error occured")
                }
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
      <div className="w-full  flex sm:h-[100%]  bg-gray-100 column-display">
    
      <div className="w-full bg-gray-100 flex justify-center center  rounded-lg  shadow dark:border sm:w-[100%] w-[500px] h-[1000px] dark:bg-gray-800 dark:border-gray-700 ">

						<div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-white rounded-lg shadow dark:border lg:mt-6 lg:mb-6">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								Register
							</h1>
							<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<label
											htmlFor="email"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Last Name
										</label>
										<input
											type="text"
											name="last_name"
											id="last_name"
											value={formData.last_name}
											onChange={handleChange}
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder=""
										/>
									</div>

									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											First Name
										</label>
										<input
											type="text"
											name="first_name"
											id="last_name"
											value={formData.first_name}
											onChange={handleChange}
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder=""
										/>
									</div>
								</div>

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Email Address
									</label>
									<input
										type="email"
										name="email"
										id="last_name"
										value={formData.email}
										onChange={handleChange}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder=""
									/>
								</div>

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Mobile
									</label>
									<input
										type="text"
										name="phone"
										id="phone"
										value={formData.phone}
										onChange={handleChange}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder=""
									/>
								</div>

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Company
									</label>
									<input
										type="text"
										name="company"
										id="copany"
										value={formData.company}
										onChange={handleChange}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder=""
									/>
								</div>
                                <div className="grid grid-cols-2 gap-2">

                                <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Country <span className="text-red-300 font-bold">*</span>
                                </label>

                                <select
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value=""></option>
                                    {countries.map((country) => (
                                        <option
                                            key={country.id}
                                            value={country.id}
                                        >
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                </div>

                                <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    State/Province <span className="text-red-300 font-bold">*</span>
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option></option>
                                    {states.map((state) => (
                                        <option
                                            key={state.id}
                                            value={state.name}
                                        >
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                                </div>

                                </div>

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Street
									</label>
									<input
										type="text"
										name="street"
										id="street"
										value={formData.street}
										onChange={handleChange}
										placeholder=""
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											City
										</label>
										<input
											type="text"
											name="city"
											id="city"
											value={formData.city}
											onChange={handleChange}
											placeholder=""
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>

									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Zip
										</label>
										<input
											type="text"
											name="zip"
											id="zip"
											value={formData.zip}
											onChange={handleChange}
											placeholder=""
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2">
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
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>

									<div>
										<label
											htmlFor="password"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Confirm Password
										</label>
										<input
											type="password"
											name="cpassword"
											id="cpassword"
											value={formData.cpassword}
											onChange={handleChange}
											placeholder="••••••••"
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>
								</div>

								<button
									type="submit"
									className="w-full text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none 
                                    focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                    dark:bg-yellow-600 dark:hover-bg-yellow-700 dark:focus:ring-primary-800 primary-btn flex center justify-center gap-4"
                                    disabled={isLoading}
                                >
									{isLoading && <Spinner size="sm" />}
							        {isLoading ? 'Please wait...' : 'Register'}
								</button>
								<p className="text-sm font-light text-gray-500 dark:text-gray-400">
									already have an account?{" "}
									<Link
										href="/login"
										className="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>
										Sign in
									</Link>
								</p>
							</form>
						</div>
					</div>

                    <ToastContainer />
      <Footer />
    </div>
    
    </div>
  );
};

export default RegisterComponent;
