import React from "react";

const UserCard = ({ user }) => {
  if (!user || !user.firstName || !user.lastName) return null;

  const { firstName, lastName, about, age, gender, photoUrl, skills = [] } = user;

  return (
    <div className="relative w-96 h-[35rem] rounded-3xl overflow-hidden shadow-2xl bg-base-300 transform hover:scale-105 transition-transform duration-500">
      <div className="relative w-full h-full">
        {/* User Photo */}
        <img
          src={
            photoUrl ||
            "https://www.shutterstock.com/image-vector/female-profile-picture-placeholder-vector-260nw-450966928.jpg"
          }
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Name + Age */}
        <div className="absolute bottom-32 left-5 text-white">
          <h2 className="text-2xl font-bold drop-shadow-lg">
            {firstName} {lastName}
            {age ? `, ${age}` : ""}
          </h2>
          {gender && (
            <p className="text-sm opacity-80 capitalize drop-shadow-sm">Gender: {gender}</p>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="absolute bottom-24 left-5 right-5 text-white text-sm line-clamp-2 backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
            {about}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="absolute bottom-16 left-5 flex flex-wrap gap-2 max-w-[90%]">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full shadow-md border border-white/30 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Tinder-style Action Buttons */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6 z-10">
          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white text-3xl shadow-2xl hover:scale-125 hover:shadow-red-400 transition-transform duration-300">
            ❌
          </button>
          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-white text-3xl shadow-2xl hover:scale-125 hover:shadow-green-400 transition-transform duration-300">
            💚
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
