import express from 'express'
import { Router } from 'express'
import cloudinary from "cloudinary"
import Shop from '../model/shop.model.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import jwt from 'jsonwebtoken'
import sendMail from '../utils/sendMail.js'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import sendShopToken from '../utils/shopToken.js'
import { isAdmin, isAuthenticated, isSeller } from '../middleware/auth.js'
import Product from '../model/product.model.js'
import Event from '../model/event.model.js'
const router = Router()

// create shop
router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
        });


        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);

        const activationUrl = `https://multi-vendor-ecom-seven.vercel.app/shop/activation/${activationToken}`;

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
        expiresIn: "24h",
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
// load shop
router.get(
    "/get-seller",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.seller._id);

            if (!seller) {
                return next(new ErrorHandler("User doesn't exists", 400));
            }

            res.status(200).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// log out from shop
router.get(
    "/logout",
    catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie("seller_token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.status(201).json({
                success: true,
                message: "Log out successful!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get shop info
router.get(
    "/get-shop-info/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.params.id);
            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// update shop profile picture
router.put(
    "/update-shop-avatar",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            let existsSeller = await Shop.findById(req.seller._id);

            const imageId = existsSeller.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
            });

            existsSeller.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };


            await existsSeller.save();
            await Product.updateMany(
                { shopId: req.seller.id },
                {
                    $set: {
                        shop: existsSeller, // 🔥 overwrite full shop object
                    },
                }
            );
            await Event.updateMany(
                { shopId: req.seller.id },
                {
                    $set: {
                        shop: existsSeller, // 🔥 overwrite full shop object
                    },
                }
            );
            res.status(200).json({
                success: true,
                seller: existsSeller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update seller info
router.put(
    "/update-seller-info",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description, address, phoneNumber, zipCode } = req.body;

            const shop = await Shop.findById(req.seller._id);

            if (!shop) {
                return next(new ErrorHandler("User not found", 400));
            }

            shop.name = name;
            shop.description = description;
            shop.address = address;
            shop.phoneNumber = phoneNumber;
            shop.zipCode = zipCode;

            await shop.save();
            await Product.updateMany(
                { shopId: req.seller.id },
                {
                    $set: {
                        shop: shop, // 🔥 overwrite full shop object
                    },
                }
            );
            await Event.updateMany(
                { shopId: req.seller.id },
                {
                    $set: {
                        shop: shop, // 🔥 overwrite full shop object
                    },
                }
            );
            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// all sellers --- for admin
router.get(
    "/admin-all-sellers",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const sellers = await Shop.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                sellers,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller ---admin
router.delete(
    "/delete-seller/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.params.id);

            if (!seller) {
                return next(
                    new ErrorHandler("Seller is not available with this id", 400)
                );
            }

            await Shop.findByIdAndDelete(req.params.id);

            res.status(201).json({
                success: true,
                message: "Seller deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update seller withdraw methods --- sellers
router.put(
    "/update-payment-methods",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { withdrawMethod } = req.body;

            const seller = await Shop.findByIdAndUpdate(req.seller._id, {
                withdrawMethod,
            });

            res.status(201).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller withdraw merthods --- only seller
router.delete(
    "/delete-withdraw-method/",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.seller._id);

            if (!seller) {
                return next(new ErrorHandler("Seller not found with this id", 400));
            }

            seller.withdrawMethod = null;

            await seller.save();

            res.status(201).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


export default router
