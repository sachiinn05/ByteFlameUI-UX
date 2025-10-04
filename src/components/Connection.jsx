import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  useEffect(() => {
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

    fetchConnections();
  }, [dispatch]); // ✅ include dispatch as dependency

  if (!connections) return <h1 className="text-center mt-24">Loading...</h1>;

  if (connections.length === 0)
    return (
      <div className="flex justify-center items-center mt-24">
        <h1 className="text-2xl font-semibold text-gray-600">
          No Connection Found
        </h1>
      </div>
    );

  return (
    <div className="flex flex-col items-center mt-20 px-6 sm:px-10 lg:px-16">
      <h1 className="text-3xl font-bold mb-8">Your Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {connections.map((connection) => {
          const user =
            connection.fromUserId._id === localStorage.getItem("userId")
              ? connection.toUserId
              : connection.fromUserId;

          return (
            <div
              key={connection._id}
              className="bg-white shadow-md rounded-xl flex items-center p-6 hover:shadow-xl transition duration-300 w-full"
            >
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />

              <div className="ml-6 flex-1">
                <h2 className="text-xl font-semibold">
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
