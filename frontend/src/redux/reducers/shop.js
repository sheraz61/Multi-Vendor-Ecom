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

        // get all sellers ---admin
        .addCase("getAllSellersRequest", (state) => {
            state.loadingSeller = true;
        })
        .addCase("getAllSellersSuccess", (state, action) => {
            state.loadingSeller = false;
            state.sellers = action.payload;
        })
        .addCase("getAllSellersFailed", (state, action) => {
            state.loadingSeller = false;
            state.error = action.payload;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
