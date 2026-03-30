import { Router } from 'express'
import Event from '../model/event.model.js'
import { upload } from '../multer.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.js'
import { isSeller } from '../middleware/auth.js'
import fs from 'fs'


const router = Router()
router.post('/create-event', upload.array('images'), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId
        const shop = await Shop.findById(shopId)
        if (!shop) {
            return next(new ErrorHandler('Shop did not exist', 404))
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`)
            const eventData = req.body;
            eventData.images = imageUrls
            eventData.shop = shop
            const event = await Event.create(eventData)

            res.status(201).json({
                success: true,
                event
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))


//get all event of the shop
router.get('/get-all-events/:id', catchAsyncErrors(async (req, res, next) => {
    try {
        const events = await Event.find({ shopId: req.params.id })
        res.status(201).json({
            success: true,
            events
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))

    }
}))


//delete product
router.delete('/delete-shop-event/:id',isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
       const eventId = req.params.id
        const eventData=await Event.findById(eventId)

        if (!eventData){
        return next(new ErrorHandler('Event not found with this id', 500))
        }

        eventData.images.forEach((imgUrl)=>{
            const filename = imgUrl
            const filePath=`uploads/${filename}`

            fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err);
                
            }
            })
        })
        const event=await Event.findByIdAndDelete(eventId)
        res.status(200).json({
            success:true,
            message:'Event delete successfully',
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))
        
    }
}))



export default router
