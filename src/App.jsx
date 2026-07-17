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
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [artTitle, setArtTitle] = useState('');
    const [artCategory, setArtCategory] = useState('gizi');
    const [artContent, setArtContent] = useState('');
    const [artImageUrl, setArtImageUrl] = useState(''); // State Foto

    const fetchData = async () => {
        try {
            const resU = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if(resU.ok) setUsers(await resU.json());
            const resA = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if(resA.ok) setArticles(await resA.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users`, {
            method: 'POST', headers,
            body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, approved: false })
        });
        if(res.ok) { alert('Berhasil!'); setPortalMode('login'); } else alert('Gagal!');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginEmail === 'admin' && loginPassword === 'ceozie') { setView('admin-dashboard'); return; }
        const user = users.find(u => u.email === loginEmail && u.password === loginPassword && u.approved);
        if(user) setCurrentUser(user); else alert('Login Gagal!');
    };

    const handleCreateArticle = async (e) => {
        e.preventDefault();
        await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, {
            method: 'POST', headers,
            body: JSON.stringify({ title: artTitle, category: artCategory, content: artContent, author: currentUser.name, image_url: artImageUrl, status: 'Pending Review' })
        });
        alert('Artikel dikirim!');
        setArtTitle(''); setArtImageUrl(''); setArtContent('');
    };

    if (view === 'admin-dashboard') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '40px' }}>
                <button onClick={() => setView('home')}>Keluar</button>
                <h1>ADMIN CONTROL</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h3>VERIFIKASI ({users.filter(u=>!u.approved).length})</h3>
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
                                {a.image_url && <img src={a.image_url} width="100"/>}
                                <button onClick={() => fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${a.id}`, { method:'PATCH', headers, body: JSON.stringify({status: 'Published'}) }).then(fetchData)}>Terbitkan</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                <h1>RAYLIZIIE MEDIA DIGITAL</h1>
                <button onClick={() => setView('portal')}>Portal Admin & Relawan</button>
            </nav>

            {view === 'home' && (
                <div style={{ padding: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h1>Navigasi Masa Depan</h1>
                        <p>Ekosistem Media Siber Terintegrasi</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {mediaNetwork.map(m => (
                            <div key={m.name} style={{ background: '#1e293b', padding: '20px', borderRadius: '15px' }}>
                                <h3>{m.icon} {m.name}</h3>
                                <p>{m.desc}</p>
                                {/* ARTIKEL TAYANG DI SINI */}
                                {articles.filter(a => a.status === 'Published').filter(a => 
                                    (m.name === 'NutrisiDietMu' && a.category === 'gizi') ||
                                    (m.name === 'BolaGass' && a.category === 'bola') ||
                                    (m.name === 'GlowLogika' && a.category === 'skincare') ||
                                    (m.name === 'CuanPintar' && a.category === 'keuangan')
                                ).map(a => (
                                    <div key={a.id} style={{ marginTop: '10px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                                        {a.image_url && <img src={a.image_url} style={{ width: '100%', borderRadius: '8px' }} />}
                                        <h4>{a.title}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'portal' && (
                <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
                    {!currentUser ? (
                        portalMode === 'login' ? (
                            <form onSubmit={handleLogin}>
                                <h2>Login</h2>
                                <input placeholder="Email" onChange={e=>setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px' }} /><br/><br/>
                                <input type="password" placeholder="Pass" onChange={e=>setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px' }} /><br/><br/>
                                <button type="submit">Login</button>
                                <p onClick={()=>setPortalMode('register')} style={{ cursor: 'pointer' }}>Daftar?</p>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <h2>Daftar</h2>
                                <input placeholder="Nama" onChange={e=>setRegName(e.target.value)} style={{ width: '100%', padding: '10px' }} /><br/><br/>
                                <input placeholder="Email" onChange={e=>setRegEmail(e.target.value)} style={{ width: '100%', padding: '10px' }} /><br/><br/>
                                <input type="password" placeholder="Pass" onChange={e=>setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px' }} /><br/><br/>
                                <button type="submit">Daftar</button>
                            </form>
                        )
                    ) : (
                        <form onSubmit={handleCreateArticle}>
                            <h3>Buat Artikel</h3>
                            <input value={artTitle} onChange={e=>setArtTitle(e.target.value)} placeholder="Judul" style={{ width: '100%', padding: '10px' }} /><br/><br/>
                            <input value={artImageUrl} onChange={e=>setArtImageUrl(e.target.value)} placeholder="Link Gambar (URL)" style={{ width: '100%', padding: '10px' }} /><br/><br/>
                            <textarea value={artContent} onChange={e=>setArtContent(e.target.value)} placeholder="Isi" style={{ width: '100%', padding: '10px' }} /><br/><br/>
                            <button type="submit">Kirim</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
