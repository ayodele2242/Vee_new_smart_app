"use client"

import React, { useEffect, useState } from 'react';
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
import AllProductList from './all'

interface ResponseDataItem {
  status: string;
  message: string;
  data: any;
}


const Orders: React.FC = () => {
  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeButton, setActiveButton] = useState<number>(1);
  const [backendResponse, setBackendResponse] = useState(null)
	const [backendMsg, setBackendMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const handleButtonClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber);
  };

  


  useEffect(() => {
    setBgHeroLeftSrc(bgHeroLeft.src);
    fetchData();
  }, [currentPage, searchQuery]); // Fetch data when currentPage or searchQuery changes

  const fetchData = async () => {
    try {
      let url = '';
      let payload = {}; // Initialize the payload
       let userJson = localStorage.getItem("user")
				if (!userJson) return
				let user = JSON.parse(userJson)
  
      if (activeButton === 1) {
    
        setLoading(true);
        url = "orders/orders";
        payload = {
          action: "fetch_order",
          email: user.email
        }
      } else if (activeButton === 2) {
        url = 'http://your-backend-url/processing_orders.php';
        payload = { /* Payload for processing orders endpoint */ };
      } else if (activeButton === 3) {
        url = 'http://your-backend-url/completed_orders.php';
        payload = { /* Payload for completed orders endpoint */ };
      }
  
      const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), url);
      const responseData = response.data;

      if (response.status === 200) {
        const { status, message, data } = responseData;
        setOrders(responseData.data);
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
  

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
        <div className="mb-0 mt-1 flex w-full bg-white pl-9 pr-5 pt-5 row-layout">
            <Link href="/" className="font-bold text-lg text-yellow-600  md:text-sm">Home</Link> 
            <KeyboardArrowRightOutlinedIcon  />
            <Link href="#" className="font-bold text-lg md:text-sm">Account</Link> 
            <KeyboardArrowRightOutlinedIcon />
            <Link href="#" className="font-bold text-lg md:text-sm">My Orders</Link> 
        </div>
        <div className="w-full flex p-6 bg-white pl-5 pr-5">
          <div className="flex gap-6 w-full">
            <div className="sidebar-div lg:w-1/4 hidden sm:flex bg-gray-100 rounded-lg m-5">
              <SideBar />
            </div>


            <div className="content-div lg:w-3/4 sm:w-full bg-gray-100 rounded-xlg m-5">

            <div className="flex column-layout w-full">

            <div className="btn-list w-full">
            <button className={activeButton === 1 ? 'font-bold' : ''} onClick={() => handleButtonClick(1)}>All</button>
            <button className={activeButton === 2 ? 'font-bold' : ''} onClick={() => handleButtonClick(2)}>Processing</button>
            <button className={activeButton === 3 ? 'font-bold' : ''} onClick={() => handleButtonClick(3)}>Completed</button>
            </div>
            
          <div className="w-full p-6">
            {activeButton === 1 && 
            <div>

           {loading && <ProductsAnime  numberOfItems={5} />}
            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}
              
            {!loading && !error && (
              <>
                {Object.keys(orders).map((groupOrderNumber) => {
                  const orderDate = new Date(orders[groupOrderNumber].order_date);
                  const formattedOrderDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(orderDate)} ${orderDate.getDate()}, ${orderDate.getFullYear()}`;
                  return (
                    
                    <div key={groupOrderNumber}>
                      <div className="bg-white w-full flex column-display p-1 rounded-full pl-3">
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order Date:</span><span className="font-semibold txt-smaller">{formattedOrderDate}</span></div>
                    <div className="w-full"><span className="font-semibold txt-smaller mr-2">Order ID:</span><span className="font-semibold txt-smaller">{groupOrderNumber}</span></div>  
                    </div>
                    <AllProductList products={orders[groupOrderNumber].orders} />
                      
                    </div>
                  );
                })}
                </>
                )}

              
              </div>}
            {activeButton === 2 && <div>Content for Button 2</div>}
            {activeButton === 3 && <div>Content for Button 3</div>}
          </div>




          </div>









              {/* Render orders data */}
              {/* Implement your logic to render orders data */}
              {/* Example: orders.map(order => <OrderItem key={order.id} order={order} />) */}

              {/* Pagination */}
             {/* <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />*/}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
