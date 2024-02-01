import React, { useEffect, useState } from 'react';
import useCartStore  from '@/store/cart';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import toast from "react-hot-toast";
import Link from 'next/link';
import SingleLoader from '@/loaders/singleLoader';
import { ApiRequestService } from '@/services/apiRequest.service';
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service"

const CheckoutComponentPage = () => {
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<VeeCartItem[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const { cartItems } = useCartStore();
    const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("")
    const [states, setStates] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetchCountries()
            .then((data) => {
                setCountries(data)
            })
            .catch((error) => {
                console.log("Error occurred " + error)
            })
    }, [])

    useEffect(() => {
        setBgHeroLeftSrc(bgHeroLeft.src);
        setLoading(false);
    }, []);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await ApiRequestService.callAPI(formData, "auth/register");

            if (response.status === 200) {
                const responseData = response.data;
                if (responseData.status === "error") {
                    toast.error("Error occurred: " + responseData.message);
                } else if (responseData.status === true) {
                    toast.success("Registration successful");
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
                }
            } else {
                if (response.status === 400) {
                    const responseData = response.data;
                    if (responseData.status === "error") {
                        toast.error(responseData.message);
                    } else if (responseData.status === true) {
                        toast.success("Unknown error occurred");
                    }
                }
            }
        } catch (error) {
            toast.error(
                "An error occurred while registering." + JSON.stringify(error)
            );
            console.error("Registration error:", JSON.stringify(error));
        }
    };

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    return (
        <div className="w-full" style={{
            backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
        }}>
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} />

            <div className='w-full cartAll bg-[#ffffff] p-10 gap-4'>
                <div className="mb-2 ml-8 w-full font-extrabold text-lg">
                    Checkout
                </div>
                <div className="mb-3 ml-8 w-full font-bold loginBody">
                    <PersonOutlineOutlinedIcon className="largeIcon"/> <span className="loginBtn bg-yellow-500">Login</span>
                </div>

                <div className="w-full justify-between sCart  flex column lg:p-8 bg-gray-50 lg:w-[85%] md:w-[100%] ">

                    <div className="cartBody lg:w-[65%] md:w-[100%]">
                        <div className="w-full font-extrabold">Shipping Address</div>

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

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Select a country
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
										State
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
									className="w-full text-black bg-secondary-600 hover:bg-secondary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-secondary-600 dark:hover-bg-secondary-700 dark:focus:ring-primary-800 primary-btn"
								>
									Register
								</button>
								
							</form>
                    </div>

                    <div className="cartSummary lg:w-[25%] md:w-[100%]"></div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default CheckoutComponentPage;
