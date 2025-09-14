// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  items: [],
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemId = item.id || item._id; // normalize id

      const existingItem = state.items.find((i) => i.id === itemId);

      if (existingItem) {
        toast.error("Product already in cart");
      } else {
        state.items.push({ ...item, id: itemId, quantity: 1 });
        toast.success("Product added to cart");
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      toast.info("Product removed from cart");
    },
    clearCart: (state) => {
      state.items = [];
      toast.warn("Cart cleared");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = CartSlice.actions;
export default CartSlice.reducer;
