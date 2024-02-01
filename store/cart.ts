import { useEffect, useState } from 'react'
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VeeCartItem } from "@/types/types";


interface CartState {
  cartItems: VeeCartItem[];
  addItemToCart: (item: VeeCartItem) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeItemFromCart: (productId: any) => void;
  removeMultipleItemsFromCart: (productIds: any[]) => void;
  clearCart: () => void;
}



const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cartItems: [],

      addItemToCart: (item) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem.ingramPartNumber === item.ingramPartNumber
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            itemExists.quantity++;
          }

          set({ cartItems: [...get().cartItems] });
        } else {
          set({ cartItems: [...get().cartItems, { ...item, quantity: 1 }] });
        }
      },

      increaseQuantity: (productId) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem.ingramPartNumber === productId
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            itemExists.quantity++;
          }

          set({ cartItems: [...get().cartItems] });
        }
      },
      decreaseQuantity: (productId) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem.ingramPartNumber === productId
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            if (itemExists.quantity === 1) {
              const updatedCartItems = get().cartItems.filter(
                (item) => item.ingramPartNumber !== productId
              );
              set({ cartItems: updatedCartItems });
            } else {
              itemExists.quantity--;
              set({ cartItems: [...get().cartItems] });
            }
          }
        }
      },

      removeItemFromCart: (productId) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem.ingramPartNumber === productId
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            const updatedCartItems = get().cartItems.filter(
              (item) => item.ingramPartNumber !== productId
            );
            set({ cartItems: updatedCartItems });
          }
        }
      },

      removeMultipleItemsFromCart: (productIds) => {
        const updatedCartItems = get().cartItems.filter(
          (item) => !productIds.includes(item.ingramPartNumber)
        );
        set({ cartItems: updatedCartItems });
      },

      clearCart: () => {
        // Set cartItems to an empty array
        set({ cartItems: [] });
      },
      
    }),
    {
      name: "cart-items",
    }
  )
);

export default useCartStore;