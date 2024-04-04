"use client"

import React, { useRef, useEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";



export const ContactComponent: React.FC = () => {
    const [pageContent, setPageContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
          try {
            const iframeDocument = iframeRef.current.contentDocument;
            const elementsToHide = iframeDocument?.querySelectorAll('.site-header-wrapper, .header-style-3, .site-header');
        
            // Hide elements reliably using a combination of methods
            elementsToHide?.forEach((element: any) => {
              element.style.display = 'none';
              element.style.visibility = 'hidden';
            });
          } catch (error) {
            // Handle potential errors gracefully, such as cross-origin issues
            console.error('Error accessing iframe content:', error);
          }
        }
      }, [iframeRef]);
   

    const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
      };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow relative">
            <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
                <div className="mt-4"></div>
                <div className="w-full flex lg:p-6 bg-white lg:pl-5 lg:pr-5">
                    <iframe
                        ref={iframeRef}
                        title="External Page"
                        src="https://veemost.com/contact-us"
                       id="service-inframe"
                        
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};
