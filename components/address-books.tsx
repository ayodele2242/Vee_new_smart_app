"use client"



import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Navbar } from "@/components/navbar";
import Footer from './Home/Footer/Footer';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import SideBar from './SideBar';
import { ApiRequestService } from '@/services/apiRequest.service';
import Pagination from "@/pagination/Pagination";
import ProductsAnime from '@/loaders/ProductsAime';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import {
	getShippingAddress
} from "@/services/requestAll.service";

import { ToastContainer } from 'react-toastify';
import Link from 'next/link';

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
            action: "get",
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
          console.error('Error fetching orders:', error);
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
            setError("No response from the server. Please try again later.");
          } else {
            setError("An unexpected error occurred. Please try again later.");
          }
        }
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
          <Link href="#" className="font-bold text-lg md:text-sm">My Orders</Link> 
      </div>
      <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
        <div className="flex gap-6 w-full">
          <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
            <SideBar />
          </div>


          <div className="content-div lg:w-3/4  bg-gray-100 rounded-xlg lg:m-5 sm:p-3">

          <div className="flex column-layout w-full sm:pb-3">
           
         

          <div className="w-full mt-2 lg:p-6 sm:p-3">
            
           
          </div>
          
        <div className="w-full lg:p-6">
         
       
           <h2>Development In Progress</h2>

        
        
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
