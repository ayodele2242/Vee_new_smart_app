import React from 'react';
import {Card, Skeleton} from "@nextui-org/react";

interface ImageLoaderProps {
  numberOfItems: number;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ numberOfItems }) => {
  const skeletons = Array.from({ length: numberOfItems }, (_, index) => (
   
    <div className="w-full  mb-2" key={index}>
         <Skeleton className="rounded-md">
           <div className="h-[120px] bg-gray-500 hover:bg-gray-600">...</div>
         </Skeleton>
  </div>
   
  
  ));

  return <>{skeletons}</>;
};

export default ImageLoader;
