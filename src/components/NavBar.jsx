import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { clearPresence } from "../utils/presenceSlice";
import { disconnectSocket } from "../utils/socket";
import { AnimatePresence, motion } from "framer-motion";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const unreadByUserId = useSelector((store) => store.presence.unreadByUserId);
  const totalUnread = Object.values(unreadByUserId || {}).reduce(
    (sum, n) => sum + (Number(n) || 0),
    0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(clearPresence());
      disconnectSocket();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "text-white bg-white/10"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <nav className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-[#0b1220]/90 backdrop-blur-xl border-b border-white/10">
        <Link to={user ? "/feed" : "/"} className="flex items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNeysa26FLKrZhOZEgVsdjr5WJQq4zagAEA&s"
            alt="ByteFlame Logo"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-500/40"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ByteFlame
          </span>
        </Link>

        {user ? (
          <>
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/feed" className={linkClass}>
                Discover
              </NavLink>
              <NavLink to="/connections" className={linkClass}>
                Matches
                {totalUnread > 0 && (
                  <span className="ml-1.5 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded-full">
                    {totalUnread}
                  </span>
                )}
              </NavLink>
              <NavLink to="/requests" className={linkClass}>
                Requests
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden text-gray-200 px-3 py-2 rounded-lg border border-white/10"
                onClick={() => setMenuOpen((v) => !v)}
              >
                Menu
              </button>

              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <span className="text-gray-200 text-sm hidden sm:block">
                  {user.firstName}
                </span>
                <img
                  src={resolvePhotoUrl(user.photoUrl)}
                  alt="user"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-400/50"
                />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium"
          >
            Join Us
          </button>
        )}
      </nav>

      {user && menuOpen && (
        <div className="md:hidden bg-[#0b1220] border-b border-white/10 px-4 py-3 flex flex-col gap-1">
          <NavLink to="/feed" className={linkClass} onClick={() => setMenuOpen(false)}>
            Discover
          </NavLink>
          <NavLink to="/connections" className={linkClass} onClick={() => setMenuOpen(false)}>
            Matches {totalUnread > 0 ? `(${totalUnread})` : ""}
          </NavLink>
          <NavLink to="/requests" className={linkClass} onClick={() => setMenuOpen(false)}>
            Requests
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
            Profile
          </NavLink>
        </div>
      )}

      {user && profileOpen && (
        <div className="absolute right-4 top-16 w-52 bg-[#111827] rounded-2xl shadow-xl border border-white/10 p-2 text-sm">
          <button
            onClick={() => {
              setShowAbout(true);
              setProfileOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-white/10"
          >
            About
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}

      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              className="bg-[#111827] rounded-3xl shadow-2xl p-8 w-[90%] md:w-[420px] text-center border border-white/10"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-3">About ByteFlame</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Meet people who share your interests. Match, chat in real time, and stay in control with block and unmatch.
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
