import React, { useEffect, useState } from 'react';
import useCartStore  from '@/store/cart';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import toast, { ToastBar } from "react-hot-toast";
import Image from "next/image";
import Link from 'next/link';
import SingleLoader from '@/loaders/singleLoader';
import { ApiRequestService } from '@/services/apiRequest.service';
import CheckoutForm from './checkout-form';
import {
    fetchCountries,
    fetchStatesByCountry,
} from "@/services/requestAll.service"
import {
	isUserLoggedIn
} from "@/auth/auth";

const CheckoutComponentPage = () => {
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { cartItems } = useCartStore();
    const isLoggedIn = isUserLoggedIn();
    const [detailsVisible, setDetailsVisible] = useState<boolean[]>(Array(cartItems.length).fill(false));

    const toggleDetailsVisibility = (index: number) => {
        setDetailsVisible(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };
  
    useEffect(() => {
      setBgHeroLeftSrc(bgHeroLeft.src);
      setLoading(false);
    }, []);

    if (loading) {
      return <div className="h-[100vh] w-full flex justify-center text-center overlayer">
        <div className="loadig mb-3">Loading. Please wait...</div>
        <SingleLoader numberOfItems={1} />
        </div>; 
    }


    const overallSum = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
 

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
    };

    return (
        <div className="w-full" style={{
            backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
        }}>
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} />

            <div className='w-full cartAll bg-[#ffffff] p-10 gap-4'>
                <div className="mb-2 ml-8 w-full font-extrabold text-lg">
                    Checkout
                </div>
                <div className="mb-3 ml-8 w-full font-bold loginBody">
                    <PersonOutlineOutlinedIcon className="largeIcon"/> <span className="loginBtn bg-yellow-500 cursor-pointer">Login</span>
                </div>

                <div className="w-full justify-between sCart  flex column lg:p-8 bg-gray-50  md:w-[100%] ">

                    <div className="cartBody lg:w-[65%] md:w-[100%]">
                    {!isLoggedIn && <CheckoutForm />}

                       
                    </div>

                    <div className="cartSummary lg:w-[25%] md:w-[100%] bg-gray-200 ml-4">
                      <div className="w-full font-bold mb-3">Order Summary</div>
                      <div className="w-full font-semibold text-sm flex justify-between border-b-[1px] border-gray-600 pb-2">
                        <span>{cartItems.length < 2 ? (
                          <p>{cartItems.length} item in cart</p>
                      ) : (
                          <p>{cartItems.length} items in cart</p>
                      )}
                      </span>

                      <KeyboardArrowDownOutlinedIcon />
                      
                      </div>

                      <div className="w-full text-sm flex justify-between">

                          <div className="cartRightDiv w-full">

                          {cartItems.map((item: VeeCartItem, index: number) => (
                       <div className="flex justify-between  w-full mb-3 mt-3" key={index}>
                        
                        <div className="summaryLeft flex lg:w-[70%]">
                        <Image
                          src={item.image_url} // Source of the image
                          alt={item.description} // Alternate text for accessibility
                          className="mr-2 w-[50px] h-[50px]" // Custom classes for styling
                          width={50} // Width of the image
                          height={50} // Height of the image
                        />
                            <div className="flex column-layout">
                              <div className="font-bold w-full">{item.ingramPartNumber}</div>
                              <div className="txt-smaller w-full"><b>Qty:</b> {item.quantity}</div>
                              <div className="txt-smaller w-full cursor-pointer"  onClick={() => toggleDetailsVisibility(index)}><KeyboardArrowDownOutlinedIcon /> View Details</div>
                              {detailsVisible[index] && 
                              <div className="flex column-layout">
                               <div className="font-semibold w-full text-sm">{item.description}</div>
                              </div>
                              }
                              

                            </div>
                        </div>
                        <div className="summaryRight font-bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.price * item.quantity)}
                     
                        </div>

                      
                       
                          </div>
                        ))}



                          </div>
                         

                      </div>


                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default CheckoutComponentPage;
