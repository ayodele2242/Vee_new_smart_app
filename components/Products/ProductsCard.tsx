"use client"
import React, { useState, useEffect, useRef } from "react";

interface ProductsCardProps {
  selectedCategories: any;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ selectedCategories }) => {
    const isMounted = useRef(true);
  // Now you can use the selectedCategories prop in your component
  

  useEffect(() => {
    // Check if the component is mounted
    if (isMounted.current) {
      
        if(selectedCategories){
            console.log('Selected Categories in ProductsCard:', selectedCategories);
        }else{
            console.log('Selected Categories not received');
        }

    }

    // Set isMounted to false during cleanup
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div>
      Products here
    </div>
  );
};

export default ProductsCard;
