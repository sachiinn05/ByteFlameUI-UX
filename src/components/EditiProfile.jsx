import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
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
  const [photoFile, setPhotoFile] = useState(null);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills || []);
  const [showPreview, setShowPreview] = useState(false);

  const dispatch = useDispatch();

  const inputClass =
    "w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition";

  const saveProfile = async () => {
    try {
      let uploadedPhotoUrl = photoUrl;

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        const uploadRes = await axios.post(BASE_URL + "/profile/photo", formData, {
          withCredentials: true,
        });
        uploadedPhotoUrl = uploadRes.data.photoUrl;
        setPhotoUrl(uploadedPhotoUrl);
        setPhotoFile(null);
      }

      if (uploadedPhotoUrl?.startsWith("blob:")) {
        toast.error("Please choose a photo from your computer");
        return;
      }

      const res = await axios.patch(
        BASE_URL + "/profile/editi",
        {
          firstName,
          lastName,
          age,
          photoUrl: uploadedPhotoUrl,
          gender,
          skills: skills.map((s) => String(s).trim()).filter(Boolean),
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      toast.success("Profile saved successfully 🎉");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to save profile ❌");
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6">

     
      <h2 className="text-2xl font-semibold text-white">Edit profile</h2>
      <p className="text-gray-400 text-sm -mt-4">
        Your photo and interests help others find you
      </p>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={inputClass}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={inputClass}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={`${inputClass} bg-[#0b1220]`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>

    
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-400">Profile Photo</label>

        {photoUrl && (
          <img
            src={resolvePhotoUrl(photoUrl)}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border border-white/20"
          />
        )}

        <label className="cursor-pointer inline-flex items-center justify-center w-fit px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-pink-300 text-sm hover:bg-white/20 transition">
          Choose photo from computer
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        {photoFile && (
          <p className="text-xs text-gray-400">{photoFile.name} — click Save to upload</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write something about yourself..."
          className={`${inputClass} h-28 resize-none`}
        />
      </div>

    
      <div>
        <label className="text-sm text-gray-400">Interests</label>

        <input
          type="text"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(","))}
          placeholder="Travel, music, gym, cooking..."
          className={inputClass}
        />

        {/* Interests Preview */}
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-white/10 text-gray-200 rounded-full border border-white/10"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

    
      <div className="flex gap-4">

      
        <button
          onClick={() => setShowPreview(true)}
          className="w-1/2 py-3 rounded-xl bg-white/10 border border-white/10 
          text-white font-medium hover:bg-white/20 transition"
        >
          View Profile
        </button>

        
        <button
          onClick={saveProfile}
          className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
          text-white font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          Save
        </button>

      </div>

      {/* 🔥 Profile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

          <div className="relative">

          
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-4 -right-4 bg-white text-black w-8 h-8 rounded-full shadow-lg"
            >
              ✕
            </button>

          
            <UserCard
              user={{ firstName, lastName, age, photoUrl, gender, skills, about }}
            />

          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;