import { Router } from 'express'
import Event from '../model/event.model.js'
import { upload } from '../multer.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.model.js'
import { isAdmin, isAuthenticated, isSeller } from '../middleware/auth.js'
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


// delete event of a shop
router.delete(
    "/delete-shop-event/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                return next(new ErrorHandler("Event is not found with this id", 404));
            }

            //   for (let i = 0; 1 < event.images.length; i++) {
            //     const result = await cloudinary.v2.uploader.destroy(
            //       event.images[i].public_id
            //     );
            //   }
            event.images.forEach((imgUrl) => {
                const filename = imgUrl
                const filePath = `uploads/${filename}`

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);

                    }
                })
            })
            await Event.findByIdAndDelete(req.params.id)



            res.status(201).json({
                success: true,
                message: "Event Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


// get all events
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});


// all events --- for admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);



export default router
