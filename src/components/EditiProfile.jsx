import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [_photoFile, setPhotoFile] = useState(null);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills || []);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/editi",
        { firstName, lastName, age, photoUrl, gender, skills, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      toast.success("Profile saved successfully 🎉");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save profile ❌");
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file)); // show preview
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen py-16 px-6 gap-12 bg-pink-50">
      {/* UserCard on the Left */}
      <div className="mt-[10px] flex-shrink-0 transform hover:scale-105 transition-transform duration-500">
        <UserCard
          user={{ firstName, lastName, age, photoUrl, gender, skills, about }}
        />
      </div>

      {/* Edit Profile Form */}
      <fieldset className="bg-white/30 border border-gray-200 rounded-3xl shadow-2xl w-full md:w-[400px] p-8 backdrop-blur-xl hover:shadow-purple-400/50 transition-all duration-500">
        <legend className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Edit Profile
        </legend>

        {/* Input Fields */}
        {[
          { label: "First Name", value: firstName, set: setFirstName, type: "text" },
          { label: "Last Name", value: lastName, set: setLastName, type: "text" },
          { label: "Age", value: age, set: setAge, type: "number" },
        ].map((field, idx) => (
          <div key={idx}>
            <label className="block font-semibold text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
            />
          </div>
        ))}

        {/* Gender */}
        <label className="block font-semibold text-gray-700 mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>

        {/* Photo */}
        <label className="block font-semibold text-gray-700 mb-1">Profile Photo</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => {
            setPhotoUrl(e.target.value);
            setPhotoFile(null);
          }}
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
        />

        {/* About */}
        <label className="block font-semibold text-gray-700 mb-1">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
        />

        {/* Skills */}
        <label className="block font-semibold text-gray-700 mb-1">Skills</label>
        <input
          type="text"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(","))}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm"
        />

        {/* Save Button */}
        <button
          className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 hover:shadow-pink-400/50"
          onClick={saveProfile}
        >
          Save Profile
        </button>
      </fieldset>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;
