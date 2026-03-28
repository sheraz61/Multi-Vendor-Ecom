import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './reducers/user'
import { shopReducer } from './reducers/shop'
import { productReducer } from './reducers/product'

const Store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        products:productReducer,
    }
})


export default Store;