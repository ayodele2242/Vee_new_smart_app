import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Logo } from '@/components/icons';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { VeeProductType } from '@/types/types';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiRequestService } from '@/services/apiRequest.service';
import { Spinner } from '@nextui-org/react';
import FavoriteIcon from '@mui/icons-material/Favorite';


interface ProductListProps {
  products: VeeProductType[];
  sortOption: any
}

interface ResponseDataItem {
  status: string;
  message: string;
  data: any;
}

const ProductList: React.FC<ProductListProps> = ({ products, sortOption }) => {

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const isLoggedIn = isUserLoggedIn();
    const [isLoading, setIsLoading] = useState(false);

    const [backendResponse, setBackendResponse] = useState(null)
    const [backendMsg, setBackendMsg] = useState<string | null>(null);
      const [message, setMessage] = useState<string>("");
      const [iStatus, setIStatus] = useState(false);
      const [processing, setProcessing] = useState(false);
      const [processingItemId, setProcessingItemId] = useState<string | null>(null);
      const [ingramId, setIngramId] = useState<string | null>(null);


    // Sorting logic based on the selected option
  const sortedProducts = [...products];
  if (sortOption === "low-to-high") {
    sortedProducts.sort((a, b) => a.price_details.pricing.customerPrice - b.price_details.pricing.customerPrice);
  } else if (sortOption === "high-to-low") {
    sortedProducts.sort((a, b) => b.price_details.pricing.customerPrice - a.price_details.pricing.customerPrice);
  }
 

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
    
    <div className="productList pt-4">
      {sortedProducts.map((product, index) => (
        <div className="px-2 mb-5" key={index}>
          <div className="flex -mx-2">
            <div className="w-1/5 px-2">
              <div className="relative">
                <div className="h-26 rounded-lg bg-default-300 mt-3">
                  {product.images_url && product.images_url.length > 0 ? (
                     <Image
                     src={product.images_url[0].url as string}
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
              </div>
            </div>

            <div className="w-1/2 px-2">
              {product.price_details?.pricing?.retailPrice != null && (
                <span className="inline-block text-xs px-1.5 py-1 rounded-full border border-gray-700 mb-1">
                  Special Price
                </span>
              )}
              <div className="">
                <div className="mb-2 text-xs font-bold">
                  <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs">
                  {product.description}
                  </Link>
                 
                  </div>

                <div className="text-sm font-semibold">
                  {product.category} - {product.subCategory} - {product.productType} - {product.vendorName}
                </div>

                <div className="w-100 itemListMe mt-1">
                  <div className="iTemRight">
                    <span className="uppercase text-sm">
                      <b>VPN: </b> {product.vendorPartNumber}
                    </span>
                  </div>
                  <div className="iTemLeft">
                    <span className="uppercase text-sm">
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
                </div>
              </div>
            </div>

            <div className="w-1/3 px-2">
           
              <div className="compare-checkbox">
              <input
                  type="checkbox"
                  id={product?.ingramPartNumber}
                  checked={checkedItems[product?.ingramPartNumber] || false}
                  onChange={() => handleCheckboxChange(product?.ingramPartNumber || '')}
                  
                />
                <label htmlFor={product?.ingramPartNumber}>Add to Compare</label>
              </div>
              <div className="">
                <div className="h-24">
                  <div className="">
                     <h6 className="text-1xl lg:text-2xl font-bold ">
                       
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(product?.price_details?.pricing?.customerPrice)}
                    </h6>
                  </div>


                  {/*<div className="w-100 itemListMe mt-1">
                    <div className="iTemRight">
                      <div className="h-5 rounded-lg bg-default-300"></div>
                    </div>
                    <div className="iTemLeft">
                      <div className="h-5 rounded-lg bg-default-300"></div>
                    </div>
                  </div>*/}

                  <div className="itemListMe">

                  <CartQuantityActionBtns 
                  product={product}
                  id={product.ingramPartNumber}
                  />
                  


                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>

    
  );
};

export default ProductList;
