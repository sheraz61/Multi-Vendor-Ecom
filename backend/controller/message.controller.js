import Conversation from "../model/conversation.model.js";

import ErrorHandler from "../utils/ErrorHandler.js";

import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import express from 'express'
import { Router } from "express";
import { upload } from "../multer.js";
import Messages from "../model/messages.model.js";

const router  = Router()


// create new Message

router.post('/create-new-message', upload.array('images'),catchAsyncErrors(async(req,res ,next)=>{
    try {

            const messageData = req.body;
        if (req.files){
            const  files = req.files;
            const imageUrl=files.map((file)=>`${file.filename}`)

            messageData.images=imageUrl

        }

        messageData.conversationId= req.body.conversationId
        messageData.sender = req.body.sender
        messageData.text=req.body.text

        const message = new Messages({
            conversationId:messageData.conversationId,
            sender:messageData.sender,
            text:messageData.text,
            images:messageData.images? messageData.images : undefined,

        
        })

        await message.save()

        res.status(201).json({
            success:true,
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