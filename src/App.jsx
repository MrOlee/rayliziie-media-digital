import React, { useState } from 'react';

// Pastikan import ini sesuai dengan nama file kamu di dalam folder src
import HomePage from './HomePage'; 
import CmsPortalRelawan from './CmsPortalRelawan';
import CeoControlServer from './CeoControlServer';

function App() {
  // State untuk mengatur halaman mana yang sedang aktif
  // Default kita set ke 'relawan' untuk testing
  const [currentView, setCurrentView] = useState('relawan'); 

  return (
    <div className="relative min-h-screen bg-[#0F172A]">
      
      {/* 
        NAVIGASI SISTEM (Hanya untuk Admin/Developer)
        Menu ini akan selalu melayang di paling atas agar kamu mudah berpindah 
      */}
      <nav className="fixed top-0 left-0 w-full z-[100] flex justify-center gap-2 sm:gap-4 p-3 bg-black/80 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <button 
          onClick={() => setCurrentView('home')} 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition ${
            currentView === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          🌍 Public Web
        </button>
        <button 
          onClick={() => setCurrentView('relawan')} 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition ${
            currentView === 'relawan' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          ✍️ Portal Relawan
        </button>
        <button 
          onClick={() => setCurrentView('ceo')} 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition ${
            currentView === 'ceo' ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          ⚙️ Server CEO
        </button>
      </nav>

      {/* 
        AREA RENDER KONTEN
        Karena ada navbar di atas, kita beri padding-top (pt-16) agar konten tidak tertutup 
      */}
      <div className="pt-14 sm:pt-16">
        {currentView === 'home' && <HomePage />}
        {currentView === 'relawan' && <CmsPortalRelawan />}
        {currentView === 'ceo' && <CeoControlServer />}
      </div>

    </div>
  );
}

export default App;
