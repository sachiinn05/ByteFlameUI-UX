import axios from "axios";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

 
  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch]); 


  const reviewRequests = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
  
      fetchRequests();
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]); 

  if (!requests)
    return (
      <p className="text-center mt-24 text-gray-400 animate-pulse">Loading requests...</p>
    );

  if (requests.length === 0)
    return (
      <div className="flex justify-center mt-16">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-white">No requests yet</h1>
          <p className="text-gray-400 text-sm mt-2">
            When someone likes you, you can accept or ignore them here.
          </p>
        </div>
      </div>
    );

 return (
  <div className="w-full px-4 md:px-6 lg:px-10 mt-10">

   
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
      Requests
    </h1>
    <p className="text-center text-gray-400 text-sm mb-10">People who liked you</p>

  
    {!requests && (
      <div className="flex justify-center mt-20">
        <p className="text-gray-400 text-lg animate-pulse">Loading...</p>
      </div>
    )}

   
    {requests?.length === 0 && (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl">
          <h2 className="text-xl text-gray-300 font-medium">
            No Requests Yet 😴
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            When someone shows interest, you’ll see it here.
          </p>
        </div>
      </div>
    )}

  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {requests?.map((req) => {
        const user = req.fromUserId;

        return (
          <div
            key={req._id}
            className="group flex gap-5 items-center p-5 rounded-2xl 
            bg-white/5 backdrop-blur-xl border border-white/10 
            shadow-lg hover:shadow-2xl transition duration-300"
          >

          
            <div className="relative">
              <img
                src={resolvePhotoUrl(user.photoUrl)}
                alt={user.firstName}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-pink-500 transition"></div>
            </div>

           
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>

              {user.about && (
                <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                  {user.about}
                </p>
              )}

              {user.age && (
                <p className="text-gray-500 text-xs mt-1">
                  {user.age} • {user.gender}
                </p>
              )}

          
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full 
                      bg-white/10 text-gray-200 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

        
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => reviewRequests("accepted", req._id)}
                  className="px-4 py-1.5 text-sm rounded-full 
                  bg-gradient-to-r from-pink-500 to-red-500 
                  text-white hover:scale-105 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => reviewRequests("rejected", req._id)}
                  className="px-4 py-1.5 text-sm rounded-full 
                  bg-white/10 text-gray-300 border border-white/10 
                  hover:bg-red-500/20 hover:text-red-400 transition"
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
