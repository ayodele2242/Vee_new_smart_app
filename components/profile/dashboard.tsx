"use client"

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { useRouter } from "next/navigation";
import Footer from '../Home/Footer/Footer';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import SideBar from '../SideBar';
import Link from 'next/link';
import { ApiRequestService } from '@/services/apiRequest.service';
import SettingsIcon from '@mui/icons-material/Settings';
import CollectionsIcon from '@mui/icons-material/Collections';
import CloseIcon from '@mui/icons-material/Close';
import UploadImageComponent from './UploadImageComponent';
import {Spinner} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service";

import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import UpdatePassword from './password-update';
import useAutoLogout from "@/hooks/useAutoLogout";

interface ResponseDataItem {
  status: string;
  message: string;
  data: any;
  totalRecords: any;
}


const Dashboard: React.FC = () => {
  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("")
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userData = getUserData()

  const expirePeriod =
  typeof window !== "undefined" ? localStorage.getItem("expire_period") : null;
  const expireTime = expirePeriod ? parseInt(expirePeriod, 10) : 0;
    // Pass the expiration time to the useAutoLogout hook
    const isLoggedIn = useAutoLogout(expireTime);
    // Handle the user's authentication state based on the isLoggedIn value
    if (!isLoggedIn) {
      redirectToLoginPage();
    }

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [fName, setFName] = useState(
    formSubmitted ? "" : userData && userData.first_name ? userData.first_name : ""
  );
  const [lName, setLName] = useState(
    formSubmitted ? "" : userData && userData.last_name ? userData.last_name : ""
  );
  const [phone, setPhone] = useState(
    formSubmitted ? "" : userData && userData.phone ? userData.phone : ""
  );


  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    phone: "",
    selectedCountry: "",
})
  



 
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


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

   
  
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  
    if (name === "first_name") {
      setFName(value);
    } else if (name === "last_name") {
      setLName(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "selectedCountry") {
      setSelectedCountry(value);
    }
  };
  



const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    setIsLoading(true);
    setFormSubmitted(true);

    try {
        // Send a POST request to your backend with the login data
        const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "auth/update_profile");
        if (response.status === 200) {
            const responseData = response.data;
            
            setIsLoading(false);
            if (responseData.status === "error") {
                toast.error("Error occurred: " + responseData.message)
            } else if (responseData.status === true) {
                toast.success("Profile Update successful")
               
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


  const uploadProfile = () => {
    setIsUploadOpen(!isUploadOpen);
  };

  const updatePassword = () => {
    setIsPasswordOpen(!isPasswordOpen);
  }

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
        <div className="mb-0 mt-1 flex w-full bg-white lg:pl-9 lg:pr-5 lg:pt-5 row-layout sm:p-4">
            <Link href="/" className="font-bold text-lg text-yellow-600  md:text-sm">Home</Link> 
            <KeyboardArrowRightOutlinedIcon  />
            <Link href="#" className="font-bold text-lg md:text-sm">Account</Link> 
            <KeyboardArrowRightOutlinedIcon />
            <Link href="#" className="font-bold text-lg md:text-sm">Profile Settings </Link> 
        </div>
        <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
          <div className="flex lg:gap-6 w-full main-body">
            <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
              <SideBar />
            </div>


            <div className="content-div lg:w-3/4  bg-gray-100 rounded-lg lg:m-5 sm:p-3">
            <div className="font-bold mb-5 mt-5"><span><SettingsIcon fontSize="medium"/></span> Profile Settings </div>

            <div className="flex column-layout w-full rounded-lg lg:p-6 sm:pb-3 bg-white relative detail-body">
             
                <div className="w-full font-semibold text-lg mb-3 ">
                    Personal Information
                </div>
                <div className="w-full font-semibold text-base column-layout mb-3">
                   <div className="mb-2 text-gray-400 cursor-pointer" onClick={uploadProfile}>Upload Profile Pictures <span><CollectionsIcon /></span></div>
                </div>
                <div className="w-full">
                    <form onSubmit={handleSubmit}>
                           <div className="flex form-group ">
                            <label className="mr-3">Last Name</label>
                            <input
                              type="text"
                              name="last_name"
                              id="last_name"
                              value={lName}
										          onChange={handleChange}
                              className="inputs bg-gray-100"
                              readOnly
                              />
                           </div>
                           <div className="flex form-group ">
                            <label className="mr-3">First Name</label>
                            <input
                              type="text"
                              name="first_name"
                              id="first_name"
                              value={fName}
									           	onChange={handleChange}
                              className="inputs bg-gray-100"
                              readOnly
                              />
                           </div>
                           <div className="flex form-group">
                            <label className="mr-3">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={phone}
										           onChange={handleChange}
                                className="inputs bg-gray-100"
                                readOnly
                                />
                           </div>
                           <div className="flex form-group">
                            <label className="mr-3">Country / Region</label>
                             <select
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    className="bg-gray-100"
                                    
                                >
                                    
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

                           {/*<button
									type="submit"
									className="sm:w-[100%] lg:w-[200px] text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none 
                                    focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                    dark:bg-yellow-600 dark:hover-bg-yellow-700 dark:focus:ring-primary-800 primary-btn flex center justify-center gap-4"
                                    disabled={isLoading}
                                >
									{isLoading && <Spinner size="sm" />}
							        {isLoading ? 'Please wait...' : 'Update'}
								</button>*/}

                    </form>
                </div>

                <div className="w-full font-semibold text-lg mb-3 mt-8">
                    Security
                </div>

                <div className="w-full font-semibold text-base column-layout">
                   <div className="mb-2 text-gray-400 cursor-pointer" onClick={updatePassword}>Change Password <span></span></div>
                </div>







                {isUploadOpen && (
                    <div className="profile-container">
                        <div className="w-full justify-between flex pl-3 pr-3">
                                <span className="font-semibold text-lg mb-3">Upload Profile Picture</span>
                                <button className="text-red-400 font-bold close-btn" onClick={uploadProfile}><CloseIcon /> Close</button>
                        </div>
                        <div className="profile-body column-display">
                                <UploadImageComponent />
                        </div>
                    </div>
                )}

                {isPasswordOpen && (
                    <div className="profile-container">
                        <div className="w-full justify-between flex pl-3 pr-3">
                                <span className="font-semibold text-lg mb-3">Change Password</span>
                                <button className="text-red-400 font-bold close-btn" onClick={updatePassword}><CloseIcon /> Close</button>
                        </div>
                        <div className="profile-body column-display">
                                <UpdatePassword />
                        </div>
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

export default Dashboard;
