import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './reducers/user'
import { shopReducer } from './reducers/shop'
import { productReducer } from './reducers/product'
import { eventReducer } from './reducers/event'
import { cartReducer } from './reducers/cart'
import { wishlistReducer } from './reducers/wishlist'

const Store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        products:productReducer,
        events:eventReducer,
        cart:cartReducer,
        wishlist:wishlistReducer,
    }
})


export default Store;