import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Save, Send, PlusCircle } from 'lucide-react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CmsPortalRelawan = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', image_url: '', category: 'NutrisiDietMu', content: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Identitas Relawan (Nanti bisa dihubungkan dengan sistem Login/Auth)
    const CURRENT_USER = "Adlndika"; 

    const fetchMyArticles = async () => {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?author=eq.${CURRENT_USER}&order=created_at.desc`, {
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            });
            if (res.ok) {
                const data = await res.json();
                setArticles(data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchMyArticles();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (statusTarget) => {
        if (!formData.title || !formData.content) {
            return alert("Judul dan isi berita tidak boleh kosong!");
        }
        
        const payload = {
            title: formData.title,
            image_url: formData.image_url,
            category: formData.category,
            content: formData.content,
            status: statusTarget, // 'Draft' atau 'Pending'
            author: CURRENT_USER
        };

        try {
            const method = formData.id ? 'PATCH' : 'POST';
            const url = formData.id 
                ? `${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${formData.id}`
                : `${SUPABASE_URL}/rest/v1/rayliziie_articles`;

            const res = await fetch(url, {
                method: method,
                headers: { 
                    'apikey': SUPABASE_ANON_KEY, 
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(statusTarget === 'Draft' ? 'Draf tulisan berhasil disimpan!' : 'Artikel berhasil dikirim ke Meja Sensor CEO!');
                resetForm();
                fetchMyArticles();
            }
        } catch (err) {
            console.error("Error saving article:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus draf/artikel ini secara permanen?")) return;
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
                method: 'DELETE',
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            });
            fetchMyArticles();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    const handleEdit = (article) => {
        setFormData(article);
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({ id: null, title: '', image_url: '', category: 'NutrisiDietMu', content: '' });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* BLOK KIRI: Daftar Artikel Milik Relawan */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        📂 Arsip Tulisan Saya
                    </h2>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {articles.length === 0 ? (
                            <p className="text-sm text-slate-500 italic bg-[#0F172A] p-4 rounded-lg border border-slate-800">
                                Belum ada artikel yang ditulis.
                            </p>
                        ) : articles.map(art => (
                            <div key={art.id} className="bg-[#0F172A] p-5 rounded-lg border border-slate-700 flex flex-col gap-4 shadow-sm hover:border-slate-500 transition">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-bold text-slate-100 flex-1 leading-snug">{art.title}</h3>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
                                        art.status === 'Draft' ? 'bg-slate-700 text-slate-300' : 
                                        art.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                        {art.status === 'Pending' ? 'Menunggu Review' : art.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 border-t border-slate-800 pt-3">
                                    <button onClick={() => alert(`Preview Konten:\n\n${art.content}`)} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-2 rounded-md hover:bg-blue-600 hover:text-white transition">
                                        <Eye size={14}/> Lihat
                                    </button>
                                    <button onClick={() => handleEdit(art)} className="flex items-center gap-1.5 text-xs bg-amber-900/30 text-amber-400 px-3 py-2 rounded-md hover:bg-amber-600 hover:text-white transition">
                                        <Edit size={14}/> Edit
                                    </button>
                                    <button onClick={() => handleDelete(art.id)} className="flex items-center gap-1.5 text-xs bg-red-900/30 text-red-400 px-3 py-2 rounded-md hover:bg-red-600 hover:text-white transition">
                                        <Trash2 size={14}/> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BLOK KANAN: Ruang Redaksi Kontributor (Form) */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                            ✍️ Ruang Redaksi Kontributor
                        </h2>
                        <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sesi Aktif ({CURRENT_USER})
                        </span>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Judul Artikel</label>
                            <input 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                placeholder="Judul berita..." 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition placeholder-slate-600" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">URL Gambar Resolusi Tinggi</label>
                            <input 
                                name="image_url" 
                                value={formData.image_url} 
                                onChange={handleChange} 
                                placeholder="Link foto (https://...)" 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition placeholder-slate-600" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Target Divisi Media</label>
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 transition"
                            >
                                <option value="NutrisiDietMu">NutrisiDietMu (Kesehatan)</option>
                                <option value="BeritaUmum">Berita Umum & Teknologi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Isi Tulisan Berita</label>
                            <textarea 
                                name="content" 
                                value={formData.content} 
                                onChange={handleChange} 
                                placeholder="Ketik narasi berita lengkap di sini..." 
                                rows="10" 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white resize-none transition placeholder-slate-600 leading-relaxed"
                            ></textarea>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                            {isEditing && (
                                <button onClick={resetForm} className="px-5 py-3 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center gap-2 transition border border-slate-600">
                                    <PlusCircle size={16}/> Batal Edit
                                </button>
                            )}
                            <button onClick={() => handleSubmit('Draft')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-slate-900/50">
                                <Save size={18}/> Simpan ke Draf
                            </button>
                            <button onClick={() => handleSubmit('Pending')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/50">
                                <Send size={18}/> Kirim ke CEO Server
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CmsPortalRelawan;
