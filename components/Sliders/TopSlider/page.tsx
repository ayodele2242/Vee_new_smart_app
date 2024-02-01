import React from 'react';
import Image, { StaticImageData } from 'next/image';
import LearnMore from '../LearnMore';

interface TopSliderProps {
  item: {
    id: number;
    isActive: boolean;
    isVisibleBackground: boolean;
    background: StaticImageData;
    title: string;
    desc: string;
    position?: undefined;
    imageUrl?: undefined;
    isLeft?: undefined;
  };
}

const TopSlider: React.FC<TopSliderProps> = ({ item }) => {
  const backgroundImage: React.CSSProperties['backgroundImage'] = item.isVisibleBackground
    ? `url(${item.background.src})`
    : 'none';

  return (
    <div
      className={[
        'bg-no-repeat bg-cover w-full h-[70vh] sm:h-[75vh] md:h-[80vh] relative z-10',
        item.isActive ? 'z-10' : 'hidden',
        item.position ? item.position : 'bg-center',
      ].join(' ')}
      style={{
        backgroundImage,
      }}
    >
      <div
        className={[
          'w-full h-full flex items-center justify-center lg:justify-between gap-y-4 lg:gap-y-0',
          item.isLeft !== undefined ? (item.isLeft ? 'flex-col lg:flex-row-reverse' : 'flex-col-reverse lg:flex-row') : '',
        ].join(' ')}
      >
        <div
          className={[
            'flex-[0.5] h-full lg:items-center justify-center',
            item.isVisibleBackground ? 'hidden' : 'flex',
            item.isLeft !== undefined ? (item.isLeft ? 'items-center' : 'items-start') : '',
          ].join(' ')}
        >
          {item.imageUrl && (
            <div className="w-[50%] lg:w-[80%]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                className="w-full -z-10 object-contain"
              />
            </div>
          )}
        </div>
        <div
          className={[
            'flex-[0.5] h-full flex flex-col items-center lg:justify-center gap-4 w-[90%] mx-auto',
            item.isLeft !== undefined ? (item.isLeft ? 'justify-start' : 'justify-center') : '',
          ].join(' ')}
        >
          <h1
            className={[
              'font-secondary font-bold text-center w-full lg:w-[90%] mx-auto',
              item.imageUrl ? 'text-black' : 'text-white',
              item.isLeft
                ? 'text-4xl lg:text-5xl'
                : 'text-4xl md:text-5xl lg:text-6xl',
            ].join(' ')}
          >
            {item.title}
          </h1>
          <p
            className={[
              'font-[400] text-xl lg:text-2xl text-center w-full lg:w-[75%] mx-auto',
              item.imageUrl ? 'text-black' : 'text-white',
            ].join(' ')}
          >
            <span
              className={[
                item.imageUrl
                  ? ''
                  : 'bg-black rounded-lg py-1 box-decoration-clone px-2',
              ].join(' ')}
            >
              {item.desc}
            </span>
          </p>
          <div className="w-full flex items-center justify-center">
            <LearnMore />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSlider;
