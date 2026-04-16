import express from 'express'
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
const app = express()
import cors from 'cors'
import bodyParser from 'body-parser';
import errorMiddleware from "./middleware/error.js";

app.use(cors(
    { 
        origin: "https://multi-vendor-ecom-seven.vercel.app",
       credentials:true
     }
))

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/test", (req, res) => {
  res.send("Hello world!");
});


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    config({
        path: "config/.env"
    })
}

// import routes
import userRouter from './controller/user.controller.js'
import shopRouter from './controller/shop.controller.js'
import productRouter from './controller/product.controller.js'
import eventRouter from './controller/event.controller.js'
import couponCodeRouter from './controller/couponCode.controller.js'
import paymentRouter from './controller/payment.controller.js'
import orderRouter from './controller/order.controller.js'
import conversationRouter from './controller/conversation.controller.js'
import messageRouter from './controller/message.controller.js'
import withdrawRouter from './controller/withdraw.controller.js'
app.use('/api/v2/user', userRouter)
app.use('/api/v2/shop', shopRouter)
app.use('/api/v2/product', productRouter)
app.use('/api/v2/event', eventRouter)
app.use('/api/v2/coupon', couponCodeRouter)
app.use('/api/v2/payment', paymentRouter)
app.use('/api/v2/order', orderRouter)
app.use('/api/v2/conversation', conversationRouter)
app.use('/api/v2/message', messageRouter)
app.use('/api/v2/withdraw', withdrawRouter)
// it's for ErrorHandling...
app.use(errorMiddleware)
export default app