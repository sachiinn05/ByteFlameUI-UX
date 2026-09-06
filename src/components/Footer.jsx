import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto border-t border-white/10 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center">
        <p className="text-sm text-gray-400">ByteFlame</p>
        <p className="text-xs text-gray-600 mt-1">
          © {new Date().getFullYear()} · Match with people who share your interests
        </p>
      </div>
    </footer>
  );
};

export default Footer;
