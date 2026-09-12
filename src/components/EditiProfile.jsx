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
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setSaving(true);
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
      toast.success("Profile saved");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
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
    <div className="w-full max-w-2xl mx-auto surface-card p-5 md:p-8 flex flex-col gap-5">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Your photo and interests help others find you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="input-field"
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-zinc-400">Photo</label>
        {photoUrl && (
          <img
            src={resolvePhotoUrl(photoUrl)}
            alt=""
            className="w-20 h-20 rounded-xl object-cover border border-zinc-800"
          />
        )}
        <label className="btn-secondary w-fit cursor-pointer">
          Choose photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        {photoFile && <p className="text-xs text-zinc-500">{photoFile.name} — click Save to upload</p>}
      </div>

      <div>
        <label className="text-sm text-zinc-400">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="A short intro"
          className="input-field mt-1 min-h-28 resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-400">Interests</label>
        <input
          type="text"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(","))}
          placeholder="Travel, music, gym…"
          className="input-field mt-1"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.map((skill, i) =>
            skill.trim() ? (
              <span key={i} className="px-2 py-0.5 text-xs border border-zinc-800 text-zinc-400 rounded-md">
                {skill.trim()}
              </span>
            ) : null
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={() => setShowPreview(true)} className="btn-secondary flex-1">
          Preview
        </button>
        <button type="button" onClick={saveProfile} disabled={saving} className="btn-primary flex-1">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute -top-2 right-0 z-10 btn-secondary min-h-10"
            >
              Close
            </button>
            <UserCard
              user={{ firstName, lastName, age, photoUrl, gender, skills, about }}
            />
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default EditProfile;
