import React from "react";
import { useSelector } from "react-redux";

const NavBar = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="w-screen m-0 p-0 shadow-md">
      <div className="navbar bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg w-full fixed top-0 left-0 z-50 px-4 md:px-8 py-2">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl font-bold text-white hover:text-yellow-300 transition-colors">
            🫶 Dev Tinder
          </a>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered rounded-full w-24 md:w-64 transition-all focus:w-64 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Profile dropdown */}
          {user && (
            <div className="dropdown dropdown-end relative">
              <div className="flex items-center gap-2 cursor-pointer">
                <p className="text-white font-medium hidden md:block">
                  Welcome, {user.firstName}
                </p>

                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar relative hover:scale-110 transition-transform"
                >
                  <div className="w-10 rounded-full ring-2 ring-white overflow-hidden">
                    <img alt="user photo" src={user.photoUrl} />
                  </div>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-xl shadow-xl mt-3 w-52 p-2 border border-gray-200 animate-fade-in"
              >
                <li>
                  <a className="justify-between hover:bg-purple-100 transition-colors rounded-md">
                    Profile <span className="badge badge-secondary">New</span>
                  </a>
                </li>
                <li>
                  <a className="hover:bg-purple-100 transition-colors rounded-md">Settings</a>
                </li>
                <li>
                  <a className="hover:bg-purple-100 transition-colors rounded-md">Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
