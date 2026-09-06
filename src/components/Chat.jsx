import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSocket } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { setTyping, setUnread } from "../utils/presenceSlice";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const onlineUserIds = useSelector((store) => store.presence.onlineUserIds);
  const isTargetTyping = useSelector(
    (store) => store.presence.typingByUserId[String(targetUserId)]
  );
  const isOnline = onlineUserIds.includes(String(targetUserId));
  const userId = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

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
          senderId: senderId?._id || senderId,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      if (error?.response?.status === 403) {
        setBlocked(true);
      }
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

    const socket = getSocket();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });
    socket.emit("markRead", { userId, targetUserId });
    dispatch(setUnread({ fromUserId: targetUserId, unreadCount: 0 }));

    const onMessage = ({ firstName, lastName, text, senderId }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text, senderId }]);
      if (String(senderId) === String(targetUserId)) {
        socket.emit("markRead", { userId, targetUserId });
      }
    };

    const onEnded = ({ userId: otherId }) => {
      if (String(otherId) === String(targetUserId)) {
        setBlocked(true);
      }
    };

    socket.on("messageReceived", onMessage);
    socket.on("relationship:ended", onEnded);

    return () => {
      socket.emit("typing", { userId, targetUserId, isTyping: false });
      socket.emit("leaveChat", { userId, targetUserId });
      socket.off("messageReceived", onMessage);
      socket.off("relationship:ended", onEnded);
      dispatch(setTyping({ userId: targetUserId, isTyping: false }));
    };
  }, [userId, targetUserId, user?.firstName, dispatch]);

  useEffect(() => {
    fetchChatMessages();
    fetchTargetUser();
  }, [targetUserId]);

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    socket.emit("typing", { userId, targetUserId, isTyping });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 800);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !userId || blocked) return;
    const socket = getSocket();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    emitTyping(false);
    clearTimeout(typingTimeout.current);
    setNewMessage("");
  };

  const handleBlock = async () => {
    const ok = window.confirm(
      "Block this person? They will be removed and hidden from your feed and chat."
    );
    if (!ok) return;
    setBusy(true);
    try {
      await axios.post(
        `${BASE_URL}/request/block/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      navigate("/connections");
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTargetTyping]);

  if (blocked) {
    return (
      <div className="text-center mt-20 text-gray-300">
        <p className="text-xl font-semibold">Chat is no longer available</p>
        <p className="text-sm text-gray-500 mt-2">
          This match was unmatched or blocked.
        </p>
        <button
          onClick={() => navigate("/connections")}
          className="mt-6 px-5 py-2 rounded-xl bg-pink-500 text-white"
        >
          Back to connections
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[85vh] max-w-5xl mx-auto mt-6 
  rounded-3xl overflow-hidden 
  bg-gradient-to-br from-[#020617] via-[#0f172a] to-black 
  border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      <div
        className="flex items-center gap-4 px-5 py-4 
    border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="relative">
          <img
            src={
              targetUser?.photoUrl
                ? resolvePhotoUrl(targetUser.photoUrl)
                : `https://api.multiavatar.com/${targetUserId}.svg`
            }
            alt="user"
            className="w-12 h-12 rounded-full object-cover border border-white/20"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              isOnline ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg leading-tight">
            {targetUser
              ? `${targetUser.firstName} ${targetUser.lastName || ""}`
              : "Loading..."}
          </h2>
          <p className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
            {isTargetTyping ? "typing..." : isOnline ? "● Online" : "Offline"}
          </p>
        </div>
        <button
          disabled={busy}
          onClick={handleBlock}
          className="px-4 py-2 rounded-full bg-red-500/80 text-white text-sm hover:bg-red-500 disabled:opacity-50"
        >
          Block
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Start the conversation 🚀
          </p>
        ) : (
          messages.map((msg, index) => {
            const isOwn =
              String(msg.senderId) === String(userId) ||
              msg.firstName === user.firstName;

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

        {isTargetTyping && (
          <p className="text-xs text-gray-400">typing...</p>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div
        className="flex items-center gap-3 p-4 
    border-t border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <input
          value={newMessage}
          onChange={handleInputChange}
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
