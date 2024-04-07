import React, { useEffect, useState } from 'react';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiRequestService } from '@/services/apiRequest.service';
import { VeeCheckoutFormData } from '@/types/types';
import { LocalStorageService } from '@/services/localStorage';
import {Spinner} from "@nextui-org/react";
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service";
import { useRouter } from "next/navigation"


const CheckoutForm = () => {
    const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("")
    const [states, setStates] = useState<{ id: string; name: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter()
    const [formData, setFormData] = useState({
      last_name: "",
      first_name: "",
      email: "",
      phone: "",
      company: "",
      selectedCountry: "",
	  street: "",
      state: "",
      city: "",
      zip: "",
      
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

    

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
		setIsLoading(true);
          // Check if any form field is empty
		  const emptyFields = Object.entries(formData).filter(([key, value]) => key !== 'company').some(([key, value]) => value === "");

		  const localStorageService = new LocalStorageService("checkoutFormData");

          if (emptyFields) {
			localStorageService.deleteData("formData");
			setIsLoading(false);
              toast.error("Please fill in all the required fields.", {});
              setErrorMessage("Please fill in all the required fields.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000); 

              return;
          }

          
          localStorageService.setData("formData", formData);
		   push("/cart/checkout/payment");
    };

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    return (
       

           
               

                    <div>
                        <div className="w-full font-extrabold mb-2">Shipping Address</div>

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
											Last Name <span className="text-red-300 font-bold">*</span>
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
											First Name <span className="text-red-300 font-bold">*</span>
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
										Email Address <span className="text-red-300 font-bold">*</span>
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
											City <span className="text-red-300 font-bold">*</span>
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
											Zip/Postal Code <span className="text-red-300 font-bold">*</span>
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
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Phone Number <span className="text-red-300 font-bold">*</span>
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

                </div>

								

								

							<div className="w-full flex center justify-center">
							<button
								type="submit"
								className=" flex center justify-center gap-2 text-white bg-yellow-600 
								hover:bg-yellow-700 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg 
								text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover-bg-yellow-700 
								dark:focus:ring-yellow-800 warning-btn relative"
								disabled={isLoading}
							>
								{isLoading && <Spinner size="sm" />}
								{isLoading ? 'Please wait...' : 'Continue to Payment'}
							</button>
						</div>

                                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
								
							</form>
							<ToastContainer />
                    </div>

                 
          

            
       
    );
};

export default CheckoutForm;
