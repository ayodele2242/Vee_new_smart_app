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
import Pagination from "@/pagination/Pagination";
import ProductsAnime from '@/loaders/ProductsAime';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AllProductList from './all';
import ProcessingList from './processing';
import CompletedList from './completerd';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import { ToastContainer } from 'react-toastify';

interface ResponseDataItem {
  status: string;
  message: string;
  data: any;
  totalRecords: any;
}


const Orders: React.FC = () => {
  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const { push } = useRouter();
  const [activeButton, setActiveButton] = useState<number>(1);
  const [backendResponse, setBackendResponse] = useState(null)
	const [backendMsg, setBackendMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<{ [key: string]: any }>({});
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

    let url = '';
    if (activeButton === 1) {
      url = "orders/orders";
    } else if (activeButton === 2) {
      url = "orders/processing_orders";
    } else if (activeButton === 3) {
      url = "orders/completed_orders";
    }

    // Call fetchData with the updated URL
    fetchData(url);
  };



  const handleButtonClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber);

    let url = '';
    if (buttonNumber === 1) {
      url = "orders/orders";
      setCurrentPage(1);
    } else if (buttonNumber === 2) {
      url = "orders/processing_orders";
      setCurrentPage(1);
    } else if (buttonNumber === 3) {
      url = "orders/completed_orders";
      setCurrentPage(1);
    }

    // Call fetchData with the updated URL
    fetchData(url);
  };


 

  const handleSearchInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchType(event.target.value);
  };

  const handleCopyOrderNumber = (groupOrderNumber: string) => {
    navigator.clipboard.writeText(groupOrderNumber);
    
    // Optionally, provide feedback to the user that the text has been copied
    console.log("Order number copied:", groupOrderNumber);
  };


  useEffect(() => {

    let url = '';
    if (activeButton === 1) {
      url = "orders/orders";
    } else if (activeButton === 2) {
      url = "orders/processing_orders";
    } else if (activeButton === 3) {
      url = "orders/completed_orders";
    }

    // Call fetchData with the updated URL
    fetchData(url);
  }, [searchQuery, searchType]);

  const fetchData = async (url: string) => {
    try {
      
      let payload = {};
      let userJson = localStorage.getItem("user");
      if (!userJson) return;
      let user = JSON.parse(userJson);
  
      setLoading(true); // Set loading to true by default
  
      payload = {
        action: "fetch_order",
        email: user.email,
        pageNo: currentPage,
        limit: pageSize,
        search_query: searchQuery,
        search_type: searchType,
      };
  
      const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), url);
      const responseData = response.data;
  
    
      if (response.status === 200) {
        const { status, message, data } = responseData;
        setOrders(responseData.data);
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
             
            <div className="btn-list w-full">
            <button className={activeButton === 1 ? 'font-bold' : ''} onClick={() => handleButtonClick(1)}>All</button>
            <button className={activeButton === 2 ? 'font-bold' : ''} onClick={() => handleButtonClick(2)}>Processing</button>
            <button className={activeButton === 3 ? 'font-bold' : ''} onClick={() => handleButtonClick(3)}>Completed</button>
            </div>

            <div className="w-full mt-2 lg:p-6 sm:p-3">
              <div className="input-div  rounded-lg bg-grey-600 lg:w-[300px]   flex row-display ">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-[90%] p-2"
              />
              <div className="searchIcon"><SearchOutlinedIcon /></div>
              </div>
             
            </div>
            
          <div className="w-full lg:p-6">
            {activeButton === 1 && 
            <div>

           {loading && <div className="w-full"><ProductsAnime  numberOfItems={5} /></div>}
            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}
              
            {!loading && !error && (
              <>
                {orders && Object.keys(orders).map((groupOrderNumber) => {
                  const orderDate = new Date(orders[groupOrderNumber].order_date);
                  const formattedOrderDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate)} ${orderDate.getDate()}, ${orderDate.getFullYear()}`;
                  return (
                    
                    <div key={groupOrderNumber} className="lg:p-5 bg-white mb-4">
                      <div className="bg-white w-full flex column-display p-1 rounded-full pl-3">
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order Date:</span><span className="font-semibold txt-smaller">{formattedOrderDate}</span></div>
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order ID:</span><span className="font-semibold txt-smaller">{groupOrderNumber}</span> <button className="text-blue-400 ml-3 text-sm font-semibold" onClick={() => handleCopyOrderNumber(groupOrderNumber)}>Copy</button></div>  
                    </div>
                    <AllProductList products={orders[groupOrderNumber].orders} />
                      
                    </div>
                  );
                })}

                 {Object.keys(orders).length === 0 && 
                 <div className="error-order w-full lg:column-display sm:row-display p-8 text-red-400">

                  No orders to display
                  
                  </div>}
                </>
                )}

              
              </div>}


            {activeButton === 2 && 
            <div>
              
              
           {loading && <ProductsAnime  numberOfItems={5} />}
            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}
              
            {!loading && !error && (
              <>
                {orders && Object.keys(orders).map((groupOrderNumber) => {
                  const orderDate = new Date(orders[groupOrderNumber].order_date);
                  const formattedOrderDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate)} ${orderDate.getDate()}, ${orderDate.getFullYear()}`;
                  return (
                    
                    <div key={groupOrderNumber} className="p-5 bg-white mb-4">
                      <div className="bg-white w-full flex column-display p-1 rounded-full pl-3">
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order Date:</span><span className="font-semibold txt-smaller">{formattedOrderDate}</span></div>
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order ID:</span><span className="font-semibold txt-smaller">{groupOrderNumber}</span> <button className="text-blue-400 ml-3 text-sm font-semibold" onClick={() => handleCopyOrderNumber(groupOrderNumber)}>Copy</button></div>  
                    </div>
                    <ProcessingList products={orders[groupOrderNumber].orders} />
                      
                    </div>
                  );
                })}

                 {Object.keys(orders).length === 0 && 
                 <div className="error-order w-full lg:column-display sm:row-display p-8 text-red-400">

                  No orders to display
                  
                  </div>}
                </>
                )}

              
              
              </div>}
            {activeButton === 3 && 
            
              <div>
                 {loading && <ProductsAnime  numberOfItems={5} />}
            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}
              
            {!loading && !error && (
              <>
                {orders && Object.keys(orders).map((groupOrderNumber) => {
                  const orderDate = new Date(orders[groupOrderNumber].order_date);
                  const formattedOrderDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate)} ${orderDate.getDate()}, ${orderDate.getFullYear()}`;
                  return (
                    
                    <div key={groupOrderNumber} className="p-5 bg-white mb-4">
                      <div className="bg-white w-full flex column-display p-1 rounded-full pl-3">
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order Date:</span><span className="font-semibold txt-smaller">{formattedOrderDate}</span></div>
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order ID:</span><span className="font-semibold txt-smaller">{groupOrderNumber}</span> <button className="text-blue-400 ml-3 text-sm font-semibold" onClick={() => handleCopyOrderNumber(groupOrderNumber)}>Copy</button></div>  
                    </div>
                    <CompletedList products={orders[groupOrderNumber].orders} />
                      
                    </div>
                  );
                })}

                 {Object.keys(orders).length === 0 && 
                 <div className="error-order w-full lg:column-display sm:row-display p-8 text-red-400">

                  No completed order(s) fulfilled
                  
                  </div>}
                </>
                )}

              </div>
              
              }
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

export default Orders;
