"use client"
import React, { useState } from "react";
import bgSection2 from "@/public/images/bgSection2.png";
import bgSection3 from "@/public/images/bgSection3.png";
import bgSection4 from "@/public/images/bgSection4.png";
import FirstSection from "@/components/Home/FirstSection/page";
import SecondSection from "@/components/Home/SecondSection/SecondSection";
import ThirdSection from "@/components/Home/ThirdSection/ThirdSection";
import Footer from "@/components/Home/Footer/Footer";
import { Navbar } from "@/components/navbar";
import HeroSlider from "@/components/Sliders/HeroSlider";

const HomeComponent: React.FC = () => {

    const [backgroundImage, setBackgroundImage] = useState<string>("");
	const [backgroundPosition, setBackgroundPosition] = useState<'left' | 'right'>('left');

	const onPageBackgroundChange = (imageUrl: string, position: 'left' | 'right') => {
	setBackgroundImage(imageUrl);
	setBackgroundPosition(position);
	};

	const selectedSearchedItems = (selectedItem: any) => {
		
	
	  
	  };

  return (
    <div className="relative flex flex-col h-screen" 
		style={{
			backgroundImage: `url(${backgroundImage})`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: backgroundPosition === 'left' ? 'top left' : 'top right',
			// Add other styles as needed
		  }}>
						<Navbar onSelectedCategoriesChange={selectedSearchedItems}/>
						<HeroSlider onPageBackgroundChange={onPageBackgroundChange} />
		

		        <SecondSection
					title="On-premise and Cloud Products & Services"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services that work best for you"
					}
					isVisibleLogo={true}
					bg={bgSection2}        
				/>

                <FirstSection />
				<SecondSection
					title="Our tech team at your disposal"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
					isVisibleLogo={true}
					bg={bgSection3}
				/>

				<SecondSection
					title="Our tech team at your disposal"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
					isVisibleLogo={false}
					bg={bgSection4}
				/>

                <ThirdSection
					isVisibleLogo={true}
					title={"Connect with us today"}
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
				/>
     			<Footer />
</div>
  );
}

export default HomeComponent;
