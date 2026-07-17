import React, { useState, useEffect } from 'react';

// Data Supabase lu yang udah terbukti jalan
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

    // ADMIN DASHBOARD
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '40px', fontFamily: 'sans-serif' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
                        <h1 style={{ margin: 0 }}>⚙️ CENTRAL CONTROL SERVER</h1>
                        <button onClick={() => setView('home')} style={{ background: '#7f1d1d', border: 'none', padding: '10px 20px', borderRadius: '20px', color: '#fff', cursor: 'pointer' }}>Keluar Server</button>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '30px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                            <h3>👥 VERIFIKASI AKUN ({users.filter(u=>!u.approved).length})</h3>
                            {users.filter(u=>!u.approved).map(u => (
                                <div key={u.id} style={{ background: '#0f172a', padding: '15px', marginBottom: '10px', borderRadius: '12px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{u.name}</p>
                                    <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?id=eq.${u.id}`, { method:'PATCH', headers, body: JSON.stringify({approved: true}) }).then(fetchData)}>Approve</button>
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: '2', background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                            <h3>📝 MEJA SENSOR ARTIKEL ({articles.filter(a=>a.status==='Pending Review').length})</h3>
                            {articles.filter(a=>a.status==='Pending Review').map(a => (
                                <div key={a.id} style={{ background: '#0f172a', padding: '15px', marginBottom: '10px', borderRadius: '12px' }}>
                                    <h4>{a.title}</h4>
                                    {a.image_url && <img src={a.image_url} width="100" style={{ borderRadius: '8px' }} />}<br/>
                                    <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${a.id}`, { method:'PATCH', headers, body: JSON.stringify({status: 'Published'}) }).then(fetchData)}>Terbitkan</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // TAMPILAN PREMIUM
    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <header style={{ padding: '20px 40px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>RAYLIZIIE MEDIA DIGITAL</h1>
                <button onClick={() => setView('portal')} style={{ padding: '10px 20px', borderRadius: '20px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Portal Admin & Relawan</button>
            </header>

            {view === 'home' && (
                <main style={{ padding: '60px 40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '48px', margin: 0 }}>Navigasi Masa Depan</h2>
                        <p style={{ color: '#94a3b8', fontSize: '18px' }}>Ekosistem Media Siber Terintegrasi</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {['gizi', 'bola', 'skincare', 'keuangan'].map(cat => (
                            <div key={cat} style={{ background: '#1e293b', padding: '24px', borderRadius: '16px' }}>
                                <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>{cat.toUpperCase()}</h3>
                                {articles.filter(a => a.category === cat && a.status === 'Published').map(a => (
                                    <div key={a.id} style={{ marginTop: '20px' }}>
                                        {a.image_url && <img src={a.image_url} width="100%" style={{ borderRadius: '8px' }} />}
                                        <h4 style={{ margin: '10px 0' }}>{a.title}</h4>
                                        <p style={{ fontSize: '12px', color: '#64748b' }}>Oleh: {a.author}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            )}

            {view === 'portal' && (
                <div style={{ padding: '60px 40px' }}>
                    <div style={{ maxWidth: '400px', margin: 'auto', background: '#1e293b', padding: '40px', borderRadius: '16px' }}>
                        {!currentUser ? (
                            portalMode === 'login' ? (
                                <form onSubmit={e => { e.preventDefault(); if(loginEmail==='admin'&&loginPassword==='ceozie') setView('admin-dashboard'); else { const user = users.find(u=>u.email===loginEmail && u.password===loginPassword && u.approved); if(user) setCurrentUser(user); else alert('Gagal!'); }}}>
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
