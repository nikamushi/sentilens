import React, { useState, useEffect, useRef } from 'react';
import { getHistory, getDashboardStats } from '../services/api';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Globe, 
  MoreVertical, 
  ShieldAlert 
} from 'lucide-react';

export default function History() {
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ positiveCount: 4201, negativeCount: 1082 });
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSentiment, setActiveSentiment] = useState(''); // '' | 'Positif' | 'Netral' | 'Negatif'
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterPanelRef = useRef(null);

  // Tutup filter panel saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setShowFilterPanel(false);
      }
    }
    if (showFilterPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterPanel]);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        const total = res.total_analyses || 0;
        const posRate = res.positive_rate || 0;
        const negRate = res.negative_rate || 0;
        setStats({
          positiveCount: Math.round(total * posRate) || 4201,
          negativeCount: Math.round(total * negRate) || 1082,
        });
      })
      .catch((err) => {
        console.error("Gagal memuat statistik ulasan di riwayat:", err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    getHistory(search, page, 10, activeSentiment)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat:", err);
        setError("Gagal terhubung ke API backend. Menampilkan data simulasi.");
        
        // Fallback data simulasi
        const mockItems = [
          { id: 1, review_text: "Pembaruan perangkat lunak terbaru secara signifikan meningkatkan produktivitas saya sehari-hari.", sentiment: "Positif", confidence_score: 0.982, created_at: "2023-10-24T14:32:00" },
          { id: 2, review_text: "Layanan pelanggan sangat tidak membantu saat menangani masalah pengiriman produk.", sentiment: "Negatif", confidence_score: 0.845, created_at: "2023-10-24T12:15:00" },
          { id: 3, review_text: "Produk ini biasa saja. Berfungsi sesuai deskripsi, tapi tidak terlalu istimewa.", sentiment: "Netral", confidence_score: 0.721, created_at: "2023-10-23T09:44:00" },
          { id: 4, review_text: "Pengalaman luar biasa bersama tim pelayanan toko. Mereka sangat responsif dan ramah.", sentiment: "Positif", confidence_score: 0.958, created_at: "2023-10-22T18:20:00" },
          { id: 5, review_text: "Aplikasi seluler sering kali mengalami gangguan saat memuat file data berukuran besar.", sentiment: "Negatif", confidence_score: 0.893, created_at: "2023-10-22T11:05:00" },
          { id: 6, review_text: "Barang sudah diterima dengan baik. Kualitasnya standar biasa saja sesuai harga.", sentiment: "Netral", confidence_score: 0.685, created_at: "2023-10-21T16:30:00" },
          { id: 7, review_text: "Sangat puas belanja di toko ini, pengiriman super cepat dan kemasan aman.", sentiment: "Positif", confidence_score: 0.975, created_at: "2023-10-21T14:12:00" },
          { id: 8, review_text: "Bahan pakaian tipis sekali dan ukurannya jauh lebih kecil dari standar.", sentiment: "Negatif", confidence_score: 0.912, created_at: "2023-10-20T10:05:00" },
        ];

        const filtered = mockItems.filter(item => {
          const matchSearch = item.review_text.toLowerCase().includes(search.toLowerCase());
          const matchSentiment = activeSentiment ? item.sentiment === activeSentiment : true;
          return matchSearch && matchSentiment;
        });

        setData({
          items: filtered.slice((page - 1) * 10, page * 10),
          total: filtered.length,
          pages: Math.ceil(filtered.length / 10) || 1
        });
        setLoading(false);
      });
  }, [search, page, activeSentiment]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSentimentFilter = (sentiment) => {
    setActiveSentiment(sentiment);
    setPage(1);
    setShowFilterPanel(false);
  };

  const clearFilter = () => {
    setActiveSentiment('');
    setPage(1);
  };

  const SENTIMENT_OPTIONS = [
    { label: 'Semua Sentimen', value: '', color: 'text-slate-600', dot: 'bg-slate-400' },
    { label: 'Positif', value: 'Positif', color: 'text-brand-positive', dot: 'bg-brand-positive' },
    { label: 'Netral', value: 'Netral', color: 'text-brand-neutral', dot: 'bg-brand-neutral' },
    { label: 'Negatif', value: 'Negatif', color: 'text-brand-negative', dot: 'bg-brand-negative' },
  ];

  const start = data.total === 0 ? 0 : (page - 1) * 10 + 1;
  const end = Math.min(page * 10, data.total);

  // Fungsi pembuat deretan nomor halaman dengan elipsis
  const getPageNumbers = () => {
    const totalPages = data.pages;
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#0F172A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0 text-slate-800">Catatan Analisis</h1>
          <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
            Tinjau dan kelola riwayat pemrosesan analisis sentimen ulasan Anda.
          </p>
        </div>
        <div className="relative" ref={filterPanelRef}>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-medium text-xs font-bold transition-all ${
              activeSentiment
                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                : 'border-brand-border bg-white text-slate-600 hover:bg-[#F8FAFC]'
            }`}
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${activeSentiment ? 'text-brand-primary' : 'text-[#94A3B8]'}`} />
            Filter
            {activeSentiment && (
              <span className="ml-0.5 w-4 h-4 bg-brand-primary text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                1
              </span>
            )}
          </button>

          {/* Filter Dropdown Panel */}
          {showFilterPanel && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-brand-border shadow-card-hover rounded-large z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-brand-border">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter Sentimen</span>
              </div>
              <div className="py-1">
                {SENTIMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSentimentFilter(opt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                      activeSentiment === opt.value
                        ? 'bg-brand-primary/5 text-brand-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`}></span>
                    {opt.label}
                    {activeSentiment === opt.value && (
                      <span className="ml-auto text-brand-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-brand-warning/10 border border-brand-warning/20 p-4 rounded-medium text-xs font-semibold text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-warning flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-large shadow-card border border-brand-border overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          {/* Active Filter Badge */}
          {activeSentiment && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/20 rounded-medium text-xs font-bold text-brand-primary">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeSentiment === 'Positif' ? 'bg-brand-positive' :
                  activeSentiment === 'Negatif' ? 'bg-brand-negative' : 'bg-brand-neutral'
                }`}
              ></span>
              {activeSentiment}
              <button onClick={clearFilter} className="ml-1 text-brand-primary/60 hover:text-brand-primary leading-none text-base">&times;</button>
            </div>
          )}

          <div className="relative w-full sm:w-[320px]">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#94A3B8]" />
            </span>
            <input
              type="text"
              placeholder="Cari teks ulasan atau tanggal..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#64748B] select-none">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-positive"></span>
              {stats.positiveCount.toLocaleString('id-ID')} Positif
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-negative"></span>
              {stats.negativeCount.toLocaleString('id-ID')} Negatif
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-[#F8FAFC] select-none">
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[50%]">Ulasan</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[15%]">Sentimen</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[15%]">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[15%]">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[5%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
                  </td>
                </tr>
              ) : data.items.length > 0 ? (
                data.items.map((item) => {
                  const dateObj = new Date(item.created_at);
                  const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors duration-150 relative">
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-[#0F172A] leading-relaxed max-w-xl">
                          "{item.review_text}"
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            item.sentiment === 'Positif'
                              ? 'bg-brand-positive/10 text-brand-positive'
                              : item.sentiment === 'Negatif'
                              ? 'bg-brand-negative/10 text-brand-negative'
                              : 'bg-brand-neutral/10 text-brand-neutral'
                          }`}
                        >
                          {item.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded-full ${
                                item.sentiment === 'Positif' 
                                  ? 'bg-brand-positive' 
                                  : item.sentiment === 'Negatif' 
                                    ? 'bg-brand-negative' 
                                    : 'bg-brand-neutral'
                              }`}
                              style={{ width: `${item.confidence_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {(item.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-slate-800">{formattedDate}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{formattedTime}</div>
                      </td>
                      <td className="px-6 py-5 text-center relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                        >
                          <MoreVertical className="w-4 h-4 mx-auto" />
                        </button>

                        {/* Menu Aksi Dropdown Sederhana */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-6 mt-1 w-24 bg-white border border-brand-border shadow-card rounded-small py-1 z-10 text-left">
                            <button 
                              onClick={() => {
                                alert(`Melihat detail ulasan: "${item.review_text}"`);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              Detail
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#64748B]">
                    Tidak ditemukan riwayat analisis yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {data.pages > 1 && (
          <div className="px-6 py-4 border-t border-brand-border flex items-center justify-between bg-white select-none">
            <div className="text-xs font-semibold text-[#64748B]">
              Menampilkan <span className="text-slate-800 font-bold">{start}-{end}</span> dari <span className="text-slate-800 font-bold">{data.total.toLocaleString('id-ID')}</span> ulasan
            </div>

            <div className="flex items-center gap-1">
              {/* Prev Button */}
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-medium border border-brand-border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all mr-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span key={`elip-${idx}`} className="px-2 text-slate-400 font-semibold text-xs select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-medium text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-brand-primary text-white shadow-card'
                        : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-brand-border'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
                disabled={page === data.pages}
                className="w-8 h-8 rounded-medium border border-brand-border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all ml-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Cards Grid - Omit Automate History card & Set to 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rata-rata Kepercayaan */}
        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Rata-rata Kepercayaan</span>
            <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {data.items.length > 0 
                ? (data.items.reduce((acc, item) => acc + item.confidence_score, 0) / data.items.length * 100).toFixed(1)
                : "91.4"}%
            </div>
          </div>
          
          {/* Spark Bar Chart */}
          <div className="flex items-end gap-1.5 h-10 mt-4">
            <div className="w-full bg-brand-primary/20 hover:bg-brand-primary h-[30%] rounded-t-sm transition-all duration-200" title="Hari 1"></div>
            <div className="w-full bg-brand-primary/20 hover:bg-brand-primary h-[50%] rounded-t-sm transition-all duration-200" title="Hari 2"></div>
            <div className="w-full bg-brand-primary/20 hover:bg-brand-primary h-[40%] rounded-t-sm transition-all duration-200" title="Hari 3"></div>
            <div className="w-full bg-brand-primary/20 hover:bg-brand-primary h-[70%] rounded-t-sm transition-all duration-200" title="Hari 4"></div>
            <div className="w-full bg-brand-primary/40 hover:bg-brand-primary h-[85%] rounded-t-sm transition-all duration-200" title="Hari 5"></div>
            <div className="w-full bg-brand-primary hover:bg-brand-primary h-[91.4%] rounded-t-sm transition-all duration-200" title="Hari 6"></div>
          </div>
        </div>

        {/* Distribusi Gaya Bahasa */}
        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Gaya Bahasa Ulasan</span>
            <Globe className="w-4 h-4 text-brand-primary" />
          </div>

          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Bahasa Baku (Standard)</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Bahasa Gaul / Slang</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-accent h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
