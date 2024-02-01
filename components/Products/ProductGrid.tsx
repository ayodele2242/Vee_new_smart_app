import React, { useState } from 'react';
import Image from 'next/image';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Logo } from '@/components/icons';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { VeeProductType } from '@/types/types';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import toast from "react-hot-toast";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import Link from 'next/link';

interface ProductGridProps {
  products: VeeProductType[]; 
  sortOption: any;
}


  const ProductGrid: React.FC<ProductGridProps> = ({ products, sortOption }) => {

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
   // Sorting logic based on the selected option
   const sortedProducts = [...products];

   
   if (sortOption === "low-to-high") {
     sortedProducts.sort((a, b) => a.price_details.pricing.customerPrice - b.price_details.pricing.customerPrice);
   } else if (sortOption === "high-to-low") {
     sortedProducts.sort((a, b) => b.price_details.pricing.customerPrice - a.price_details.pricing.customerPrice);
   }

   const handleCheckboxChange = (productId: string) => {
    // Check if the checkbox is checked
    if (!checkedItems[productId]) {
      // Check if the user is logged in
      if (!isUserLoggedIn()) {
           toast.error("Please log in to add item to compare.", {});
        // or redirectToLoginPage(); // Uncomment this line to redirect to the login page
        return;
      }
  
      // Update the checked items state
      setCheckedItems((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
  
      // Send the request to the backend
      sendCheckedItemsToBackend({ [productId]: true });
    }
  };

    const sendCheckedItemsToBackend = async (updatedCheckedItems: Record<string, boolean>) => {

        try {
            const productKeys = Object.keys(updatedCheckedItems);
            if (productKeys.length > 0) {
              const productId = productKeys[0];
              console.log('Compare ', productId);
              
              // Now you can use `productId` in your API request or wherever needed
            } else {
              console.error('No products selected');
            }
        
            // The rest of your API request code goes here...
          } catch (error) {
            console.error('Error extracting product ID:', error);
          }

      };

      const handleAddToFavorites = (productId: string) => {
        // Check if the user is logged in
        if (!isUserLoggedIn()) {
          toast.error("Please log in to add item to wishlist.", {});
          return;
        }
      
        // Send the request to the backend with the productId
        sendProductToBackend(productId);
      };

      const sendProductToBackend = async (productId: string) => {
        try {
          // Your API request to add the product to favorites goes here
          console.log('Add to Favorites:', productId);
          // ... rest of the API request code
        } catch (error) {
          console.error('Error adding to favorites:', error);
        }
      };
      



  return (

  <div className="mx-auto mb-5 mt-5">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sortedProducts.map((product, i) => (


      <div key={i} className="box-item flex justify-center border-2 border-gray-300 rounded-xl p-0 pb-3">
          <div className="relative">
                <div className="h-26 rounded-lg bg-default-300">
                  {product.images_url && product.images_url.length > 0 ? (
                   
                   <Image
                    src={product.images_url[0].url as string}
                    alt={product.description}
                    width={300}
                    height={300}
                    className="relative"
                  />
                  ) : (
                    <Image
                    src="/images/logoheader.png"
                    alt={product.description}
                    width={300}
                    height={300}
                    className="relative"
                  />
                  )}
                </div>
                <div className="favourite">
                <FavoriteBorderOutlinedIcon onClick={() => handleAddToFavorites(product?.ingramPartNumber || '')} />

                </div>
                <div className="mb-2 mt-2 text-xs color-[yellow] font-bold p-2">
                <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs">
                  {product.description}
                  </Link>
                </div>
                <div className="text-sm font-semibold p-2">
                  {product.category} - {product.subCategory} - {product.productType} - {product.vendorName}
                </div>

                <div className="w-100 itemListMe mt-1">
                  <div className="iTemRight">
                    <span className="uppercase text-xs">
                      <b>VPN: </b> {product.vendorPartNumber}
                    </span>
                  </div>
                  <div className="iTemLeft">
                    <span className="uppercase text-xs">
                      <b>SKU: </b> {product.ingramPartNumber}
                    </span>
                  </div>
                </div>

                <div className="w-100 itemListMe">
                  <div className="iTemRight">
                    <span className="py-1 px-2 rounded-full bg-green-100 font-bold text-xs text-green-800 ">
                      Direct Ship
                    </span>
                  </div>
                  <div className="iTemLeft">
                    <span className="text-red-700 font-bold text-sm">No returns</span>
                  </div>
                </div>

               
           
           <div className="compare-checkbox w-100 p-2">
             <input
               type="checkbox"
               id={product?.ingramPartNumber}
               checked={checkedItems[product?.ingramPartNumber] || false}
               onChange={() => handleCheckboxChange(product?.ingramPartNumber || '')}
             />
             <label htmlFor={product?.ingramPartNumber}>Add to Compare</label>
           </div>
           <div className="w-100 p-2">
             
               <div className="">
                  <h6 className="text-1xl lg:text-2xl font-bold ">
                    
                     {new Intl.NumberFormat('en-US', {
                         style: 'currency',
                         currency: 'USD'
                     }).format(product?.price_details?.pricing?.customerPrice)}
                 </h6>
               </div>


           </div>
        <div className='p-2 w-100'>
        <CartQuantityActionBtns 
                  product={product}
                  id={product.ingramPartNumber}
                  />
        </div>

              </div>
             
      </div>
    ))}
    </div>
  </div>
);
}

export default ProductGrid;
