import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Logo } from '@/components/icons';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { VeeProductType } from '@/types/types';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
	isUserLoggedIn,
	getUserData,
	redirectToLoginPage,
} from "@/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



interface ProductListProps {
  products: VeeProductType[];
  sortOption: any
}

const ProductList: React.FC<ProductListProps> = ({ products, sortOption }) => {

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const isLoggedIn = isUserLoggedIn();

    if (!products || !Array.isArray(products)) {
      // Handle the case where products is not defined or not an array
      return <div></div>;
    }

    // Sorting logic based on the selected option
  const sortedProducts = [...products];
  if (sortOption === "low-to-high") {
    sortedProducts.sort((a, b) => a.customerPrice - b.customerPrice);
  } else if (sortOption === "high-to-low") {
    sortedProducts.sort((a, b) => b.customerPrice - a.customerPrice);
  }
 

  const handleCheckboxChange = (productId: string) => {
    // Check if the user is logged in
    if (!isUserLoggedIn()) {
      toast.error("Please log in to add item to compare.", {});
      // or redirectToLoginPage(); // Uncomment this line to redirect to the login page
      return;
    }
  
    // Toggle the checked state of the checkbox
    setCheckedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  
    // Send the request to the backend
    sendCheckedItemsToBackend({ [productId]: !checkedItems[productId] });
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
    
<div className="productItems w-full p-6">

{sortedProducts.map((product, index) => (
 <div className="px-2 mb-2 products_list flex" key={index}>

          <div className="imgHolder lg:w-[20%] p-3 relative">
            <div className="h-26 rounded-lg bg-default-300 mt-3">
                  {product.images_url && product.images_url.length > 0 ? (
                     <Image
                     src={product.images_url as string}
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
                {/*<div className="favourite-list">
                <FavoriteIcon onClick={() => handleAddToFavorites(product?.ingramPartNumber || '')} fontSize="medium"/>
                </div>*/}
          </div>

          <div className="p-6 lg:w-[65%] centerLayout">

          <div className="flex w-full mb-3">
                  <Link href={`/productdetail?id=${product.ingramPartNumber}`} className="text-xs font-bold">
                  {product.description}
                  </Link>   
          </div>

          <div className="flex w-full mb-3 text-small">
                  {product?.descr}
          </div>

          <div className="flex w-full iTemRightMobile">
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
                  <div className="iTemLeft">
                    <span className="uppercase text-sm">
                      <b>UPC: </b> {product.upc}
                    </span>
                  </div>
          </div>

          </div>

          <div className="p-3 lg:w-[15%] flex centerLayout">
              <div className="compare-checkbox flex w-full">
                  <input
                      type="checkbox"
                      id={product?.ingramPartNumber}
                      checked={checkedItems[product?.ingramPartNumber] || false}
                      onChange={() => handleCheckboxChange(product?.ingramPartNumber || '')}
                      
                    />
                    <label htmlFor={product?.ingramPartNumber}>Add to Compare</label>
              </div>

              <div className="mobilr-flex">
              <div className="w-full mt-2 mb-2 justItem">
              <div className="">
                  {product.pricing?.customerPrice ? (
                    <>
                  <h6 className="text-1xl lg:text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(product.pricing.customerPrice)}
                  </h6>
                  <p>MSRP  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(product.pricing.retailPrice)} </p>
                  <p>EXCL TAX</p>
                  </>
                ) : (
                  <h6 className="text-1xl lg:text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(0.0)}
                  </h6>
                )}
                  </div>

              </div>
              <div className="w-full mt-2 mb-2 justItem">
              <CartQuantityActionBtns 
                  product={product}
                  id={product.ingramPartNumber}
                  />
              </div>

              </div>

          </div>




 </div>
))}

</div>
    
  );
};

export default ProductList;
