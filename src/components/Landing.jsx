import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-[#0f172a] to-black px-6 relative overflow-hidden">

     
      <div className="absolute top-[-120px] left-[10%] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[10%] w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-3xl"></div>

  
      <div className="flex flex-col items-center justify-center text-center pt-32 pb-20 max-w-5xl mx-auto">
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Build Real Connections with  
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {" "}ByteFlame 🔥
          </span>
        </h1>

        <p className="text-gray-400 mt-6 text-lg max-w-2xl">
          A modern real-time dating platform where users discover, connect, and chat instantly. 
          Designed with performance, scalability, and user experience at its core.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
            text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Join Now
          </button>

          <button
            className="px-8 py-3 rounded-xl border border-white/20 
            text-gray-300 hover:bg-white/10 transition"
          >
            Learn More
          </button>
        </div>
      </div>

    
      <div className="max-w-6xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why ByteFlame?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            {
              title: "Real-time Chat",
              desc: "Instant messaging powered by Socket.io for seamless conversations.",
            },
            {
              title: "Smart Matching",
              desc: "Discover people based on interests, skills, and preferences.",
            },
            {
              title: "Secure Platform",
              desc: "JWT authentication with cookies ensures secure user sessions.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl 
              hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

   
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Tech Stack</h2>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            "React.js",
            "Redux Toolkit",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Socket.io",
            "AWS EC2",
            "Cloudflare",
          ].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

 
      <div className="text-center py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to find your match?
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
          text-white font-semibold text-lg shadow-lg hover:scale-105 transition"
        >
          Get Started 🚀
        </button>
      </div>

    </div>
  );
};

export default Landing;