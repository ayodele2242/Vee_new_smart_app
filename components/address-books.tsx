"use client"

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Navbar } from "@/components/navbar";
import Footer from './Home/Footer/Footer';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import SideBar from './SideBar';
import { ApiRequestService } from '@/services/apiRequest.service';
import Pagination from "@/pagination/Pagination";
import ProductsAnime from '@/loaders/ProductsAime';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import {
  fetchCountries,
  fetchStatesByCountry,
  createShippingAddress,
getShippingAddress,
} from "@/services/requestAll.service";
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";

import Link from 'next/link';
import { Spinner } from '@nextui-org/react';

interface Contact {
  id: number;
  name: string;
  email: string;
}

interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
  }
  

    const AddressBook: React.FC = () => {
    
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [backendResponse, setBackendResponse] = useState(null)
	const [backendMsg, setBackendMsg] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(5); // Set default page size
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('product_name'); 
    const [totalPages, setTotalPages] = useState(1);
    const [recordsFound, setRecordsFound] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editedValues, setEditedValues] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("")
    const [states, setStates] = useState<{ id: string; name: string }[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    //const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);


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



    useLayoutEffect(() => {
        // Check if user is logged in
        const loggedIn = isUserLoggedIn();
    
        if (!loggedIn) {
          // If user is not logged in, redirect to login page
          redirectToLoginPage();
        } else {
          setLoading(false);
        }
    }, []);


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
      const user = JSON.parse(userJson);
      setFormData({
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
      });
      getShippingAddress(user.email).then(({ data }) => {
        if (!data || !data.length) return
        
              setIsLoading(false);
              setShowModal(true)
              fetchData('orders/shippingAddress', 1);
              
      })
    }
    useEffect(() => {
     
    }, [])

    const openModal = () => {
      setShowModal(true);
      //init()
    };
    

    const handleSetDefaultAddress = async (addressId: string) => {
      console.log("Selected item", addressId);
      setIsLoading(true);
        try {
          
          let payload = {};
          payload = {
            action: "update_address",
            id: addressId,
           
          };
      
          const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), 'orders/shippingAddress');
          const responseData = response.data;
      
        
          if (response.status === 200) {
            const { status, message, data } = responseData;
            toast.success(message);
            setError(null);
            setEditIndex(null);
            setIsLoading(false);
            fetchData('orders/shippingAddress', 1);      
        } else {
            const { status, message } = responseData;
            setBackendResponse(status);
            setIsLoading(false);
            toast.error(message);
        }
          
        } catch (error: any) {
          setIsLoading(false);
        
          if (error.response) {
            if (error.response.status === 401) {
              setError("Please log in to access this content.");
            } else if (error.response.status === 403) {
              setError("You do not have permission to access this content.");
            } else {
              setError("An error occurred on the server. Please try again later.");
            }
          } else if (error.request) {
            setError("No response from the server. Please try again later.");
          } else {
            setError("An unexpected error occurred. Please try again later.");
          }
        }
    };
  


    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchData('orders/shippingAddress', pageNumber);
      };

  
      useEffect(() => {

        fetchData('orders/shippingAddress', 1);
      }, [searchQuery, searchType]);
    
      const fetchData = async (url: string, pageNumber: number) => {
        try {
          
          let payload = {};
          let userJson = localStorage.getItem("user");
          if (!userJson) return;
          let user = JSON.parse(userJson);
      
          setLoading(true); // Set loading to true by default
      
          payload = {
            action: "select",
            email: user.email,
            pageNo: pageNumber,
            limit: pageSize,
            search_query: searchQuery,
            search_type: searchType,
          };
      
          const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), url);
          const responseData = response.data;
      
        
          if (response.status === 200) {
            const { status, message, data } = responseData;
            setProducts(responseData.data);
            setTotalCount(parseInt(responseData.totalRecords as any));
            setRecordsFound(parseInt(responseData.totalRecords as any));
            const totalPages = Math.ceil(parseInt(responseData.totalRecords as any) / pageSize);
            setTotalPages(totalPages);
            setError(null);
            setLoading(false);
                        
        } else {
            const { status, message } = responseData;
            setBackendResponse(status);
            setLoading(false);
        }
          
        } catch (error: any) {
          console.error('Error fetching address:', error);
          setLoading(false);
          if (error.response) {
            if (error.response.status === 401) {
              setError("Please log in to access this content.");
            } else if (error.response.status === 403) {
              setError("You do not have permission to access this content.");
            } else {
              setError("An error occurred on the server. Please try again later.");
            }
          } else if (error.request) {
            setError("No internet connection. Check your internet connection and try again.");
          } else {
            setError("An unexpected error occurred. Please try again later.");
          }
        }
      };

      const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditedValues(products[index]);
      };
    
      const handleSubmit = async (index: number) => {
        setIsLoading(true);
        try {
          
          let payload = {};
          let userJson = localStorage.getItem("user");
          if (!userJson) return;
          let user = JSON.parse(userJson);
          const {  
            id,
            email,
            phone,
            street, 
            company, 
            state, 
            country, 
            city,
            zip, 
            nickname, 
            default_address_status, } = editedValues;
    
      
          payload = {
            action: "update",
            id: id,
            email: email,
            phone: phone,
            street: street, 
            company: company, 
            state: state, 
            country: country, 
            city: city,
            zip: zip, 
            nickname: nickname, 
            default_address_status: default_address_status,
            
          };
      
          const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), 'orders/shippingAddress');
          const responseData = response.data;
      
        
          if (response.status === 200) {
            const { status, message, data } = responseData;
            toast.success(message);
            setError(null);
            setEditIndex(null);
            setIsLoading(false);
            fetchData('orders/shippingAddress', 1);      
        } else {
            const { status, message } = responseData;
            setBackendResponse(status);
            setIsLoading(false);
            toast.error(message);
        }
          
        } catch (error: any) {
          setIsLoading(false);
        
          if (error.response) {
            if (error.response.status === 401) {
              setError("Please log in to access this content.");
            } else if (error.response.status === 403) {
              setError("You do not have permission to access this content.");
            } else {
              setError("An error occurred on the server. Please try again later.");
            }
          } else if (error.request) {
            setError("No response from the server. Please try again later.");
          } else {
            setError("An unexpected error occurred. Please try again later.");
          }
        }
        
      };


      const handleClose = () => {
        setEditIndex(null);
        setEditedValues({});
      };


      const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
      };

      


  return (
    <div className="flex flex-col min-h-screen">
    <div
      className="flex-grow relative"
      style={{
        backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
        backgroundPosition: 'right bottom',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
     <Navbar onSelectedCategoriesChange={selectedSearchedItems} hideUserMenus={false}/>
      <div className="mt-4"></div>
      {/* Breadcrumbs */}
      <div className="mb-0 mt-1 flex w-full bg-white lg:pl-9 lg:pr-5 lg:pt-5 row-layout sm:p-4 md:p-4">
          <Link href="/" className="font-bold text-lg text-yellow-600  md:text-sm">Home</Link> 
          <KeyboardArrowRightOutlinedIcon  />
          <Link href="#" className="font-bold text-lg md:text-sm">Account</Link> 
          <KeyboardArrowRightOutlinedIcon />
          <Link href="#" className="font-bold text-lg md:text-sm">Address Book</Link> 
      </div>
      <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
        <div className="flex gap-6 w-full">
          <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
            <SideBar />
          </div>


          <div className="content-div lg:w-3/4  bg-gray-100 rounded-xlg lg:m-5 sm:p-1">

          <div className="flex column-layout w-full sm:pb-3">
            <div className="flex justify-between p-3">
              <b></b>
            <button className="btn bg-yellow-600 text-white rounded-xl font-semibold p-2" onClick={openModal}>Add Address</button>
            </div>
          
          
        <div className="w-full lg:p-0 relative">
        {loading && <div className="iSpinner pt-9"> <Spinner size="sm" /> </div>}
        {error && !loading &&
        <div className="text-red-500 font-bold pt-9 flex justify-center h-[100%]">{error}</div>
        }

        {!loading && (
          
        <>
        {products && products.map((product, index) => (
        <div key={index} className="w-full bg-white p-3 mb-3 flex flex-col lg:flex-row">
          {editIndex === index ? (
            <div className="flex column-display w-full lg:mr-3 p-3">
                <form className="space-y-4">
                <div>
                  <label htmlFor="nickname" className="block">Nickname</label>
                  <input
                    id="nickname"
                    type="text"
                    value={editedValues.nickname || ''}
                    onChange={(e) => setEditedValues({ ...editedValues, nickname: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block">Email</label>
                  <input
                    id="email"
                    type="text"
                    value={editedValues.email || ''}
                    onChange={(e) => setEditedValues({ ...editedValues, email: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block">Phone</label>
                  <input
                    id="phone"
                    type="text"
                    value={editedValues.phone || ''}
                    onChange={(e) => setEditedValues({ ...editedValues, phone: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block">State</label>
              <input
                type="text"
                value={editedValues.state || ''}
                onChange={(e) => setEditedValues({ ...editedValues, state: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              </div>
              <div>
                  <label htmlFor="phone" className="block">Street</label>
              <input
                type="text"
                value={editedValues.street || ''}
                onChange={(e) => setEditedValues({ ...editedValues, street: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              </div>
              <div>
                  <label htmlFor="phone" className="block">City</label>
              <input
                type="text"
                value={editedValues.city || ''}
                onChange={(e) => setEditedValues({ ...editedValues, city: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              </div>
              <div>
                  <label htmlFor="phone" className="block">Zip</label>
              <input
                type="text"
                value={editedValues.zip || ''}
                onChange={(e) => setEditedValues({ ...editedValues, zip: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              </div>
                <div className="flex justify-between mt-5">
                  <button type="button" onClick={() => handleSubmit(index)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}>
                    {isLoading && <Spinner size="sm" />}
						      	{isLoading ? 'Please wait...' : 'Update'}
                  </button>
                  <button type="button" onClick={handleClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md">Close</button>
                </div>
                </form>
            </div>
          ) : (
            <>
              <div className="flex column-display w-full lg:mr-3 p-3">
                <div className="font-bold w-full flex">
                {product.nickname}
                {product.default_address_status === "1" && (
                  <span className="default-address-indicator bg-yellow-600 text-white ml-3">Default</span>
                )}</div>
                <div className="font-normal w-full txt-small">{product.email}</div>
                <div className="font-normal w-full txt-small">{product.phone}</div>
                {!product.default_address_status && (
                <><label className="radio-btn mt-2">
                        <input
                          type="radio"
                          name="defaultAddress"
                          className="mr-2"
                          onChange={() => handleSetDefaultAddress(product.id)} />
                        Set as Default {isLoading && <Spinner size="sm" className="ml-2" />}
                      </label> 
                      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                      </>
                

                )}
              </div>
              <div className="flex column-display w-full lg:mr-3 p-3">
                <div className="w-full">{product.state}</div>
                <div className="w-full">{product.street}</div>
                <div className="w-full">{product.city} - {product.zip}</div>
              </div>

              <button onClick={() => handleEdit(index)} className="text-red-600">Edit</button>
              

            </>
          )}
        </div>
      ))}

      {!products && (
      <div className="text-red-500 font-bold w-full h-[100%] flex justify-center bg-red-100 p-9">No shipping address available.</div>
      )}



        </>

        )}
         
       
         <Modal isOpen={showModal} onRequestClose={closeModal} className="formModal">
          <div className="addressContainer">
          <div className="header flex justify-between">
          <h2>Add New Address</h2>
          <button onClick={closeModal} className="closeButton">Close</button>
        </div>
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
          </div>
               
                
            </Modal>
        
        
        </div>



        {recordsFound > 0 && !loading && (
                      <div className="navContainer mt-4 mb-10 w-full">
                          <Pagination
                              onPageChange={handlePageChange}
                              totalCount={recordsFound}
                              siblingCount={1}
                              currentPage={currentPage}
                              pageSize={pageSize}
                              className="pagination-bar"
                          />
            
                      </div>
                  )}
        </div>

         
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    <Footer />
  </div>
  );
};

export default AddressBook;
