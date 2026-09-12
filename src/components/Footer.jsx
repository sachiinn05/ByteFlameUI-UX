import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-zinc-800">
      <div className="page-wrap px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">ByteFlame</p>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Dating by shared interests
        </p>
      </div>
    </footer>
  );
};

export default Footer;
