"use client"
import React, { useState } from "react";
import bgSection2 from "@/public/images/bgSection2.png";
import bgSection3 from "@/public/images/bgSection3.png";
import bgSection4 from "@/public/images/bgSection4.png";
import FirstSection from "@/components/Home/FirstSection/page";
import SecondSection from "@/components/Home/SecondSection/SecondSection";
import ThirdSection from "@/components/Home/ThirdSection/ThirdSection";
import Footer from "@/components/Home/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "@/components/navbar";
import HeroSlider from "@/components/Sliders/HeroSlider";
import Link from "next/link";
import { ApiRequestService } from '@/services/apiRequest.service';

interface ResponseDataItem {
    status: string;
    message: string;
}

const HomeComponent: React.FC = () => {

    const [backgroundImage, setBackgroundImage] = useState<string>("");
	const [backgroundPosition, setBackgroundPosition] = useState<'left' | 'right'>('left');
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [isEmilLoading, setIsEmailLoading] = useState(false);

	const onPageBackgroundChange = (imageUrl: string, position: 'left' | 'right') => {
	setBackgroundImage(imageUrl);
	setBackgroundPosition(position);
	};

	const [formData, setFormData] = useState({
		email: ""
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	  };

	const selectedSearchedItems = (selectedItem: any) => {
	 };

	 const handleSubscribtion = async () => {
		setIsEmailLoading(true);
	
		try {
		  const response = await ApiRequestService.callAPI<any>({ email }, "newsletter/subscribe");
		  if (response.status === 200) {
			const responseData = response.data;
			//console.log("Data ", responseData)
			setIsEmailLoading(false);
			if (responseData.status === false) {
				toast.error(responseData.message)
			} else if (responseData.status === true) {
				toast.success(responseData.message);
				setEmail('');
			}
		} else {
			setIsEmailLoading(false);
			if (response.status === 400) {
				const responseData = response.data
				toast.error(responseData.message)
			}
		}
		} catch (error: any) {
		  // Handle network or other errors
		  toast.error("An error occurred:", error)
		  
		} finally {
			setIsEmailLoading(false);
		}
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
		
				<FirstSection />

		        <SecondSection
					title="On-premise and Cloud Products & Services"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services that work best for you"
					}
					isVisibleLogo={true}
					bg={bgSection2}        
				/>

				<ThirdSection
					isVisibleLogo={true}
					title={"Connect with us today"}
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
				/>
                
				<SecondSection
					title="Our tech team at your disposal"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
					isVisibleLogo={true}
					bg={bgSection3}
				/>

				{/*<SecondSection
					title="Our tech team at your disposal"
					desc={
						"Tailored solutions for your unique needs - Let us help you find the IT products & services  that work best for you"
					}
					isVisibleLogo={false}
					bg={bgSection4}
				/>*/}

			<div className="w-full p-5">

			<div className="container flex flex-col xl:flex-row mx-auto px-5 py-12 xl:py-14 text-gray-500 bg-blue-100 rounded-2xl">

			
			<div className="w-full">

			<div className="mt-3 mb-4 text-lg sm:text-center text-black-900 font-extrabold">Follow us and the future of network.</div>


				<div className="container flex flex-col justify-center items-center sm:flex-row gap-3 w-full lg:pl-8 lg:pr-8">

				<input type="text" placeholder="Please enter your email" 
				className="sm:w-[400px] h-12 p-3 text-black-900 border border-solid border-gray-300 rounded-lg shadow"
				required 
				value={email}
				onChange={handleEmailChange}/>

				<button type="submit" 
				className="sm:w-auto h-12 sm:h-auto text-white bg-yellow-600 rounded-lg shadow 
				transition-all duration-300 ease-in-out hover:bg-yellow-700 sm:px-4 sm:py-2"
				style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
				onClick={handleSubscribtion} disabled={isEmilLoading}>
					
					{isEmilLoading ? 'Please wait...' : 'Subscribe'}
					</button>

				</div>

				<div className="mt-3  text-base sm:text-center text-black-600 ">Follow us, you will get the rest products and industry information in our insights emails.</div>
				<div className="mt-1 mb-2 text-base sm:text-center text-black-600">Subscribe now also can get more than 50 valuable white papers. <Link href="" className="text-blue-600 font-bold"> Learn Details{">"}{">"}{">"}</Link></div>

			</div>

			</div>

			</div>

			<ToastContainer />
     			<Footer />
</div>
  );
}

export default HomeComponent;
