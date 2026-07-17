import React, { useState, useEffect } from 'react';

// ==========================================
// PENTING: PASTIKAN INI SUDAH DIISI DENGAN BENAR, BOY!
// ==========================================
const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

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
    const [view, setView] = useState('home');
    const [portalMode, setPortalMode] = useState('login');
    
    // Cloud DB States
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');

    // AMBIL DATA DARI SUPABASE SECARA REAL-TIME (POLLING DATA)
    const fetchSupabaseData = async () => {
        if (!SUPABASE_URL || SUPABASE_URL.includes("XYZ_GANTI")) return;
        try {
            const resUsers = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if (resUsers.ok) {
                const dataUsers = await resUsers.json();
                if (Array.isArray(dataUsers)) setUsers(dataUsers);
            }

            const resArticles = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if (resArticles.ok) {
                const dataArticles = await resArticles.json();
                if (Array.isArray(dataArticles)) setArticles(dataArticles);
            }
        } catch (err) {
            console.error("Koneksi Supabase terputus:", err);
        }
    };

    useEffect(() => {
        fetchSupabaseData();
        const interval = setInterval(fetchSupabaseData, 3000); // Pollingiap 3 detik
        return () => clearInterval(interval);
    }, []);

    // 1. REGISTRASI RELAWAN + DETEKSI EROR ASLI
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (users.find(u => u.email.toLowerCase() === regEmail.toLowerCase()) || regEmail === 'admin') {
            alert('Email sudah terdaftar di server Supabase!');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, approved: false })
            });

            if (!res.ok) {
                const errData = await res.json();
                alert(`Supabase Menolak Data: ${errData.message || 'Pastikan Tabel rayliziie_users sudah dibuat & RLS dimatikan!'}`);
                setLoading(false);
                return;
            }

            alert(`Registrasi Berhasil! Data Akun (${regName}) RESMI masuk ke database awan Supabase.`);
            setRegName(''); setRegEmail(''); setRegPassword(''); setPortalMode('login');
            fetchSupabaseData();
        } catch (err) {
            alert('Gagal menyambung ke server Supabase. Periksa koneksi internet atau URL API lu.');
        } finally {
            setLoading(false);
        }
    };

    // 2. LOGIN CHECK DARI DATA LIVE SUPABASE
    const handleLogin = (e) => {
        e.preventDefault();
        if (loginEmail === 'admin') {
            if (loginPassword === 'ceozie') {
                setView('admin-dashboard');
                alert('Akses Root Diterima! Selamat Datang CEO Rayliziie Grup.');
                setLoginEmail(''); setLoginPassword(''); return;
            } else {
                alert('Sandi Admin Root Salah!');
                setLoginPassword(''); return;
            }
        }

        const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
        if (!user) {
            alert('Email tidak ditemukan di database Supabase! Pastikan pendaftaran tadi tidak eror.');
        } else if (user.password !== loginPassword) {
            alert('Password salah!');
        } else if (!user.approved) {
            alert('Akses Ditolak! Akun Anda aktif di database, tapi BELUM DI-APPROVE oleh CEO.');
        } else {
            setCurrentUser(user);
            alert(`Selamat bekerja di redaksi, ${user.name}!`);
        }
        setLoginEmail(''); setLoginPassword('');
    };

    // 3. FITUR LUPA PASSWORD REAL-TIME
    const handleForgotPassword = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
        if (user) {
            alert(`[Supabase Auth] Akun Valid!\nNama: ${user.name}\nPassword Akun Anda: ${user.password}`);
            setPortalMode('login');
        } else {
            alert('Email tidak terdaftar di database cloud!');
        }
        setForgotEmail('');
    };

    // 4. KIRIM ARTIKEL KONTRIBUTOR KE SUPABASE + DETEKSI EROR
    const handleCreateArticle = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ title: artTitle, category: artCategory, content: artContent, author: currentUser.name, status: 'Pending Review' })
            });

            if (!res.ok) {
                const errData = await res.json();
                alert(`Gagal Kirim Artikel: ${errData.message || 'Pastikan tabel rayliziie_articles sudah ada!'}`);
                setLoading(false);
                return;
            }

            alert('Artikel terkirim! Status: PENDING REVIEW di Central Server.');
            setArtTitle(''); setArtContent('');
            fetchSupabaseData();
        } catch (err) {
            alert('Gagal mengirim draf artikel ke awan.');
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?id=eq.${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ approved: true })
            });
            alert('Akun kontributor resmi diaktifkan live!');
            fetchSupabaseData();
        } catch (err) {
            alert('Gagal update database.');
        }
    };

    const approveArticle = async (id) => {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ status: 'Published' })
            });
            alert('Artikel live ke publik!');
            fetchSupabaseData();
        } catch (err) {
            alert('Gagal meloloskan artikel.');
        }
    };

    const rejectArticle = async (id) => {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
                method: 'DELETE',
                headers
            });
            alert('Draf artikel dihapus permanen dari server cloud.');
            fetchCloudData();
        } catch (err) {
            alert('Gagal menghapus draf.');
        }
    };

    // DASHBOARD KENDALI ADMIN (CEO INTERFACE)
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>⚙️ RAYLIZIIE CENTRAL CONTROL SERVER</h1>
                            <p style={{ fontSize: '12px', color: '#a78bfa', margin: '5px 0 0 0' }}>DATABASE: <span style={{ color: '#10b981', fontWeight: '800' }}>● SUPABASE CLOUD LIVE</span></p>
                        </div>
                        <button onClick={() => setView('home')} style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700' }}>Keluar Server</button>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {/* APPROVAL RELAWAN */}
                        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>👥 VERIFIKASI AKUN ({users.filter(u=>!u.approved).length})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {users.filter(u => !u.approved).length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Tidak ada antrean pendaftar.</p>
                                ) : (
                                    users.filter(u => !u.approved).map(u => (
                                        <div key={u.id} style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>{u.name}</p>
                                                <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{u.email}</p>
                                            </div>
                                            <button onClick={() => approveUser(u.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Approve</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* SENSOR KELAYAKAN ARTIKEL */}
                        <div style={{ flex: '2', minWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 20px 0' }}>📝 MEJA SENSOR KELAYAKAN ARTIKEL ({articles.filter(a=>a.status==='Pending Review').length})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {articles.filter(a => a.status === 'Pending Review').length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Server bersih. Belum ada artikel masuk.</p>
                                ) : (
                                    articles.filter(a => a.status === 'Pending Review').map(a => (
                                        <div key={a.id} style={{ padding: '16px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#818cf8', backgroundColor: '#1e1b4b', padding: '2px 6px', borderRadius: '4px' }}>{a.category.toUpperCase()}</span>
                                                    <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '8px 0 4px 0', color: '#fff' }}>{a.title}</h3>
                                                    <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Oleh: {a.author}</p>
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

    // INTERFACE REDAKSI / PORTAL LOG IN
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
                                        <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email atau 'admin'..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
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
                                        {loading ? 'Mengirim ke Supabase...' : 'Ajukan Relawan'}
                                    </button>
                                </form>
                            )}

                            {portalMode === 'forgot' && (
                                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '14px', margin: 0, color: '#fff', textAlign: 'center' }}>🔑 PEMULIHAN SANDI AKUN</h3>
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
                        // RUANG KETIK KONTRIBUTOR TERVERIFIKASI
                        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>✍️ RUANG REDAKSI KONTRIBUTOR</h2>
                                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>● Sesi Aktif ({currentUser.name})</span>
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

    // TAMPILAN DEPAN UTAMA PUBLIC WEBSITE
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>RAYLIZIIE MEDIA DIGITAL</span>
                        <span style={{ fontSize: '9px', color: '#818cf8', display: 'block', fontWeight: '700' }}>RAYLIZIIE GRUP SUBSIDIARY</span>
                    </div>
                    <button onClick={() => setView('portal')} style={{ backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>Portal Admin & Relawan</button>
                </div>
            </header>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span style={{ fontSize: '11px', color: '#818cf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>🛡️ DIVISI INFORMASI & TEKNOLOGI GLOBAL</span>
                <h1 style={{ fontSize: '40px', fontWeight: '950', color: '#fff', marginTop: '20px' }}>Navigasi Masa Depan</h1>
                <p style={{ fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Ekosistem Media Siber Terintegrasi</p>
            </section>

            {/* Grid Konten */}
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
