import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Logo } from '@/components/icons';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { VeeProductType } from '@/types/types';
import { ApiRequestService } from '@/services/apiRequest.service';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Spinner} from "@nextui-org/react";
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ResponseDataItem {
  status: string;
  message: string;
  data: any;
}


interface ProductListProps {
  products: VeeProductType[];
}

const AllProductList: React.FC<ProductListProps> = ({ products }) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendResponse, setBackendResponse] = useState(null)
    const [backendMsg, setBackendMsg] = useState<string | null>(null);
      const [message, setMessage] = useState<string>("");
      const [iStatus, setIStatus] = useState(false);
      const [processing, setProcessing] = useState(false);
      const [processingItemId, setProcessingItemId] = useState<string | null>(null);
      const [ingramId, setIngramId] = useState<string | null>(null);


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
    {products.map((item, index) => (
      <div className="px-2 mb-5" key={index}>
      <div className="flex -mx-2">
        <div className="w-1/5 px-2">
          <div className="relative">
          
            <div className="h-26 rounded-lg bg-default-300 mt-3">
              {item.images_url && item?.images_url?.length > 0 ? (
                 <Image
                 src={item?.images_url}
                 alt={item?.description}
                 width={300}
                 height={300}
                 className="relative"
               />
              ) : (
                <Image
                src="/images/logoheader.png"
                alt={item.description}
                width={300}
                height={300}
                className="relative"
              />
              )}
            </div>
            <div className="favourite">
              {!processing &&
            <FavoriteIcon 
                onClick={() => handleAddToFavorites(item?.ingramPartNumber || '')} 
                className={ingramId === item.ingramPartNumber ? 'fake-active-favourite' : (item.wishlist ? 'active-favourite' : '')}
                style={{ fill: item.wishlist || ingramId === item.ingramPartNumber ? 'blue' : 'black' }}
              />
            }
            {processingItemId === item.ingramPartNumber && <Spinner size="sm" className="ml-1"/>}
            </div>
          </div>
        </div>

        <div className="w-1/2 px-2">
          {item.price_details?.pricing?.retailPrice != null && (
            <span className="inline-block text-xs px-1.5 py-1 rounded-full border border-gray-700 mb-1">
              Special Price
            </span>
          )}
          <div className="">
            <div className="mb-2 text-xs">
              <Link href={`/productdetail?id=${item.ingramPartNumber}`} className="text-xs font-bold">
              {item.description}
              </Link>
              <p><small>{item.descr}</small></p>
            </div>

            

            <div className="w-100 itemListMe mt-1">
              <div className="iTemRight">
                <span className="uppercase text-sm">
                  <b>VPN: </b> {item.vendorPartNumber}
                </span>
              </div>
              <div className="iTemLeft">
                <span className="uppercase text-sm">
                  <b>SKU: </b> {item.ingramPartNumber}
                </span>
              </div>
              <div className="iTemLeft">
                <span className="uppercase text-sm">
                  <b>UPC: </b> {item?.upc}
                </span>
              </div>
            </div>

            <div className="w-100 itemListMe mt-1">
              <div className="iTemRight">
                <span className="uppercase text-sm">
                  <b>Qty: </b> {item?.quantity}
                </span>
              </div>

              <div className="iTemRight">
                <span className="uppercase text-sm">
                  <b>Price: </b> {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                      }).format(Number(item?.product_price))}
                </span>
              </div>
            </div>

           
          </div>
        </div>

        <div className="w-1/3 px-2">
       
          {/*<div className="compare-checkbox">
          <input
              type="checkbox"
              id={item?.ingramPartNumber}
              checked={item.compare || false}
              onChange={() => handleCheckboxChange(item?.ingramPartNumber || '')}
              
            />
            <label htmlFor={item?.ingramPartNumber}>Add to Compare</label>
          </div>*/}
          <div className="">
            <div className="h-24">
              <div className="">
                 <h6 className="text-1xl lg:text-xl font-bold ">
                   
                 {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(Number(item?.product_price) * (item?.quantity))}
                   
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

              {/*<CartQuantityActionBtns 
              product={item}
              id={item.ingramPartNumber}
              />*/}
              


            
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ))}
    
  </div>

  
    
  );
};

export default AllProductList;
