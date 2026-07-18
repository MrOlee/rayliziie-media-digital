import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Laptop, Sparkles, Flame, Box, Landmark, Globe, 
    ShieldCheck, ArrowUpRight, ArrowRight, Layers, 
    Users, Radio, X, Trash2, Plus, Wallet, FileText, 
    Eye, UserPlus, LogIn, CheckCircle2 
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { sanity } from './sanityClient';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
const mediaNetwork = [
    { name: "NutrisiDietMu", icon: Sparkles, cat: "Gizi & Kesehatan", color: "border-teal-550 text-teal-400 bg-teal-950/30", link: "https://nutrisidietmu.vercel.app" },
    { name: "BolaGass", icon: Flame, cat: "Jurnalisme Olahraga", color: "border-orange-550 text-orange-400 bg-orange-950/30", link: "#" },
    { name: "GlowLogika", icon: Box, cat: "Skincare & Beauty", color: "border-pink-550 text-pink-400 bg-pink-950/30", link: "#" },
    { name: "CuanPintar", icon: Landmark, cat: "Literasi Finansial", color: "border-blue-550 text-blue-400 bg-blue-950/30", link: "#" }
];

const App = () => {
    const [view, setView] = useState('landing');
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // State Database
    const [relawanList, setRelawanList] = useState([]);
    const [artikelSanity, setArtikelSanity] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State (CEO)
    const [formData, setFormData] = useState({ nama: '', divisi: 'NutrisiDietMu', role: 'Relawan Penulis' });

    // Konfigurasi Gaji Profesional Rayliziie Grup
    const TARIF_PER_ARTIKEL = 15000;
    const TARIF_PER_1000_VIEWS = 5000;

    // --- INTEGRASI SUPABASE & SANITY ---
    useEffect(() => {
        if (view === 'admin_ceo' || view === 'dashboard_relawan') {
            fetchDataSistem();
        }
    }, [view]);

    const fetchDataSistem = async () => {
        setLoading(true);
        try {
            // 1. Ambil Data Relawan dari Supabase (Kalau gagal, pakai fallback data semalam agar UI tidak hancur)
            const { data: timData, error } = await supabase.from('tim_rayliziie').select('*');
            if (timData && timData.length > 0) {
                setRelawanList(timData);
            } else {
                setRelawanList([
                    { id: 1, nama: "Muhammad Syuhada ar'rayyan", divisi: "NutrisiDietMu", role: "Editor Konten", artikel: 34, views: 28000 },
                    { id: 2, nama: "Amallea Fadhilla", divisi: "GlowLogika", role: "Relawan Penulis", artikel: 12, views: 4500 }
                ]);
            }

            // 2. Ambil Data Artikel dari Sanity.io (Try-Catch agar aman jika Sanity belum di-deploy)
            try {
                const artikel = await sanity.fetch(`*[_type == "post"]{title, views, author}`);
                setArtikelSanity(artikel);
            } catch (err) {
                console.log("Sanity belum terhubung sempurna. Menggunakan mode simulasi artikel.");
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // --- FUNGSI CRUD CEO (SUPABASE) ---
    const handleAddRelawan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supabase.from('tim_rayliziie').insert([formData]);
            fetchDataSistem();
            setFormData({ nama: '', divisi: 'NutrisiDietMu', role: 'Relawan Penulis' });
        } catch (error) {
            alert("Koneksi Supabase belum aktif. Menjalankan fungsi lokal.");
            setRelawanList([{ id: Date.now(), ...formData, artikel: 0, views: 0 }, ...relawanList]);
        }
        setLoading(false);
    };

    // --- KOMPONEN MODAL LOGIN ---
    const LoginModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="h-5 w-5"/></button>
                <h2 className="text-2xl font-900 text-white mb-2">Akses Sistem Eksekutif</h2>
                <p className="text-sm text-slate-400 mb-8">Otentikasi terenkripsi Rayliziie Media Digital.</p>
                
                <div className="space-y-4">
                    <button onClick={() => { setView('admin_ceo'); setShowLoginModal(false); }} className="w-full flex items-center justify-between bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-700 transition-all">
                        <span className="flex items-center gap-3"><ShieldCheck className="h-5 w-5"/> Login CEO / Direksi</span>
                        <ArrowRight className="h-4 w-4"/>
                    </button>
                    <button onClick={() => { setView('dashboard_relawan'); setShowLoginModal(false); }} className="w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-700 transition-all">
                        <span className="flex items-center gap-3"><FileText className="h-5 w-5"/> Dashboard Kontributor</span>
                        <ArrowRight className="h-4 w-4"/>
                    </button>
                </div>
            </motion.div>
        </div>
    );

    // --- TAMPILAN 1: DASHBOARD CEO ---
    if (view === 'admin_ceo') {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-900 text-white flex items-center gap-3"><ShieldCheck className="text-indigo-500 h-8 w-8" /> Executive Dashboard</h1>
                            <p className="text-slate-400 text-sm mt-1">Sistem Kontrol HR & Keuangan Supabase</p>
                        </div>
                        <button onClick={() => setView('landing')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-600 flex items-center gap-2"><X className="h-4 w-4" /> Tutup</button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
                            <h2 className="text-lg font-800 mb-5 flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-400"/> Rekrut Relawan</h2>
                            <form onSubmit={handleAddRelawan} className="space-y-4">
                                <div>
                                    <input required type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="Nama Lengkap..." />
                                </div>
                                <div>
                                    <select value={formData.divisi} onChange={(e) => setFormData({...formData, divisi: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none">
                                        <option>NutrisiDietMu</option>
                                        <option>BolaGass</option>
                                        <option>CuanPintar</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-700 py-2.5 rounded-lg text-sm mt-4">
                                    {loading ? 'Menyinkronkan...' : 'Tambahkan ke Supabase'}
                                </button>
                            </form>
                        </div>

                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-lg font-800 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-400"/> Database Kontributor Aktif</h2>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Personel</th>
                                        <th className="p-4">Performa Content (Sanity)</th>
                                        <th className="p-4 text-right">Estimasi Gaji</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {relawanList.map((r) => {
                                        const gaji = (r.artikel * TARIF_PER_ARTIKEL) + ((r.views / 1000) * TARIF_PER_1000_VIEWS);
                                        return (
                                            <tr key={r.id} className="hover:bg-slate-800/30">
                                                <td className="p-4">
                                                    <p className="font-700 text-white">{r.nama}</p>
                                                    <p className="text-[10px] text-emerald-400">{r.divisi}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-xs text-white font-700">{r.artikel} Artikel Terbit</p>
                                                    <p className="text-[10px] text-slate-500">{r.views.toLocaleString()} Total Views</p>
                                                </td>
                                                <td className="p-4 text-right font-800 text-indigo-400">
                                                    Rp {gaji.toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAMPILAN 2: DASHBOARD RELAWAN (CMS SYSTEM) ---
    if (view === 'dashboard_relawan') {
        const dummyUser = relawanList[0]; 
        const pendapatanFlat = dummyUser.artikel * TARIF_PER_ARTIKEL;
        const pendapatanViews = (dummyUser.views / 1000) * TARIF_PER_1000_VIEWS;
        const totalPendapatan = pendapatanFlat + pendapatanViews;

        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-400 font-900 text-xl">
                                {dummyUser.nama.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-900 text-white">Halo, {dummyUser.nama}!</h1>
                                <p className="text-slate-400 text-xs mt-0.5">Konten Kreator &middot; <span className="text-emerald-400">{dummyUser.divisi}</span></p>
                            </div>
                        </div>
                        <button onClick={() => setView('landing')} className="bg-slate-800 px-4 py-2 rounded-lg text-sm font-600 flex items-center gap-2"><LogIn className="h-4 w-4 rotate-180" /> Logout</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                            <FileText className="h-5 w-5 text-indigo-400 mb-2"/>
                            <p className="text-xs text-slate-400 font-600 mb-1">Artikel Terbit (PPS)</p>
                            <p className="text-2xl font-900 text-white">{dummyUser.artikel}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                            <Eye className="h-5 w-5 text-orange-400 mb-2"/>
                            <p className="text-xs text-slate-400 font-600 mb-1">Total Views (PPV)</p>
                            <p className="text-2xl font-900 text-white">{dummyUser.views.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 bg-emerald-950/20 border border-emerald-900/50 p-5 rounded-2xl flex items-center justify-between">
                            <div>
                                <Wallet className="h-5 w-5 text-emerald-400 mb-2"/>
                                <p className="text-xs text-emerald-500 font-600 mb-1">Total Pendapatan Terakumulasi</p>
                                <p className="text-3xl font-900 text-emerald-400">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
                            </div>
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-700 text-sm shadow-lg">
                                Tarik Dana
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-base font-800 text-white">Status Publikasi Sanity.io</h2>
                            <a href="https://sanity.io" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-700 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/> Buka Sanity Studio</a>
                        </div>
                        <div className="p-6 text-center text-slate-500 text-sm">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2"/>
                            Sistem sedang melakukan sinkronisasi dengan database artikel {dummyUser.divisi}.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAMPILAN 3: LANDING PAGE ---
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 antialiased">
            {showLoginModal && <LoginModal />}
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40"><Layers className="h-5 w-5 text-white" /></span>
                        <div>
                            <span className="font-display text-lg font-900 tracking-tight text-white block">RAYLIZIIE MEDIA DIGITAL</span>
                            <span className="text-[9px] font-700 tracking-widest text-indigo-400 uppercase block -mt-0.5">Rayliziie Grup Subsidiary</span>
                        </div>
                    </div>
                    <button onClick={() => setShowLoginModal(true)} className="rounded-full bg-white px-5 py-2 text-xs font-700 text-slate-900 transition-all hover:bg-indigo-500 hover:text-white flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> Portal Eksekutif & Relawan
                    </button>
                </div>
            </header>
            <section className="relative overflow-hidden pt-24 pb-16 text-center md:pt-32 md:pb-24">
                <div className="mx-auto max-w-4xl px-6 relative z-10">
                    <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/60 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-indigo-400">
                        <Radio className="h-3.5 w-3.5 text-indigo-400" /> Powered by Supabase & Sanity.io
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 font-display text-4xl font-900 leading-[1.1] tracking-tight text-white md:text-6xl">
                        Membangun Karir <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Jurnalisme & Media Siber Masa Depan</span>
                    </motion.h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 leading-relaxed">
                        Platform media terintegrasi dengan sistem kompensasi <strong>Pay Per Submission (Rp 15.000/Artikel)</strong> dan <strong>Revenue Sharing (Rp 5.000/1000 Views)</strong>.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default App;
