import React, { useState } from 'react';
import { Navbar } from "@/components/navbar";
import Partners from '../Home/Partners';
import Vendors from '../Vendors';
import Header from '../Home/Header/page';
import Footer from '../Home/Footer/Footer';
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 

const PartnersList: React.FC = () => {

    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string>("");
	const [backgroundPosition, setBackgroundPosition] = useState<'left' | 'right'>('left');
    const onPageBackgroundChange = (imageUrl: string, position: 'left' | 'right') => {
        setBackgroundImage(imageUrl);
        setBackgroundPosition(position);
        };

    const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
      };

    return (
        <div className="relative flex flex-col min-h-screen">
        <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
        <div
            className="h-full w-[90%] mx-auto relative z-10 pb-4"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: backgroundPosition === 'left' ? 'top left' : 'top right',
                // Add other styles as needed
            }}
        >
            <Partners />
        </div>
        <div className="mt-auto"> <Footer  /></div>
       

    </div>
    );
};

export default PartnersList;
