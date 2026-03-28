import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.product = action.payload;
        })
        .addCase("productCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // get all products of shop
        .addCase('getAllProductsShopRequest',(state)=>{
            state.isLoading=true;
        })
        .addCase('getAllProductsShopSuccess',(state,action)=>{
            state.isLoading=false;
            state.products=action.payload;
        })
        .addCase('getAllProductsShopFail',(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        })

        // delete product of shop
         .addCase('deleteProductRequest',(state)=>{
            state.isLoading=true;
        })
        .addCase('deleteProductSuccess',(state,action)=>{
            state.isLoading=false;
            state.message=action.payload;
        })
        .addCase('deleteProductFail',(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
