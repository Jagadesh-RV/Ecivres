import React from 'react';

export const PublicHeroWidget: React.FC = () => {
  return (
    <div className="py-20 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white text-center rounded-3xl shadow-2xl space-y-8 border border-sky-900/50">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-700/50 text-sky-400 text-xs font-bold uppercase tracking-wider">
        <span>🚀 V9.0 GLOBAL REVENUE & GROWTH PLATFORM IS LIVE</span>
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
        The Autonomous Marketplace for Every Home & Enterprise Service
      </h1>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
        Book top-tier verified providers, earn 10% cash back with VIP loyalty, and manage home maintenance automatically with AI.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <a href="/register" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-sky-500/20 transition duration-200 text-base">
          Get Started Instant $15 Credit
        </a>
        <a href="#how-it-works" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition duration-200 text-base">
          Explore Services
        </a>
      </div>
    </div>
  );
};
