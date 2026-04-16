import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/style";
const ENDPOINT = "https://chat-server-45wh.onrender.com";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user,loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(
          `${server}/message/create-new-message`,
          {
            images: e,
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          }
        )
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
  <div className="w-full min-h-screen bg-gray-50">
    {!open && (
      <>
        <Header />
        <div className="max-w-2xl mx-auto pt-6 pb-10">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Messages</h1>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {conversations && conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </>
    )}
    {open && (
      <SellerInbox
        setOpen={setOpen}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessageHandler={sendMessageHandler}
        messages={messages}
        sellerId={user._id}
        userData={userData}
        activeStatus={activeStatus}
        scrollRef={scrollRef}
        handleImageUpload={handleImageUpload}
      />
    )}
  </div>
);
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
  <div
    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors
      ${active === index ? "bg-teal-50" : "hover:bg-gray-50"}`}
    onClick={(e) =>
      setActive(index) ||
      handleClick(data._id) ||
      setCurrentChat(data) ||
      setUserData(user) ||
      setActiveStatus(online)
    }
  >
    <div className="relative shrink-0">
      <img src={`${user?.avatar?.url}`} alt="" className="w-11 h-11 rounded-full object-cover" />
      <span className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white
        ${online ? "bg-green-400" : "bg-gray-300"}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
      <p className="text-xs text-gray-400 truncate">
        {!loading && data?.lastMessageId !== userData?._id
          ? "You: "
          : (userData?.name?.split(" ")[0] + ": ")}{" "}
        {data?.lastMessage}
      </p>
    </div>
  </div>
);
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
 return (
  <div className="w-full h-screen flex flex-col bg-white">

    {/* Header */}
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img src={`${userData?.avatar?.url}`} alt="" className="w-11 h-11 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
          {activeStatus && <p className="text-xs text-teal-500 font-medium">● Active now</p>}
        </div>
      </div>
      <button
        onClick={() => setOpen(false)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
      >
        <AiOutlineArrowRight size={18} className="text-gray-500" />
      </button>
    </div>

    {/* Messages */}
    <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3">
      {messages && messages.map((item, index) => (
        <div
          key={index}
          className={`flex w-full ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
          ref={scrollRef}
        >
          {item.sender !== sellerId && (
            <img src={`${userData?.avatar?.url}`} className="w-8 h-8 rounded-full mr-2 self-end" alt="" />
          )}
          <div className="flex flex-col max-w-[65%]">
            {item.images && (
              <img src={`${item.images?.url}`} className="w-[220px] h-[220px] object-cover rounded-xl mb-1" />
            )}
            {item?.text !== "" && (
              <>
                <div className={`px-4 py-2 rounded-2xl text-sm text-white
                  ${item?.sender === sellerId
                    ? "bg-gray-800 rounded-br-none"
                    : "bg-teal-600 rounded-bl-none"}`}>
                  <p>{item?.text}</p>
                </div>
                <p className={`text-[11px] text-gray-400 mt-1 ${item.sender === sellerId ? "text-right" : "text-left"}`}>
                  {format(item.createdAt)}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Input */}
    <form
      onSubmit={sendMessageHandler}
      className="px-4 py-3 border-t border-gray-100 flex items-center gap-3 bg-white"
    >
      <div className="shrink-0">
        <input type="file" id="image" className="hidden" onChange={handleImageUpload} />
        <label htmlFor="image">
          <TfiGallery size={20} className="cursor-pointer text-gray-400 hover:text-teal-600 transition" />
        </label>
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          required
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <input type="submit" value="Send" className="hidden" id="send" />
        <label htmlFor="send">
          <AiOutlineSend size={18} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-teal-600" />
        </label>
      </div>
    </form>
  </div>
);
};

export default UserInbox;