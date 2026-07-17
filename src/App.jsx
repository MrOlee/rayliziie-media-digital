import React, { useState } from 'react';
import HomePage from './HomePage';
import CmsPortalRelawan from './CmsPortalRelawan';
import CeoControlServer from './CeoControlServer';

function App() {
  const [currentView, setCurrentView] = useState('hub');

  if (currentView === 'hub') {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200">
        <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-[#0F172A]">
          <h1 className="text-xl font-black text-white uppercase">RAYLIZIIE MEDIA DIGITAL</h1>
          <div className="flex gap-3">
            <button onClick={() => setCurrentView('relawan')} className="bg-white text-[#0B1120] px-4 py-2 rounded-full font-bold text-sm">Relawan</button>
            <button onClick={() => setCurrentView('ceo')} className="bg-red-800 text-white px-4 py-2 rounded-full font-bold text-sm">CEO</button>
          </div>
        </header>
        <main className="p-10 text-center">
            <h2 className="text-4xl font-black text-white mb-10">Pilih Modul</h2>
            <div onClick={() => setCurrentView('public')} className="cursor-pointer bg-[#1E293B] p-6 rounded-xl border border-slate-700 max-w-sm mx-auto">
                <h4 className="text-xl font-bold">NutrisiDietMu</h4>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setCurrentView('hub')} className="fixed bottom-6 right-6 z-[999] bg-slate-800 text-white px-4 py-2 rounded-full text-sm border border-slate-600">
        &larr; Kembali
      </button>
      {currentView === 'public' && <HomePage />}
      {currentView === 'relawan' && <CmsPortalRelawan />}
      {currentView === 'ceo' && <CeoControlServer />}
    </div>
  );
}
export default App;
