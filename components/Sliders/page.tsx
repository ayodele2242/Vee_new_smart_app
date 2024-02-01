"use client"

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Paper, useTheme, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { sliderConfig } from './slider';
import Image, { StaticImageData } from 'next/image';
import bgSliderLeft from '@/public/images/bgHeroLeft.png';
import bgSliderRight from '@/public/images/bgHeroRight.png';



interface SliderItem {
  id: number;
  name: string;
  image: StaticImageData | string;
  price: string;
  type: string[];
}

function Item({ item }: { item: SliderItem }) {
  return (
    <Paper className="max-h-[350px] h-full w-full flex items-center justify-center shadow-none">
      <Image
        src={item.image}
        alt={item.name}
        className="w-full sm:w-[50%] h-[300px] object-contain object-center"
      />
    </Paper>
  );
}


const Sliders = () => {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultIndicatorStyle = {
    backgroundColor: '#e2e8f0 !important',
    borderRadius: 0,
    width: isSmScreen ? 30 : 60,
    height: 10,
  };

  const activeIndicatorIconButtonProps = {
    backgroundColor: '#D7AA12 !important',
    borderRadius: 0,
    width: isSmScreen ? 30 : 60,
    height: 10,
  }
  
  const hoverIndicatorStyle = {
    backgroundColor: '#cbd5e1 !important',
  };

 



  const handleSlideChange = (now?: number, previous?: number) => {
    setCurrentSlide(now || 0); // Set currentSlide to 0 if now is undefined
  };

  const getBackgroundImage = () => {
    if (currentSlide === 0) {
      return { backgroundImage: `url(${bgSliderLeft.src})`, backgroundPosition: 'top left' };
    } else if (currentSlide === sliderConfig.sliderItems.length - 1) {
      return { backgroundImage: `url(${bgSliderRight.src})`, backgroundPosition: 'right top' };
    } else {
      return {};
    }
  };

  return (
    <div
    className="h-screen w-full flex items-center justify-center lg:px-10 px-4"
    style={getBackgroundImage()}
  >
    <Carousel
      className="relative h-full w-full flex items-center justify-center shadow-none"
      NextIcon={<ChevronRight />}
      PrevIcon={<ChevronLeft />}
      indicators={true}
      cycleNavigation={true}
      navButtonsAlwaysVisible={true}
      navButtonsProps={{
        style: {
          backgroundColor: '#D7AA12 !important',
        },
      }}
      indicatorContainerProps={{
        style: {
          position: 'absolute',
          bottom: 50,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px 10px',
        },
      }}
      indicatorIconButtonProps={{
        style: {
          ...defaultIndicatorStyle as any,
          '&:hover': hoverIndicatorStyle as any,
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          ...activeIndicatorIconButtonProps as any,
          '&:hover': hoverIndicatorStyle as any,
        },
      }}
      onChange={handleSlideChange}
    >
      {sliderConfig.sliderItems.map((item, i) => (
         <Item key={i} item={item} />
      ))}
    </Carousel>
  </div>
  );
};

export default Sliders;
