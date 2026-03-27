import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loadingSeller: true,
};

export const shopReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadSellerRequest", (state) => {
            state.loadingSeller = true;
        })
        .addCase("LoadSellerSuccess", (state, action) => {
            state.isSeller = true;
            state.loadingSeller = false;
            state.seller = action.payload;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.loadingSeller = false;
            state.error = action.payload;
            state.isSeller = false;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
