import React, { useState, useEffect } from 'react';

// GANTI DENGAN KUNCI SUPABASE LU DI SINI
const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const App = () => {
    const [view, setView] = useState('home');
    const [portalMode, setPortalMode] = useState('login');
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Form
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');
    const [artImageUrl, setArtImageUrl] = useState('');

    const fetchData = async () => {
        try {
            const resU = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if(resU.ok) setUsers(await resU.json());
            const resA = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if(resA.ok) setArticles(await resA.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, []);

    // DASHBOARD ADMIN PREMIUM
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '40px', fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0 }}>⚙️ CENTRAL CONTROL SERVER</h1>
                    <button onClick={() => setView('home')} style={{ background: '#7f1d1d', padding: '10px 20px', borderRadius: '20px', color: '#fff', border: 'none', cursor: 'pointer' }}>Keluar Server</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                        <h3>👥 VERIFIKASI ({users.filter(u=>!u.approved).length})</h3>
                        {users.filter(u=>!u.approved).map(u => (
                            <div key={u.id} style={{ background: '#0f172a', padding: '15px', marginBottom: '10px', borderRadius: '12px' }}>
                                {u.name}<br/>
                                <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?id=eq.${u.id}`, { method:'PATCH', headers, body: JSON.stringify({approved: true}) }).then(fetchData)}>Approve</button>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                        <h3>📝 SENSOR ARTIKEL</h3>
                        {articles.filter(a=>a.status==='Pending Review').map(a => (
                            <div key={a.id} style={{ background: '#0f172a', padding: '15px', marginBottom: '10px', borderRadius: '12px' }}>
                                <h4>{a.title}</h4>
                                <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${a.id}`, { method:'PATCH', headers, body: JSON.stringify({status: 'Published'}) }).then(fetchData)}>Terbitkan</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            {/* Header Original */}
            <header style={{ padding: '20px 40px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>RAYLIZIIE MEDIA DIGITAL</h1>
                <button onClick={() => setView('portal')} style={{ padding: '10px 20px', borderRadius: '20px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Portal Admin & Relawan</button>
            </header>

            {view === 'home' && (
                <main style={{ padding: '60px 40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ color: '#818cf8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>🛡️ DIVISI INFORMASI & TEKNOLOGI GLOBAL</span>
                        <h2 style={{ fontSize: '48px', margin: '20px 0' }}>Navigasi Masa Depan</h2>
                        <p style={{ color: '#818cf8', fontSize: '24px', margin: 0 }}>Ekosistem Media Siber Terintegrasi</p>
                    </div>

                    <h3 style={{ marginBottom: '30px' }}>DIGITAL MEDIA NETWORK</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {['gizi', 'bola', 'skincare', 'keuangan'].map(cat => (
                            <div key={cat} style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                                <h3>{cat === 'gizi' ? 'NutrisiDietMu' : cat === 'bola' ? 'BolaGass' : cat === 'skincare' ? 'GlowLogika' : 'CuanPintar'}</h3>
                                {articles.filter(a => a.category === cat && a.status === 'Published').map(a => (
                                    <div key={a.id} style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                                        {a.image_url && <img src={a.image_url} width="100%" style={{ borderRadius: '8px' }} />}
                                        <h4 style={{ margin: '10px 0' }}>{a.title}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <h3 style={{ marginTop: '50px', marginBottom: '30px' }}>DIGITAL BUSINESS SERVICES</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}><h3>Web Dev & Techno</h3></div>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}><h3>Rayliziie Digital Invitation</h3></div>
                    </div>
                </main>
            )}

            {/* Portal & Admin Forms */}
            {view === 'portal' && (
                <div style={{ padding: '60px 40px' }}>
                    <div style={{ maxWidth: '400px', margin: 'auto', background: '#1e293b', padding: '40px', borderRadius: '16px' }}>
                        {!currentUser ? (
                            portalMode === 'login' ? (
                                <form onSubmit={e => { e.preventDefault(); if(loginEmail==='admin'&&loginPassword==='ceozie') setView('admin-dashboard'); else { const user = users.find(u=>u.email===loginEmail && u.password===loginPassword && u.approved); if(user) setCurrentUser(user); else alert('Login Gagal!'); }}}>
                                    <h2>Login Penulis</h2>
                                    <input placeholder="Email" onChange={e=>setLoginEmail(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                    <input type="password" placeholder="Password" onChange={e=>setLoginPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                    <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>Masuk</button>
                                    <p onClick={()=>setPortalMode('register')} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '15px' }}>Daftar Relawan</p>
                                </form>
                            ) : (
                                <form onSubmit={async e => { e.preventDefault(); const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users`, { method: 'POST', headers, body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, approved: false }) }); if(res.ok) { alert('Berhasil!'); setPortalMode('login'); } else alert('Gagal!'); }}>
                                    <h2>Daftar Relawan</h2>
                                    <input placeholder="Nama" onChange={e=>setRegName(e.target.value)} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                    <input placeholder="Email" onChange={e=>setRegEmail(e.target.value)} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                    <input type="password" placeholder="Password" onChange={e=>setRegPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '5px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                    <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>Daftar</button>
                                </form>
                            )
                        ) : (
                            <form onSubmit={async e => { e.preventDefault(); await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, { method: 'POST', headers, body: JSON.stringify({ title: artTitle, category: artCategory, content: artContent, author: currentUser.name, image_url: artImageUrl, status: 'Pending Review' }) }); alert('Artikel dikirim!'); setArtTitle(''); }}>
                                <h3>Buat Artikel</h3>
                                <input value={artTitle} onChange={e=>setArtTitle(e.target.value)} placeholder="Judul" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }} /><br/>
                                <input value={artImageUrl} onChange={e=>setArtImageUrl(e.target.value)} placeholder="URL Gambar" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} /><br/>
                                <textarea value={artContent} onChange={e=>setArtContent(e.target.value)} placeholder="Isi Artikel..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', height: '150px' }} /><br/>
                                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}>Kirim ke Redaksi</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            
            <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid #334155' }}>
                <p>&copy; 2026 Rayliziie Media Digital</p>
                <p>Medan, Sumatera Utara</p>
            </footer>
        </div>
    );
};

export default App;
