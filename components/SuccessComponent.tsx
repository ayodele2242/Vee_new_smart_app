"use client"

import React, { useEffect, useRef, useState } from 'react';
import useCartStore from '@/store/cart';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import {Spinner} from "@nextui-org/react";
import { LocalStorageService } from '@/services/localStorage';
import { ApiRequestService } from '@/services/apiRequest.service';
import { VeeCheckoutFormData } from '@/types/types';
import { CheckIcon } from 'lucide-react';
import numeral from "numeral"; 
import SingleLoader from '@/loaders/singleLoader';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isUserLoggedIn } from '@/auth/auth';


interface Props {
  sessionId: string | null;
}
interface ResponseDataItem {
    status: string;
    message: string;
}

export const SuccessComponent: React.FC<Props> = ({ sessionId }) => {

    const isMounted = useRef(true);
	const [status, setStatus] = useState(null);
	const [customerEmail, setCustomerEmail] = useState('');
	const [backendResponse, setBackendResponse] = useState(null); 
	const [backendMsg, setBackendMsg] = useState<string | null>(null);
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<VeeCartItem[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [processingPayment, setProcessingPayment] = useState(true); 
    const { cartItems, clearCart } = useCartStore();
	
	const isLoggedIn = isUserLoggedIn();

    useEffect(() => {
       
        setLoading(false);
    }, []);

	if (loading) {
		
	  }

      const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

	
    
	useEffect(() => {
		setBgHeroLeftSrc(bgHeroLeft.src);

		if (isMounted.current) {
		  isMounted.current = false;
	
		  fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
			method: 'GET',
		  })
			.then((res) => res.json())
			.then(async (data) => {
			  setStatus(data.status);
			  setCustomerEmail(data.customer_email);
	
			  if (data.status === 'complete') {

				const overallSum = cartItems.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				  );
			
				const commentValue = localStorage.getItem('comment');
				const localStorageService = new LocalStorageService('checkoutFormData');
				// Define the key you want to retrieve data for
				const keyToRetrieve = 'formData';
				// Retrieve the data associated with the key
				const retrievedData = localStorageService.getData<any>(keyToRetrieve);

				if(!isLoggedIn){

				const formData = JSON.stringify({
				  session_id: sessionId,
				  address_details: retrievedData,
				  checkOutEmail: data.customer_email,
				  user_id: '',
				  payment_type: "card",
				  note: commentValue,
				  items: cartItems,
				  totalPrice: numeral(overallSum).format('0,0.00')
				});
	


				try {
					const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "checkout/quick_checkout");
					const responseData = response.data;
			
					if (response.status === 200) {
						const { status, message } = responseData;
						if (status === "error") {
							toast.error(message);
							setBackendMsg(message);
							setBackendResponse(status);
						} else if (status === "success") {
							setBackendResponse(status);
							setBackendMsg(message);
							clearCart();
							toast.success(message);
							
							//push("/account/my_orders");
						}
					} else {
						if (response.status === 400) {
							const { status, message } = responseData;
							toast.error(message);
							setBackendResponse(status);
						}
					}
				} catch (error) {
					toast.error("An error occurred while finalizing orders details.");
				}
			}else{

				const formData = JSON.stringify({
					session_id: sessionId,
					email: retrievedData.email,
					checkOutEmail: data.customer_email,
					user_id: '',
					payment_type: "card",
					note: commentValue,
					items: cartItems,
					totalPrice: numeral(overallSum).format('0,0.00')
				  });
	  
  
  
				  try {
					  const response = await ApiRequestService.callAPI<ResponseDataItem>(formData, "checkout/checkout");
					  const responseData = response.data;
			  
					  if (response.status === 200) {
						  const { status, message } = responseData;
						  if (status === "error") {
							  toast.error(message);
							  setBackendMsg(message);
							  setBackendResponse(status);
						  } else if (status === "success") {
							  setBackendResponse(status);
							  setBackendMsg(message);
			  
							  toast.success(message);
							  //push("/account/my_orders");
						  }
					  } else {
						  if (response.status === 400) {
							  const { status, message } = responseData;
							  toast.error(message);
							  setBackendResponse(status);
						  }
					  }
				  } catch (error) {
					  toast.error("An error occurred while finalizing orders details.");
				  }

			}





			  }
			});
		}
	
		return () => {
		  isMounted.current = false;
		};
	  }, [sessionId, cartItems, clearCart, isLoggedIn]);


  return (
    <div className="w-full" style={{
        backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
        backgroundPosition: 'right bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed'
    }}>
        <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
        <div className="w-full cartAll lg:h-[300px] h-100 bg-[#ffffff] p-10 gap-4 flex justify-center center">
        <div className="flex items-center w-full flex justify-center">
                            <div>
                                <div className="relative w-[150px] sm:w-[200px] h-[5px] sm:h-2 rounded-l-full bg-green-300 text-green-300">
                                    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40px] sm:w-[50px] p-1 sm:p-2 aspect-square bg-green-300 rounded-full">
                                        <span className="flex justify-center items-center w-full aspect-square bg-white rounded-full">
                                            <CheckIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-center mt-8 text-green-300">
                                        Processing Payment
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className={`relative w-[150px] sm:w-[200px] h-[5px] sm:h-2 rounded-r-full ${status === 'complete' ? 'text-green-300 bg-green-300' : 'text-grey-100 bg-gray-100'}`}>
                                    <div className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40px] sm:w-[50px] p-1 sm:p-2 aspect-square  rounded-full ${status === 'complete' ? 'text-green-300 bg-green-300' : 'text-grey-100 bg-gray-50'}`}>
                                        <span className="flex justify-center items-center w-full aspect-square bg-white rounded-full">
                                            <CheckIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                <p className={`text-center mt-8 ${status === 'complete' ? 'text-green-300' : 'text-grey-100'}`}>
                                        
                                        {status === 'complete' ? 'Payment Confirmed' : 'Confirming Payment'}
                                        
                                    </p>
                                </div>
                            </div>
                            <div>
                            <div className={`relative w-[150px] sm:w-[200px] h-[5px] sm:h-2 rounded-r-full ${backendResponse === 'success' ? 'text-green-300 bg-green-300' : 'text-grey-100 bg-gray-100'}`}>
                                    <div className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[40px] sm:w-[50px] p-1 sm:p-2 aspect-square  rounded-full ${backendResponse === 'success' ? 'text-green-300 bg-green-300' : 'text-grey-100 bg-gray-50'}`}>
                                            <span className="flex justify-center items-center w-full aspect-square bg-white text-grey-300 rounded-full">
                                            <CheckIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                <p className={`text-center mt-8 ${backendResponse === 'success' ? 'text-green-300' : 'text-grey-100'}`}>
                                 {status === 'complete' 
                                 && backendResponse === 'success' ? 'Done' : 
                                 (status === 'complete' 
                                 && backendResponse !== 'success' ? 'Finalizing Checkout' : 'Pending Checkout')}

                                    </p>
                                </div>
                            </div>
                        </div>
           
        </div>
        <ToastContainer />
        <Footer />
    </div>
  );
}
