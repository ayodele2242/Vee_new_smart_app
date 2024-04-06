"use client"

import React, { useRef, useEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import { ApiRequestService } from '@/services/apiRequest.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ResponseDataItem {
    status: string;
    message: string;
}


export const ContactComponent: React.FC = () => {
    const [pageContent, setPageContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [isEmilLoading, setIsEmailLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      message: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      validateForm(formData);
      try {
        const response = await ApiRequestService.callAPI<any>({ formData }, "newsletter/mailSender");
        if (response.status === 200) {
          const responseData = response.data;
          //console.log("Data ", responseData)
          setIsEmailLoading(false);
          if (responseData.status === false) {
            toast.error(responseData.message)
          } else if (responseData.status === true) {
            toast.success(responseData.message);
            setFormData({
              name: '',
              companyName: '',
              email: '',
              phone: '',
              message: '',
            });
            
          }
        } else {
          setIsEmailLoading(false);
          if (response.status === 400) {
            const responseData = response.data
            toast.error(responseData.message)
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }finally {
        setIsSubmitting(false); // Reset form submission status to false
      }
     
    };
  
    const validateForm = (formData: any) => {
      const { name, email, message } = formData;
  
      if (!name || !email || !message) {
        toast.error('Please fill in all required fields');
      }
  
      // You can add more validation rules as needed
  
      return true;
    };
  
   

    useEffect(() => {
      setBgHeroLeftSrc(bgHeroLeft.src);

      }, []);
   

    const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
      };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full relative" style={{
            backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
        }}>
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
                <div className="mt-4"></div>
                <div className="relative min-h-screen bg-gray-200">
    
    {/* Map background */}
    <div className="absolute inset-0 z-0">
      {/* Replace 'YOUR_MAP_IMAGE_URL' with the URL of your map image */}
      <img
        src="https://images.unsplash.com/photo-1532154066703-3973764c81fe?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Map"
        className="w-full h-full object-cover"
      />
    </div>
    {/* Contact form overlay */}
    <div className="absolute inset-0 flex flex-col justify-center items-center z-10 w-full bg-opacity-70 bg-white">
    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <div className="flex justify-center items-center w-full font-semibold mb-3">INTERESTED IN CONNECTING WITH VEEMOST STORE?
WE WANT TO HEAR FROM YOU.</div>
   
      <div className="bg-white p-8 rounded-lg shadow-lg w-[50%] ">
    
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">
            Name <span className="text-red-500 font-bold text-lg">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email <span className="text-red-500 font-bold text-lg">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700">
            Contact Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700">
            Message <span className="text-red-500 font-bold text-lg">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      </div>
    </div>
  </div>
            </div>
            <Footer />
        </div>
    );
};
