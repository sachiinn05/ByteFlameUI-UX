import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { clearPresence } from "../utils/presenceSlice";
import { disconnectSocket } from "../utils/socket";

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
  const profileRef = useRef(null);

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

  useEffect(() => {
    const onDoc = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
      isActive ? "text-white bg-white/8" : "text-zinc-400 hover:text-white hover:bg-white/5"
    }`;

  const links = (
    <>
      <NavLink to="/feed" className={linkClass} onClick={() => setMenuOpen(false)}>
        Discover
      </NavLink>
      <NavLink to="/connections" className={linkClass} onClick={() => setMenuOpen(false)}>
        Matches
        {totalUnread > 0 && (
          <span className="ml-1.5 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white px-1">
            {totalUnread}
          </span>
        )}
      </NavLink>
      <NavLink to="/requests" className={linkClass} onClick={() => setMenuOpen(false)}>
        Requests
      </NavLink>
      <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
        Profile
      </NavLink>
    </>
  );

  return (
    <header className="w-full fixed top-0 left-0 z-50 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-xl">
      <nav className="page-wrap px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        <Link to={user ? "/feed" : "/"} className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNeysa26FLKrZhOZEgVsdjr5WJQq4zagAEA&s"
            alt=""
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-[15px] font-semibold tracking-tight">ByteFlame</span>
        </Link>

        {user ? (
          <>
            <div className="hidden md:flex items-center gap-0.5">{links}</div>
            <div className="relative flex items-center gap-2" ref={profileRef}>
              <button
                type="button"
                className="md:hidden btn-secondary min-h-10 px-3 text-sm"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg p-0.5"
                aria-label="Account menu"
              >
                <span className="text-sm text-zinc-300 hidden sm:block">{user.firstName}</span>
                <img
                  src={resolvePhotoUrl(user.photoUrl)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                />
              </button>
              {profileOpen && (
                <div className="absolute right-4 top-14 w-48 surface-card p-1.5 text-sm shadow-xl">
                  <button
                    onClick={() => {
                      setShowAbout(true);
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-zinc-300 hover:bg-white/5"
                  >
                    About
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-rose-300 hover:bg-rose-500/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => navigate("/login")} className="btn-primary min-h-10">
            Sign in
          </button>
        )}
      </nav>

      {user && menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 flex flex-col gap-1">
          {links}
        </div>
      )}

      {showAbout && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowAbout(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
        >
          <div
            className="surface-card p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="about-title" className="text-lg font-semibold mb-2">
              About ByteFlame
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              Match on shared interests, chat in real time, and unmatch or block whenever you want.
            </p>
            <button type="button" className="btn-primary w-full" onClick={() => setShowAbout(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
