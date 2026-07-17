import React, { useState, useEffect } from 'react';

// URL API Mock Database Terpusat biar langsung live & sinkron antar-perangkat tanpa ribet setup token
const API_URL = "https://6698660a2069c438a71765c9.mockapi.io/rayliziie/v1";

const mediaNetwork = [
    { name: "NutrisiDietMu", icon: "🌱", cat: "Media Kesehatan & Gizi", desc: "Portal edukasi gizi klinis dan panduan kesehatan masyarakat.", link: "https://nutrisidietmu.vercel.app" },
    { name: "BolaGass", icon: "⚽", cat: "Media Jurnalisme Olahraga", desc: "Platform jurnalisme sepak bola dengan ulasan taktis mendalam.", link: "#" },
    { name: "GlowLogika", icon: "✨", cat: "Edukasi Skincare & Beauty", desc: "Media literasi kesehatan kulit berdasarkan sains serta fakta medis.", link: "#" },
    { name: "CuanPintar", icon: "💰", cat: "Literasi Finansial & Investasi", desc: "Portal perencanaan keuangan harian dan investasi anak muda.", link: "#" }
];

const businessServices = [
    { name: "Web Dev & Techno", icon: "💻", cat: "Pengembangan IT", desc: "Layanan pembuatan website korporat dan infrastruktur sistem digital." },
    { name: "Rayliziie Digital Invitation", icon: "🌐", cat: "Undangan Digital Premium", desc: "Jasa perancangan undangan digital elegan untuk acara formal dan pernikahan." }
];

const App = () => {
    const [view, setView] = useState('home'); // 'home', 'portal', 'admin-dashboard'
    const [portalMode, setPortalMode] = useState('login'); // 'login', 'register', 'forgot'
    
    // Live Cloud State
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Session State
    const [currentUser, setCurrentUser] = useState(null);

    // Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    
    // Article Form State
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');

    // AMBIL DATA DARI SERVER LIVE AWAN SECARA REAL-TIME
    const fetchCloudData = async () => {
        try {
            const resUsers = await fetch(`${API_URL}/users`);
            const dataUsers = await resUsers.json();
            if (Array.isArray(dataUsers)) setUsers(dataUsers);

            const resArticles = await fetch(`${API_URL}/articles`);
            const dataArticles = await resArticles.json();
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
        } catch (err) {
            console.error("Gagal sinkronisasi data cloud:", err);
        }
    };

    useEffect(() => {
        fetchCloudData();
        const interval = setInterval(fetchCloudData, 5000); // Auto-refresh setiap 5 detik biar LIVE!
        return () => clearInterval(interval);
    }, []);

    // 1. PENDAFTARAN RELAWAN LANGSUNG MASUK KE SERVER AWAN
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (users.find(u => u.email === regEmail) || regEmail === 'admin') {
            alert('Email ini sudah terdaftar di database pusat, Boy!');
            setLoading(false);
            return;
        }
        const newUser = { name: regName, email: regEmail, password: regPassword, approved: false };
        
        try {
            await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            alert(`Registrasi Sukses! Data Akun (${regName}) sudah terkirim ke Server Pusat CEO. Silakan hubungi Admin untuk Otorisasi.`);
            setRegName(''); setRegEmail(''); setRegPassword(''); setPortalMode('login');
            fetchCloudData();
        } catch (err) {
            alert('Gagal mengirim data ke server awan.');
        } finally {
            setLoading(false);
        }
    };

    // 2. VERIFIKASI LOGIN REAL-TIME DARI SERVER
    const handleLogin = (e) => {
        e.preventDefault();
        if (loginEmail === 'admin') {
            if (loginPassword === 'ceozie') {
                setView('admin-dashboard');
                alert('Selamat Datang CEO Rayliziie Grup! Membuka Pusat Kendali Server...');
                setLoginEmail(''); setLoginPassword(''); return;
            } else {
                alert('Password Admin Utama Salah, Boy!');
                setLoginPassword(''); return;
            }
        }

        const user = users.find(u => u.email === loginEmail);
        if (!user) {
            alert('Email tidak ditemukan di server pusat!');
        } else if (user.password !== loginPassword) {
            alert('Password salah, Boy!');
        } else if (!user.approved) {
            alert('Akses Tertahan! Akun Anda belum di-approve oleh CEO.');
        } else {
            setCurrentUser(user);
            alert(`Otentikasi Berhasil! Selamat datang di ruang redaksi, ${user.name}.`);
        }
        setLoginEmail(''); setLoginPassword('');
    };

    // 3. FITUR LUPA PASSWORD TERPUSAT
    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (forgotEmail === 'admin') {
            alert('Hubungi tim IT internal untuk reset akun root CEO!');
            return;
        }
        const user = users.find(u => u.email === forgotEmail);
        if (user) {
            alert(`Sistem Otorisasi Pusat: Akun ditemukan!\nNama: ${user.name}\nPassword Anda adalah: ${user.password}\n\nSilakan simpan password Anda dengan baik.`);
            setPortalMode('login');
        } else {
            alert('Email tidak terdaftar di server kami!');
        }
        setForgotEmail('');
    };

    // 4. KIRIM ARTIKEL KONTRIBUTOR KE SERVER REVIEW
    const handleCreateArticle = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newArticle = {
            title: artTitle,
            category: artCategory,
            content: artContent,
            author: currentUser.name,
            status: 'Pending Review'
        };

        try {
            await fetch(`${API_URL}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle)
            });
            alert('Artikel sukses di-upload ke antrean review server pusat!');
            setArtTitle(''); setArtContent('');
            fetchCloudData();
        } catch (err) {
            alert('Gagal mengirim artikel ke server.');
        } finally {
            setLoading(false);
        }
    };

    // KONTROL ADMIN: APPROVE AKUN RELAWAN BARU SECARA LIVE
    const approveUser = async (id) => {
        try {
            await fetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });
            alert('Akun kontributor resmi diaktifkan!');
            fetchCloudData();
        } catch (err) {
            alert('Gagal meng-approve user.');
        }
    };

    // KONTROL ADMIN: APPROVE PUBLISH ARTIKEL LIVE
    const approveArticle = async (id) => {
        try {
            await fetch(`${API_URL}/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Published' })
            });
            alert('Berita resmi dipublikasikan ke publik!');
            fetchCloudData();
        } catch (err) {
            alert('Gagal menerbitkan artikel.');
        }
    };

    // KONTROL ADMIN: REJECT ARTIKEL LIVE
    const rejectArticle = async (id) => {
        try {
            await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' });
            alert('Draf artikel dihapus dari server.');
            fetchCloudData();
        } catch (err) {
            alert('Gagal menghapus artikel.');
        }
    };

    // CENTRAL CONTROL SERVER SCREEN
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>⚙️ RAYLIZIIE CENTRAL CONTROL SERVER</h1>
                            <p style={{ fontSize: '12px', color: '#a78bfa', margin: '5px 0 0 0' }}>STATUS SERVER: <span style={{ color: '#10b981', fontWeight: '800' }}>● LIVE & SYNCED</span> (MEDAN, SUMATERA UTARA)</p>
                        </div>
                        <button onClick={() => setView('home')} style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700' }}>Keluar Server</button>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {/* LIVE USER REVIEW */}
                        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>👥 VERIFIKASI AKUN RELAWAN ({users.filter(u=>!u.approved).length})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {users.filter(u => !u.approved).length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Tidak ada antrean pendaftar baru.</p>
                                ) : (
                                    users.filter(u => !u.approved).map(u => (
                                        <div key={u.id} style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>{u.name}</p>
                                                <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{u.email}</p>
                                            </div>
                                            <button onClick={() => approveUser(u.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>Approve</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* LIVE ARTICLE SENSOR */}
                        <div style={{ flex: '2', minWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>📝 MEJA SENSOR ARTIKEL KELAYAKAN ({articles.filter(a=>a.status==='Pending Review').length})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {articles.filter(a => a.status === 'Pending Review').length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Server bersih. Belum ada draf masuk.</p>
                                ) : (
                                    articles.filter(a => a.status === 'Pending Review').map(a => (
                                        <div key={a.id} style={{ padding: '16px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#818cf8', backgroundColor: '#1e1b4b', padding: '2px 6px', borderRadius: '4px' }}>{a.category.toUpperCase()}</span>
                                                    <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '8px 0 4px 0', color: '#fff' }}>{a.title}</h3>
                                                    <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Kontributor: {a.author}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => approveArticle(a.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>Terbitkan</button>
                                                    <button onClick={() => rejectArticle(a.id)} style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>Tolak</button>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginTop: '12px', whiteSpace: 'pre-wrap' }}>{a.content}</p>
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

    // INTERFACE GATEWAY PORTAL
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
                            {portalMode !== 'forgot' && (
                                <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
                                    <button onClick={() => setPortalMode('login')} style={{ width: '50%', paddingBottom: '10px', background: 'none', border: 'none', color: portalMode === 'login' ? '#fff' : '#64748b', fontWeight: '800', cursor: 'pointer', borderBottom: portalMode === 'login' ? '2px solid #6366f1' : 'none' }}>LOG IN</button>
                                    <button onClick={() => setPortalMode('register')} style={{ width: '50%', paddingBottom: '10px', background: 'none', border: 'none', color: portalMode === 'register' ? '#fff' : '#64748b', fontWeight: '800', cursor: 'pointer', borderBottom: portalMode === 'register' ? '2px solid #6366f1' : 'none' }}>DAFTAR RELAWAN</button>
                                </div>
                            )}

                            {portalMode === 'login' && (
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
                                    <span onClick={() => setPortalMode('forgot')} style={{ fontSize: '11px', color: '#a78bfa', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>Lupa Password Akun?</span>
                                </form>
                            )}

                            {portalMode === 'register' && (
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
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>BUAT PASSWORD</label>
                                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Buat password..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <button type="submit" disabled={loading} style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                                        {loading ? 'Mengirim data...' : 'Ajukan Relawan'}
                                    </button>
                                </form>
                            )}

                            {portalMode === 'forgot' && (
                                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '14px', margin: 0, color: '#fff', textAlign: 'center' }}>🔑 PEMULIHAN KODE AKSES</h3>
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>MASUKKAN EMAIL ANDA</label>
                                        <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@example.com" required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Cek Sandi Pusat</button>
                                    <span onClick={() => setPortalMode('login')} style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', cursor: 'pointer', marginTop: '5px' }}>Kembali ke Login</span>
                                </form>
                            )}
                        </div>
                    ) : (
                        // WRITER FIELD FORM
                        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justify: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>✍️ RUANG REDAKSI KONTRIBUTOR</h2>
                                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>● Sesi Aktif</span>
                            </div>
                            <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>JUDUL ARTIKEL</label>
                                    <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="Judul berita..." required style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
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
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>ISI TULISAN BERITA</label>
                                    <textarea rows="6" value={artContent} onChange={(e) => setArtContent(e.target.value)} placeholder="Ketik narasi berita lengkap..." required style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginTop: '6px', resize: 'none', boxSizing: 'border-box' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <button type="submit" disabled={loading} style={{ backgroundColor: '#fff', color: '#0f172a', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                                        {loading ? 'Mengirim...' : 'Ajukan Terbit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // HOME SCREEN
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>RAYLIZIIE MEDIA DIGITAL</span>
                        <span style={{ fontSize: '9px', color: '#818cf8', display: 'block', fontWeight: '700' }}>RAYLIZIIE GRUP SUBSIDIARY</span>
                    </div>
                    <button onClick={() => setView('portal')} style={{ backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>Portal Admin & Relawan</button>
                </div>
            </header>

            <section style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span style={{ fontSize: '11px', color: '#818cf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>🛡️ DIVISI INFORMASI & TEKNOLOGI GLOBAL</span>
                <h1 style={{ fontSize: '40px', fontWeight: '950', color: '#fff', marginTop: '20px' }}>Navigasi Masa Depan</h1>
                <p style={{ fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Ekosistem Media Siber Terintegrasi</p>
            </section>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px 20px' }}>
                <h2 style={{ fontSize: '12px', color: '#64748b', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '30px' }}>DIGITAL MEDIA NETWORK</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
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
                                        <div key={art.id} style={{ padding: '10px', backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '12px', marginTop: '8px' }}>
                                            <h4 style={{ margin: 0, color: '#f1f5f9', fontWeight: '700' }}>{art.title}</h4>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#64748b' }}>Oleh: {art.author}</p>
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

                <h2 style={{ fontSize: '12px', color: '#64748b', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '30px' }}>DIGITAL BUSINESS SERVICES</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {businessServices.map((item) => (
                        <div key={item.name} style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>{item.icon} {item.name}</h3>
                            <p style={{ fontSize: '10px', color: '#c084fc', margin: '4px 0 0 0', fontWeight: '700' }}>{item.cat}</p>
                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginTop: '14px' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer style={{ borderTop: '1px solid #1e293b', backgroundColor: '#020617', padding: '40px 20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '700' }}>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                <p style={{ margin: 0, color: '#6366f1', fontWeight: '600' }}>Menaungi Brand Pilihan: NutrisiDietMu &middot; BolaGass &middot; GlowLogika &middot; CuanPintar</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#475569' }}>Subsidiary Corporate Office: Rayliziie Grup &middot; Medan, Sumatera Utara</p>
            </footer>
        </div>
    );
};

export default App;
