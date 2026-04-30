import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [socket, setSocket] = useState(null); // ✅ Store single socket
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);


  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

 
  const fetchTargetUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      const users = res.data.data || [];
      const foundUser = users.find((u) => u._id === targetUserId);
      setTargetUser(foundUser);
    } catch (err) {
      console.error("Error fetching target user:", err);
    }
  };


  useEffect(() => {
    if (!userId) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    newSocket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => newSocket.disconnect();
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChatMessages();
    fetchTargetUser();
  }, []);

 
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

return (
  <div className="flex flex-col h-[85vh] max-w-5xl mx-auto mt-6 
  rounded-3xl overflow-hidden 
  bg-gradient-to-br from-[#020617] via-[#0f172a] to-black 
  border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

  
    <div className="flex items-center gap-4 px-5 py-4 
    border-b border-white/10 bg-white/5 backdrop-blur-xl">

      <img
        src={
          targetUser?.photoUrl ||
          `https://api.multiavatar.com/${targetUserId}.svg`
        }
        alt="user"
        className="w-12 h-12 rounded-full object-cover border border-white/20"
      />

      <div>
        <h2 className="text-white font-semibold text-lg">
          {targetUser
            ? `${targetUser.firstName} ${targetUser.lastName || ""}`
            : "Loading..."}
        </h2>
        <p className="text-xs text-green-400">● Online</p>
      </div>
    </div>

   
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">

      {messages.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Start the conversation 🚀
        </p>
      ) : (
        messages.map((msg, index) => {
          const isOwn = msg.firstName === user.firstName;

          return (
            <div
              key={index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm 
                shadow-lg backdrop-blur-md ${
                  isOwn
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-white/10 text-gray-200 border border-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })
      )}

      <div ref={messagesEndRef}></div>
    </div>

  
    <div className="flex items-center gap-3 p-4 
    border-t border-white/10 bg-white/5 backdrop-blur-xl">

      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-xl 
        bg-white/10 border border-white/10 
        text-white placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
      />

      <button
        onClick={sendMessage}
        className="px-5 py-2 rounded-xl 
        bg-gradient-to-r from-pink-500 to-purple-500 
        text-white font-medium shadow-lg 
        hover:scale-105 transition"
      >
        Send
      </button>
    </div>
  </div>
);
};

export default Chat;
