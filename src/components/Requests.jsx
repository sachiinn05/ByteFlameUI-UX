
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  // Handle accept/reject
  const reviewRequests = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      // Refresh list after review
      fetchRequests();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <h1 className="text-center mt-24">Loading...</h1>;

  if (requests.length === 0)
    return (
      <div className="flex justify-center items-center mt-24">
        <h1 className="text-2xl font-semibold text-gray-600">
          No Requests Found
        </h1>
      </div>
    );

  return (
    <div className="flex flex-col items-center mt-20 px-6 sm:px-10 lg:px-16">
      <h1 className="text-3xl font-bold mb-8">Requests</h1>

      {/* Grid like Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {requests.map((req) => {
          const user = req.fromUserId;

          return (
            <div
              key={req._id}
              className="bg-white shadow-md rounded-xl flex items-center p-6 hover:shadow-xl transition duration-300 w-full"
            >
              {/* Profile image */}
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />

              {/* Info + Actions */}
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
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                    onClick={() => reviewRequests("accepted", req._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                    onClick={() => reviewRequests("rejected", req._id)}
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;

