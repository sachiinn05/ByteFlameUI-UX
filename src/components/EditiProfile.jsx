import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [_photoFile, setPhotoFile] = useState(null);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills);
  const [_error,setError]=useState("")
  const dispatch=useDispatch()
  const saveProfile=async () => {
    try{
        const res=await axios.patch(BASE_URL+"/profile/editi",
            {
            firstName,
            lastName,
            age,
            photoUrl,
            gender,
            skills,
            about,
        },
        {withCredentials:true}
    );
    dispatch(addUser(res?.data?.data))
    }
    catch(err)
    {
        setError(err.message);
    }
    
  }

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file)); // show preview
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-16 px-6 gap-12 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50">
      
      {/* UserCard on the Left */}
      <div className="mt-[10px] flex-shrink-0">
        <UserCard
          user={{
            firstName,
            lastName,
            age,
            photoUrl,
            gender,
            skills,
            about,
          }}
        />
      </div>

      {/* Edit Profile Form on the Right */}
      <fieldset className="bg-white/95 border border-gray-200 rounded-3xl shadow-2xl w-[380px] p-8 backdrop-blur-lg">
        <legend className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Edit Profile
        </legend>

        {/* First Name */}
        <label className="block font-semibold text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Last Name */}
        <label className="block font-semibold text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Age */}
        <label className="block font-semibold text-gray-700 mb-1">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Gender */}
        <label className="block font-semibold text-gray-700 mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>

        {/* Photo URL or Upload */}
        <label className="block font-semibold text-gray-700 mb-1">Profile Photo</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => {
            setPhotoUrl(e.target.value);
            setPhotoFile(null);
          }}
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* About */}
        <label className="block font-semibold text-gray-700 mb-1">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Skills */}
        <label className="block font-semibold text-gray-700 mb-1">Skills</label>
        <input
          type="text"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(","))}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Save Button */}
        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transform transition"
       onClick={saveProfile} >
          Save Profile
        </button>
      </fieldset>
    </div>
  );
};

export default EditProfile;
