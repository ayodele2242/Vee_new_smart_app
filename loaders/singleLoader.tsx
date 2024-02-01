import React from 'react';
import {Card, Skeleton} from "@nextui-org/react";

interface SingleLoaderProps {
  numberOfItems: number;
}

const SingleLoader: React.FC<SingleLoaderProps> = ({ numberOfItems }) => {
  const skeletons = Array.from({ length: numberOfItems }, (_, index) => (
   
    <div className="w-full" key={index}>
         <Skeleton className="rounded-lg">
           <div className="h-5 bg-gray-500 hover:bg-gray-600">...</div>
         </Skeleton>
  </div>
   
  
  ));

  return <>{skeletons}</>;
};

export default SingleLoader;
