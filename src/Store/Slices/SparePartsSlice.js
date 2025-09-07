// src/Store/Slices/sparePartsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: 1, name: "Brake Pad", price: 500, stock: 20 },
    { id: 2, name: "Clutch Plate", price: 1200, stock: 15 },
    { id: 3, name: "Engine Oil", price: 350, stock: 50 },
    { id: 4, name: "Air Filter", price: 250, stock: 30 },
  ],
};

const SparePartsSlice = createSlice({
  name: "spareParts",
  initialState,
  reducers: {}, // 🚫 no actions needed if only viewing
});

export default SparePartsSlice.reducer;
