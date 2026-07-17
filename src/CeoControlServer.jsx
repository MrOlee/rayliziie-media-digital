import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

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

    useEffect(() => { 
        fetchAll(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <--- KOSONGKAN INI AGAR TIDAK LOOPING

    const updateStatus = async (id, status) => {
        await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
            method: 'PATCH',
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status })
        });
        fetchAll();
    };

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">⚙️ Server CEO</h2>
            {articles.map(a => (
                <div key={a.id} className="bg-slate-800 p-4 mb-3 rounded flex justify-between items-center">
                    <span>{a.title} ({a.status})</span>
                    {a.status === 'Pending' && (
                        <button onClick={() => updateStatus(a.id, 'Published')} className="bg-green-600 px-3 py-1 rounded text-sm"><CheckCircle size={14}/></button>
                    )}
                </div>
            ))}
        </div>
    );
};
export default CeoControlServer;
