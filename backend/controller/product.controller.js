import { Router } from 'express'
import Product from '../model/product.model.js'
import upload from '../middleware/multer.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import Shop from '../model/shop.model.js'
import { isAdmin, isAuthenticated, isSeller } from '../middleware/auth.js'
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js'
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
      const imageUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file.path, "products"))
      );
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
router.delete('/delete-shop-product/:id', isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id
    const productData = await Product.findById(productId)

    if (!productData) {
      return next(new ErrorHandler('Product not found with this id', 500))
    }

    await Promise.all(
      (productData.images || []).map((image) =>
        deleteFromCloudinary(image?.public_id)
      )
    );
    const product = await Product.findByIdAndDelete(productId)

    res.status(200).json({
      success: true,
      message: 'Product delete successfully',
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

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { rating, comment, productId, orderId } = req.body;

      // 1. Find product
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // 2. Create SAFE user object (only required fields)
      const userData = {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
      };

      // 3. Check existing review (FIXED ObjectId comparison)
      const existingReview = product.reviews.find(
        (rev) =>
          rev.user._id.toString() === req.user._id.toString()
      );

      if (existingReview) {
        // 4. Update ONLY one review
        existingReview.rating = rating;
        existingReview.comment = comment;
        existingReview.user = userData;
      } else {
        // 5. Add new review
        product.reviews.push({
          user: userData,
          rating,
          comment,
          productId,
        });
      }

      // 6. Recalculate average rating
      const total = product.reviews.reduce(
        (sum, rev) => sum + rev.rating,
        0
      );

      product.ratings = total / product.reviews.length;

      // 7. Save product
      await product.save({ validateBeforeSave: false });

      // 8. Mark order item as reviewed (FIXED)
       await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
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
// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


export default router