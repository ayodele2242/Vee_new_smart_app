import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Logo } from '@/components/icons';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { VeeProductType } from '@/types/types';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import toast from "react-hot-toast";



interface ProductListProps {
  products: VeeProductType[];
  sortOption: any
}

const ProductList: React.FC<ProductListProps> = ({ products, sortOption }) => {

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const isLoggedIn = isUserLoggedIn();

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
    
    <div className="productList pt-4">
      {sortedProducts.map((product, index) => (
        <div className="px-2 mb-5" key={index}>
          <div className="flex -mx-2">
            <div className="w-1/5 px-2">
              <div className="relative">
                <div className="h-26 rounded-lg bg-default-300 mt-3">
                  {product.images_url && product.images_url.length > 0 ? (
                    <img
                    src={product.images_url[0].url as string}
                    alt={product.description}
                    className="relative"
                  />
                  ) : (
                    <img
                      src="/images/logoheader.png"
                      alt={product.description}
                      className="relative"
                    />
                  )}
                </div>
                <div className="favourite">
                <FavoriteBorderOutlinedIcon onClick={() => handleAddToFavorites(product?.ingramPartNumber || '')} />
                </div>
              </div>
            </div>

            <div className="w-1/2 px-2">
              {product.price_details?.pricing?.retailPrice != null && (
                <span className="inline-block text-xs px-1.5 py-1 rounded-full border border-gray-700 mb-1">
                  Special Price
                </span>
              )}
              <div className="">
                <div className="mb-2 text-xs font-bold">
                  <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs">
                  {product.description}
                  </Link>
                 
                  </div>

                <div className="text-sm font-semibold">
                  {product.category} - {product.subCategory} - {product.productType} - {product.vendorName}
                </div>

                <div className="w-100 itemListMe mt-1">
                  <div className="iTemRight">
                    <span className="uppercase text-sm">
                      <b>VPN: </b> {product.vendorPartNumber}
                    </span>
                  </div>
                  <div className="iTemLeft">
                    <span className="uppercase text-sm">
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
              </div>
            </div>

            <div className="w-1/3 px-2">
           
              <div className="compare-checkbox">
              <input
                  type="checkbox"
                  id={product?.ingramPartNumber}
                  checked={checkedItems[product?.ingramPartNumber] || false}
                  onChange={() => handleCheckboxChange(product?.ingramPartNumber || '')}
                  
                />
                <label htmlFor={product?.ingramPartNumber}>Add to Compare</label>
              </div>
              <div className="">
                <div className="h-24">
                  <div className="">
                     <h6 className="text-1xl lg:text-2xl font-bold ">
                       
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(product?.price_details?.pricing?.customerPrice)}
                    </h6>
                  </div>


                  {/*<div className="w-100 itemListMe mt-1">
                    <div className="iTemRight">
                      <div className="h-5 rounded-lg bg-default-300"></div>
                    </div>
                    <div className="iTemLeft">
                      <div className="h-5 rounded-lg bg-default-300"></div>
                    </div>
                  </div>*/}

                  <div className="itemListMe">

                  <CartQuantityActionBtns 
                  product={product}
                  id={product.ingramPartNumber}
                  />
                  


                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
    </div>

    
  );
};

export default ProductList;
