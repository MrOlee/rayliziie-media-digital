import React, { useState, useEffect } from 'react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CmsPortalRelawan = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({ title: '', image_url: '', category: 'NutrisiDietMu', content: '' });

    const fetchArticles = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const data = await res.json();
        setArticles(data);
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleSubmit = async (status) => {
        const payload = { ...formData, status, author: "Adlndika" };
        console.log("Mengirim data:", payload);

        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles`, {
            method: 'POST',
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Berhasil!");
            fetchArticles();
        } else {
            const error = await res.text();
            console.error("GAGAL:", error);
            alert("Gagal! Cek Console (F12) untuk detail error: " + error);
        }
    };

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">✍️ Portal Relawan</h2>
            <div className="space-y-4 max-w-md">
                <input placeholder="Judul" className="w-full p-2 bg-slate-800 rounded" onChange={e => setFormData({...formData, title: e.target.value})} />
                <textarea placeholder="Konten" className="w-full p-2 bg-slate-800 rounded" onChange={e => setFormData({...formData, content: e.target.value})} />
                <button onClick={() => handleSubmit('Pending')} className="bg-blue-600 p-3 rounded w-full">Kirim ke CEO</button>
            </div>
            <div className="mt-10">
                {articles.map(a => <div key={a.id} className="border-b p-2">{a.title} - <span className="text-xs text-slate-400">{a.status}</span></div>)}
            </div>
        </div>
    );
};
export default CmsPortalRelawan;
