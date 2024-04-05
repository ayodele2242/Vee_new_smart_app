import React from 'react';
import logo from '@/public/images/logoheader.png';
import Image from 'next/image';
import ToCartProfile from '@/components/ToCartProfile';
import icon_1 from '@/public/images/icon_1.webp';
import icon_2 from '@/public/images/icon_2.webp';
import icon_3 from '@/public/images/icon_3.webp';

interface ThirdSectionProps {
  title: string;
  desc: string;
  isVisibleLogo: boolean,
  
}

const image_content = [
    {
      id: 1,
      icon: icon_1,
      title: 'Tech Support',
    },
    {
      id: 2,
      icon: icon_2,
      title: 'Tech Deals',
    },
    {
      id: 3,
      icon: icon_3,
      title: 'Track Order',
    },
  ];

const ThirdSection: React.FC<ThirdSectionProps> = ({ title, desc, isVisibleLogo }) => {
    const isDarkIcon = true;

  return (
    <section className="relative w-full pt-0 py-28 flex flex-col items-center justify-center gap-10  bg-white">
      <div className="w-full h-full lg:px-14 sm:px-3">
        <div className="w-full h-[150px] flex items-center lg:justify-center relative">
          {isVisibleLogo && (
            <Image src={logo} alt="Logo" className="w-[50%] lg:w-[250px]" />
          )}
          <div className="absolute flex gap-4 justify-end items-center z-10  top-10 right-0">
            <ToCartProfile isDarkIcon={isDarkIcon} />
          </div>
        </div>
        <div className="w-full min-h-[35vh] flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl sm:text-2xl font-secondary font-bold text-black text-center drop-shadow-lg">
            {title}
          </h1>
          <div className="w-[50%] flex justify-evenly items-center flex-wrap gap-2 lg:gap-0 mt-4 sm:w-full font-items-contact">
            {image_content.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center gap-2 font-items-contact-us"
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  className="lg:w-[50px] sm:w-[10px] lg:h-[50px] sm:h-[10px]"
                />
                <p className="text-base lg:text-xl sm:text-sm text-black font-[300] font-primary">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
          <h4 className="text-2xl font-primary w-full lg:max-w-[600px] mx-auto font-[300] text-black text-center sm:pl-3 sm:pr-3">
            {desc}
          </h4>
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
