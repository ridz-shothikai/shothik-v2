import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pricingPlans: {},
};

const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    getPricingPlans: (state, action) => {
      state.pricingPlans = action.payload;
    },
  },
});

export const { getPricingPlans } = pricingSlice.actions;
export default pricingSlice.reducer;
