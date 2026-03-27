import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './reducers/user'
import { shopReducer } from './reducers/shop'

const Store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
    }
})


export default Store;