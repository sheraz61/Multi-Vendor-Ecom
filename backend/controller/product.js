import { Router } from 'express'
import Product from '../model/product.js'
import { upload } from '../multer.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.js'
import { isSeller } from '../middleware/auth.js'
import fs from 'fs'



const router = Router()
router.post('/create-product', upload.array('images'), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId
        const shop = await Shop.findById(shopId)
        if (!shop) {
            return next(new ErrorHandler('Shop did not exist', 404))
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`)
            const productData = req.body;
            productData.images = imageUrls
            productData.shop = shop
            const product = await Product.create(productData)

            res.status(201).json({
                success: true,
                product
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))

//get all product of the shop
router.get('/get-all-products-shop/:id', catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id })
        res.status(201).json({
            success: true,
            products
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))

    }
}))


//delete product
router.delete('/delete-shop-product/:id',isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
        const productId = req.params.id
        const productData=await Product.findById(productId)

        if (!productData){
        return next(new ErrorHandler('Product not found with this id', 500))
        }

        productData.images.forEach((imgUrl)=>{
            const filename = imgUrl
            const filePath=`uploads/${filename}`

            fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err);
                
            }
            })
        })
        const product=await Product.findByIdAndDelete(productId)
        
        res.status(200).json({
            success:true,
            message:'Product delete successfully',
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))
        
    }
}))

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


export default router