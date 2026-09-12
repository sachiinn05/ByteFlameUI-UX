import React from "react";
import EditiProfile from "./EditiProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user) {
    return <div className="h-48 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />;
  }
  return <EditiProfile user={user} />;
};

export default Profile;
