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
      await axios.post(
        `${BASE_URL}/request/${type}/${userId}`,
        {},
        { withCredentials: true }
      );
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
       
        console.log("Connections API response:", res.data); 
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        dispatch(addConnections(list));
        const unread = {};
        list.forEach((u) => {
          if (u?._id) unread[u._id] = u.unreadCount || 0;
        });
        dispatch(setUnreadBulk(unread));
      } catch (err) {
        console.log(err.message);
        dispatch(addConnections([])); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center mt-24 text-gray-400 animate-pulse">Loading matches...</p>
    );

  if (!connections || connections.length === 0)
    return (
      <div className="flex justify-center mt-16">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-white">No matches yet</h1>
          <p className="text-gray-400 text-sm mt-2">
            Like people on Discover. When they accept, they show up here.
          </p>
          <Link
            to="/feed"
            className="inline-block mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium"
          >
            Go to Discover
          </Link>
        </div>
      </div>
    );

return (
  <div className="w-full px-4 md:px-6 lg:px-10 mt-10">

  
    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
      Your matches
    </h1>
    <p className="text-center text-gray-400 text-sm mb-10">Chat, unmatch, or block anytime</p>

   
    {loading && (
      <div className="flex justify-center mt-20">
        <p className="text-gray-400 text-lg animate-pulse">Loading...</p>
      </div>
    )}

  
    {!loading && connections.length === 0 && (
      <div className="flex justify-center mt-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center">
          <h2 className="text-xl text-gray-300 font-medium">
            No Connections Yet 😴
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Start connecting with people to see them here.
          </p>
        </div>
      </div>
    )}

  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {connections.map((user, idx) =>
        user && user._id ? (
          <div
            key={user._id || idx}
            className="group flex gap-5 items-center p-5 rounded-2xl 
            bg-white/5 backdrop-blur-xl border border-white/10 
            shadow-lg hover:shadow-2xl transition duration-300"
          >

           
            <div className="relative">
              <img
                src={resolvePhotoUrl(user.photoUrl)}
                alt={user.firstName || "User"}
                className="w-20 h-20 rounded-full object-cover border border-white/20"
              />
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  onlineUserIds.includes(String(user._id))
                    ? "bg-green-400"
                    : "bg-gray-500"
                }`}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {user.firstName || "N/A"} {user.lastName || ""}
                {(unreadByUserId[String(user._id)] || 0) > 0 && (
                  <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                    {unreadByUserId[String(user._id)]}
                  </span>
                )}
              </h2>
              <p className="text-xs mt-0.5 text-gray-400">
                {onlineUserIds.includes(String(user._id)) ? "Online" : "Offline"}
              </p>

              {user.about && (
                <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                  {user.about}
                </p>
              )}

              {user.age && (
                <p className="text-gray-500 text-xs mt-1">
                  {user.age} • {user.gender || "N/A"}
                </p>
              )}

            
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.skills.slice(0, 3).map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="text-xs px-3 py-1 rounded-full 
                      bg-white/10 text-gray-200 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

            
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={"/chat/" + user._id}>
                  <button
                    className="px-4 py-2 rounded-full 
                    bg-gradient-to-r from-pink-500 to-purple-500 
                    text-white text-sm font-medium 
                    hover:scale-105 transition"
                  >
                    Chat
                  </button>
                </Link>
                <button
                  disabled={busyId === user._id}
                  onClick={() => handleAction("unmatch", user._id)}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 disabled:opacity-50"
                >
                  Unmatch
                </button>
                <button
                  disabled={busyId === user._id}
                  onClick={() => handleAction("block", user._id)}
                  className="px-4 py-2 rounded-full bg-red-500/80 text-white text-sm hover:bg-red-500 disabled:opacity-50"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  </div>
);
};

export default Connections;