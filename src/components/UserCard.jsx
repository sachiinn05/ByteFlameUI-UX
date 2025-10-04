import React from "react";

const UserCard = ({ user }) => {
  if (!user || !user.firstName || !user.lastName) return null;

  const { firstName, lastName, about, age, gender, photoUrl, skills = [] } = user;

  return (
    <div className="relative w-96 h-[34rem] rounded-3xl overflow-hidden shadow-2xl bg-base-300 transform hover:scale-105 transition-transform duration-500 flex flex-col">
      
      {/* User Photo */}
      <img
        src={
          photoUrl ||
          "https://www.shutterstock.com/image-vector/female-profile-picture-placeholder-vector-260nw-450966928.jpg"
        }
        alt={`${firstName} ${lastName}`}
        className="w-full h-full object-cover absolute inset-0"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Card Content - stick to bottom */}
      <div className="relative z-10 flex flex-col justify-end h-full p-3 gap-1 overflow-y-auto">

        {/* Name + Age */}
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {firstName} {lastName}
            {age ? `, ${age}` : ""}
          </h2>
          {gender && (
            <p className="text-sm opacity-80 capitalize text-white drop-shadow-sm">
              Gender: {gender}
            </p>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="text-white text-sm line-clamp-2 backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded">
            {about}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full shadow-md border border-white/30 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-xl font-bold shadow-md hover:scale-110 transition-transform cursor-pointer">
            X
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-bold shadow-md hover:scale-110 transition-transform cursor-pointer">
            ❤
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserCard;
