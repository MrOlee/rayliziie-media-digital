import React, { useState, useEffect } from 'react';
import { Trash2, Send, Save } from 'lucide-react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CmsPortalRelawan = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({ title: '', image_url: '', content: '' });

    const fetchArticles = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const data = await res.json();
        setArticles(data);
    };

    useEffect(() => { 
        fetchArticles(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <--- KOSONGKAN INI AGAR TIDAK LOOPING

    const handleSubmit = async (status) => {
        const payload = { ...formData, status: status, author: "Adlndika", category: "NutrisiDietMu" };
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
            alert("Data terkirim!");
            setFormData({ title: '', image_url: '', content: '' });
            fetchArticles();
        } else {
            console.error(await res.text());
        }
    };

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">✍️ Portal Relawan</h2>
            <div className="space-y-4 max-w-md bg-[#1E293B] p-6 rounded-xl border border-slate-700">
                <input placeholder="Judul" className="w-full p-2 bg-slate-800 rounded" onChange={e => setFormData({...formData, title: e.target.value})} />
                <textarea placeholder="Konten" className="w-full p-2 bg-slate-800 rounded" onChange={e => setFormData({...formData, content: e.target.value})} />
                <div className="flex gap-2">
                    <button onClick={() => handleSubmit('Draft')} className="bg-slate-700 p-2 rounded flex-1"><Save size={16}/> Draf</button>
                    <button onClick={() => handleSubmit('Pending')} className="bg-blue-600 p-2 rounded flex-1"><Send size={16}/> Kirim ke CEO</button>
                </div>
            </div>
            <div className="mt-10">
                {articles.map(a => <div key={a.id} className="border-b border-slate-700 p-3">{a.title} - <b>{a.status}</b></div>)}
            </div>
        </div>
    );
};
export default CmsPortalRelawan;
