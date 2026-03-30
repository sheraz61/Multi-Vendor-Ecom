import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("eventCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("eventCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.event = action.payload;
        })
        .addCase("eventCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // get all events of shop
        .addCase('getAllEventsShopRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllEventsShopSuccess', (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase('getAllEventsShopFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // delete event of shop
        .addCase('deleteEventRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('deleteEventSuccess', (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase('deleteEventFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        //get all events
        .addCase('getAllEventsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllEventsSuccess', (state, action) => {
            state.isLoading = false;
            state.allEvents = action.payload;
        })
        .addCase('getAllEventsFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
