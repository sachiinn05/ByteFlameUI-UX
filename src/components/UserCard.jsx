import axios from "axios";
import React, { useState } from "react";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromFeedUser } from "../utils/feedSlice";
import IcebreakerPanel from "./IcebreakerPanel";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState("");
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
  const handleSendRequest = async (status, userId, opener) => {
    if (!userId) return;
    try {
      const body =
        status === "interested" && opener
          ? { opener: String(opener).trim().slice(0, 180) }
          : {};
      await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, body, {
        withCredentials: true,
      });
      dispatch(removeFromFeedUser(userId));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <article className="w-full max-w-md surface-card overflow-hidden">
      <div className="relative h-72 bg-zinc-900">
        <img
          src={resolvePhotoUrl(photoUrl)}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        {typeof matchPercent === "number" && (
          <p className="text-xs font-medium text-rose-400 mb-2">{matchPercent}% interest match</p>
        )}
        <h2 className="text-xl font-semibold tracking-tight">
          {firstName} {lastName}
          {age && <span className="text-zinc-400 font-normal">, {age}</span>}
        </h2>
        {gender && <p className="text-xs text-zinc-500 capitalize mt-0.5">{gender}</p>}
        {about && <p className="text-sm text-zinc-400 mt-3 line-clamp-3 leading-relaxed">{about}</p>}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className={`px-2.5 py-1 text-xs rounded-md border ${
                  sharedSet.has(String(skill).trim().toLowerCase())
                    ? "border-rose-900/80 text-rose-200 bg-rose-950/40"
                    : "border-zinc-800 text-zinc-400"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {_id && (
          <div className="mt-4">
            <IcebreakerPanel
              targetUserId={_id}
              sendLabel="Like & keep line"
              onSend={async (line) => {
                await handleSendRequest("interested", _id, line);
                setCopied("Liked. They’ll see this opener when they get your request.");
              }}
            />
            {copied && <p className="text-xs text-zinc-400 mt-2">{copied}</p>}
          </div>
        )}

        {_id && (
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleSendRequest("ignore", _id)}
              className="btn-secondary flex-1"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => handleSendRequest("interested", _id)}
              className="btn-primary flex-1"
            >
              Like
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UserCard;
