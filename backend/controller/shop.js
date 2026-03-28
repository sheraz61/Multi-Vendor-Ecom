import express from 'express'
import path from 'path'
import { Router } from 'express'
import { upload } from '../multer.js'
import Shop from '../model/shop.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import jwt from 'jsonwebtoken'
import sendMail from '../utils/sendMail.js'
import fs from "fs";
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import sendShopToken from '../utils/shopToken.js'
import { isAuthenticated, isSeller } from '../middleware/auth.js'
const router = Router()

// create shop
router.post("/create-shop", upload.single('file'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            const filename = req.file.filename
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: 'Error deleting file',
                    })
                }
            })
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename;
        // const fileUrl=path.join(filename)
        const fileUrl = {
            public_id: filename,           // previously just the filename
            url: `/uploads/${filename}`
        }
        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);

        const activationUrl = `http://localhost:5173/shop/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}));

// create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;

            const newSeller = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );

            if (!newSeller) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const { name, email, password, avatar, zipCode, address, phoneNumber } =
                newSeller;

            let seller = await Shop.findOne({ email });

            if (seller) {
                return next(new ErrorHandler("User already exists", 400));
            }
            // Validate required fields
            if (!password) {
                console.error("Password is missing from token");
                return next(new ErrorHandler("Password is missing from activation token", 400));
            }

            if (!avatar || !avatar.public_id || !avatar.url) {

                return next(new ErrorHandler("Invalid avatar data in activation token", 400));
            }
            try {
                seller = await Shop.create({
                    name,
                    email,
                    avatar,
                    password,
                    zipCode,
                    address,
                    phoneNumber,
                });

                sendShopToken(seller, 201, res);
            } catch (error) {
                // If two activation requests arrive at the same time, one may win and
                // the other will hit the unique index on `email`.
                if (error?.code === 11000) {
                    const existing = await Shop.findOne({ email });
                    if (existing) return sendShopToken(existing, 200, res);
                }
                return next(new ErrorHandler(error.message, 500));

            }

        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// login shop 

router.post('/login-shop', catchAsyncErrors(async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler('Please provide all fields', 400))
        }
        const seller = await Shop.findOne({ email }).select('+password')
        if (!seller) {
            return next(new ErrorHandler('Shop not found', 404))
        }
        const isPasswordValid = await seller.comparePassword(password)
        if (!isPasswordValid) {
            return next(new ErrorHandler('Wrong password', 404))
        }
        sendShopToken(seller, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))
//load shop
router.get('/get-seller', isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller.id);
        if (!seller) {
            return next(new ErrorHandler('User not found', 404))

        }
        res.status(200).json({
            success: true,
            seller,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

//logout from shop
router.get('/shop-logout',isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
        res.cookie('seller_token',null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })
        res.status(201).json({
            success:true,
            message:'logout successfully'
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))
export default router
