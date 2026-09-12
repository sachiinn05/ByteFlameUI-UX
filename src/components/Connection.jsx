import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, removeConnection } from "../utils/connectionSlice";
import { setUnreadBulk } from "../utils/presenceSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections) || [];
  const onlineUserIds = useSelector((store) => store.presence.onlineUserIds);
  const unreadByUserId = useSelector((store) => store.presence.unreadByUserId);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const handleAction = async (type, userId) => {
    const ok = window.confirm(
      type === "block"
        ? "Block this person? They will be removed and hidden from your feed and chat."
        : "Unmatch this person? You will no longer be connected."
    );
    if (!ok) return;
    setBusyId(userId);
    try {
      await axios.post(`${BASE_URL}/request/${type}/${userId}`, {}, { withCredentials: true });
      dispatch(removeConnection(userId));
    } catch (err) {
      console.log(err.message);
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        dispatch(addConnections(list));
        const unread = {};
        list.forEach((u) => {
          if (u?._id) unread[u._id] = u.unreadCount || 0;
        });
        dispatch(setUnreadBulk(unread));
      } catch (err) {
        console.log(err.message);
        dispatch(addConnections([]));
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        <h1 className="page-title">Matches</h1>
        <p className="page-sub">Chat, unmatch, or block anytime</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          <div className="h-36 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!connections.length) {
    return (
      <div className="max-w-md mx-auto text-center surface-card p-8 mt-8">
        <h1 className="text-lg font-semibold">No matches yet</h1>
        <p className="page-sub">Like people on Discover. When they accept, they show up here.</p>
        <Link to="/feed" className="btn-primary mt-6 inline-flex">
          Go to Discover
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Matches</h1>
      <p className="page-sub mb-8">Chat, unmatch, or block anytime</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((user, idx) =>
          user && user._id ? (
            <article key={user._id || idx} className="surface-card p-4 flex gap-4">
              <div className="relative shrink-0">
                <img
                  src={resolvePhotoUrl(user.photoUrl)}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${
                    onlineUserIds.includes(String(user._id)) ? "bg-emerald-400" : "bg-zinc-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold truncate">
                  {user.firstName || "N/A"} {user.lastName || ""}
                  {(unreadByUserId[String(user._id)] || 0) > 0 && (
                    <span className="ml-2 text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full align-middle">
                      {unreadByUserId[String(user._id)]}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-zinc-500">
                  {onlineUserIds.includes(String(user._id)) ? "Online" : "Offline"}
                </p>
                {user.opener && (
                  <p className="text-sm text-zinc-200 mt-2 border border-zinc-800 rounded-xl px-3 py-2 leading-relaxed">
                    <span className="block text-[11px] text-zinc-500 mb-1">
                      {user.openerFromMe ? "You opened with" : "They opened with"}
                    </span>
                    “{user.opener}”
                  </p>
                )}
                {user.about && (
                  <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{user.about}</p>
                )}
                {user.age && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {user.age} · {user.gender || ""}
                  </p>
                )}
                {user.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {user.skills.slice(0, 3).map((skill, sidx) => (
                      <span key={sidx} className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={"/chat/" + user._id} className="btn-primary min-h-10 text-sm">
                    Chat
                  </Link>
                  <button
                    disabled={busyId === user._id}
                    onClick={() => handleAction("unmatch", user._id)}
                    className="btn-secondary min-h-10 text-sm"
                  >
                    Unmatch
                  </button>
                  <button
                    disabled={busyId === user._id}
                    onClick={() => handleAction("block", user._id)}
                    className="btn-danger min-h-10 text-sm"
                  >
                    Block
                  </button>
                </div>
              </div>
            </article>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Connections;
