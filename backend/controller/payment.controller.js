import { Router } from 'express'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import Stripe from 'stripe'

const router = Router()

// Lazy init: server.js imports app before dotenv.config() runs, so env vars
// from config/.env are not available at module load time.
let stripeClient
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeClient = new Stripe(key)
  }
  return stripeClient
}

router.post('/process',catchAsyncErrors(async (req,res,next)=>{
    
    const stripe = getStripe()
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "USD",
      metadata: {
        company: "e-comShop",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
}))


router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);


export default router