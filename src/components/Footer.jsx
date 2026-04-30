import React from "react";

const Footer = () => {
  return (
    <footer className="w-full fixed bottom-0 left-0 z-40 
      bg-white/5 backdrop-blur-xl border-t border-white/10">

      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2">

     
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-white">
            ByteFlame
          </p>
          <p className="text-xs text-gray-400">
            Reliable matches since 2025
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} All rights reserved
        </p>

      
        <div className="flex gap-4 text-gray-400 text-sm">
          <span className="hover:text-pink-400 cursor-pointer transition">
            Twitter
          </span>
          <span className="hover:text-pink-400 cursor-pointer transition">
            LinkedIn
          </span>
          <span className="hover:text-pink-400 cursor-pointer transition">
            YouTube
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;