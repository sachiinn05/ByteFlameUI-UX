import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { AnimatePresence, motion } from "framer-motion"; 

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="w-screen fixed top-0 left-0 z-50">
    <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between 
      bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">

   
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNeysa26FLKrZhOZEgVsdjr5WJQq4zagAEA&s"
          alt="ByteFlame Logo"
          className="w-10 h-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          ByteFlame
        </span>
      </Link>

     
      {user ? (
       
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer">
            <p className="text-gray-700 font-medium hidden md:block">
              {user.firstName}
            </p>

            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-300 group-hover:ring-pink-400 transition-all">
              <img src={user.photoUrl} alt="user" />
            </div>
          </div>

      
          <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">

            <div className="p-2 text-sm text-gray-700">
              <Link to="/profile" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                👤 Profile
              </Link>
              <Link to="/connections" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                🤝 Connections
              </Link>
              <Link to="/requests" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                📩 Requests
              </Link>
              <Link to="/feed" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                📰 Feed
              </Link>

              <button
                onClick={() => setShowAbout(true)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                ℹ️ About
              </button>

              <div className="border-t my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-xl 
          bg-gradient-to-r from-pink-500 to-purple-500 
          text-white font-medium shadow-lg 
          hover:scale-105 transition"
        >
          Join Us
        </button>
      )}
    </nav>

    <AnimatePresence>
      {showAbout && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-[90%] md:w-[420px] text-center border border-gray-200"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              About ByteFlame
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              ByteFlame is a modern real-time dating platform built with MERN stack,
              focusing on seamless connections and real-time interactions.
            </p>

            <button
              onClick={() => setShowAbout(false)}
              className="px-5 py-2 bg-black text-white rounded-xl hover:scale-105 transition-transform"
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
