import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Show loading until API finishes
  if (!connections) return <h1 className="text-center mt-24">Loading...</h1>;

  // No connections found
  if (connections.length === 0)
    return (
      <div className="flex justify-center items-center mt-24">
        <h1 className="text-2xl font-semibold text-gray-600">
          No Connection Found
        </h1>
      </div>
    );

  // Render list of connections
  return (
    <div className="flex flex-col items-center mt-24 space-y-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Connections</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {connections.map((connection) => {
          // Show the "other user" in connection
          const user =
            connection.fromUserId._id === localStorage.getItem("userId")
              ? connection.toUserId
              : connection.fromUserId;

          return (
            <div
              key={connection._id}
              className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center transition hover:scale-105 duration-200"
            >
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
              />
              <h2 className="text-xl font-semibold mt-3">
                {user.firstName} {user.lastName}
              </h2>
              {user.about && (
                <p className="text-gray-600 text-sm mt-1">{user.about}</p>
              )}
              {user.age && (
                <p className="text-gray-500 text-sm mt-1">
                  Age: {user.age} | {user.gender}
                </p>
              )}
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
