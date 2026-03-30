import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './reducers/user'
import { shopReducer } from './reducers/shop'
import { productReducer } from './reducers/product'
import { eventReducer } from './reducers/event'

const Store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        products:productReducer,
        events:eventReducer,
    }
})


export default Store;