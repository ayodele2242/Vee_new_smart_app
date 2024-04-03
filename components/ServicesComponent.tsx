"use client"

import React, { useEffect, useRef, useState } from 'react';
import useCartStore from '@/store/cart';
import Link from 'next/link';
import { VeeCartItem } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { useRouter } from "next/navigation"




export const ServicesComponent: React.FC = () => {

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


    useEffect(() => {
       
        setLoading(false);
    }, []);

	if (loading) {
		
	  }

    const selectedSearchedItems = (selectedItem: any) => {
        // Handle selected items here
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
       
        <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
         Services Page
        </div>
      </div>
      
      <Footer />
    </div>
    );
}
