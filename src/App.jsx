import React, { useState } from 'react';
import HomePage from './HomePage';
import CmsPortalRelawan from './CmsPortalRelawan';
import CeoControlServer from './CeoControlServer';

function App() {
  // State untuk mengatur halaman mana yang sedang aktif
  // 'hub' adalah halaman utama Rayliziie Media Digital
  const [currentView, setCurrentView] = useState('hub'); 

  // TAMPILAN 1: HUB UTAMA (Sesuai UI Navigasi Masa Depan)
  if (currentView === 'hub') {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-blue-500/30">
        
        {/* Navbar Hub */}
        <header className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 md:px-12 border-b border-slate-800 bg-[#0F172A]">
          <div className="text-center sm:text-left">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">RAYLIZIIE MEDIA DIGITAL</h1>
            <p className="text-[10px] md:text-xs text-blue-500 font-bold tracking-widest uppercase mt-1">Rayliziie Grup Subsidiary</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setCurrentView('relawan')} 
              className="bg-white text-[#0B1120] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-200 transition shadow-lg shadow-white/10"
            >
              Portal Relawan
            </button>
            <button 
              onClick={() => setCurrentView('ceo')} 
              className="bg-red-800 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-900/40 border border-red-500/30"
            >
              Server CEO
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-6 md:px-12 py-20 text-center flex flex-col items-center relative overflow-hidden">
          {/* Efek Latar Belakang */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <span className="bg-slate-800/80 border border-slate-700 text-slate-300 text-xs px-5 py-2 rounded-full mb-8 flex items-center gap-2 backdrop-blur-sm tracking-wide">
            🛡️ DIVISI INFORMASI & TEKNOLOGI GLOBAL
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight relative z-10">
            Navigasi Masa Depan
          </h2>
          <h3 className="text-2xl md:text-4xl font-bold text-indigo-400 mb-20 relative z-10">
            Ekosistem Media Siber Terintegrasi
          </h3>

          {/* Cards Portfolio Media */}
          <div className="w-full max-w-5xl text-left relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">Digital Media Network</p>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card NutrisiDietMu (Aktif) */}
              <div 
                onClick={() => setCurrentView('public')}
                className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8 hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer shadow-xl group"
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl bg-slate-800 p-3 rounded-xl group-hover:scale-110 transition-transform">🌱</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">NutrisiDietMu</h4>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-1">Media Kesehatan & Gizi</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Portal edukasi gizi klinis dan panduan kesehatan masyarakat berbasis telaah sejawat. 
                  <span className="block mt-4 text-blue-400 font-bold text-xs uppercase tracking-wide">→ Akses Web Publik</span>
                </p>
              </div>

              {/* Card BolaGass (Disabled / Coming Soon) */}
              <div className="bg-[#1E293B]/50 border border-slate-800 rounded-2xl p-8 opacity-70">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl bg-slate-800/50 p-3 rounded-xl grayscale">⚽</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">BolaGass</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Media Jurnalisme Olahraga</p>
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Platform jurnalisme sepak bola dengan ulasan taktis mendalam.
                  <span className="block mt-4 text-slate-600 font-bold text-xs uppercase tracking-wide">Dalam Pengembangan</span>
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // TAMPILAN 2: KOMPONEN GLOBAL (Terdapat Tombol Kembali)
  return (
    <div className="relative min-h-screen">
      
      {/* Tombol Melayang untuk kembali ke Hub */}
      <button 
        onClick={() => setCurrentView('hub')}
        className="fixed bottom-6 right-6 z-[999] bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-full font-bold shadow-2xl border border-slate-600 transition flex items-center gap-2 text-sm"
      >
        &larr; Hub Rayliziie
      </button>

      {/* Render komponen sesuai pilihan */}
      {currentView === 'public' && <HomePage />}
      {currentView === 'relawan' && <CmsPortalRelawan />}
      {currentView === 'ceo' && <CeoControlServer />}
      
    </div>
  );
}

export default App;
