import React, { useEffect, useState } from 'react';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiRequestService } from '@/services/apiRequest.service';
import { VeeCheckoutFormData } from '@/types/types';
import { LocalStorageService } from '@/services/localStorage';

import {Spinner, Checkbox} from "@nextui-org/react";
import {
    fetchCountries,
    fetchStatesByCountry,
    createShippingAddress,
	getShippingAddress,
} from "@/services/requestAll.service";
import { useRouter } from "next/navigation"
import Btn from '../elements/btn';



const Addresses = () => {
    const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("")
    const [states, setStates] = useState<{ id: string; name: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
    const [isShippingAddressSet, setIsShippingAddressSet] = useState(false)
	const [selectAddress, setSelectAddress] = useState("addressOne")
    const [shippingAddresses, setShippingAddresses] = useState([])
    const { push } = useRouter()
    const [formData, setFormData] = useState({
        action: "insert",
		email: "",
		street: "",
		state: "",
		city: "",
		zip: "",
		company: "",
		selectedCountry: "",
		phone: "",
		nickname: "",
      
  })

    useEffect(() => {
        fetchCountries()
            .then((data) => {
                setCountries(data)
            })
            .catch((error) => {
                console.log("Error occurred " + error)
            })
    }, [])


    function replaceSpecialCharactersWithSpace(str: string) {
		// Define a regular expression to match special characters
		var regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/=]/g

		// Use the replace method to replace special characters with spaces
		return str.replace(regex, " ")
	}
  

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

    const _handleSubmit = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();
        setIsLoading(true);
		createShippingAddress(formData).then(() => init())
	}

	const _handleChange = (e: { target: { name: any; value: any; }; }) => {
		const { name, value } = e.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

    const init = async () => {
		const userJson = localStorage.getItem("user")
		if (!userJson) return
		const user = JSON.parse(userJson)
		getShippingAddress(user.email).then(({ data }) => {
			if (!data || !data.length) return
			setShippingAddresses(data)
			setSelectAddress(data[0]?.id)
			setIsShippingAddressSet(false)
            setIsLoading(false);
		})
	}
	useEffect(() => {
		init()
	}, [])


    const handleClick = () => {
        setIsLoading(true);
       
         
    
       
        setTimeout(() => {
          setIsLoading(false);
          
          localStorage.setItem("myAddress", selectAddress);
          push("/cart/checkout/payment");
        }, 3000); 
      };

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    return (
       

           
               

                    <div>
                       
                        <div className="my-3 flex justify-between items-center">
							<h1 className=" font-semibold">Shipping Address</h1>
							<Btn
								onClick={() =>
									setIsShippingAddressSet(
										!isShippingAddressSet
									)
								}
								className=" p-1 bg-blue-400 text-white rounded-lg"
							>
								{!isShippingAddressSet ? "Add" : "Select"}{" "}
								Address
							</Btn>
						</div>

                        {shippingAddresses?.length &&
							!isShippingAddressSet ? (
								<div className="flex-1 order-2 lg:order-1  p-3">
									{shippingAddresses.map(
										({ id, street, state, city, zip }) => (
											<div
												key={id}
												className="border mb-4  p-3 flex space-x-3 items-center"
											>
												<input
													onChange={() =>
														setSelectAddress(id)
													}
													type="radio"
													name="address"
													id={id}
													checked={
														selectAddress === id
													}
												/>
												<label
													htmlFor={id}
													className=" capitalize"
												>
													<div>
														<p>
															{street} ({zip})
														</p>

														<p>
															{city} ({state})
														</p>
													</div>
												</label>
											</div>
										)
									)}
                                     <button
                                        className="w-full flex center justify-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover-bg-yellow-700 dark:focus:ring-yellow-800 warning-btn relative"
                                        onClick={handleClick}
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Spinner size="sm" />}
                                        {isLoading ? 'Please wait...' : 'Continue to Payment'}
                                    </button>
								</div>
							) : (

                        <form
								className="space-y-4 md:space-y-6"
								onSubmit={_handleSubmit}
							>
								<div className="  flex-1 ">
											<label
												htmlFor=""
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
											>
												Nickname
												<span className=" text-[#982c2e]">
													{" "}
													*{" "}
												</span>
											</label>
											<input
												type="text"
												className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
												name="nickname"
												value={formData.nickname}
												onChange={_handleChange}
											/>
										</div>

                                        

								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Email Address <span className="text-red-300 font-bold">*</span>
									</label>
									<input
										type="email"
										name="email"
										id="last_name"
                                        required
										value={formData.email}
										onChange={_handleChange}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder=""
									/>
								</div>

                                <div className=" ">
										<label
											htmlFor=""
											className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Street Address
											<span className=" text-[#982c2e]">
												{" "}
												*{" "}
											</span>
										</label>
										<input
											type="text"
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											required
											name="street"
											value={formData.street}
											onChange={_handleChange}
                                            
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
                                        required
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
										onChange={_handleChange}
                                        required
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

                <div className="grid grid-cols-2 gap-2">
									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											City <span className="text-red-300 font-bold">*</span>
										</label>
										<input
											type="text"
											name="city"
											id="city"
											value={formData.city}
											onChange={_handleChange}
                                            required
											placeholder=""
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>

									<div>
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Zip/Postal Code <span className="text-red-300 font-bold">*</span>
										</label>
										<input
											type="text"
											name="zip"
											id="zip"
											value={formData.zip}
											onChange={_handleChange}
                                            required
											placeholder=""
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>
								</div>


                <div className="grid grid-cols-2 gap-2">
                <div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Phone Number <span className="text-red-300 font-bold">*</span>
									</label>
									<input
										type="text"
										name="phone"
										id="phone"
										value={formData.phone}
										onChange={_handleChange}
                                        required
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
										onChange={_handleChange}
                                      
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder=""
									/>
								</div>

                </div>
                <div className="mt-2">
            
                <div className="lk lx abg">
                    <div className="lx nz yz flex gap-4">
                    <input 
                    onChange={_handleChange}
                    name="default_address"
                     type="checkbox" 
                     className="nw rx adp afv ayg bnp" 
                     />
                         <label className="avz awd axu">Set as default address</label>
                     </div>
                    </div>
                </div>

								

								

							
						<button
							type="submit"
							className="w-full flex center justify-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover-bg-yellow-700 dark:focus:ring-yellow-800 warning-btn relative"
							disabled={isLoading}
						>
							{isLoading && <Spinner size="sm" />}
							{isLoading ? 'Please wait...' : 'Add Address'}
						</button>

                                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
								
							</form>
                            )}
							<ToastContainer />
                    </div>

                 
          

            
       
    );
};

export default Addresses;
