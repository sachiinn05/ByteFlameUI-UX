import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import { removeConnection } from "../utils/connectionSlice";
import {
  setOnlineUsers,
  setTyping,
  setUnread,
  setUserOffline,
  setUserOnline,
} from "../utils/presenceSlice";

const PresenceListener = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    socket.emit("presence:join", { userId });

    const onList = ({ userIds }) => {
      dispatch(setOnlineUsers((userIds || []).map(String)));
    };
    const onUpdate = ({ userId: id, online }) => {
      if (online) dispatch(setUserOnline(id));
      else dispatch(setUserOffline(id));
    };
    const onUnread = ({ fromUserId, unreadCount }) => {
      dispatch(setUnread({ fromUserId, unreadCount }));
    };
    const onTyping = ({ userId: id, isTyping }) => {
      dispatch(setTyping({ userId: id, isTyping }));
    };

    const onEnded = ({ userId: otherId }) => {
      dispatch(removeConnection(otherId));
    };

    socket.on("presence:list", onList);
    socket.on("presence:update", onUpdate);
    socket.on("unread:update", onUnread);
    socket.on("typing", onTyping);
    socket.on("relationship:ended", onEnded);

    return () => {
      socket.off("presence:list", onList);
      socket.off("presence:update", onUpdate);
      socket.off("unread:update", onUnread);
      socket.off("typing", onTyping);
      socket.off("relationship:ended", onEnded);
    };
  }, [dispatch, userId]);

  return null;
};

export default PresenceListener;
