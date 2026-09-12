import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSocket } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { setTyping, setUnread } from "../utils/presenceSlice";
import IcebreakerPanel from "./IcebreakerPanel";

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

  const sendMessage = (textOverride) => {
    const text = (typeof textOverride === "string" ? textOverride : newMessage).trim();
    if (!text || !userId || blocked) return;
    const socket = getSocket();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text,
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
      await axios.post(`${BASE_URL}/request/block/${targetUserId}`, {}, { withCredentials: true });
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
      <div className="max-w-md mx-auto text-center surface-card p-8 mt-8">
        <h1 className="text-lg font-semibold">Chat is no longer available</h1>
        <p className="page-sub">This match was unmatched or blocked.</p>
        <button type="button" onClick={() => navigate("/connections")} className="btn-primary mt-6">
          Back to matches
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8.5rem)] max-w-3xl mx-auto surface-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className="relative">
          <img
            src={
              targetUser?.photoUrl
                ? resolvePhotoUrl(targetUser.photoUrl)
                : `https://api.multiavatar.com/${targetUserId}.svg`
            }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${
              isOnline ? "bg-emerald-400" : "bg-zinc-600"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm truncate">
            {targetUser ? `${targetUser.firstName} ${targetUser.lastName || ""}` : "Loading…"}
          </h2>
          <p className="text-xs text-zinc-500">
            {isTargetTyping ? "Typing…" : isOnline ? "Online" : "Offline"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <IcebreakerPanel
            compact
            targetUserId={targetUserId}
            sendLabel="Send"
            onSend={(line) => sendMessage(line)}
          />
          <button type="button" disabled={busy} onClick={handleBlock} className="btn-danger min-h-10 text-sm">
            Block
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm mt-10">No messages yet. Say hello.</p>
        ) : (
          messages.map((msg, index) => {
            const isOwn =
              String(msg.senderId) === String(userId) || msg.firstName === user.firstName;
            return (
              <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    isOwn ? "bg-rose-600 text-white" : "bg-zinc-900 text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        {isTargetTyping && <p className="text-xs text-zinc-500">Typing…</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-zinc-800">
        <input
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message"
          className="input-field flex-1"
          aria-label="Message"
        />
        <button type="button" onClick={sendMessage} className="btn-primary shrink-0">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
