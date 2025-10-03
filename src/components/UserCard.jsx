import React from "react";

const UserCard = ({ user }) => {
  if (!user || !user.firstName || !user.lastName) return null;

  const { firstName, lastName, about, age, gender, photoUrl, skills = [] } = user;

  return (
    <div className="relative w-96 h-[35rem] rounded-3xl overflow-hidden shadow-2xl bg-base-300">
      <div className="relative w-full h-full">
        {/* User Photo with gradient overlay */}
        <img
          src={photoUrl || "https://www.shutterstock.com/image-vector/female-profile-picture-placeholder-vector-260nw-450966928.jpg"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Name + Age on photo */}
        <div className="absolute bottom-32 left-5 text-white">
          <h2 className="text-2xl font-bold drop-shadow-md">
            {firstName} {lastName}{age ? `, ${age}` : ""}
          </h2>
          {gender && <p className="text-sm opacity-80 capitalize">Gender: {gender}</p>}
        </div>

        {/* About section */}
        {about && (
          <div className="absolute bottom-24 left-5 right-5 text-white text-sm line-clamp-2">
            {about}
          </div>
        )}

        {/* Skills badges with more gap from About and Actions */}
        {skills.length > 0 && (
          <div className="absolute bottom-16 left-5 flex flex-wrap gap-2 max-w-[90%]">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/40"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Tinder-style Actions - fixed at bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6 z-10">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl shadow-lg hover:scale-110 transition">
            ❌
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl shadow-lg hover:scale-110 transition">
            💚
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
