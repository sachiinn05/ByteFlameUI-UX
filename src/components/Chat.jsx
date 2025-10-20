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

  // Fetch chat messages
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

  // Fetch target user info
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

  // Initialize socket only once
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

  // Send message through existing socket
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    // Add locally to UI immediately
    // setMessages((prev) => [
    //   ...prev,
    //   { firstName: user.firstName, lastName: user.lastName, text: newMessage },
    // ]);
    setNewMessage("");
  };

  // Auto scroll to bottom when new message comes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-3/4 mx-auto mt-6 border border-gray-700 rounded-2xl bg-gradient-to-b from-gray-900 via-gray-950 to-black shadow-2xl h-[75vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-gray-800/70 backdrop-blur-md sticky top-0 z-10">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={
                targetUser?.photoUrl ||
                `https://api.multiavatar.com/${targetUserId}.svg`
              }
              alt={targetUser?.firstName || "User"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white text-lg">
            Chat with{" "}
            <span className="text-secondary">
              {targetUser
                ? `${targetUser.firstName} ${targetUser.lastName || ""}`
                : "Loading..."}
            </span>
          </h2>
          <p className="text-xs text-gray-400">Online now 💬</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-950/40 backdrop-blur-sm">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.firstName === user.firstName;
            return (
              <div
                key={index}
                className={`flex items-end ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {/* Target user's photo beside their messages */}
                {!isOwn && (
                  <div className="avatar mr-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={
                          targetUser?.photoUrl ||
                          `https://api.multiavatar.com/${targetUserId}.svg`
                        }
                        alt={targetUser?.firstName || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                    isOwn
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/60 backdrop-blur-lg flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-secondary px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
};

export default Chat;
