import React, { useState, useEffect } from 'react';

// GANTI DENGAN KUNCI SUPABASE LU
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
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);

    const fetchData = async () => {
        // PERBAIKAN: Kalau URL belum diisi, jangan paksain fetch supaya web gak crash
        if (SUPABASE_URL === "ISI_URL_LU_DI_SINI") return;
        
        try {
            const resU = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_users?select=*`, { headers });
            if (resU.ok) setUsers(await resU.json());

            const resA = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, { headers });
            if (resA.ok) setArticles(await resA.json());
        } catch (err) { console.log("Database off/Eror"); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // TAMPILAN BASIC (BUAT NGETES APAKAH WEB LU JALAN)
    return (
        <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#fff', padding: '20px' }}>
            <h1>STATUS WEB: AKTIF</h1>
            <p>Database Records: {users.length} Users, {articles.length} Articles.</p>
            <button onClick={() => setView('admin-dashboard')}>Masuk Admin</button>
            <div style={{ marginTop: '20px' }}>
                {view === 'admin-dashboard' ? "Admin Panel" : "Halaman Utama"}
            </div>
        </div>
    );
};

export default App;
