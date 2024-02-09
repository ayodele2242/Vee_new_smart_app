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

import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import {
	getShippingAddress
} from "@/services/requestAll.service";
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
           
          
        <div className="w-full lg:p-0 relative">
        {loading && <div className="iSpinner pt-9"> <Spinner size="sm" /> </div>}
        {error && !loading &&
        <div className="text-red-500 font-bold pt-9 flex justify-center h-[100%]">{error}</div>
        }

        {!loading && (
          
        <>
        {products.map((product, index) => (
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
                <div className="font-bold w-full">{product.nickname}</div>
                <div className="font-normal w-full txt-small">{product.email}</div>
                <div className="font-normal w-full txt-small">{product.phone}</div>
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
        </>

        )}
         
       
          
        
        
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
