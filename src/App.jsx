import React from 'react';
import { 
    Laptop, Sparkles, Flame, Box, Landmark, 
    Globe, ShieldCheck, ArrowUpRight, ArrowRight, 
    Layers, Users, BarChart3, Radio
} from 'lucide-react';

const mediaNetwork = [
    { 
        name: "NutrisiDietMu", 
        icon: Sparkles, 
        cat: "Media Kesehatan & Gizi", 
        desc: "Portal edukasi gizi klinis, analisis pangan berbasis bukti ilmiah, dan panduan kesehatan masyarakat.",
        color: "text-teal-400 bg-teal-950/30 border-teal-900/50",
        link: "https://nutrisidietmu.vercel.app" 
    },
    { 
        name: "BolaGass", 
        icon: Flame, 
        cat: "Media Jurnalisme Olahraga", 
        desc: "Platform jurnalisme sepak bola dengan ulasan taktis mendalam, analisis bursa transfer, dan kabar terupdate.",
        color: "text-orange-400 bg-orange-950/30 border-orange-900/50",
        link: "#" 
    },
    { 
        name: "GlowLogika", 
        icon: Box, 
        cat: "Edukasi Skincare & Beauty", 
        desc: "Media literasi kesehatan kulit dan ulasan kandungan kosmetik berdasarkan sains serta fakta medis.",
        color: "text-pink-400 bg-pink-950/30 border-pink-900/50",
        link: "#" 
    },
    { 
        name: "CuanPintar", 
        icon: Landmark, 
        cat: "Literasi Finansial & Investasi", 
        desc: "Portal perencanaan keuangan harian, investasi anak muda, dan edukasi melek finansial makro.",
        color: "text-blue-400 bg-blue-950/30 border-blue-900/50",
        link: "#" 
    }
];

const businessServices = [
    { 
        name: "Web Dev & Techno", 
        icon: Laptop, 
        cat: "Pengembangan IT & Solusi Digital", 
        desc: "Layanan pembuatan website korporat, aplikasi mobile, optimasi SEO, dan infrastruktur sistem digital perusahaan.",
        color: "text-cyan-400 bg-cyan-950/30 border-cyan-900/50"
    },
    { 
        name: "Rayliziie Digital Invitation", 
        icon: Globe, 
        cat: "Layanan Undangan Digital Premium", 
        desc: "Jasa perancangan undangan digital elegan untuk acara pernikahan, khitanan, sempro, semhas, hingga sidang.",
        color: "text-indigo-400 bg-indigo-950/30 border-indigo-900/50"
    }
];

const stats = [
    { label: "Total Target Pembaca", value: "250K+", icon: Users },
    { label: "Jaringan Ekosistem Media", value: "4 Platform", icon: Radio },
    { label: "Proyeksi Pertumbuhan", value: "+45%", icon: BarChart3 }
];

const App = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white antialiased">
            
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-850 bg-slate-900/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40">
                            <Layers className="h-5 w-5 text-white" />
                        </span>
                        <div>
                            <span className="font-display text-lg font-900 tracking-tight text-white block">RAYLIZIIE MEDIA DIGITAL</span>
                            <span className="text-[9px] font-700 tracking-widest text-indigo-400 uppercase block -mt-0.5">Rayliziie Grup Subsidiary</span>
                        </div>
                    </div>
                    <button className="rounded-full bg-white px-5 py-2 text-xs font-700 text-slate-900 transition-all hover:bg-indigo-500 hover:text-white shadow-sm">
                        Portal Admin Terpusat
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-16 text-center md:pt-32 md:pb-24">
                <div className="mx-auto max-w-4xl px-6 relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/60 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-indigo-400 shadow-inner">
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Divisi Informasi & Teknologi Global
                    </span>
                    <h1 className="mt-6 font-display text-4xl font-900 leading-[1.1] tracking-tight text-white md:text-6xl">
                        Navigasi Masa Depan <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ekosistem Media Siber Terintegrasi</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-400">
                        Rayliziie Media Digital memimpin orkestrasi portal berita multi-sektor dan penyediaan infrastruktur teknologi terapan untuk mendorong penetrasi literasi digital secara profesional.
                    </p>
                </div>
            </section>

            {/* Ringkasan Statistik */}
            <section className="mx-auto max-w-6xl px-6 mb-20">
                <div className="grid gap-6 sm:grid-cols-3 border border-slate-800 bg-slate-900 rounded-2xl p-6 shadow-xl">
                    {stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                                <s.icon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-2xl font-800 text-white tracking-tight">{s.value}</p>
                                <p className="text-xs text-slate-500 font-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Grid Lini Bisnis */}
            <main className="mx-auto max-w-7xl px-6 pb-28 space-y-20">
                
                {/* PILAR A: MEDIA NETWORK */}
                <div>
                    <div className="relative mb-8 flex items-center gap-4">
                        <h2 className="font-display text-xs font-800 tracking-widest text-slate-400 uppercase">Digital Media Network</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {mediaNetwork.map((item) => (
                            <div key={item.name} className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            <span className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 text-indigo-400 border-slate-800 group-hover:text-white transition-colors`}>
                                                <item.icon className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] text-indigo-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                        Kunjungi Platform <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 rounded-md font-600">Active Server</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PILAR B: BUSINESS SERVICES */}
                <div>
                    <div className="relative mb-8 flex items-center gap-4">
                        <h2 className="font-display text-xs font-800 tracking-widest text-slate-400 uppercase">Digital Business Services</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {businessServices.map((item) => (
                            <div key={item.name} className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950">
                                <div>
                                    <div className="flex items-center gap-3.5">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-900 border-slate-800 text-purple-400 group-hover:text-white transition-colors">
                                            <item.icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h3 className="font-800 text-base text-white tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] text-purple-400 font-600 uppercase tracking-wider">{item.cat}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-600 text-slate-500">
                                    <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                        Integrasi Layanan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                    <span className="text-[10px] text-purple-400 bg-purple-950/50 border border-purple-900/50 px-2.5 py-0.5 rounded-md font-600">Enterprise Solution</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/60">
                <div className="mx-auto max-w-7xl px-6 py-12 text-center text-xs text-slate-500">
                    <p>&copy; 2026 Rayliziie Media Digital. Seluruh Hak Cipta Dilindungi.</p>
                    <p className="mt-1 font-600 text-indigo-400 tracking-wide">Menaungi NutrisiDietMu, BolaGass, GlowLogika & CuanPintar &middot; Medan, Sumatera Utara [Subsidiary of Rayliziie Grup].</p>
                </div>
            </footer>

        </div>
    );
};

export default App;
