import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CeoControlServer = () => {
    const [articles, setArticles] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', content: '', image_url: '', status: 'Published' });

    const fetchAll = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*&order=created_at.desc`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const data = await res.json();
        setArticles(data);
    };

    useEffect(() => { 
        fetchAll(); 
    }, []); 

    const handleSubmit = async () => {
        const url = formData.id 
            ? `${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${formData.id}` 
            : `${SUPABASE_URL}/rest/v1/rayliziie_articles`;
        
        const method = formData.id ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert("Berhasil disimpan!");
            setIsFormOpen(false);
            setFormData({ id: null, title: '', content: '', image_url: '', status: 'Published' });
            fetchAll();
        } else {
            alert("Gagal simpan, cek Console (F12)");
        }
    };

    const deleteArticle = async (id) => {
        if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
        await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
            method: 'DELETE',
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        fetchAll();
    };

    const openEdit = (art) => {
        setFormData(art);
        setIsFormOpen(true);
    };

    return (
        <div className="p-8 bg-[#0F172A] min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">⚙️ Server CEO (Panel Kontrol)</h2>
                <button onClick={() => { setFormData({ id: null, title: '', content: '', image_url: '', status: 'Published' }); setIsFormOpen(true); }} 
                        className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={18}/> Tambah Artikel
                </button>
            </div>

            {/* List Artikel */}
            <div className="grid gap-3">
                {articles.map(a => (
                    <div key={a.id} className="bg-[#1E293B] p-4 rounded-lg flex justify-between items-center border border-slate-700">
                        <div>
                            <h3 className="font-bold">{a.title}</h3>
                            <span className="text-xs text-slate-400">{a.status}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openEdit(a)} className="bg-slate-700 p-2 rounded hover:bg-slate-600"><Edit size={16}/></button>
                            <button onClick={() => deleteArticle(a.id)} className="bg-red-900 p-2 rounded hover:bg-red-800 text-red-400"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
                    <div className="bg-[#1E293B] p-6 rounded-xl w-full max-w-lg border border-slate-700">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-lg">{formData.id ? 'Edit Artikel' : 'Tambah Artikel'}</h3>
                            <button onClick={() => setIsFormOpen(false)}><X/></button>
                        </div>
                        <input className="w-full p-2 mb-3 bg-[#0F172A] rounded" placeholder="Judul" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <textarea className="w-full p-2 mb-3 bg-[#0F172A] rounded" placeholder="Konten" rows="5" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                        <button onClick={handleSubmit} className="bg-blue-600 w-full p-2 rounded font-bold"><Save className="inline mr-2" size={18}/> Simpan</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CeoControlServer;
