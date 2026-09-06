import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToWhy = () => {
    document.getElementById("why")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-[#0f172a] to-black relative overflow-hidden">
      <div className="absolute top-[-120px] left-[10%] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[10%] w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-3xl"></div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNeysa26FLKrZhOZEgVsdjr5WJQq4zagAEA&s"
            alt="ByteFlame"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-500/40"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ByteFlame
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-medium"
        >
          Sign in
        </button>
      </header>

      <div className="flex flex-col items-center justify-center text-center pt-16 pb-16 px-6 max-w-5xl mx-auto relative z-10">
        <p className="text-pink-400 text-sm font-medium tracking-wide uppercase mb-4">
          Dating that starts with shared interests
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Meet people who actually
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {" "}
            get you
          </span>
        </h1>
        <p className="text-gray-400 mt-6 text-lg max-w-2xl">
          Discover matches by interests, chat instantly, and stay in control with unmatch and block.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Join Now
          </button>
          <button
            onClick={scrollToWhy}
            className="px-8 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition"
          >
            How it works
          </button>
        </div>
      </div>

      <div id="why" className="max-w-6xl mx-auto py-16 px-6 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">How ByteFlame works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Discover",
              desc: "Swipe through people ranked by shared interests. Filter by what matters to you.",
            },
            {
              title: "Match",
              desc: "Send interest, accept requests, and start talking when both of you say yes.",
            },
            {
              title: "Chat safely",
              desc: "Real-time chat with online status. Unmatch or block anytime.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-16 px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your match?</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition"
        >
          Get started
        </button>
      </div>
    </div>
  );
};

export default Landing;
