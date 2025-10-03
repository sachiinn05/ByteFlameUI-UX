import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <nav className="backdrop-blur-md bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 shadow-xl w-full px-6 md:px-12 py-3 flex items-center justify-between transition-all">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-white hover:text-yellow-300 transition-colors flex items-center gap-2"
        >
          🫶 ByteFlame
          <span className="animate-pulse text-white">💖</span>
        </Link>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered rounded-full w-28 md:w-64 transition-all focus:w-64 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/30 text-white placeholder-white/70 border-none backdrop-blur-sm"
        />

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
    </div>
  );
};

export default NavBar;
