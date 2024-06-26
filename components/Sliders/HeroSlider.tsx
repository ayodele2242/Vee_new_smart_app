import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import LearnMore from './LearnMore';
import { sliderConfig } from "@/components/Sliders/slider";
import bgRight from "@/public/images/bg-hero_left.png";
import bgLeft from "@/public/images/bgHeroLeft.png";

interface HeroSliderProps {
  onPageBackgroundChange: (imageUrl: string, position: 'left' | 'right') => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onPageBackgroundChange }) => {
  const [curr, setCurr] = useState(0);
  const sliderIntervalRef = useRef<NodeJS.Timeout>();

  const handleNextSlide = () => {
    setCurr((prev) => (prev + 1) % sliderConfig.homeSliderItems.length);
  };

  const handlePrevSlide = () => {
    setCurr((prev) => (prev - 1 + sliderConfig.homeSliderItems.length) % sliderConfig.homeSliderItems.length);
  };

  const handleBackgroundImage = (imageUrl: string, position: 'left' | 'right') => {
    onPageBackgroundChange(imageUrl, position);
  };

  useEffect(() => {
    const initialBackground = sliderConfig.homeSliderItems[0].isLeft ? 'left' : 'right';
    setCurr(0);
    handleBackgroundImage(initialBackground === 'left' ? bgLeft.src : bgRight.src, initialBackground);

    // Start the slider automatically after component mounts
    sliderIntervalRef.current = setInterval(handleNextSlide, 5000); // Adjust the interval as needed

    return () => {
      // Clear the interval when component unmounts to prevent memory leaks
      clearInterval(sliderIntervalRef.current);
    };
  }, []);

  const handleBulletClick = (index: number) => {
    setCurr(index);
    const selectedItem = sliderConfig.homeSliderItems[index];
    if (selectedItem.isLeft) {
      handleBackgroundImage(bgLeft.src, 'left');
    } else {
      handleBackgroundImage(bgRight.src, 'right');
    }
  };

  return (
    <div className="relative h-[80vh] ">
      <div className="absolute w-full h-full top-0 left-0 bg-[#0000002e]"></div>
      {sliderConfig.homeSliderItems.map((item, index) => (
        <div
          key={item.id}
          className={[
            'bg-no-repeat bg-cover w-full h-[70vh] sm:h-[75vh] md:h-[80vh] relative',
            index === curr ? 'z-10' : 'hidden',
            item.position ? item.position : 'bg-center',
          ].join(' ')}
          style={{
            backgroundImage: item.isVisibleBackground ? `url(${item.background.src})` : undefined,
          }}
        >
          <div
            className={[
              'w-full h-full flex items-center justify-center lg:justify-between gap-y-4 lg:gap-y-0',
              item.isLeft ? 'flex-col lg:flex-row-reverse' : 'flex-col-reverse lg:flex-row',
            ].join(' ')}
          >
            <div
              className={[
                'flex-[0.5] h-full lg:items-center justify-center',
                item.isVisibleBackground ? 'hidden' : 'flex',
                item.isLeft ? 'items-center' : 'items-start',
              ].join(' ')}
            >
              {item.imageUrl && (
                <div className="w-[100%] lg:w-[80%]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full -z-10 object-contain"
                  />
                </div>
              )}
            </div>
            {item.isRightText && (
              <div className="flex-[0.5] h-full flex flex-col items-center lg:justify-center gap-4 lg:w-[70%] sm:w-[90%] mx-auto sm:hidden">
                {/* Render your text content for the right side here */} 
              </div>
            )}
            <div
              className={[
                'flex-[0.4] h-full flex flex-col items-center lg:justify-center gap-3 w-[80%] mx-auto',
                item.isLeft ? 'justify-start' : 'justify-center',
              ].join(' ')}
            >
              <h1 className={[
              'font-secondary font-bold text-center w-full lg:w-[90%] mx-auto lg:mt-8 lg:pt-[300px]',
              item.imageUrl ? 'text-black' : 'text-white',
              item.isLeft ? 'text-5xl lg:text-7xl' : 'text-5xl md:text-5xl lg:text-[47px]',
            ].join(' ')}
            >
              {item.title}
            </h1>
              <p
  className={[
    'font-[400] text-xl lg:text-3xl text-center w-full lg:w-[65%] mx-auto mb-3 pb-4',
    item.imageUrl ? 'text-black' : 'text-white',
  ].join(' ')}
>
  <span
    className="bg-black rounded-lg py-2 box-decoration-clone px-1 pt-2 pb-3 block" // Change display to block
    style={{ marginBottom: '0px', paddingBottom: '5px' }} // Add margin-bottom
  >
    {item.desc.split(' ').slice(0, 4).join(' ')} 
  </span>
  <span
    className="bg-black rounded-lg py-2 box-decoration-clone px-1 pt-1 pb-2 inline-block" 
  >
    {item.desc.split(' ').slice(4).join(' ')} {/* Display remaining text */}
  </span>
</p>

              <div className="w-full flex items-center justify-center">
                <LearnMore />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute navBtns lg:pl-24 md:pl-5 bottom-24 md:bottom-26 w-full flex items-center justify-start gap-4 z-30">
        {sliderConfig.homeSliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBulletClick(index)}
            className={`w-[15px] h-[15px] lg:w-[20px] lg:h-[20px] rounded-full cursor-pointer ${
              index === curr ? 'bg-[#D7AA12]' : 'bg-white'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
