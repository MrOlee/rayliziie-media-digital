import React, { useState, useEffect } from 'react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CmsPortalRelawan = () => {
    const [articles, setArticles] = useState([]);
    const [form, setForm] = useState({ title: '', content: '' });

    // FUNGSI FETCH
    const fetchData = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const data = await res.json();
        setArticles(data);
    };

    // PENTING: [] di akhir ini agar fetch hanya jalan 1x saat load
    useEffect(() => { 
        fetchData(); 
    }, []); 

    const handleSubmit = async (status) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, {
            method: 'POST',
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ ...form, status, author: 'Adlndika' })
        });
        if (res.ok) {
            alert("Data tersimpan!");
            fetchData(); // Refresh list setelah simpan
        } else {
            alert("Gagal simpan, cek Console (F12)");
        }
    };

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">✍️ Portal Relawan</h2>
            <div className="space-y-3 max-w-sm mb-10">
                <input className="w-full p-2 bg-slate-800 rounded" placeholder="Judul" onChange={e => setForm({...form, title: e.target.value})} />
                <textarea className="w-full p-2 bg-slate-800 rounded" placeholder="Konten" onChange={e => setForm({...form, content: e.target.value})} />
                <button onClick={() => handleSubmit('Pending')} className="bg-blue-600 p-2 rounded w-full">Kirim ke CEO</button>
            </div>
            <div>
                {articles.map(a => <div key={a.id} className="border-b border-slate-700 py-2">{a.title} ({a.status})</div>)}
            </div>
        </div>
    );
};
export default CmsPortalRelawan;
