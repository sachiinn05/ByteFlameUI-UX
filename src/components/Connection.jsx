import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
const connections = useSelector((store) => store.connections) || [];

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
       
        console.log("Connections API response:", res.data); 
        dispatch(addConnections(Array.isArray(res.data.data) ? res.data.data : []));
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
    return <h1 className="text-center mt-24 text-xl">Loading...</h1>;

  if (!connections || connections.length === 0)
    return (
      <div className="flex justify-center items-center mt-24">
        <h1 className="text-2xl font-semibold text-gray-600">
          No Connections Found
        </h1>
      </div>
    );

return (
  <div className="w-full px-4 md:px-6 lg:px-10 mt-10">

  
    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
      Your Connections
    </h1>

   
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
                src={user.photoUrl || "/default-avatar.png"}
                alt={user.firstName || "User"}
                className="w-20 h-20 rounded-full object-cover border border-white/20"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-pink-500 transition"></div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">
                {user.firstName || "N/A"} {user.lastName || ""}
              </h2>

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

            
              <div className="mt-4">
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