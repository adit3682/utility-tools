import { useState, useMemo } from 'react';
import { Search, Shield, Zap, WifiOff } from 'lucide-react';
import { tools } from '../config/tools.config';
import ToolCard from '../components/ui/ToolCard';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = useMemo(() => {
    const unique = [...new Set(tools.map((t) => t.category))];
    return ['Semua', ...unique];
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = activeCategory === 'Semua' || tool.category === activeCategory;
      const matchQuery =
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory]);

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
            {tools.length} Tools Tersedia
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Semua Tools yang Kamu Butuhkan,{' '}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Tanpa Upload ke Server
            </span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Kompres gambar, convert PDF, hapus background, upscale foto — semua diproses langsung
            di browser kamu. Cepat, gratis, dan 100% privat.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Shield size={16} className="text-teal-500" />
              100% Privat
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Zap size={16} className="text-teal-500" />
              Proses Instan
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200">
              <WifiOff size={16} className="text-teal-500" />
              Tanpa Upload File
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative mb-5 max-w-xl mx-auto">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tool... (misal: compress, pdf, gambar)"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition shadow-sm"
          />
        </div>

        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="font-medium">Tool tidak ditemukan</p>
            <p className="text-sm">Coba kata kunci atau kategori lain</p>
          </div>
        )}
      </div>
    </div>
  );
}