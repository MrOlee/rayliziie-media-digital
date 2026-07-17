import React, { useState, useEffect } from 'react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CeoControlServer = () => {
    const [articles, setArticles] = useState([]);

    const fetchAll = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        setArticles(await res.json());
    };

    // PENTING: [] di akhir ini agar fetch hanya jalan 1x saat load
    useEffect(() => { 
        fetchAll(); 
    }, []); 

    const publish = async (id) => {
        await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
            method: 'PATCH',
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: 'Published' })
        });
        fetchAll();
    };

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">⚙️ Server CEO</h2>
            {articles.map(a => (
                <div key={a.id} className="bg-slate-800 p-3 mb-2 rounded flex justify-between">
                    {a.title} - <b>{a.status}</b>
                    {a.status === 'Pending' && <button onClick={() => publish(a.id)} className="bg-green-600 px-2 rounded">Publish</button>}
                </div>
            ))}
        </div>
    );
};
export default CeoControlServer;
