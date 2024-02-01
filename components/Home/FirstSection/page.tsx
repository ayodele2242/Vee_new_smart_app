"use client"

import React from 'react';
import QuickNote from '../QuickNote';
import Image from "next/image";
import icon from "@/public/images/icon_5.png";
import bg7 from "@/public/images/bgs7.png";
import bg1 from "@/public/images/bg1.png";
import bgs6 from "@/public/images/bgs6.png";
import bg2 from "@/public/images/bg2.jpeg";
import bgs5 from "@/public/images/bgs5.png";
import homeImg from "@/public/images/bgHome9-removebg-preview.png";
import bg_3 from "@/public/images/bg_3.png";
import useRouting from "@/hooks/routing";
import Link from "next/link";
import { menusConfig } from '@/data/menus';

const FirstSection: React.FC = () => {

    const { setParam } = useRouting()
	const goToProduct = (path: string) => {
		setParam(path, "products", "search")
	}

    
  return (
    <section className="relative w-full pt-0 py-28 flex flex-col items-center justify-center gap-10  bg-white">
			<div className="lg:mt-[100px]"></div>
            <p className=" lg:text-lg text-[#737373] font-[400] ">
				Choose wisely, succeed effortlessly
			</p>
			<h1 className="md:text-3xl text-2xl lg:text-5xl w-full lg:w-[65%] mx-auto text-center font-bold font-secondary text-black">
				Stay ahead of the curve with cutting-edge IT products, power
				your success today
			</h1>
			
            <div className="relative w-full overflow-hidden">
                <div className="itemGroup">
                        <div className="flex items-center space-x-1 flex justify-center pt-1">
                            <Image src={icon} alt="icon" className="w-[20px] lg:w-[30px]" />
                            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-20 relative">
                                {menusConfig.productsLinks.map(({ title, id }) => (
                                    <p
                                        key={id}
                                        className="text-[18px] font-[500] cursor-pointer"
                                        onClick={() => goToProduct(title)}
                                    >
                                        {title}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="btnContainer  flex items-center space-x-1 flex justify-center">
                        <Link href="/products">
                            <QuickNote title={"All Products"} onClick={function (): void { } } />
                        </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 flex justify-center gap-4 sm:px-4 lg:px-10 items-center space-x-1">
                       
                        <Image
                            src={bgs5}
                            alt="icon"
                            className="w-[250px] md:w-[200px] lg:w-[680px]  lg:block"
                        />

                        <Image
                            src={homeImg}
                            alt="icon"
                            className="w-[150px] md:w-[200px]  lg:w-[380px]  lg:block"
                        />

                        <Image
                            src={bg_3}
                            alt="icon"
                            className="w-[150px] md:w-[200px] lg:w-[380px] lg:block"
                        />



                        </div>

                </div>

                <Image
				src={bg2}
				alt="icon"
				className="absolute right-[-50px] top-[-15px] w-[150px] md:w-[100px] lg:w-[280px] hidden lg:block"
			/>
			<Image
				src={bgs6}
				alt="icon"
				className="absolute left-0 top-[-20px] w-[150px] lg:w-[220px] hidden lg:block"
			/>

			</div>
			
			
			<Image
				src={bg1}
				alt="icon"
				className="absolute right-0 top-0 w-[150px] md:w-[100px] lg:w-[280px] sm:hidden lg:block"
			/>
			<Image
				src={bg7}
				alt="icon"
				className="absolute left-0 top-0 w-[150px] lg:w-[350px] sm:hidden lg:block"
			/>
		</section>
  );
};

export default FirstSection;
