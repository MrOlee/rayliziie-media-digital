import React, { useState } from 'react';
import HomePage from './HomePage';
import CmsPortalRelawan from './CmsPortalRelawan';
import CeoControlServer from './CeoControlServer';

function App() {
  const [currentView, setCurrentView] = useState('hub');

  if (currentView === 'hub') {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200">
        <header className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 md:px-12 border-b border-slate-800 bg-[#0F172A]">
          <h1 className="text-xl font-black text-white uppercase tracking-wider">RAYLIZIIE MEDIA DIGITAL</h1>
          <div className="flex gap-3">
            <button onClick={() => setCurrentView('relawan')} className="bg-white text-[#0B1120] px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-200">Portal Relawan</button>
            <button onClick={() => setCurrentView('ceo')} className="bg-red-800 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-700">Server CEO</button>
          </div>
        </header>
        <main className="p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-10">Navigasi Masa Depan</h2>
          <div onClick={() => setCurrentView('public')} className="cursor-pointer bg-[#1E293B] p-8 rounded-2xl max-w-sm mx-auto hover:border-blue-500 border border-slate-700">
             <h4 className="text-2xl font-bold">NutrisiDietMu</h4>
             <p className="text-blue-400 mt-2">Masuk ke Website Publik</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setCurrentView('hub')} 
        className="fixed bottom-6 right-6 z-[999] bg-slate-800 text-white px-5 py-3 rounded-full font-bold text-sm border border-slate-600 hover:bg-slate-700 shadow-xl"
      >
        &larr; Kembali ke Hub
      </button>
      {currentView === 'public' && <HomePage />}
      {currentView === 'relawan' && <CmsPortalRelawan />}
      {currentView === 'ceo' && <CeoControlServer />}
    </div>
  );
}
export default App;
