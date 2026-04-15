
import ErrorHandler from "../utils/ErrorHandler.js";

import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import express from 'express'
import { Router } from "express";
import  upload from "../middleware/multer.js";
import Messages from "../model/messages.model.js";
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router()


// create new Message

router.post('/create-new-message', upload.single('images'), catchAsyncErrors(async (req, res, next) => {
  try {

    const messageData = req.body;
    if (req.file) {
      const image = await uploadToCloudinary(req.file.path, "messages");
      messageData.images = image;
    }

    messageData.conversationId = req.body.conversationId
    messageData.sender = req.body.sender
    messageData.text = req.body.text

    const message = new Messages({
      conversationId: messageData.conversationId,
      sender: messageData.sender,
      text: messageData.text,
      images: messageData.images || undefined,


    })

    await message.save()

    res.status(201).json({
      success: true,
      message
    })
  } catch (error) {
    return next(new ErrorHandler(error.response.message), 500)

  }
}))

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);



export default router