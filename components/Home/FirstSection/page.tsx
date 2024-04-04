"use client"

import React, { useState, useEffect, useRef } from "react";
import QuickNote from '../QuickNote';
import Image from "next/image";
import icon from "@/public/images/icon_5.png";
import bg7 from "@/public/images/bgs7.png";
import bg1 from "@/public/images/bg1.png";
import bgs6 from "@/public/images/bgs6.png";
import bg2 from "@/public/images/bg2.jpeg";
import bgs5 from "@/public/images/bgs5.png";
import homeImg from "@/public/images/bgHome9-removebg-preview.png";
import bg_3 from "@/public/images/bg_3.png";
import useRouting from "@/hooks/routing";
import { menusConfig } from '@/data/menus';
import { fetchFrontPageProducts } from "@/services/product.service";
import { Spinner } from "@nextui-org/react";
import { VeeProductType } from '@/types/types';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import CartQuantityActionBtns from "@/components/cart/cart-quantity-btn";
import Link from 'next/link';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiRequestService } from '@/services/apiRequest.service';

interface ProductListingProps {
    searchTerm: any;
}

interface ProductGridProps {
    products: VeeProductType[]; 
    sortOption: any;
  }
  
  interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
  }
  

const FirstSection: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [trackLoading, setTrackLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [recordsFound, setRecordsFound] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [processingItemId, setProcessingItemId] = useState<string | null>(null);
    const itemPerPage = 15;
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendMsg, setBackendMsg] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [iStatus, setIStatus] = useState(false);
    const [ingramId, setIngramId] = useState<string | null>(null);
    const [backendResponse, setBackendResponse] = useState(null);
    const { setParam } = useRouting()
	const goToProduct = (path: string) => {
		setParam(path, "products", "search")
	}

    useEffect(() => {
        setLoading(true);
        // Define the payload with category data
const payload = {
    keywords: ["Switches & Hubs", "Routers & Components", "Wireless Networking", "Portable Computers", "Monitors", "Display", "Phone Systems", "Network Cables", "#"]
  };
  
  // Make the API request using Promise.all
  Promise.all([
    fetchFrontPageProducts(JSON.stringify(payload)),
  ])
    .then(([productsData]) => {
      // Handle the response data
      if (productsData && productsData.data) {
        const productsDataToUse = productsData.data;
        setProducts(productsDataToUse);
        setRecordsFound(productsData.recordsFound);

        const totalPages = Math.ceil(productsData.recordsFound / itemPerPage);
        setTotalPages(totalPages);
        setTrackLoading(false);

        // Randomly select an item from productsDataToUse
        //const randomIndex = Math.floor(Math.random() * productsDataToUse.length);
        //setProducts(productsDataToUse[randomIndex]);
      }
    })
    .catch((error) => {
      // Handle errors
      setTrackLoading(false);
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
    })
    .finally(() => setLoading(false));
  

    }, []);

    const handleCheckboxChange = (productId: string) => {
        // Check if the checkbox is checked
        if (!checkedItems[productId]) {
          // Check if the user is logged in
          if (!isUserLoggedIn()) {
               toast.error("Please log in to add item to compare.", {});
            // or redirectToLoginPage(); // Uncomment this line to redirect to the login page
            return;
          }
      
          // Update the checked items state
          setCheckedItems((prev) => ({
            ...prev,
            [productId]: !prev[productId],
          }));
      
          // Send the request to the backend
          sendCheckedItemsToBackend({ [productId]: true });
        }
      };
    
      const sendCheckedItemsToBackend = async (updatedCheckedItems: Record<string, boolean>) => {
    
        try {
          const productKeys = Object.keys(updatedCheckedItems);
          if (productKeys.length > 0) {
            const productId = productKeys[0];
            const formData = {
              action: 'add',
              ingramPartNumber: productId
          };
    
          const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(formData), "compare/compare");
          const responseData = response.data;
    
          if (response.status === 200) {
            const { status, message } = responseData;
            setIsLoading(false);
    
            if (status === false) {
              toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "dark",
                transition: Bounce
              });
             
              setBackendMsg(message);
              setBackendResponse(status);
              
          } else if (status === true) {
            setBackendResponse(status);
            setBackendMsg(message);
            setIsLoading(false);
            toast.success(message);
    
          }
    
    
          }else {
            setIsLoading(false);
              if (response.status === 400) {
                  const { status, message } = responseData;
                  toast.error(message);
                  setBackendResponse(status);
              }
          }
    
        }
          
    
    
        }catch (error) {
          console.error('Error extracting product ID:', error);
        }
    
        
        };
    
          const handleAddToFavorites = (productId: string) => {
            // Check if the user is logged in
            if (!isUserLoggedIn()) {
              toast.error("Please log in to add item to wishlist.", {});
              return;
            }
          
            // Send the request to the backend with the productId
            sendProductToBackend(productId);
          };
    
          const sendProductToBackend = async (productId: string) => {
           
            const formData = {
              action: 'add',
              ingramPartNumber: productId
          };
    
          setProcessingItemId(productId);
    
          try {
            const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(formData), "wishlist/wishlist");
            const responseData = response.data;
    
            if (response.status === 200) {
                const { status, message } = responseData;
                setIsLoading(false);
                setProcessingItemId(null);
                
                if (status === false) {
                    toast.error(message, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                    });
                   
                    setBackendMsg(message);
                    setBackendResponse(status);
                    setIStatus(status);
                    setIngramId(null);
                    
                } else if (status === true) {
                    setBackendResponse(status);
                    setBackendMsg(message);
                    setIsLoading(false);
                    toast.success(message);
                    setIngramId(productId);
                    setIStatus(true);
                    
                   
                }
            } else {
              setProcessingItemId(null);
              setIsLoading(false);
                if (response.status === 400) {
                    const { status, message } = responseData;
                    toast.error(message);
                    setBackendResponse(status);
                    setIStatus(false);
                }
            }
        } catch (error) {
          setProcessingItemId(null);
          setIsLoading(false);
            toast.error("Error adding to favorites");
        }
    
    
        };
          

    
  return (
    <section className="relative w-full pt-0 py-28 flex flex-col items-center justify-center gap-10  bg-white">
			<div className="lg:mt-[100px]"></div>
            <p className=" lg:text-lg text-[#737373] font-[400] ">
				Choose wisely, succeed effortlessly
			</p>
			<h1 className="md:text-3xl text-2xl lg:text-5xl w-full lg:w-[65%] mx-auto text-center font-bold font-secondary text-black">
				Stay ahead of the curve with cutting-edge IT products, power
				your success today
			</h1>
			
            <div className="relative w-full overflow-hidden">
                <div className="itemGroup">
                        <div className="flex items-center space-x-1 flex justify-center pt-1">
                            <Image src={icon} alt="icon" className="w-[20px] lg:w-[30px]" />
                            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-20 relative">
                                {menusConfig.productsLinks.map(({ title, id }) => (
                                    <p
                                        key={id}
                                        className="text-[18px] font-[500] cursor-pointer"
                                        onClick={() => goToProduct(title)}
                                    >
                                        {title}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="btnContainer  flex items-center space-x-1 flex justify-center">
                        <Link href="/products">
                            <QuickNote title={"All Products"} onClick={function (): void { } } />
                        </Link>
                        </div>
                        

                </div>
                {error && <div className="flex justify-center w-full text-center text-danger color-[red] p-4 h-[300px]">Error occured: {error}</div>}
               
                {loading && <div className="loaderSpin"><Spinner /></div>}
                        <div className="w-full">
                       <div className="products-grid">        
                       {!loading && !error && !trackLoading && (
                        products.slice(0, 15).map((product, i) => (
                          <div key={i} className="items bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">{/* Product content */}
                            <div className="relative">
                                  <div className="rounded-lg bg-default-300 main-front-img-body">
                                  {product && product.images_url && product.images_url.length > 0 ? (
                                     
                                     <Image
                                      src={product.images_url[0].url as string}
                                      alt={product.description}
                                      width={200}
                                      height={140}
                                      className="relative"
                                    />
                                    ) : (
                                      <Image
                                      src="/images/logoheader.png"
                                      alt={product.description}
                                      width={130}
                                      height={250}
                                      className="relative"
                                    />
                                    )}
                                  </div>
                                  <div className="favourite">
                                  {!processing &&
                                  <FavoriteIcon 
                                      onClick={() => handleAddToFavorites(product?.ingramPartNumber || '')} 
                                      className={ingramId === product.ingramPartNumber ? 'fake-active-favourite' : (product.wishlist ? 'active-favourite' : '')}
                                      style={{ fill: product.wishlist || ingramId === product.ingramPartNumber ? 'blue' : 'black' }}
                                    />
                                  }
                                  {processingItemId === product?.ingramPartNumber && <Spinner size="sm" className="ml-1"/>}
                  
                                  </div>
                                  
                                  <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs front-box-title">
                                  <div className="mb-0 color-[yellow] font-bold p-2" style={{ wordWrap: 'break-word' }}>
                                            {product.description.length > 68 ? product.description.slice(0, 68) + '...' : product.description}
                                        </div>
                                    </Link>
                                  
                                  
                  
                                  {/*<div className="front-box-description p-2">
                                    {product?.descr}
                                  </div><div className="w-100 itemListMe mt-1">
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
                                  </div>
                  
                                  <div className="w-100 itemListMe">
                                    <div className="iTemRight">
                                      <span className="py-1 px-2 rounded-full bg-green-100 font-bold text-xs text-green-800 ">
                                        Direct Ship
                                      </span>
                                    </div>
                                    <div className="iTemLeft">
                                      <span className="text-red-700 font-bold text-sm">No returns</span>
                                    </div>
                                  </div>*/}
                  
                                 
                             
                            {/* <div className="compare-checkbox w-100 p-2">
                               <input
                                 type="checkbox"
                                 id={product?.ingramPartNumber}
                                 checked={checkedItems[product?.ingramPartNumber] || false}
                                 onChange={() => handleCheckboxChange(product?.ingramPartNumber || '')}
                               />
                               <label htmlFor={product?.ingramPartNumber}>Add to Compare</label>
                             </div>*/}
                            <div className="btn-rpice-list">
                              <div className="">
                                
                                  <div className="">
                                  {product.price_details?.pricing?.customerPrice ? (
                                        <>
                                      <h6 className="text-sm lg:text-sm font-bold">
                                        {new Intl.NumberFormat('en-US', {
                                          style: 'currency',
                                          currency: 'USD'
                                        }).format(product.price_details.pricing.customerPrice)}
                                      </h6>
                                      <p className="msr">MSRP  {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                      }).format(product.price_details.pricing.retailPrice)} </p>
                                      <p className="msr">EXCL TAX</p>
                                      </>
                                    ) : (
                                      <h6 className="text-sm lg:text-sm font-bold">
                                        {new Intl.NumberFormat('en-US', {
                                          style: 'currency',
                                          currency: 'USD'
                                        }).format(0.0)}
                                      </h6>
                                    )}
                                  </div>
                    
                    
                              </div>
                              <div className=''>
                              <CartQuantityActionBtns 
                                        product={product}
                                        id={product.ingramPartNumber}
                                        />
                              </div>
                            </div>
                  
                                </div>
                               
                        </div>
                        ))
                    )}

                      
                        </div>
                        </div>

                        {!loading && !error && !trackLoading && products?.length === 0 && (
                        <div className="text-center mt-5 mb-5 h-200 w-100 ">
                            <p className="text-danger color-[red]">No products found.</p>
                      </div>
                        )}


                {/*<Image
				src={bg2}
				alt="icon"
				className="absolute right-[-50px] top-[-15px] w-[150px] md:w-[100px] lg:w-[280px] hidden lg:block"
			/>
			<Image
				src={bgs6}
				alt="icon"
				className="absolute left-0 top-[-20px] w-[150px] lg:w-[220px] hidden lg:block"
			/>*/}

			</div>
			
			
			<Image
				src={bg1}
				alt="icon"
				className="absolute right-0 top-0 w-[150px] md:w-[100px] lg:w-[280px] sm:hidden lg:block"
			/>
			<Image
				src={bg7}
				alt="icon"
				className="absolute left-0 top-0 w-[150px] lg:w-[350px] sm:hidden lg:block"
			/>
		</section>
  );
};

export default FirstSection;
