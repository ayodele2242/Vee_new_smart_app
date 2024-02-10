"use client"

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { useRouter } from "next/navigation";
import Footer from './Home/Footer/Footer';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import Link from 'next/link';
import Image from 'next/image';
import { ApiRequestService } from '@/services/apiRequest.service';
import Pagination from "@/pagination/Pagination";
import ProductsAnime from '@/loaders/ProductsAime';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';


import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import { ToastContainer } from 'react-toastify';
import CartQuantityActionBtns from './cart/cart-quantity-btn';

interface ProductComparisonProps {
  products: any[]; // Array of products to compare
}

interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
  }
  

const ProductComparison = () => {
 
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const { push } = useRouter();
    const [activeButton, setActiveButton] = useState<number>(1);
    const [backendResponse, setBackendResponse] = useState(null)
      const [backendMsg, setBackendMsg] = useState<string | null>(null);
    const [orders, setOrders] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
      const [error, setError] = useState<string | null>(null);
      const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Set default page size
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('product_name'); 
    const [totalPages, setTotalPages] = useState(1);
    const [recordsFound, setRecordsFound] = useState(0);
    const [layoutType, setLayoutType] = useState<"grid" | "list">("list"); 
    const [sortOption, setSortOption] = useState("");
  
  
  
    
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
      fetchData('compare/compare', pageNumber);
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
      fetchData('compare/compare', 1);
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
    
  
    const handleLayoutToggle = () => {
      setLayoutType((prevLayoutType) => (prevLayoutType === "list" ? "grid" : "list"));
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
        

        <div className="w-full flex justify-between bg-white pl-10 pr-10 ">
            <b>Favorite Products</b>
        </div>

        {/*<div className="w-full flex justify-between mobile bg-white lg:pl-10 pr-10 mt-9">
            <div className="compare-div  rounded-lg  lg:w-[400px] sm:w-full  flex row-display border border-gray-300 pr-5 pl-5">
                <div className="w-30 h-30 searcIncon"><SearchOutlinedIcon fontSize="small" /></div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-[90%] p-2 searchInput"
                />
                
            </div>

            <div className="listItems mr-8 flex">
               <div className="formWrapper">
                <select
                    id="relevant"
                    name="relevant"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="" className="font-sm">
                      Sort By: Relevance
                    </option>
                    <option value="low-to-high" className="font-sm">
                      Price: Low to High
                    </option>
                    <option value="high-to-low" className="font-sm">
                      Price: High to Low
                    </option>
                  </select>

                </div>
              <ListAltOutlinedIcon sx={{ fontSize: 25 }} onClick={handleLayoutToggle} />
               <GridViewOutlinedIcon sx={{ fontSize: 25 }} onClick={handleLayoutToggle} />
            </div>
        </div>*/}

        <div className="w-full mainLayer  p-9">
        
        {loading && <ProductsAnime  numberOfItems={5} />}

            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}

            {!loading && !error && (

                <>
                {products.map((product, i) => (
                 
                 <div key={i} className="box-item flex justify-center border-2 border-gray-300 rounded-xl p-0 pb-3">
                 <div className="relative">
                       <div className="h-26 rounded-lg bg-default-300">
                         {product.images_url && product?.images_url?.length > 0 ? (
                          
                          <Image
                           src={product.images_url as string}
                           alt={product.description}
                           width={300}
                           height={300}
                           className="relative"
                         />
                         ) : (
                           <Image
                           src="/images/logoheader.png"
                           alt={product.description}
                           width={300}
                           height={300}
                           className="relative"
                         />
                         )}
                       </div>
                       {/*<div className="favourite">
                       <FavoriteBorderOutlinedIcon onClick={() => handleAddToFavorites(product?.ingramPartNumber || '')} fontSize="medium"/>
                       </div>*/}
                       <div className="mb-2 mt-2 text-xs color-[yellow] font-bold p-2">
                       <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs">
                         {product.description}
                         </Link>
                       </div>
                       <div className="p-2 text-small">
                       {product.detail}
                       </div>
       
                       <div className="w-100 itemListMe mt-1">
                         <div className="iTemRight">
                           <span className="uppercase text-xs">
                             <b>VPN: </b> {product.vendorPartNumber}
                           </span>
                         </div>
                         <div className="iTemLeft">
                           <span className="uppercase text-xs">
                             <b>SKU: </b> {product.ingramPartNumber}
                           </span>
                         </div>
                         <div className="iTemLeft">
                           <span className="uppercase text-sm">
                             <b>UPC: </b> {product.upc}
                           </span>
                         </div>
                       </div>
       
                       {/*<div className="w-100 itemListMe">
                         <div className="iTemRight">
                           <span className="py-1 px-2 rounded-full bg-green-100 font-bold text-xs text-green-800 ">
                             Direct Ship
                           </span>
                         </div>
                         <div className="iTemLeft">
                           <span className="text-red-700 font-bold text-sm">No returns</span>
                         </div>
                       </div>*/}
       
                      
                  
                 
                  <div className="w-100 p-2">
                    
                      <div className="">
                         <h6 className="text-1xl lg:text-2xl font-bold ">
                           
                         {new Intl.NumberFormat('en-US', {
                                       style: 'currency',
                                       currency: 'USD'
                                   }).format(product?.customerPrice)}
                        </h6>
                      </div>
       
       
                  </div>
               <div className='p-2 w-100'>
               <CartQuantityActionBtns 
                         product={product}
                         id={product.ingramPartNumber}
                         />
               </div>
       
                     </div>
                    
             </div>


                ))}
                
                </>

              
            )}

            {!loading && !error && (!products || products.length === 0) && (
            <div className="text-center mt-5 mb-5 h-200 w-100 ">
                <p className="text-danger color-[red]">No products found in compare.</p>
            </div>
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
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default ProductComparison;
