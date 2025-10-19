import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection) || [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        // Make sure we always get an array
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
    <div className="flex flex-col items-center mt-20 px-6 sm:px-10 lg:px-16">
      <h1 className="text-3xl font-bold mb-8">Your Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {connections.map((user, idx) =>
          user && user._id ? ( // <- SAFEGUARD
            <div
              key={user._id || idx} // fallback key
              className="bg-white shadow-md rounded-xl flex flex-col md:flex-row items-center p-6 hover:shadow-xl transition duration-300 w-full"
            >
              <img
                src={user.photoUrl || "/default-avatar.png"}
                alt={user.firstName || "User"}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />

              <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold">
                  {user.firstName || "N/A"} {user.lastName || ""}
                </h2>

                {user.about && (
                  <p className="text-gray-600 text-sm mt-1">{user.about}</p>
                )}

                {user.age && (
                  <p className="text-gray-500 text-sm mt-1">
                    Age: {user.age} | {user.gender || "N/A"}
                  </p>
                )}

                {user.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {user.skills.map((skill, sidx) => (
                      <span
                        key={sidx}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <Link to={"/chat/" + user._id}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
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
