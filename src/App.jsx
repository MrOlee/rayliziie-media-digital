import React, { useState, useEffect } from 'react';

// Data Supabase sudah gw pasang otomatis, Boy!
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
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');
    const [artImageUrl, setArtImageUrl] = useState('');

    const fetchData = async () => {
        try {
            const resU = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if (resU.ok) setUsers(await resU.json());
            const resA = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if (resA.ok) setArticles(await resA.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, []);

    // DASHBOARD ADMIN
    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h1 style={{ color: '#fff' }}>⚙️ CENTRAL CONTROL SERVER</h1>
                    <button onClick={() => setView('home')} style={{ background: '#7f1d1d', padding: '10px 20px', borderRadius: '20px', color: '#fff', border: 'none' }}>Keluar</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                        <h3>👥 VERIFIKASI ({users.filter(u=>!u.approved).length})</h3>
                        {users.filter(u=>!u.approved).map(u => (
                            <div key={u.id} style={{ background: '#0f172a', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                                {u.name} <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?id=eq.${u.id}`, { method:'PATCH', headers, body: JSON.stringify({approved: true}) }).then(fetchData)}>Approve</button>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                        <h3>📝 SENSOR ARTIKEL</h3>
                        {articles.filter(a=>a.status==='Pending Review').map(a => (
                            <div key={a.id} style={{ background: '#0f172a', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                                <h4>{a.title}</h4>
                                {a.image_url && <img src={a.image_url} width="100" style={{ marginBottom: '10px' }} />}
                                <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${a.id}`, { method:'PATCH', headers, body: JSON.stringify({status: 'Published'}) }).then(fetchData)}>Terbitkan</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // TAMPILAN PUBLIK
    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#fff' }}>
            <nav style={{ padding: '20px 40px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>RAYLIZIIE MEDIA DIGITAL</h1>
                <button onClick={() => setView('portal')} style={{ padding: '10px 20px', borderRadius: '20px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold' }}>Portal Admin & Relawan</button>
            </nav>
            
            {view === 'home' && (
                <div style={{ padding: '60px 40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '40px' }}>Ekosistem Media Siber</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {['gizi', 'bola', 'skincare', 'keuangan'].map(cat => (
                            <div key={cat} style={{ background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                                <h3>{cat.toUpperCase()}</h3>
                                {articles.filter(a => a.category === cat && a.status === 'Published').map(a => (
                                    <div key={a.id} style={{ borderTop: '1px solid #334155', marginTop: '10px', paddingTop: '10px' }}>
                                        {a.image_url && <img src={a.image_url} width="100%" style={{ borderRadius: '8px' }} />}
                                        <h4 style={{ margin: '10px 0' }}>{a.title}</h4>
                                        <small style={{ color: '#94a3b8' }}>Oleh: {a.author}</small>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'portal' && (
                <div style={{ padding: '60px 40px' }}>
                    <div style={{ maxWidth: '400px', margin: 'auto', background: '#1e293b', padding: '30px', borderRadius: '16px' }}>
                        {!currentUser ? (
                            portalMode === 'login' ? (
                                <form onSubmit={e => { e.preventDefault(); if(loginEmail==='admin'&&loginPassword==='ceozie') setView('admin-dashboard'); else { const user = users.find(u=>u.email===loginEmail && u.password===loginPassword && u.approved); if(user) setCurrentUser(user); else alert('Login Gagal!'); }}}>
                                    <input placeholder="Email" onChange={e=>setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} /><br/>
                                    <input type="password" placeholder="Password" onChange={e=>setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} /><br/>
                                    <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
                                    <p onClick={()=>setPortalMode('register')} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '10px' }}>Daftar Relawan</p>
                                </form>
                            ) : (
                                <form onSubmit={async e => { e.preventDefault(); const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users`, { method: 'POST', headers, body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, approved: false }) }); if(res.ok) { alert('Berhasil!'); setPortalMode('login'); } else alert('Gagal!'); }}>
                                    <input placeholder="Nama" onChange={e=>setRegName(e.target.value)} style={{ width: '100%', padding: '10px', margin: '5px 0' }} /><br/>
                                    <input placeholder="Email" onChange={e=>setRegEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '5px 0' }} /><br/>
                                    <input type="password" placeholder="Password" onChange={e=>setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '5px 0' }} /><br/>
                                    <button type="submit" style={{ width: '100%', padding: '10px' }}>Daftar</button>
                                </form>
                            )
                        ) : (
                            <form onSubmit={async e => { e.preventDefault(); await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, { method: 'POST', headers, body: JSON.stringify({ title: artTitle, category: artCategory, content: artContent, author: currentUser.name, image_url: artImageUrl, status: 'Pending Review' }) }); alert('Artikel dikirim!'); setArtTitle(''); }}>
                                <input value={artTitle} onChange={e=>setArtTitle(e.target.value)} placeholder="Judul" style={{ width: '100%', padding: '10px' }} /><br/>
                                <input value={artImageUrl} onChange={e=>setArtImageUrl(e.target.value)} placeholder="URL Gambar (Link)" style={{ width: '100%', padding: '10px', margin: '10px 0' }} /><br/>
                                <textarea value={artContent} onChange={e=>setArtContent(e.target.value)} placeholder="Isi" style={{ width: '100%', padding: '10px' }} /><br/>
                                <button type="submit">Kirim ke Redaksi</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            
            <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid #334155' }}>
                <p>&copy; 2026 Rayliziie Media Digital</p>
            </footer>
        </div>
    );
};

export default App;
