import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema(
     {
    groupTitle:{
        type: String,
    },
    members: {
      type: Array,
    },
    lastMessage: {
      type: String,
    },
    lastMessageId: {
      type: String,
    },
  },
  { timestamps: true }
);

 const Conversation = mongoose.model("Conversation", conversationSchema);
 export default Conversation