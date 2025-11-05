import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { AnimatePresence, motion } from "framer-motion"; // ✅ Proper import order

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen fixed top-0 left-0 z-50">
      <nav className="backdrop-blur-md bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 shadow-xl w-full px-6 md:px-12 py-5 flex items-center justify-between transition-all">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://www.grepixit.com/assets/img/dating-app/dating-app-development-company.jpg"
            alt="ByteFlame Logo"
            className="w-10 h-10 rounded-full object-cover hover:scale-110 transition-transform"
          />
          <span className="text-2xl md:text-3xl font-extrabold text-white hover:text-yellow-300 transition-colors">
            ByteFlame
          </span>
        </Link>

        {/* Profile Dropdown */}
        {user && (
          <div className="dropdown dropdown-end relative">
            <div className="flex items-center gap-3 cursor-pointer">
              <p className="text-white font-medium hidden md:block">
                Hi, {user.firstName}
              </p>

              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar relative hover:scale-110 transition-transform"
              >
                <div className="w-10 h-10 rounded-full ring-2 ring-pink-400 hover:ring-pink-500 overflow-hidden transition-all duration-300">
                  <img alt="user photo" src={user.photoUrl} />
                </div>
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-white/90 backdrop-blur-md rounded-xl shadow-2xl mt-3 w-52 p-2 border border-purple-200 animate-fade-in">
              <li>
                <Link
                  to="/profile"
                  className="justify-between hover:bg-pink-100 transition-colors rounded-md"
                >
                  Profile <span className="badge badge-secondary">New</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="hover:bg-pink-100 transition-colors rounded-md"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="hover:bg-pink-100 transition-colors rounded-md"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="hover:bg-pink-100 transition-colors rounded-md"
                >
                  Feeds
                </Link>
              </li>

              {/* 🔹 About Section */}
              <li>
                <button
                  onClick={() => setShowAbout(true)}
                  className="w-full text-left hover:bg-pink-100 transition-colors rounded-md"
                >
                  About
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-pink-100 transition-colors rounded-md"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* 🔥 Animated About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] md:w-[420px] relative text-center"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
                About ByteFlame
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                🔥 <strong>ByteFlame</strong> is a real-time web app built with{" "}
                <span className="font-semibold text-purple-600">React.js</span>,{" "}
                <span className="font-semibold text-purple-600">Redux Toolkit</span>,{" "}
                <span className="font-semibold text-purple-600">Node.js</span>,{" "}
                <span className="font-semibold text-purple-600">Express</span>, and{" "}
                <span className="font-semibold text-purple-600">MongoDB</span>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Designed by{" "}
                <span className="font-semibold text-pink-600">Sachin Singh</span>{" "}
                 this app focuses on
                real-time connections, chats, and social engagement.
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-md"
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
