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
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form states
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
        if (SUPABASE_URL.includes("ISI_URL")) return;
        try {
            const resU = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if (resU.ok) setUsers(await resU.json());
            const resA = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if (resA.ok) setArticles(await resA.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, []);

    // ... (Fungsi-fungsi handle lain tetap sama)
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users`, {
            method: 'POST', headers,
            body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, approved: false })
        });
        if (res.ok) { alert('Berhasil! Menunggu approval CEO.'); setPortalMode('login'); }
        else alert('Gagal daftar!');
        setLoading(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginEmail === 'admin' && loginPassword === 'ceozie') { setView('admin-dashboard'); return; }
        const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
        if (user && user.approved) { setCurrentUser(user); alert('Login Berhasil!'); }
        else alert('Login gagal / Belum di-approve!');
    };

    const handleCreateArticle = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, {
            method: 'POST', headers,
            body: JSON.stringify({ title: artTitle, category: artCategory, content: artContent, author: currentUser.name, image_url: artImageUrl, status: 'Pending Review' })
        });
        alert('Artikel dalam antrean!');
        setArtTitle(''); setArtContent(''); setArtImageUrl('');
        setLoading(false);
    };

    // TAMPILAN FULL UI
    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            {view === 'admin-dashboard' && (
                <div style={{ padding: '20px' }}>
                    <button onClick={() => setView('home')} style={{ background: '#7f1d1d', color: '#fff', padding: '10px', borderRadius: '10px' }}>Keluar</button>
                    <h1 style={{ textAlign: 'center' }}>CONTROL SERVER</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                        <div>
                            <h3>VERIFIKASI RELAWAN ({users.filter(u=>!u.approved).length})</h3>
                            {users.filter(u=>!u.approved).map(u => (
                                <div key={u.id} style={{ background: '#1e293b', padding: '10px', marginBottom: '5px' }}>{u.name} 
                                    <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?id=eq.${u.id}`, { method:'PATCH', headers, body: JSON.stringify({approved: true}) }).then(fetchData)}>Approve</button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3>SENSOR ARTIKEL</h3>
                            {articles.filter(a=>a.status==='Pending Review').map(a => (
                                <div key={a.id} style={{ background: '#1e293b', padding: '10px', marginBottom: '10px' }}>
                                    <h4>{a.title}</h4>
                                    <img src={a.image_url} width="100" />
                                    <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${a.id}`, { method:'PATCH', headers, body: JSON.stringify({status: 'Published'}) }).then(fetchData)}>Terbitkan</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view !== 'admin-dashboard' && (
                <>
                    <nav style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                        <h1>RAYLIZIIE MEDIA</h1>
                        <button onClick={() => setView('portal')}>Portal Penulis</button>
                    </nav>
                    
                    {view === 'home' && (
                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                {['gizi', 'bola', 'skincare', 'keuangan'].map(cat => (
                                    <div key={cat} style={{ border: '1px solid #334155', padding: '20px' }}>
                                        <h3>{cat.toUpperCase()}</h3>
                                        {articles.filter(a => a.category === cat && a.status === 'Published').map(a => (
                                            <div key={a.id} style={{ marginBottom: '15px' }}>
                                                <img src={a.image_url} width="100%" />
                                                <h4>{a.title}</h4>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'portal' && (
                        <div style={{ padding: '40px' }}>
                            {!currentUser ? (
                                <div style={{ maxWidth: '400px', margin: 'auto' }}>
                                    {portalMode === 'login' ? (
                                        <form onSubmit={handleLogin}>
                                            <input placeholder="Email" onChange={e=>setLoginEmail(e.target.value)} /><br/>
                                            <input type="password" placeholder="Password" onChange={e=>setLoginPassword(e.target.value)} /><br/>
                                            <button type="submit">Login</button>
                                            <p onClick={()=>setPortalMode('register')}>Belum daftar? Klik di sini</p>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleRegister}>
                                            <input placeholder="Nama" onChange={e=>setRegName(e.target.value)} required/><br/>
                                            <input placeholder="Email" onChange={e=>setRegEmail(e.target.value)} required/><br/>
                                            <input type="password" placeholder="Password" onChange={e=>setRegPassword(e.target.value)} required/><br/>
                                            <button type="submit">Daftar</button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleCreateArticle}>
                                    <input value={artTitle} onChange={e=>setArtTitle(e.target.value)} placeholder="Judul" required/><br/>
                                    <input value={artImageUrl} onChange={e=>setArtImageUrl(e.target.value)} placeholder="URL Gambar (Link)" required/><br/>
                                    <textarea value={artContent} onChange={e=>setArtContent(e.target.value)} placeholder="Isi" required/><br/>
                                    <button type="submit">Kirim ke Redaksi</button>
                                </form>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
