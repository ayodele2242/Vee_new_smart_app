import React from 'react';
import {Card, Skeleton} from "@nextui-org/react";

interface ProductsAnimeProps {
  numberOfItems: number;
}

const ProductsAnime: React.FC<ProductsAnimeProps> = ({ numberOfItems }) => {
  const skeletons = Array.from({ length: numberOfItems }, (_, index) => (
   
    <div className="px-2 mb-5" key={index}>
    <div className="flex -mx-2">
      <div className="w-1/5 px-2">
        <div className="h-24">
         <Skeleton className="rounded-lg">
           <div className="h-24 rounded-lg bg-default-300"></div>
         </Skeleton>
        </div>
      </div>

      <div className="w-1/2 px-2">
        <div className="">
        <Skeleton className="rounded-lg mb-2">
           <div className="h-6 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>

         <div className="w-100 itemListMe mt-1">
         <div className="iTemRight">
        <Skeleton className="rounded-sm mr-3">
           <div className="h-5 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
        <div className="iTemLeft">
        <Skeleton className="rounded-sm">
           <div className="h-5 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
        </div>

        <div className="w-100 itemListMe mt-1">
         <div className="iTemRight">
        <Skeleton className="rounded-sm mr-3">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
        <div className="iTemLeft">
        <Skeleton className="rounded-sm">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
        </div>

        </div>
      </div>

      <div className="w-1/3 px-2">
        <div className="h-12">
        <div className="h-24">
        <Skeleton className="rounded-lg mb-2">
           <div className="h-6 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>

         <div className="w-100 itemListMe mt-2">
         <div className="iTemRights">
        <Skeleton className="rounded-sm mr-3">
           <div className="h-5 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
         {/* <div className="iTemLeft">
        <Skeleton className="rounded-sm">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>*/}
        </div>

        <div className="w-100 itemListMe mt-2">
         <div className="">
        <Skeleton className="rounded-sm mr-3">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
       {/* <div className="iTemLeft">
        <Skeleton className="rounded-sm">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>*/}
        </div>

        <div className="w-100 itemListMe mt-1">
         <div className="">
        <Skeleton className="rounded-sm mr-3">
           <div className="h-5 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>
       {/* <div className="iTemLeft">
        <Skeleton className="rounded-sm">
           <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        </div>*/}
        </div>


        </div>
        </div>
      </div>

    </div>
  </div>
   
  
  ));

  return <>{skeletons}</>;
};

export default ProductsAnime;
