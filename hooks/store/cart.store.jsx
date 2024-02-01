import { create } from "zustand";
import { combine } from "zustand/middleware";

const STORAGE_KEY = "cart";

export const useCartStore = create(
  combine(
    {
      cart: [],
    },
    (set) => ({
      setCart: (cart) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        set({ cart });
      },
      updateLocalCart: (item) => {
        set((state) => {
          const updatedCart = [...state.cart];
          const index = updatedCart.findIndex(
            (cartItem) => cartItem.itemid === item.itemid
          );
          if (index !== -1) {
            updatedCart[index] = item;
          } else {
            updatedCart.push(item);
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
          return { cart: updatedCart };
        });
      },
      removeFromLocalCart: (itemid) =>
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.itemid !== itemid);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
          return { cart: updatedCart };
        }),
    }),
    () => {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      return savedCart ? { cart: JSON.parse(savedCart) } : undefined;
    }
  )
);
