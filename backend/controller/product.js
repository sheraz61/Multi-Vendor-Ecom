import { Router } from 'express'
import Product from '../model/product.js'
import { upload } from '../multer.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.js'
import { isAuthenticated, isSeller } from '../middleware/auth.js'
import fs from 'fs'
import Order from '../model/order.model.js'
import mongoose from 'mongoose'



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

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

export default router