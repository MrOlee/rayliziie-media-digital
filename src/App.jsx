import React, { useState, useEffect } from 'react';

// Database Awal bawaan sistem
const initialUsers = [
    { email: 'penulis@rayliziie.com', name: 'Penulis Senior', password: '123', approved: true },
];

const mediaNetwork = [
    { name: "NutrisiDietMu", icon: "🌱", cat: "Media Kesehatan & Gizi", desc: "Portal edukasi gizi klinis dan panduan kesehatan masyarakat.", color: "border-teal-900/50", link: "https://nutrisidietmu.vercel.app" },
    { name: "BolaGass", icon: "⚽", cat: "Media Jurnalisme Olahraga", desc: "Platform jurnalisme sepak bola dengan ulasan taktis mendalam.", color: "border-orange-900/50", link: "#" },
    { name: "GlowLogika", icon: "✨", cat: "Edukasi Skincare & Beauty", desc: "Media literasi kesehatan kulit berdasarkan sains serta fakta medis.", color: "border-pink-900/50", link: "#" },
    { name: "CuanPintar", icon: "💰", cat: "Literasi Finansial & Investasi", desc: "Portal perencanaan keuangan harian dan investasi anak muda.", color: "border-blue-900/50", link: "#" }
];

const businessServices = [
    { name: "Web Dev & Techno", icon: "💻", cat: "Pengembangan IT", desc: "Layanan pembuatan website korporat dan infrastruktur sistem digital.", color: "border-cyan-900/50" },
    { name: "Rayliziie Digital Invitation", icon: "🌐", cat: "Undangan Digital Premium", desc: "Jasa perancangan undangan digital elegan untuk acara formal dan pernikahan.", color: "border-indigo-900/50" }
];

const App = () => {
    const [view, setView] = useState('home'); // 'home', 'portal', 'admin-dashboard'
    const [portalMode, setPortalMode] = useState('login'); // 'login', 'register'
    
    // Database State
    const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('r_users')) || initialUsers);
    const [articles, setArticles] = useState(() => JSON.parse(localStorage.getItem('r_articles')) || []);
    
    // Session State
    const [currentUser, setCurrentUser] = useState(null);

    // Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');
    const [artImage, setArtImage] = useState(null);

    // Sync ke localstorage
    useEffect(() => { localStorage.setItem('r_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('r_articles', JSON.stringify(articles)); }, [articles]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setArtImage(URL.createObjectURL(file));
    };

    // 1. PENDAFTARAN RELAWAN + PASSWORD
    const handleRegister = (e) => {
        e.preventDefault();
        if (users.find(u => u.email === regEmail)) {
            alert('Email ini sudah terdaftar, Boy!');
            return;
        }
        const newUser = { name: regName, email: regEmail, password: regPassword, approved: false };
        setUsers([...users, newUser]);
        alert(`Registrasi Sukses, Boy! Akun Anda (${regName}) telah masuk ke antrean server. Silakan tunggu approval dari CEO agar bisa login.`);
        setRegName(''); setRegEmail(''); setRegPassword(''); setPortalMode('login');
    };

    // 2. LOGIN CHECK DENGAN PASSWORD & PASS KUNCI CEOZIE
    const handleLogin = (e) => {
        e.preventDefault();
        
        // CHECK AKUN SUPER ADMIN / CEO
        if (loginEmail === 'admin') {
            if (loginPassword === 'ceozie') {
                setView('admin-dashboard');
                alert('Selamat Datang CEO Rayliziie Grup! Membuka Pusat Kendali Server...');
                setLoginEmail(''); setLoginPassword(''); return;
            } else {
                alert('Password Admin Utama Salah, Boy! Akses Ditolak.');
                setLoginPassword(''); return;
            }
        }

        // CHECK AKUN RELAWAN WRITER
        const user = users.find(u => u.email === loginEmail);
        if (!user) {
            alert('Email tidak terdaftar! Silakan ajukan pendaftaran relawan terlebih dahulu.');
        } else if (user.password !== loginPassword) {
            alert('Password yang Anda masukkan salah!');
        } else if (!user.approved) {
            alert('Akses Ditolak! Akun Anda benar, tapi BELUM DI-APPROVE oleh Admin Server.');
        } else {
            setCurrentUser(user);
            alert(`Akses Diterima! Selamat bekerja di ruang redaksi, ${user.name}.`);
        }
        setLoginEmail(''); setLoginPassword('');
    };

    // 3. KIRIM ARTIKEL
    const handleCreateArticle = (e) => {
        e.preventDefault();
        const newArticle = {
            id: Date.now(),
            title: artTitle,
            category: artCategory,
            content: artContent,
            image: artImage,
            author: currentUser.name,
            status: 'Pending Review'
        };
        setArticles([...articles, newArticle]);
        alert('Artikel sukses dikirim ke meja redaksi! Status: PENDING REVIEW. Menunggu peninjauan CEO.');
        setArtTitle(''); setArtContent(''); setArtImage(null);
    };

    const approveUser = (email) => {
        setUsers(users.map(u => u.email === email ? { ...u, approved: true } : u));
        alert('Akun relawan sukses di-approve!');
    };

    const approveArticle = (id) => {
        setArticles(articles.map(a => a.id === id ? { ...a, status: 'Published' } : a));
        alert('Artikel layak terbit! Status berubah menjadi PUBLISHED.');
    };

    const rejectArticle = (id) => {
        setArticles(articles.filter(a => a.id !== id));
        alert('Artikel ditolak dan dihapus dari server.');
    };

    // SCREEN 1: ADMIN DASHBOARD (CEO CONTROL HUB)
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>⚙️ RAYLIZIIE CENTRAL SERVER</h1>
                            <p style={{ fontSize: '12px', color: '#a78bfa', margin: '5px 0 0 0' }}>MEJA KERJA CEO / SUPER ADMIN</p>
                        </div>
                        <button onClick={() => setView('home')} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700' }}>Keluar Server</button>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {/* APPROVAL USER */}
                        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>👥 PENINJAUAN PENDAFTAR ({users.filter(u=>!u.approved).length})</h2>
                            {users.filter(u => !u.approved).length === 0 ? (
                                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Tidak ada pendaftar baru.</p>
                            ) : (
                                users.filter(u => !u.approved).map(u => (
                                    <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#0f172a', borderRadius: '12px', marginBottom: '10px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>{u.name}</p>
                                            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{u.email}</p>
                                        </div>
                                        <button onClick={() => approveUser(u.email)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Approve</button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* APPROVAL ARTIKEL */}
                        <div style={{ flex: '2', minWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>📝 MEJA SENSOR KELAYAKAN BERITA ({articles.filter(a=>a.status==='Pending Review').length})</h2>
                            {articles.filter(a => a.status === 'Pending Review').length === 0 ? (
                                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Bersih! Tidak ada draf artikel baru.</p>
                            ) : (
                                articles.filter(a => a.status === 'Pending Review').map(a => (
                                    <div key={a.id} style={{ padding: '16px', backgroundColor: '#0f172a', borderRadius: '12px', marginBottom: '15px', border: '1px solid #334155' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <span style={{ fontSize: '9px', fontWeight: '700', color: '#818cf8', backgroundColor: '#1e1b4b', padding: '2px 6px', borderRadius: '4px' }}>{a.category.toUpperCase()}</span>
                                                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '8px 0 4px 0' }}>{a.title}</h3>
                                                <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Penulis: {a.author}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => approveArticle(a.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>Terbitkan</button>
                                                <button onClick={() => rejectArticle(a.id)} style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>Tolak</button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginTop: '12px', whiteSpace: 'pre-wrap' }}>{a.content}</p>
                                        {a.image && <img src={a.image} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // SCREEN 2: CMS WRITER PORTAL
    if (view === 'portal') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>📁 RAYLIZIIE CMS PORTAL</h1>
                        <button onClick={() => { setView('home'); setCurrentUser(null); }} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700' }}>Kembali</button>
                    </div>

                    {!currentUser ? (
                        <div style={{ maxWidth: '400px', margin: '40px auto', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
                                <button onClick={() => setPortalMode('login')} style={{ width: '50%', paddingBottom: '10px', background: 'none', border: 'none', color: portalMode === 'login' ? '#fff' : '#64748b', fontWeight: '800', cursor: 'pointer', borderBottom: portalMode === 'login' ? '2px solid #6366f1' : 'none' }}>LOG IN</button>
                                <button onClick={() => setPortalMode('register')} style={{ width: '50%', paddingBottom: '10px', background: 'none', border: 'none', color: portalMode === 'register' ? '#fff' : '#64748b', fontWeight: '800', cursor: 'pointer', borderBottom: portalMode === 'register' ? '2px solid #6366f1' : 'none' }}>DAFTAR RELAWAN</button>
                            </div>

                            {portalMode === 'login' ? (
                                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>EMAIL TERVERIFIKASI</label>
                                        <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Ketik email atau 'admin'..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
                                        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Masukkan password..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: '#fff', color: '#0f172a', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Masuk Panel</button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>NAMA LENGKAP</label>
                                        <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nama Anda..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ALAMAT EMAIL</label>
                                        <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@example.com" required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>BUAT PASSWORD BARU</label>
                                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Buat password akun..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Ajukan Relawan</button>
                                </form>
                            )}
                        </div>
                    ) : (
                        // WRITER FORM
                        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>✍️ RUANG TULIS KONTEN KONTRIBUTOR</h2>
                                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>● Terverifikasi</span>
                            </div>
                            <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>JUDUL ARTIKEL</label>
                                            <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="Judul berita memikat..." required style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>TARGET DIVISI MEDIA</label>
                                            <select value={artCategory} onChange={(e) => setArtCategory(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }}>
                                                <option value="gizi">NutrisiDietMu</option>
                                                <option value="bola">BolaGass</option>
                                                <option value="skincare">GlowLogika</option>
                                                <option value="keuangan">CuanPintar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ flex: '1', minWidth: '150px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>GAMBAR / COVER</label>
                                        <div style={{ height: '130px', backgroundColor: '#0f172a', border: '2px dashed #334155', borderRadius: '8px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                            {artImage ? (
                                                <img src={artImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <label style={{ cursor: 'pointer', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                                                    📁 Pilih File
                                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>ISI TULISAN BERITA</label>
                                    <textarea rows="6" value={artContent} onChange={(e) => setArtContent(e.target.value)} placeholder="Ketik narasi berita lu di sini, Boy..." required style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginTop: '6px', resize: 'none', boxSizing: 'border-box' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <button type="submit" style={{ backgroundColor: '#fff', color: '#0f172a', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Ajukan ke Redaksi</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // SCREEN 3: PUBLIC LANDING PAGE (DENGAN FOOTER PERUSAHAAN KORPORAT)
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>RAYLIZIIE MEDIA DIGITAL</span>
                        <span style={{ fontSize: '9px', color: '#818cf8', display: 'block', fontWeight: '700', letterSpacing: '1px' }}>RAYLIZIIE GRUP SUBSIDIARY</span>
                    </div>
                    <button onClick={() => setView('portal')} style={{ backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>Portal Admin & Relawan</button>
                </div>
            </header>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span style={{ fontSize: '11px', color: '#818cf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>🛡️ DIVISI INFORMASI & TEKNOLOGI GLOBAL</span>
                <h1 style={{ fontSize: '40px', fontWeight: '950', color: '#fff', marginTop: '20px', marginBottom: '10px' }}>Navigasi Masa Depan</h1>
                <p style={{ fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Ekosistem Media Siber Terintegrasi</p>
                <p style={{ maxWidth: '600px', margin: '20px auto 0 auto', fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>Rayliziie Media Digital memimpin orkestrasi portal berita multi-sektor dan penyediaan infrastruktur teknologi terapan untuk mendorong penetrasi literasi digital secara profesional.</p>
            </section>

            {/* Grid Media Network */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px 20px' }}>
                <h2 style={{ fontSize: '12px', color: '#64748b', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '30px' }}>DIGITAL MEDIA NETWORK</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {mediaNetwork.map((item) => (
                        <div key={item.name} style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>{item.name}</h3>
                                        <p style={{ fontSize: '10px', color: '#818cf8', margin: 0, fontWeight: '700' }}>{item.cat}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginTop: '14px' }}>{item.desc}</p>
                                
                                <div style={{ marginTop: '15px' }}>
                                    {articles.filter(a => a.category === (item.name === 'NutrisiDietMu' ? 'gizi' : item.name === 'BolaGass' ? 'bola' : item.name === 'GlowLogika' ? 'skincare' : 'keuangan') && a.status === 'Published').map(art => (
                                        <div key={art.id} style={{ padding: '10px', backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                                            {art.image && <img src={art.image} style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />}
                                            <div>
                                                <h4 style={{ margin: 0, color: '#f1f5f9', fontWeight: '700' }}>{art.title}</h4>
                                                <p style={{ margin: 0, fontSize: '9px', color: '#64748b' }}>Oleh: {art.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #0f172a', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Kunjungi Platform ↗</a>
                                <span style={{ color: '#34d399', fontSize: '10px', fontWeight: '700' }}>● Active Server</span>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 style={{ fontSize: '12px', color: '#64748b', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginTop: '50px', marginBottom: '30px' }}>DIGITAL BUSINESS SERVICES</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {businessServices.map((item) => (
                        <div key={item.name} style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>{item.name}</h3>
                                    <p style={{ fontSize: '10px', color: '#c084fc', margin: 0, fontWeight: '700' }}>{item.cat}</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginTop: '14px' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* FOOTER PREMIUM KORPORAT - RESMI KEMBALI AKTIF */}
            <footer style={{ borderTop: '1px solid #1e293b', backgroundColor: '#020617', padding: '40px 20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '700' }}>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                    <p style={{ margin: 0, color: '#6366f1', fontWeight: '600', letterSpacing: '0.5px' }}>
                        Menaungi Brand Pilihan: NutrisiDietMu &middot; BolaGass &middot; GlowLogika &middot; CuanPintar
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#475569' }}>
                        Subsidiary Corporate Office: Rayliziie Grup &middot; Medan, Sumatera Utara
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
