import React, { useEffect, useState } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
} from "@/services/requestAll.service";
import toast from "react-hot-toast";
import {
	isUserLoggedIn
} from "@/auth/auth";
import useCartStore from "@/store/cart";
import { VeeCartItem } from "@/types/types";



interface CartQuantityActionBtnsProps {
  product: {
    description?: any;
    product_name?: string;
    price_details?: any;
    pricing?: any;
    images_url?: any
    
  } | null;
  id: string;
  hideButton?: boolean;
}

const CartQuantityActionBtns: React.FC<CartQuantityActionBtnsProps> = ({ product, id, hideButton }) => {
    const { cartItems, addItemToCart, increaseQuantity, decreaseQuantity } = useCartStore();
    const [itemInCart, setItemInCart] = useState<VeeCartItem | undefined>();
    const isLoggedIn = isUserLoggedIn();
    const isInCart = itemInCart && itemInCart.quantity > 0;

  
    useEffect(() => {
      if (!cartItems) return;
      if (!product) return;
  
      const item = cartItems.find(
        (item) => item.ingramPartNumber === id
      );
  
      setItemInCart(item);
    }, [cartItems, product, id]);
  
    const _handleAddToCart = () => {

      let imageUrl = "";
      if (product) {
        if (product?.images_url && product?.images_url.length > 0) {
          imageUrl = product.images_url[0]?.url;
        } else if (Array.isArray(product) && product.length > 0 && product[0].images_url) {
          imageUrl = product[0].images_url[0]?.url;
        }
      }

      const newItem: VeeCartItem = {
        ingramPartNumber: id,
        quantity: 1,
        description: product?.description || 
        (Array.isArray(product) && product.length > 0 ? product[0]?.description : "") ||
        "",
        image_url: imageUrl || "/images/no-image-icon.png",
        price: product?.price_details?.pricing?.customerPrice || product?.pricing?.customerPrice,

      };
  
      if (!isLoggedIn) {
        // Save to cart store if the user is not logged in
        addItemToCart(newItem);
      } else {
        addItemToCart(newItem);
      }
      toast.success("Added to cart", {});
    };
  
    const _increaseCartQuantity = () => {
      if (itemInCart) {
        increaseQuantity(itemInCart.ingramPartNumber);
        toast.success("Quantity increased", {});
      }
    };
  
    const _decreaseCartQuantity = () => {
      if (itemInCart) {
        decreaseQuantity(itemInCart.ingramPartNumber);
        toast.success("Quantity decreased", {});
      }
    };
  
    return (
      <div className="flex items-center w-[100px] ">
        {isInCart ? (
          <div className="flex-1 flex justify-between border-2 rounded-md w-[76px]">
            <button
              className="px-2 py-[2px] text-gray-700"
              onClick={_decreaseCartQuantity}
            >
              -
            </button>
            <p className="px-2 py-[2px]">{itemInCart.quantity}</p>
            <button
              className="px-2 py-[2px] text-gray-700"
              onClick={_increaseCartQuantity}
            >
              +
            </button>
          </div>
        ) : null} {/* Use null to hide the element */}
        {!hideButton && ( 
          <button
            className={`flex-1 py-[2px] rounded-md inline-block border-2 border-current w-[76px] ${
              !isInCart ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 ml-2 disabled-cart-btn"
            }`}
            onClick={!isInCart ? _handleAddToCart : undefined}
            disabled={isInCart}
          >
            <AddShoppingCartIcon fontSize="small" />
          </button>
        )}
      </div>
    );
  };
  
  export default CartQuantityActionBtns;
