import React, { useState, useEffect } from 'react';
import { 
    Laptop, Sparkles, Flame, Box, Landmark, 
    Globe, ShieldCheck, ArrowUpRight, ArrowRight, 
    Layers, Users, BarChart3, Radio, FileText, 
    PlusCircle, UserPlus, Image, Lock, Unlock, Eye, Check, X, Settings
} from 'lucide-react';

// Database Awal bawaan sistem
const initialUsers = [
    { email: 'penulis@rayliziie.com', name: 'Penulis Senior', approved: true },
];

const mediaNetwork = [
    { name: "NutrisiDietMu", icon: Sparkles, cat: "Media Kesehatan & Gizi", desc: "Portal edukasi gizi klinis dan panduan kesehatan masyarakat.", color: "text-teal-400 bg-teal-950/30 border-teal-900/50", link: "https://nutrisidietmu.vercel.app" },
    { name: "BolaGass", icon: Flame, cat: "Media Jurnalisme Olahraga", desc: "Platform jurnalisme sepak bola dengan ulasan taktis mendalam.", color: "text-orange-400 bg-orange-950/30 border-orange-900/50", link: "#" },
    { name: "GlowLogika", icon: Box, cat: "Edukasi Skincare & Beauty", desc: "Media literasi kesehatan kulit berdasarkan sains serta fakta medis.", color: "text-pink-400 bg-pink-950/30 border-pink-900/50", link: "#" },
    { name: "CuanPintar", icon: Landmark, cat: "Literasi Finansial & Investasi", desc: "Portal perencanaan keuangan harian dan investasi anak muda.", color: "text-blue-400 bg-blue-950/30 border-blue-900/50", link: "#" }
];

const businessServices = [
    { name: "Web Dev & Techno", icon: Laptop, cat: "Pengembangan IT", desc: "Layanan pembuatan website korporat dan infrastruktur sistem digital.", color: "text-cyan-400 bg-cyan-950/30 border-cyan-900/50" },
    { name: "Rayliziie Digital Invitation", icon: Globe, cat: "Undangan Digital Premium", desc: "Jasa perancangan undangan digital elegan untuk acara formal dan pernikahan.", color: "text-indigo-400 bg-indigo-950/30 border-indigo-900/50" }
];

const App = () => {
    const [view, setView] = useState('home'); // 'home', 'portal', 'admin-dashboard'
    const [portalMode, setPortalMode] = useState('login'); // 'login', 'register'
    
    // Database State (Disimpan di localStorage biar ga hilang pas di-refresh)
    const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('r_users')) || initialUsers);
    const [articles, setArticles] = useState(() => JSON.parse(localStorage.getItem('r_articles')) || []);
    
    // Session State
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');
    const [artImage, setArtImage] = useState(null);

    // Sync ke localstorage setiap ada perubahan data
    useEffect(() => { localStorage.setItem('r_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('r_articles', JSON.stringify(articles)); }, [articles]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setArtImage(URL.createObjectURL(file));
    };

    // ALUR 1: PENDAFTARAN RELAWAN (STATUS PENDING AUTOMATIC)
    const handleRegister = (e) => {
        e.preventDefault();
        if (users.find(u => u.email === regEmail)) {
            alert('Email ini sudah terdaftar, Boy!');
            return;
        }
        const newUser = { name: regName, email: regEmail, approved: false };
        setUsers([...users, newUser]);
        alert(`Registrasi Sukses! Akun Anda (${regName}) telah masuk ke antrean server. Harap tunggu verifikasi dan approval dari Admin Utama.`);
        setRegName(''); setRegEmail(''); setPortalMode('login');
    };

    // ALUR 2: LOGIN CHECK (VERIFIKASI STATUS APPROVAL)
    const handleLogin = (e) => {
        e.preventDefault();
        // bypass akun admin utama
        if (loginEmail === 'admin') {
            setIsAdmin(true); setView('admin-dashboard');
            alert('Selamat Datang CEO Rayliziie Grup! Membuka Pusat Kendali Server...');
            setLoginEmail(''); return;
        }

        const user = users.find(u => u.email === loginEmail);
        if (!user) {
            alert('Email tidak terdaftar! Silakan ajukan pendaftaran relawan terlebih dahulu.');
        } else if (!user.approved) {
            alert('Akses Ditolak! Akun Anda sudah terdaftar tapi BELUM DI-APPROVE oleh Admin Server.');
        } else {
            setCurrentUser(user);
            alert(`Akses Diterima! Selamat bekerja, ${user.name}.`);
        }
        setLoginEmail('');
    };

    // ALUR 3: KIRIM ARTIKEL (MASUK STATUS PENDING REVIEW, TIDAK LANGSUNG TERBIT)
    const handleCreateArticle = (e) => {
        e.preventDefault();
        const newArticle = {
            id: Date.now(),
            title: artTitle,
            category: artCategory,
            content: artContent,
            image: artImage,
            author: currentUser.name,
            status: 'Pending Review' // Status default tertahan
        };
        setArticles([...articles, newArticle]);
        alert('Artikel sukses dikirim ke meja redaksi! Status: PENDING REVIEW. Menunggu peninjauan Admin.');
        setArtTitle(''); setArtContent(''); setArtImage(null);
    };

    // FUNGSI ADMIN: APPROVE AKUN RELAWAN
    const approveUser = (email) => {
        setUsers(users.map(u => u.email === email ? { ...u, approved: true } : u));
    };

    // FUNGSI ADMIN: APPROVE PUBLISH ARTIKEL
    const approveArticle = (id) => {
        setArticles(articles.map(a => a.id === id ? { ...a, status: 'Published' } : a));
        alert('Artikel layak terbit! Status berubah menjadi PUBLISHED.');
    };

    // FUNGSI ADMIN: TOLAK ARTIKEL
    const rejectArticle = (id) => {
        setArticles(articles.filter(a => a.id !== id));
        alert('Artikel ditolak dan dihapus dari server redaksi.');
    };

    // SCREEN 1: PANEL DASHBOARD KENDALI ADMIN (CEO VIEW)
    if (view === 'admin-dashboard') {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-900/40">
                                <Settings className="h-5 w-5 text-white" />
                            </span>
                            <div>
                                <h1 className="text-xl font-950 text-white tracking-tight">RAYLIZIIE CENTRAL SERVER KENDALI</h1>
                                <p className="text-xs text-purple-400 font-700 uppercase tracking-widest">Meja Kerja CEO / Super Admin</p>
                            </div>
                        </div>
                        <button onClick={() => { setIsAdmin(false); setView('home'); }} className="text-xs font-700 bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Keluar Server</button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* KENDALI 1: PENINJAUAN AKUN RELAWAN BARU */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit">
                            <h2 className="text-sm font-800 text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-400" /> Peninjauan Pendaftar ({users.filter(u=>!u.approved).length})
                            </h2>
                            <div className="space-y-3">
                                {users.filter(u => !u.approved).length === 0 ? (
                                    <p className="text-xs text-slate-500 italic">Tidak ada pendaftar baru saat ini.</p>
                                ) : (
                                    users.filter(u => !u.approved).map(u => (
                                        <div key={u.email} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-700 text-white">{u.name}</p>
                                                <p className="text-[10px] text-slate-500">{u.email}</p>
                                            </div>
                                            <button onClick={() => approveUser(u.email)} className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors">
                                                <Check className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* KENDALI 2: MEJA PENINJAUAN LAYAK TERBIT ARTIKEL */}
                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <h2 className="text-sm font-800 text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-400" /> Meja Sensor Kelayakan Berita ({articles.filter(a=>a.status==='Pending Review').length})
                            </h2>
                            <div className="space-y-4">
                                {articles.filter(a => a.status === 'Pending Review').length === 0 ? (
                                    <p className="text-xs text-slate-500 italic">Bersih! Tidak ada draf artikel yang menunggu peninjauan.</p>
                                ) : (
                                    articles.filter(a => a.status === 'Pending Review').map(a => (
                                        <div key={a.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-[9px] font-700 uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded">
                                                        Target: {a.category.toUpperCase()}
                                                    </span>
                                                    <h3 className="text-base font-800 text-white mt-1.5">{a.title}</h3>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Oleh Kontributor: {a.author}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveArticle(a.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-700 flex items-center gap-1">
                                                        <Check className="h-3 w-3" /> Terbitkan
                                                    </button>
                                                    <button onClick={() => rejectArticle(a.id)} className="bg-red-950 text-red-400 border border-red-900 px-3 py-1.5 rounded-lg text-xs font-700 flex items-center gap-1">
                                                        <X className="h-3 w-3" /> Tolak
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">{a.content}</p>
                                            {a.image && (
                                                <div className="w-32 h-20 border border-slate-800 rounded-lg overflow-hidden">
                                                    <img src={a.image} alt="Cover" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // SCREEN 2: PORTAL PENULIS & REGISTRASI (WRITER INTERFACE)
    if (view === 'portal') {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                                <FileText className="h-4 w-4 text-white" />
                            </span>
                            <div>
                                <h1 className="text-lg font-900 text-white">RAYLIZIIE CMS PORTAL</h1>
                                <p className="text-[10px] text-indigo-400 font-600 uppercase tracking-wider">
                                    {currentUser ? `Sesi Kerja: ${currentUser.name}` : 'Gerbang Otentikasi Penulis'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setView('home'); setCurrentUser(null); }} className="text-xs font-700 bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">Kembali</button>
                    </div>

                    {!currentUser ? (
                        <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mt-8">
                            <div className="flex border-b border-slate-800 mb-6">
                                <button onClick={() => setPortalMode('login')} className={`w-1/2 pb-3 text-xs font-800 uppercase border-b-2 transition-all ${portalMode === 'login' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'}`}>Log In</button>
                                <button onClick={() => setPortalMode('register')} className={`w-1/2 pb-3 text-xs font-800 uppercase border-b-2 transition-all ${portalMode === 'register' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'}`}>Daftar Relawan</button>
                            </div>

                            {portalMode === 'login' ? (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="flex items-center gap-2 text-amber-400 font-700 text-[10px] uppercase tracking-wider mb-1"><Lock className="h-3.5 w-3.5" /> Security Validation</div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase">Masukkan Email Terverifikasi</label>
                                        <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Ketik email atau 'admin'..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <button type="submit" className="w-full bg-white text-slate-900 font-700 text-xs py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">Verifikasi Akun</button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-400 font-700 text-[10px] uppercase tracking-wider mb-1"><UserPlus className="h-3.5 w-3.5" /> Form Kemitraan Kontributor</div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase">Nama Lengkap</label>
                                        <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Masukkan nama..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-700 text-slate-400 mb-1.5 uppercase">Alamat Email</label>
                                        <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@example.com" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-700 text-xs py-3 rounded-xl hover:bg-indigo-500 transition-all">Kirim Berkas Pendaftaran</button>
                                </form>
                            )}
                        </div>
                    ) : (
                        // FORM MENULIS JIKA AKUN SUDAH LOGGED IN DAN DI-APPROVE
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-sm font-800 text-white uppercase tracking-wider flex items-center gap-2"><PlusCircle className="h-4 w-4 text-indigo-400" /> Ruang Tulis Konten</div>
                                <span className="text-[10px] font-700 text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-1 rounded-md flex items-center gap-1"><Unlock className="h-3 w-3" /> Otoritas Terverifikasi</span>
                            </div>
                            <form onSubmit={handleCreateArticle} className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-3">
                                    <div className="md:col-span-2 space-y-5">
                                        <div>
                                            <label className="block text-xs font-700 text-slate-400 mb-2 uppercase">Judul Artikel</label>
                                            <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="Ketik judul berita memikat..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-700 text-slate-400 mb-2 uppercase">Target Divisi Media</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['gizi', 'bola', 'skincare', 'keuangan'].map((cat) => (
                                                    <label key={cat} className={`p-2.5 rounded-xl border text-xs font-700 text-center cursor-pointer select-none tracking-wide uppercase ${artCategory === cat ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                                                        <input type="radio" name="artCategory" value={cat} checked={artCategory === cat} onChange={() => setArtCategory(cat)} className="sr-only" />
                                                        {cat}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-700 text-slate-400 mb-2 uppercase">Gambar / Foto Pendukung</label>
                                        <div className="h-[140px] bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 relative group hover:border-indigo-500/50 transition-colors">
                                            {artImage ? (
                                                <img src={artImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                                    <Image className="h-5 w-5 text-slate-500 mb-1" />
                                                    <span className="text-[10px] text-slate-400">Pilih Gambar</span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-700 text-slate-400 mb-2 uppercase">Isi Tulisan Berita</label>
                                    <textarea rows="6" value={artContent} onChange={(e) => setArtContent(e.target.value)} placeholder="Ketik narasi berita lu secara mendalam di sini, Boy..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"></textarea>
                                </div>
                                <div className="flex justify-end"><button type="submit" className="bg-white text-slate-900 font-700 text-xs px-6 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-md">Ajukan ke Redaksi</button></div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // SCREEN 3: LANDING PAGE DEPAN UTAMA (PUBLIC VIEW)
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white antialiased">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40"><Layers className="h-5 w-5 text-white" /></span>
                        <div>
                            <span className="font-display text-lg font-900 tracking-tight text-white block">RAYLIZIIE MEDIA DIGITAL</span>
                            <span className="text-[9px] font-700 tracking-widest text-indigo-400 uppercase block -mt-0.5">Rayliziie Grup Subsidiary</span>
                        </div>
                    </div>
                    <button onClick={() => setView('portal')} className="rounded-full bg-white px-5 py-2 text-xs font-700 text-slate-900 transition-all hover:bg-indigo-500 hover:text-white shadow-sm">Portal Admin & Relawan</button>
                </div>
            </header>

            {/* Hero & Stat Sections */}
            <section className="relative overflow-hidden pt-24 pb-16 text-center md:pt-32 md:pb-24">
                <div className="mx-auto max-w-4xl px-6 relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/60 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-indigo-400"><ShieldCheck className="h-3.5 w-3.5" /> Divisi Informasi & Teknologi Global</span>
                    <h1 className="mt-6 font-display text-4xl font-900 leading-[1.1] text-white md:text-6xl">Navigasi Masa Depan <br /><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ekosistem Media Siber Terintegrasi</span></h1>
                    <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base text-slate-400">Rayliziie Media Digital memimpin orkestrasi portal berita multi-sektor dan penyediaan infrastruktur teknologi terapan untuk mendorong penetrasi literasi digital secara profesional.</p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 mb-20">
                <div className="grid gap-6 sm:grid-cols-3 border border-slate-800 bg-slate-900 rounded-2xl p-6 shadow-xl">
                    {stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400"><s.icon className="h-5 w-5" /></span>
                            <div><p className="text-2xl font-800 text-white tracking-tight">{s.value}</p><p className="text-xs text-slate-500 font-500">{s.label}</p></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Grid Publik Lini Bisnis */}
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
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 text-indigo-400 border-slate-800 group-hover:text-white transition-colors"><item.icon className="h-5 w-5" /></span>
                                            <div>
                                                <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] text-indigo-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                    
                                    {/* ARTIKEL YANG SUDAH DI-APPROVE OLEH ADMIN AKAN MUNCUL DI SINI SECARA LIVE */}
                                    <div className="mt-4 space-y-2">
                                        {articles.filter(a => a.category === (item.name === 'NutrisiDietMu' ? 'gizi' : item.name === 'BolaGass' ? 'bola' : item.name === 'GlowLogika' ? 'skincare' : 'keuangan') && a.status === 'Published').map(art => (
                                            <div key={art.id} className="p-2.5 bg-slate-900/60 border border-slate-800/60 rounded-xl text-xs flex gap-3 items-center">
                                                {art.image && <img src={art.image} className="w-10 h-10 object-cover rounded-md" />}
                                                <div>
                                                    <h4 className="font-700 text-slate-200 line-clamp-1">{art.title}</h4>
                                                    <p className="text-[9px] text-slate-500">Oleh: {art.author}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">Kunjungi Platform <ArrowUpRight className="h-3.5 w-3.5" /></a>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 rounded-md font-600">Active Network</span>
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
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 border-slate-800 text-purple-400 group-hover:text-white transition-colors"><item.icon className="h-5 w-5" /></span>
                                        <div>
                                            <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] text-purple-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">Integrasi Layanan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
                                    <span className="text-[10px] text-purple-400 bg-purple-950/50 border border-purple-900/50 px-2.5 py-0.5 rounded-md font-600">Enterprise Solution</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 bg-slate-950/60 py-12 text-center text-xs text-slate-500">
                <p>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                <p className="mt-1 font-600 text-indigo-400 tracking-wide">Menaungi NutrisiDietMu, BolaGass, GlowLogika & CuanPintar &middot; Medan, Sumatera Utara.</p>
            </footer>
        </div>
    );
};

export default App;
