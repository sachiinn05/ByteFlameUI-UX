import axios from "axios";
import React from "react";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromFeedUser } from "../utils/feedSlice";

const UserCard = ({ user }) => {
    const dispatch=useDispatch();
  if (!user || !user.firstName || !user.lastName) return null;

  const {
    _id,
    firstName,
    lastName,
    about,
    age,
    gender,
    photoUrl,
    skills = [],
    matchPercent,
    sharedSkills = [],
  } = user;
  const sharedSet = new Set(
    (sharedSkills || []).map((s) => String(s).trim().toLowerCase())
  );
  const handleSendRequest=async(status,userId)=>{
    try{
      const _res=await axios.post(
        BASE_URL+"/request/send/"+status+"/"+userId,
        {},
        {withCredentials:true}
      );
      dispatch(removeFromFeedUser(userId))
    }catch(err)
    {
      console.log(err.message);
    }
  }

return (
  <div className="group relative w-80 h-[32rem] rounded-3xl overflow-hidden 
    shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-black transition-all duration-500 hover:scale-[1.03]">

    
    <img
        src={resolvePhotoUrl(photoUrl)}
      alt={`${firstName} ${lastName}`}
      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
    />

  
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>


    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
      bg-gradient-to-t from-pink-500/10 via-transparent to-purple-500/10"></div>

    <div className="relative z-10 flex flex-col justify-end h-full p-4">

  
      <div className="mb-2">
        {typeof matchPercent === "number" && (
          <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-pink-500/90 text-white">
            {matchPercent}% interest match
          </span>
        )}
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          {firstName} {lastName}
          {age && <span className="text-gray-300">, {age}</span>}
        </h2>

        {gender && (
          <p className="text-xs text-gray-400 capitalize">
            {gender}
          </p>
        )}
      </div>

   
      {about && (
        <p className="text-sm text-gray-200 line-clamp-2 mb-2">
          {about}
        </p>
      )}

     
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs backdrop-blur-md rounded-full border ${
                sharedSet.has(String(skill).trim().toLowerCase())
                  ? "bg-pink-500/40 text-white border-pink-400/50"
                  : "bg-white/10 text-white border-white/10"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-6 mt-2">

   
        <button
          onClick={() => handleSendRequest("ignore", _id)}
          title="Skip"
          className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-white/10 backdrop-blur-md border border-white/20 
          text-white text-xl hover:bg-red-500/80 hover:scale-110 
          transition-all duration-300 shadow-lg"
        >
          ✕
        </button>

        <button
          onClick={() => handleSendRequest("interested", _id)}
          title="Interested"
          className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-pink-500 to-red-500 
          text-white text-xl hover:scale-110 
          transition-all duration-300 shadow-lg"
        >
          ❤
        </button>

      </div>
    </div>
  </div>
);
};

export default UserCard;
