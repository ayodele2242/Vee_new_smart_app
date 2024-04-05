import React from 'react';
import LearnMore from '@/components/Sliders/LearnMore';
import Chat from '@/public/images/icon-chat-bot.png';
import logo from '@/public/images/logo.webp';
import Image from 'next/image';
import ToCartProfile from '@/components/ToCartProfile';
import Link from 'next/link';

interface SecondSectionProps {
  title: string;
  desc: string;
  isVisibleLogo: boolean,
  bg: any
}

const SecondSection: React.FC<SecondSectionProps> = ({ title, desc, isVisibleLogo, bg }) => {
  return (
    <section
      className=" bg-no-repeat bg-center bg-cover flex items-center justify-center py-20 relative"
      style={{
        backgroundImage: `url(${bg.src})`,
      }}
    >
      <div className=" absolute w-full h-full top-0 left-0 bg-[#0000002e]"></div>
      <div className="h- w-[90%] mx-auto relative z-10">
        <div className="w-full h-[] flex items-center justify-start lg:justify-center relative">
          
          <ToCartProfile />
        </div>
        <div className="flex h-[90vh] justify-center lg:justify-start items-center w-[90%] mx-auto relative">
          <div className="lg:flex-[0.5] w-full h-full flex flex-col gap-3 justify-center items-center">
          {isVisibleLogo && (
            <Image src={logo} alt="Logo" className="w-[50%] lg:w-[300px]" />
          )}
            <h1 className="md:text-3xl text-3xl xl:text-6xl lg:text-5xl font-secondary font-bold text-white text-center w-full lg:w-[75%] mx-auto">
              {title}
            </h1>
            <p className="font-[400] text-lg  text-white text-center w-full lg:w-[75%] mx-auto">
           
              {desc}
            </p>
            <Link href="services">
            <LearnMore />
            </Link>
            
          </div>
        </div>
        {/*<Image
          src={Chat}
          alt="icon"
          className="w-[50px] lg:w-[75px] absolute bottom-20 right-0 cursor-pointer"
        />*/}
      </div>
    </section>
  );
};

export default SecondSection;
