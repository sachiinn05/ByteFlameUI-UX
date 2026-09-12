import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToWhy = () => {
    document.getElementById("why")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-shell">
      <header className="page-wrap px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNeysa26FLKrZhOZEgVsdjr5WJQq4zagAEA&s"
            alt=""
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-[15px] font-semibold tracking-tight">ByteFlame</span>
        </div>
        <button type="button" onClick={() => navigate("/login")} className="btn-primary min-h-10">
          Sign in
        </button>
      </header>

      <section className="page-wrap px-4 md:px-6 pt-16 md:pt-24 pb-20">
        <p className="text-rose-400 text-sm font-medium mb-4">Interest-first dating</p>
        <h1 className="max-w-3xl text-[2.25rem] md:text-6xl font-semibold tracking-tight leading-[1.1]">
          Meet people who share what you care about.
        </h1>
        <p className="mt-5 max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed">
          Ranked by overlapping interests. Chat when you both say yes. Unmatch or block anytime.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button type="button" onClick={() => navigate("/login")} className="btn-primary">
            Create account
          </button>
          <button type="button" onClick={scrollToWhy} className="btn-secondary">
            How it works
          </button>
        </div>
      </section>

      <section id="why" className="page-wrap px-4 md:px-6 pb-24">
        <h2 className="text-xl font-semibold tracking-tight mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Discover",
              desc: "See people ranked by shared interests. Filter by age, gender, or a topic.",
            },
            {
              step: "02",
              title: "Match",
              desc: "Like someone. If they like you back, you can chat.",
            },
            {
              step: "03",
              title: "Talk",
              desc: "Real-time messages, online status, and optional opener suggestions.",
            },
          ].map((item) => (
            <article key={item.step} className="surface-card p-5">
              <p className="text-xs text-zinc-500 mb-3">{item.step}</p>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
