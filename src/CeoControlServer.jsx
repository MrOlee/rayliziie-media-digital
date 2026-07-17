import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Settings } from 'lucide-react';

const SUPABASE_URL = "https://harpdcqmrqdgckcuhxfr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ppzSXi7DuN7v0racT9l98A_JxK5-MGG";

const CeoControlServer = () => {
    const [pendingArticles, setPendingArticles] = useState([]);
    const [publishedArticles, setPublishedArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);

    const fetchAllArticles = async () => {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?select=*&order=created_at.desc`, {
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter data untuk Meja Sensor (Pending) dan Live (Published)
                setPendingArticles(data.filter(a => a.status === 'Pending'));
                setPublishedArticles(data.filter(a => a.status === 'Published'));
            }
        } catch (err) {
            console.error("Database error:", err);
        }
    };

    useEffect(() => {
        fetchAllArticles();
    }, []);

    // CEO Mengubah status (Approve = Published, Tolak = Dihapus atau dibalikkan ke Draft)
    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Yakin ingin menyetujui dan mem-publish tulisan ini ke Live Server?`)) return;
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
                method: 'PATCH',
                headers: { 
                    'apikey': SUPABASE_ANON_KEY, 
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ status: newStatus })
            });
            fetchAllArticles();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    // Hapus Permanen (Bypass) oleh CEO
    const handleDelete = async (id, isLive = false) => {
        const msg = isLive 
            ? "PERINGATAN: Artikel ini sedang LIVE. Yakin ingin melakukan TAKEDOWN permanen?"
            : "Tolak dan hapus permanen artikel ini dari antrean server?";
            
        if (!window.confirm(msg)) return;
        
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${id}`, {
                method: 'DELETE',
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            });
            fetchAllArticles();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    // CEO Simpan Hasil Edit Paksa (Bypass)
    const handleSaveEdit = async () => {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/rayliziie_articles?id=eq.${editingArticle.id}`, {
                method: 'PATCH',
                headers: { 
                    'apikey': SUPABASE_ANON_KEY, 
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ 
                    title: editingArticle.title, 
                    content: editingArticle.content 
                })
            });
            alert('Perubahan dari CEO berhasil disimpan dan langsung sinkron ke database!');
            setEditingArticle(null);
            fetchAllArticles();
        } catch (err) {
            console.error("Error editing:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* HEADER DASHBOARD CEO */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                            <Settings className="text-slate-400" size={32}/> RAYLIZIIE CENTRAL CONTROL SERVER
                        </h1>
                        <p className="text-xs text-emerald-400 font-bold mt-2 uppercase tracking-widest flex items-center gap-1.5">
                            DATABASE: <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SUPABASE CLOUD LIVE
                        </p>
                    </div>
                    <button className="bg-red-900/80 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold uppercase transition border border-red-500/30 shadow-lg shadow-red-900/20 text-sm">
                        Keluar Server
                    </button>
                </div>

                {/* MODUL 1: MEJA SENSOR (PENDING ARTICLES) */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                        📝 Meja Sensor Kelayakan Artikel <span className="bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full text-sm ml-2">{pendingArticles.length}</span>
                    </h2>
                    
                    {pendingArticles.length === 0 ? (
                        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-6 text-center">
                            <p className="text-sm text-slate-500 italic">Server bersih. Belum ada artikel masuk dari relawan.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingArticles.map(art => (
                                <div key={art.id} className="bg-[#0F172A] p-5 md:p-6 rounded-lg border border-amber-900/50 flex flex-col md:flex-row justify-between items-start gap-6 transition hover:border-amber-700/50 shadow-sm">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-amber-400 text-xl leading-snug">{art.title}</h3>
                                        <div className="flex gap-4 mt-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-1 rounded">Penulis: {art.author}</p>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-1 rounded">Divisi: {art.category}</p>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-4 line-clamp-3 leading-relaxed border-l-2 border-slate-700 pl-3">{art.content}</p>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                                        <button onClick={() => handleStatusChange(art.id, 'Published')} className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md transition font-bold shadow-lg shadow-emerald-900/20">
                                            <CheckCircle size={16}/> Setujui & Publish
                                        </button>
                                        <button onClick={() => setEditingArticle(art)} className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs bg-blue-900/40 text-blue-400 border border-blue-800/50 px-5 py-2.5 rounded-md hover:bg-blue-600 hover:text-white transition font-bold">
                                            <Edit size={16}/> Revisi Teks
                                        </button>
                                        <button onClick={() => handleDelete(art.id, false)} className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs bg-red-900/40 text-red-400 border border-red-800/50 px-5 py-2.5 rounded-md hover:bg-red-600 hover:text-white transition font-bold">
                                            <Trash2 size={16}/> Tolak & Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODUL 2: ARTIKEL TERPUBLIKASI (LIVE MANAGEMENT) */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                        🌐 Manajemen Artikel Live <span className="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full text-sm ml-2">{publishedArticles.length}</span>
                    </h2>
                    
                    {publishedArticles.length === 0 ? (
                        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-6 text-center">
                            <p className="text-sm text-slate-500 italic">Belum ada artikel yang tayang di website publik.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {publishedArticles.map(art => (
                                <div key={art.id} className="bg-[#0F172A] p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-500 transition">
                                    <div>
                                        <h3 className="font-bold text-emerald-400">{art.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Penulis: <span className="text-slate-400">{art.author}</span> &bull; {art.category}</p>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button onClick={() => setEditingArticle(art)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition font-bold">
                                            <Edit size={14}/> Edit Force
                                        </button>
                                        <button onClick={() => handleDelete(art.id, true)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition font-bold border border-transparent hover:border-red-500">
                                            <Trash2 size={14}/> Takedown
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL OVERLAY: EDIT PAKSA OLEH CEO */}
                {editingArticle && (
                    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                        <div className="bg-[#1E293B] border border-blue-500 shadow-2xl shadow-blue-900/20 rounded-2xl p-6 md:p-8 w-full max-w-3xl transform transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-2">
                                    <Settings className="text-blue-500 animate-spin-slow" size={24}/> MODE BYPASS: EDIT ARTIKEL
                                </h2>
                                <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-white transition">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Revisi Judul</label>
                                    <input 
                                        value={editingArticle.title} 
                                        onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white font-bold" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Revisi Teks Konten</label>
                                    <textarea 
                                        value={editingArticle.content} 
                                        onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                                        rows="12"
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 resize-none leading-relaxed"
                                    ></textarea>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700 mt-6">
                                    <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition shadow-lg shadow-blue-900/50 flex justify-center items-center gap-2">
                                        <CheckCircle size={18}/> Simpan Perubahan (Live Update)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CeoControlServer;
