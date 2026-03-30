import { Router } from 'express'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.js'
import { isSeller } from '../middleware/auth.js'
import CouponCode from '../model/couponCode.model.js'


const router = Router()
// create coupoun code 

router.post('/create-coupon-code',isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
        const isCouponCode=await CouponCode.findOne({name:req.body.name})
        
        
        if(isCouponCode){
        return next(new ErrorHandler('coupon code alread exist', 400))
        }

        const couponCode= await CouponCode.create(req.body)

        res.status(201).json({
            success:true,
            couponCode
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))



// get all coupon code

router.get('/get-coupon/:id',isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
        const couponCodes= await CouponCode.find({shopId:req.params.id});
        res.status(201).json({
            success:true,
            couponCodes
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))


export default router
