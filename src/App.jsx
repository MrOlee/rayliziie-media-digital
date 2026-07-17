import React, { useState } from 'react';
import { 
    Laptop, Sparkles, Flame, Box, Landmark, 
    Globe, ShieldCheck, ArrowUpRight, ArrowRight, 
    Layers, Users, BarChart3, Radio, FileText, 
    PlusCircle, UserPlus, Image, Lock, Unlock
} from 'lucide-react';

const mediaNetwork = [
    { 
        name: "NutrisiDietMu", 
        icon: Sparkles, 
        cat: "Media Kesehatan & Gizi", 
        desc: "Portal edukasi gizi klinis, analisis pangan berbasis bukti ilmiah, dan panduan kesehatan masyarakat.",
        color: "text-teal-400 bg-teal-950/30 border-teal-900/50",
        link: "https://nutrisidietmu.vercel.app" 
    },
    { 
        name: "BolaGass", 
        icon: Flame, 
        cat: "Media Jurnalisme Olahraga", 
        desc: "Platform jurnalisme sepak bola dengan ulasan taktis mendalam, analisis bursa transfer, dan kabar terupdate.",
        color: "text-orange-400 bg-orange-950/30 border-orange-900/50",
        link: "#" 
    },
    { 
        name: "GlowLogika", 
        icon: Box, 
        cat: "Edukasi Skincare & Beauty", 
        desc: "Media literasi kesehatan kulit dan ulasan kandungan kosmetik berdasarkan sains serta fakta medis.",
        color: "text-pink-400 bg-pink-950/30 border-pink-900/50",
        link: "#" 
    },
    { 
        name: "CuanPintar", 
        icon: Landmark, 
        cat: "Literasi Finansial & Investasi", 
        desc: "Portal perencanaan keuangan harian, investasi anak muda, dan edukasi melek finansial makro.",
        color: "text-blue-400 bg-blue-950/30 border-blue-900/50",
        link: "#" 
    }
];

const businessServices = [
    { 
        name: "Web Dev & Techno", 
        icon: Laptop, 
        cat: "Pengembangan IT & Solusi Digital", 
        desc: "Layanan pembuatan website korporat, aplikasi mobile, optimasi SEO, dan infrastruktur sistem digital perusahaan.",
        color: "text-cyan-400 bg-cyan-950/30 border-cyan-900/50"
    },
    { 
        name: "Rayliziie Digital Invitation", 
        icon: Globe, 
        cat: "Layanan Undangan Digital Premium", 
        desc: "Jasa perancangan undangan digital elegan untuk acara pernikahan, khitanan, sempro, semhas, hingga sidang.",
        color: "text-indigo-400 bg-indigo-950/30 border-indigo-900/50"
    }
];

const stats = [
    { label: "Total Target Pembaca", value: "250K+", icon: Users },
    { label: "Jaringan Ekosistem Media", value: "4 Platform", icon: Radio },
    { label: "Proyeksi Pertumbuhan", value: "+45%", icon: BarChart3 }
];

const App = () => {
    const [view, setView] = useState('home'); // 'home' atau 'portal'
    const [portalMode, setPortalMode] = useState('register'); // 'register' atau 'login'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Security & Login State
    const [accessCode, setAccessCode] = useState('');

    // State Form Artikel
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('gizi');
    const [content, setContent] = useState('');
    const [articleImage, setArticleImage] = useState(null);

    // State Form Pendaftaran Relawan
    const [volunteerName, setVolunteerName] = useState('');
    const [volunteerEmail, setVolunteerEmail] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setArticleImage(URL.createObjectURL(file));
    };

    // FUNGSI LOGIN: Memastikan hanya kode khusus yang bisa nulis artikel
    const handleLogin = (e) => {
        e.preventDefault();
        // LU BISA GANTI KODE AKSES UTAMA PENULIS DI BAWAH INI SEMAUMU, BOY
        if (accessCode === 'RAYLIZIIE2026' || accessCode === 'PENULISCUAN') {
            setIsLoggedIn(true);
            alert('Akses Diterima! Selamat datang di Panel Penulis Resmi Rayliziie Media.');
        } else {
            alert('Kode Akses Salah atau Belum Terdaftar! Silakan hubungi Direksi Utama Rayliziie Grup untuk mendapatkan verifikasi.');
        }
        setAccessCode('');
    };

    const handlePublish = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Eror Keamanan: Anda tidak memiliki otoritas untuk menerbitkan artikel!');
            return;
        }
        alert(`Sukses menerbitkan artikel "${title}"! Konten dikirim ke antrean review holding.`);
        setTitle('');
        setContent('');
        setArticleImage(null);
    };

    const handleRegisterVolunteer = (e) => {
        e.preventDefault();
        alert(`Halo ${volunteerName}, pendaftaran relawan Anda sukses dikirim! Tim Rayliziie Grup akan menyeleksi portfolio Anda dan mengirimkan Kode Akses Penulis lewat email jika lolos.`);
        setVolunteerName('');
        setVolunteerEmail('');
        setPortalMode('login'); // Setelah daftar, diarahkan ke form login
    };

    // PANEL PORTAL UTAMA (CMS & REGISTRASI/LOGIN)
    if (view === 'portal') {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
                <div className="mx-auto max-w-4xl">
                    
                    {/* Header Nav Portal */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                                <FileText className="h-4 w-4 text-white" />
                            </span>
                            <div>
                                <h1 className="text-lg font-900 tracking-tight text-white">RAYLIZIIE CMS PANEL</h1>
                                <p className="text-[10px] text-indigo-400 font-600 uppercase tracking-wider">Sistem Proteksi Artikel Terintegrasi</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isLoggedIn && (
                                <button 
                                    onClick={() => setIsLoggedIn(false)} 
                                    className="text-xs font-700 bg-red-950 text-red-400 border border-red-900 px-4 py-2 rounded-full hover:bg-red-900 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                            <button 
                                onClick={() => { setView('home'); setIsLoggedIn(false); }} 
                                className="text-xs font-700 bg-slate-800 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
                            >
                                Kembali ke Web Utama
                            </button>
                        </div>
                    </div>

                    {/* JIKA BELUM LOGIN: TAMPILKAN OPSI DAFTAR / LOGIN KODE AKSES */}
                    {!isLoggedIn ? (
                        <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mt-8">
                            <div className="flex border-b border-slate-800 mb-6">
                                <button 
                                    onClick={() => setPortalMode('register')}
                                    className={`w-1/2 pb-3 text-xs font-800 uppercase tracking-wider border-b-2 transition-all ${portalMode === 'register' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Daftar Relawan
                                </button>
                                <button 
                                    onClick={() => setPortalMode('login')}
                                    className={`w-1/2 pb-3 text-xs font-800 uppercase tracking-wider border-b-2 transition-all ${portalMode === 'login' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Login Penulis
                                </button>
                            </div>

                            {portalMode === 'register' ? (
                                <form onSubmit={handleRegisterVolunteer} className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-400 font-700 text-[10px] uppercase tracking-wider mb-1">
                                        <UserPlus className="h-3.5 w-3.5" /> Registrasi Kontributor Baru
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={volunteerName}
                                            onChange={(e) => setVolunteerName(e.target.value)}
                                            placeholder="Masukkan nama lengkap Anda..."
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase tracking-wide">Alamat Email Aktif</label>
                                        <input 
                                            type="email" 
                                            value={volunteerEmail}
                                            onChange={(e) => setVolunteerEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-700 text-xs py-3 rounded-xl hover:bg-indigo-500 transition-all shadow-lg mt-2">
                                        Ajukan Pendaftaran Relawan
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center mt-3">Setelah diverifikasi oleh Admin Rayliziie Grup, Kode Akses Penulis akan dikirim ke email Anda.</p>
                                </form>
                            ) : (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="flex items-center gap-2 text-amber-400 font-700 text-[10px] uppercase tracking-wider mb-1">
                                        <Lock className="h-3.5 w-3.5" /> Proteksi Gerbang Penulisan
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase tracking-wide">Kode Akses Penulis (Token/Password)</label>
                                        <input 
                                            type="password" 
                                            value={accessCode}
                                            onChange={(e) => setAccessCode(e.target.value)}
                                            placeholder="Masukkan kode otentikasi resmi..."
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors tracking-widest"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-white text-slate-900 font-700 text-xs py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg mt-2">
                                        Verifikasi & Masuk Panel
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center mt-3">Hanya kontributor terverifikasi yang dapat menerbitkan konten artikel.</p>
                                </form>
                            )}
                        </div>
                    ) : (
                        
                        // JIKA SUDAH LOGIN & TERVERIFIKASI: PANEL NULIS TERBUKA OTOMATIS
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in duration-350">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-sm font-800 text-white uppercase tracking-wider">
                                    <PlusCircle className="h-4 w-4 text-emerald-400" /> Tulis Artikel Baru (Akses Diterima)
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-700 text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-1 rounded-md">
                                    <Unlock className="h-3 w-3" /> Penulis Terverifikasi
                                </span>
                            </div>
                            
                            <form onSubmit={handlePublish} className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-3">
                                    <div className="md:col-span-2 space-y-5">
                                        <div>
                                            <label className="block text-xs font-700 text-slate-400 mb-2 uppercase tracking-wide">Judul Berita / Artikel</label>
                                            <input 
                                                type="text" 
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Masukkan judul artikel yang memikat..."
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-700 text-slate-400 mb-2 uppercase tracking-wide">Target Publikasi Media</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'gizi', label: 'NutrisiDietMu' },
                                                    { id: 'bola', label: 'BolaGass' },
                                                    { id: 'skincare', label: 'GlowLogika' },
                                                    { id: 'keuangan', label: 'CuanPintar' },
                                                ].map((cat) => (
                                                    <label 
                                                        key={cat.id} 
                                                        className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-700 cursor-pointer select-none transition-all ${
                                                            category === cat.id 
                                                                ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                                                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                                        }`}
                                                    >
                                                        <input 
                                                            type="radio" 
                                                            name="category" 
                                                            value={cat.id} 
                                                            checked={category === cat.id}
                                                            onChange={() => setCategory(cat.id)}
                                                            className="sr-only" 
                                                        />
                                                        {cat.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-xs font-700 text-slate-400 mb-2 uppercase tracking-wide">Cover / Gambar Artikel</label>
                                        <div className="flex-1 min-h-[140px] bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 relative group hover:border-indigo-500/50 transition-colors">
                                            {articleImage ? (
                                                <>
                                                    <img src={articleImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-700 text-white rounded-xl cursor-pointer transition-opacity">
                                                        Ganti Gambar
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                    </label>
                                                </>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                                    <Image className="h-6 w-6 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                                                    <span className="text-[11px] font-600 text-slate-400 text-center">Pilih File Gambar</span>
                                                    <span className="text-[9px] text-slate-600 mt-0.5">JPG, PNG up to 5MB</span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-700 text-slate-400 mb-2 uppercase tracking-wide">Isi Konten Berita</label>
                                    <textarea 
                                        rows="7"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Ketik draf berita lengkap lu di sini, Boy..."
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="bg-white text-slate-900 font-700 text-xs px-6 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-md"
                                    >
                                        Terbitkan Berita
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // LANDING PAGE UTAMA (TAMPILAN DEPAN)
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white antialiased">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40">
                            <Layers className="h-5 w-5 text-white" />
                        </span>
                        <div>
                            <span className="font-display text-lg font-900 tracking-tight text-white block">RAYLIZIIE MEDIA DIGITAL</span>
                            <span className="text-[9px] font-700 tracking-widest text-indigo-400 uppercase block -mt-0.5">Rayliziie Grup Subsidiary</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setView('portal')}
                        className="rounded-full bg-white px-5 py-2 text-xs font-700 text-slate-900 transition-all hover:bg-indigo-500 hover:text-white shadow-sm"
                    >
                        Portal Admin & Relawan
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-16 text-center md:pt-32 md:pb-24">
                <div className="mx-auto max-w-4xl px-6 relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/60 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-indigo-400 shadow-inner">
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Divisi Informasi & Teknologi Global
                    </span>
                    <h1 className="mt-6 font-display text-4xl font-900 leading-[1.1] tracking-tight text-white md:text-6xl">
                        Navigasi Masa Depan <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ekosistem Media Siber Terintegrasi</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-400">
                        Rayliziie Media Digital memimpin orkestrasi portal berita multi-sektor dan penyediaan infrastruktur teknologi terapan untuk mendorong penetrasi literasi digital secara profesional.
                    </p>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-6 mb-20">
                <div className="grid gap-6 sm:grid-cols-3 border border-slate-800 bg-slate-900 rounded-2xl p-6 shadow-xl">
                    {stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                                <s.icon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-2xl font-800 text-white tracking-tight">{s.value}</p>
                                <p className="text-xs text-slate-500 font-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Grid Konten */}
            <main className="mx-auto max-w-7xl px-6 pb-28 space-y-20">
                <div>
                    <div className="relative mb-8 flex items-center gap-4">
                        <h2 className="font-display text-xs font-800 tracking-widest text-slate-400 uppercase">Digital Media Network</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {mediaNetwork.map((item) => (
                            <div key={item.name} className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 text-indigo-400 border-slate-800 group-hover:text-white transition-colors">
                                                <item.icon className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] text-indigo-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                        Kunjungi Platform <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 rounded-md font-600">Active Server</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="relative mb-8 flex items-center gap-4">
                        <h2 className="font-display text-xs font-800 tracking-widest text-slate-400 uppercase">Digital Business Services</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {businessServices.map((item) => (
                            <div key={item.name} className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950">
                                <div>
                                    <div className="flex items-center gap-3.5">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 border-slate-800 text-purple-400 group-hover:text-white transition-colors">
                                            <item.icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] text-purple-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                        Integrasi Layanan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                    <span className="text-[10px] text-purple-400 bg-purple-950/50 border border-purple-900/50 px-2.5 py-0.5 rounded-md font-600">Enterprise Solution</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 bg-slate-950/60">
                <div className="mx-auto max-w-7xl px-6 py-12 text-center text-xs text-slate-500">
                    <p>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                    <p className="mt-1 font-600 text-indigo-400 tracking-wide">Menaungi NutrisiDietMu, BolaGass, GlowLogika & CuanPintar &middot; Medan, Sumatera Utara [Subsidiary of Rayliziie Grup].</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
