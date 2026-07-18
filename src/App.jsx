import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Laptop, Sparkles, Flame, Box, Landmark, Globe, 
    ShieldCheck, ArrowUpRight, ArrowRight, Layers, 
    Users, X, Trash2, Plus, Wallet, FileText, 
    Eye, LogIn, CheckCircle2, Clock, Check
} from 'lucide-react';

const mediaNetwork = [
    { name: "NutrisiDietMu", icon: Sparkles, cat: "Gizi & Kesehatan", color: "border-teal-550 text-teal-400 bg-teal-950/30", link: "https://nutrisidietmu.vercel.app" },
    { name: "BolaGass", icon: Flame, cat: "Jurnalisme Olahraga", color: "border-orange-550 text-orange-400 bg-orange-950/30", link: "#" },
    { name: "GlowLogika", icon: Box, cat: "Skincare & Beauty", color: "border-pink-550 text-pink-400 bg-pink-950/30", link: "#" },
    { name: "CuanPintar", icon: Landmark, cat: "Literasi Finansial", color: "border-blue-550 text-blue-400 bg-blue-950/30", link: "#" }
];

const App = () => {
    const [view, setView] = useState('landing');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [ceoTab, setCeoTab] = useState('relawan'); // relawan atau approval
    
    // --- DATABASE SIMULASI (Bisa diganti fetch dari Supabase nanti) ---
    const [relawanList, setRelawanList] = useState([
        { id: 1, nama: "Muhammad Syuhada ar'rayyan", divisi: "NutrisiDietMu", role: "Manager", artikel: 34, views: 28000 },
        { id: 2, nama: "Amallea Fadhilla", divisi: "GlowLogika", role: "Relawan Penulis", artikel: 12, views: 4500 }
    ]);

    const [artikelDraft, setArtikelDraft] = useState([
        { id: 101, judul: "Mengenal Pola Makan Sehat Masyarakat Pesisir", penulis: "Amallea Fadhilla", divisi: "NutrisiDietMu", status: "pending", tanggal: "2026-07-18" },
        { id: 102, judul: "Taktik Formasi Baru Timnas", penulis: "Relawan Baru", divisi: "BolaGass", status: "pending", tanggal: "2026-07-18" }
    ]);

    const TARIF_PER_ARTIKEL = 15000;
    const TARIF_PER_1000_VIEWS = 5000;

    // --- FUNGSI APPROVAL CEO ---
    const handleApprove = (id) => {
        setArtikelDraft(artikelDraft.map(art => 
            art.id === id ? { ...art, status: 'approved' } : art
        ));
        alert("Artikel di-Approve! API akan menembak data ini langsung ke Vercel anak perusahaan terkait.");
    };

    const handleReject = (id) => {
        setArtikelDraft(artikelDraft.filter(art => art.id !== id));
    };

    // --- MODAL LOGIN ---
    const LoginModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="h-5 w-5"/></button>
                <h2 className="text-2xl font-900 text-white mb-2">Akses Sistem Eksekutif</h2>
                <p className="text-sm text-slate-400 mb-8">Otentikasi terenkripsi Rayliziie Media Digital.</p>
                
                <div className="space-y-4">
                    <button onClick={() => { setView('admin_ceo'); setShowLoginModal(false); }} className="w-full flex items-center justify-between bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-700 transition-all">
                        <span className="flex items-center gap-3"><ShieldCheck className="h-5 w-5"/> Login CEO / Manager</span>
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
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-900 text-white flex items-center gap-3"><ShieldCheck className="text-indigo-500 h-8 w-8" /> Executive Dashboard</h1>
                            <p className="text-slate-400 text-sm mt-1">Sistem Kontrol Manajemen & Kurasi Artikel</p>
                        </div>
                        <button onClick={() => setView('landing')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-600 flex items-center gap-2"><X className="h-4 w-4" /> Keluar</button>
                    </div>

                    {/* Navigasi Tab CEO */}
                    <div className="flex gap-4 mb-8">
                        <button onClick={() => setCeoTab('relawan')} className={`px-6 py-2.5 rounded-lg font-700 text-sm transition-all ${ceoTab === 'relawan' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>Database Relawan & Keuangan</button>
                        <button onClick={() => setCeoTab('approval')} className={`px-6 py-2.5 rounded-lg font-700 text-sm transition-all flex items-center gap-2 ${ceoTab === 'approval' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                            Kurasi Artikel <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{artikelDraft.filter(a => a.status === 'pending').length}</span>
                        </button>
                    </div>

                    {/* TAB RELAWAN */}
                    {ceoTab === 'relawan' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-lg font-800 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-400"/> Database Kontributor Aktif</h2>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Personel</th>
                                        <th className="p-4">Performa Content</th>
                                        <th className="p-4 text-right">Estimasi Gaji (Ditarik)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {relawanList.map((r) => {
                                        const gaji = (r.artikel * TARIF_PER_ARTIKEL) + ((r.views / 1000) * TARIF_PER_1000_VIEWS);
                                        return (
                                            <tr key={r.id} className="hover:bg-slate-800/30">
                                                <td className="p-4">
                                                    <p className="font-700 text-white">{r.nama}</p>
                                                    <p className="text-[10px] text-emerald-400">{r.divisi} &middot; {r.role}</p>
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
                    )}

                    {/* TAB APPROVAL */}
                    {ceoTab === 'approval' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-lg font-800 flex items-center gap-2"><Clock className="h-5 w-5 text-orange-400"/> Menunggu Persetujuan Manager</h2>
                                <p className="text-xs text-slate-400 mt-1">Artikel yang di-Approve akan otomatis didistribusikan ke database web anak (NutrisiDietMu, dll).</p>
                            </div>
                            <div className="p-6 grid gap-4">
                                {artikelDraft.filter(a => a.status === 'pending').length === 0 && <p className="text-center text-slate-500">Tidak ada artikel yang mengantri.</p>}
                                {artikelDraft.filter(a => a.status === 'pending').map((art) => (
                                    <div key={art.id} className="border border-slate-800 bg-slate-950 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <h3 className="font-800 text-white text-lg">{art.judul}</h3>
                                            <p className="text-xs text-slate-400 mt-1">Oleh: <span className="text-indigo-400">{art.penulis}</span> &middot; Target: <span className="text-emerald-400">{art.divisi}</span></p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleApprove(art.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-700 flex items-center gap-1.5 transition-colors"><Check className="h-4 w-4"/> Approve</button>
                                            <button onClick={() => handleReject(art.id)} className="bg-red-950 hover:bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm font-700 flex items-center gap-1.5 transition-colors"><Trash2 className="h-4 w-4"/> Tolak</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- TAMPILAN 2: DASHBOARD RELAWAN ---
    if (view === 'dashboard_relawan') {
        const dummyUser = relawanList[1]; // Simulasi masuk sebagai Amallea
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
                                <p className="text-slate-400 text-xs mt-0.5">Kontributor &middot; <span className="text-emerald-400">{dummyUser.divisi}</span></p>
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
                            <h2 className="text-base font-800 text-white">Status Publikasi Artikel</h2>
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-700 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/> Submit Artikel Baru</button>
                        </div>
                        <div className="p-6">
                             {artikelDraft.filter(a => a.penulis === dummyUser.nama).map((art) => (
                                 <div key={art.id} className="border border-slate-800 bg-slate-950 p-4 rounded-xl flex justify-between items-center mb-3">
                                     <div>
                                        <h3 className="font-800 text-white">{art.judul}</h3>
                                        <p className="text-xs text-slate-500 mt-1">Dikirim: {art.tanggal}</p>
                                     </div>
                                     <span className={`px-3 py-1 text-[10px] font-800 uppercase rounded-full ${art.status === 'pending' ? 'bg-orange-900/50 text-orange-400 border border-orange-800/50' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50'}`}>
                                         {art.status === 'pending' ? 'Menunggu Kurasi' : 'Telah Terbit'}
                                     </span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAMPILAN 3: LANDING PAGE UTAMA ---
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 antialiased">
            {showLoginModal && <LoginModal />}
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40"><Layers className="h-5 w-5 text-white" /></span>
                        <div>
                            <span className="font-display text-lg font-900 tracking-tight text-white block">RAYLIZIIE MEDIA DIGITAL</span>
                            <span className="text-[9px] font-700 tracking-widest text-indigo-400 uppercase block -mt-0.5">Dapur Redaksi Terpusat</span>
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
                        <Radio className="h-3.5 w-3.5 text-indigo-400" /> Ekosistem Kontributor Digital
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 font-display text-4xl font-900 leading-[1.1] tracking-tight text-white md:text-6xl">
                        Membangun Karir <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Jurnalisme & Media Siber Masa Depan</span>
                    </motion.h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 leading-relaxed">
                        Platform media terintegrasi dengan sistem kompensasi <strong>Pay Per Submission (Rp 15.000/Artikel)</strong> dan <strong>Revenue Sharing (Rp 5.000/1000 Views)</strong>. Semua proses distribusi artikel ke media jaringan dikelola secara otomatis oleh Headless CMS.
                    </p>
                </div>
            </section>
            
            <footer className="border-t border-slate-800 bg-slate-950/60 mt-20">
                <div className="mx-auto max-w-7xl px-6 py-12 text-center text-xs text-slate-500">
                    <p>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                    <p className="mt-1 font-600 text-indigo-400 tracking-wide">Pusat Manajemen Karir Kontributor &middot; Medan, Sumatera Utara.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
