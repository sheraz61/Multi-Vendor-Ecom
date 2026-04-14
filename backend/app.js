import express from 'express'
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
const app = express()
import cors from 'cors'
import errorMiddleware from "./middleware/error.js";
app.use(express.json());
app.use(cookieParser())
app.use('/',express.static("uploads"))

app.use(express.urlencoded({ extended: true }));
app.use(cors(
    { 
        origin: "http://localhost:5173",
       credentials:true
     }
))
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    config({
        path: "config/.env"
    })
}

// import routes
import userRouter from './controller/user.js'
import shopRouter from './controller/shop.js'
import productRouter from './controller/product.js'
import eventRouter from './controller/event.controller.js'
import couponCodeRouter from './controller/couponCode.controller.js'
import paymentRouter from './controller/payment.controller.js'
import orderRouter from './controller/order.controller.js'
import conversationRouter from './controller/conversation.controller.js'
import messageRouter from './controller/message.controller.js'
app.use('/api/v2/user', userRouter)
app.use('/api/v2/shop', shopRouter)
app.use('/api/v2/product', productRouter)
app.use('/api/v2/event', eventRouter)
app.use('/api/v2/coupon', couponCodeRouter)
app.use('/api/v2/payment', paymentRouter)
app.use('/api/v2/order', orderRouter)
app.use('/api/v2/conversation', conversationRouter)
app.use('/api/v2/message', messageRouter)
// it's for ErrorHandling...
app.use(errorMiddleware)
export default app