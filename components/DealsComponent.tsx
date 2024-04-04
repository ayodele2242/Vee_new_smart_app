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
import useAutoLogout from "@/hooks/useAutoLogout";
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
  

    const DealsComponent: React.FC = () => {
    
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

    const expirePeriod =
    typeof window !== "undefined" ? localStorage.getItem("expire_period") : null;
    const expireTime = expirePeriod ? parseInt(expirePeriod, 10) : 0;
      // Pass the expiration time to the useAutoLogout hook
      const isLoggedIn = useAutoLogout(expireTime);
      // Handle the user's authentication state based on the isLoggedIn value
      if (!isLoggedIn) {
        redirectToLoginPage();
      }


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
          <Link href="#" className="font-bold text-lg md:text-sm">Deals</Link> 
      </div>
      <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
        <div className="flex gap-6 w-full">
          <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
            <SideBar />
          </div>


          <div className="content-div lg:w-3/4  bg-gray-100 rounded-xlg lg:m-5 sm:p-1">

          <div className="flex column-layout w-full sm:pb-3">
           
          
          
        <div className="w-full  relative font-bold h-[100%] text-red-400 flex justify-center p-8">
       
      
         
            No deals available at the moment...
        
        
        </div>



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

export default DealsComponent;
