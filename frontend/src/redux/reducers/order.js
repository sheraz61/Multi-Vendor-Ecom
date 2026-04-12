import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const orderReducer = createReducer(initialState, (builder) => {
    builder
        // get all order  of a user
        .addCase('getAllOrdersUserRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllOrdersUserSuccess', (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase('getAllOrdersUserFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
