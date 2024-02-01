import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCartStore } from "@/hooks/store/cart.store";
import { isUserLoggedIn } from "@/auth/auth";
import { addToCart, fetchCart, removeFromCart, updateCart } from "@/services/requestAll.service";

export default function CartQualityActionBtns({ product, id }) {
  const { cart, setCart, updateLocalCart, removeFromLocalCart } = useCartStore();
  const [itemInCart, setItemInCart] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isUserLoggedIn());
    const fetchCartData = async () => {
      try {
        const { data } = await fetchCart();
        if (data) {
          setCart(data);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    if (!cart || !product) return;
    const item = cart.find((item) =>
      isAuthenticated ? item.product_name === (product.description || product.product_name) : item.itemid === id
    );
    setItemInCart(item);
  }, [cart, product, isAuthenticated, id]);

  const _handleAddToCart = () => {
    toast.success("Added to cart", {});
    const newItem = {
	  description: product.description,
      itemid: id,
      quantity: 1,
      image_url: "",
      price: product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice,
      unitprice: product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice,
    };
    if (!isAuthenticated) {
      updateLocalCart(newItem);
      setItemInCart(newItem);
    } else {
      addToCart({ ingramPartNumber: id, quantity: 1, image_url: "" }).then(() => {
        fetchCart().then(({ data }) => setCart(data));
      });
    }
  };

  const _increaseCartQuantity = () => {
	toast.success(`${product?.description} quantity increased in cart`, {});
	setItemInCart((prev) => ({
		...prev,
		quantity: parseInt(prev.quantity) + 1,
		price: (itemInCart.quantity + 1) * (product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice),
	}));
	if (!isAuthenticated) {
		updateLocalCart({
			itemid: id,
			quantity: itemInCart.quantity + 1,
			image_url: "",
			price: (itemInCart.quantity + 1) * (product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice),
			unitprice: product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice,
		});
	} else {
		updateCart({
			itemid: itemInCart.itemid,
			quantity: parseInt(itemInCart.quantity) + 1,
		}).then(() => init());
	}
};


const _decreaseCartQuantity = () => {
	toast.success(`${product?.description} quantity decreased in cart`, {});
	if (parseInt(itemInCart?.quantity) < 2) {
		if (parseInt(itemInCart < 1)) return;
		if (!isAuthenticated) return removeFromLocalCart(itemInCart.itemid);
		return removeFromCart(itemInCart.itemid).then(() => init());
	}
	setItemInCart((prev) => ({
		...prev,
		quantity: parseInt(prev.quantity) - 1,
		price: (itemInCart.quantity - 1) * (product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice),
	}));
	if (!isAuthenticated) {
		updateLocalCart({
			itemid: id,
			quantity: itemInCart.quantity - 1,
			image_url: "",
			price: (itemInCart.quantity - 1) * (product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice),
			unitprice: product?.price_details?.pricing?.customerPrice || product?.[0]?.price_details?.pricing?.customerPrice,
		});
	} else {
		updateCart({
			itemid: itemInCart.itemid,
			quantity: parseInt(itemInCart.quantity) - 1,
		}).then(() => init());
	}
};

  // Rest of your component code...

  return (
    <div className="flex items-center w-[100px] ">
        {itemInCart ? (
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
        ) : (
          <></>
        )}
        <button
          className={`flex-1 py-[2px] rounded-md inline-block border-2 border-current w-[76px] ${
            !itemInCart ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 ml-2 disabled-cart-btn"
          }`}
          onClick={!itemInCart ? _handleAddToCart : undefined}
          disabled={itemInCart}
        >
          <AddShoppingCartIcon fontSize="small" />
        </button>

      </div>
  );
}
