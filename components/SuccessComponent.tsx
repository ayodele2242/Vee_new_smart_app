"use client"

import React, { useEffect, useRef, useState } from 'react';
import useCartStore from '@/store/cart';
import Link from 'next/link';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { LocalStorageService } from '@/services/localStorage';
import { ApiRequestService } from '@/services/apiRequest.service';
import { CheckIcon } from 'lucide-react';
import numeral from "numeral"; 
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isUserLoggedIn } from '@/auth/auth';

interface Props {
  sessionId: string | null;
}

interface ResponseDataItem {
    status: string;
    message: string;
    orderId: any;
}

interface CartItem {
    ingramPartNumber: string;
    quantity: number;
    description: string;
    image_url: string;
    price: number;
    vendorPartNumber: string;
    upc: string;
    descr: string;
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
	const [orderId, setOrderId] = useState<string | null>(null); // Initialize orderId state
    const { cartItems, clearCart } = useCartStore();
	const { push } = useRouter()
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
                const keyToRetrieve = 'formData';
                const retrievedData = localStorageService.getData<any>(keyToRetrieve);

                if(!isLoggedIn){
                    const serializedCartItems = localStorage.getItem('cartItems');
                    const overallSumStr = localStorage.getItem('cartSumTotal');
                    const cartItems: CartItem[] = serializedCartItems ? JSON.parse(serializedCartItems) : [];
                    const overallSum: number = overallSumStr ? parseFloat(overallSumStr) : 0;

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
                            const { status, message, orderId } = responseData; // Destructure orderId from responseData
                            if (status === "error") {
                                toast.error(message);
                                setBackendMsg(message);
                                setBackendResponse(status);
                            } else if (status === "success") {
                                setBackendResponse(status);
                                setBackendMsg(message);
                                toast.success(message);
                                setOrderId(orderId); 
                                clearCart();
                                localStorage.setItem('comment','');
                                localStorage.setItem('cartSumTotal','');
                                localStorage.setItem('comment','');
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
                } else if(isLoggedIn){
                    const userJson = localStorage.getItem("user")
                    if (!userJson) return
                    const user = JSON.parse(userJson)
                    const commentValue = localStorage.getItem('comment');
                    const addr = localStorage.getItem("myAddress");

                    const serializedCartItems = localStorage.getItem('cartItems');
                    const overallSumStr = localStorage.getItem('cartSumTotal');
                    const cartItems: CartItem[] = serializedCartItems ? JSON.parse(serializedCartItems) : [];
                    const overallSum: number = overallSumStr ? parseFloat(overallSumStr) : 0;

                    const formData = {
                        session_id: sessionId,
                        email: user.email,
                        checkOutEmail: data.customer_email,
                        user_id: user.user_id,
                        selected_address_id: addr,
                        payment_type: "card",
                        note: commentValue,
                        items: cartItems,
                      totalPrice: numeral(overallSum).format('0,0.00')
                    };

                    try {
                        const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(formData), "checkout/checkout");
                        const responseData = response.data;
                
                        if (response.status === 200) {
                            const { status, message, orderId } = responseData; // Destructure orderId from responseData
                            if (status === "error") {
                                toast.error(message);
                                setBackendMsg(message);
                                setBackendResponse(status);
                            } else if (status === "success") {
                                setBackendResponse(status);
                                setBackendMsg(message);
                                clearCart();
                                toast.success(message);
                                setOrderId(orderId); 
                                localStorage.setItem('comment','');
                                localStorage.setItem('cartSumTotal','');
                                localStorage.setItem('comment','');
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
    }, [isLoggedIn, clearCart]);

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
                                {status === 'complete' && backendResponse === 'success' ? 'Done' : (status === 'complete' && backendResponse !== 'success' ? 'Finalizing Checkout' : 'Pending Checkout')}
                            </p>
                        </div>
                    </div>
                </div>
                {backendResponse === 'success' && 
                    <div className="flex items-center justify-center h-screen">
                        <div>
                            <div className="flex flex-col items-center space-y-2">
                                <h1 className="text-4xl font-bold">Thank You For Your Purchase!</h1>
                                <p>Your order #ID is: {orderId}.</p> 
                                <p>We'll email you an order confirmation with details and tracking info.</p>
                                <Link href="/products" className="inline-flex items-center px-4 py-2 mt-2 text-blue-400  border border-blue-400 rounded rounded-md hover:bg-blue-200 focus:outline-none focus:ring">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
}
