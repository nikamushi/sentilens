import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { Search, ChevronLeft, ChevronRight, FileSpreadsheet, Trash2, ShieldAlert } from 'lucide-react';

export default function History() {
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getHistory(search, page, 10)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setError("Gagal terhubung ke API backend. Menampilkan data simulasi.");
        
        // Mock fallback data for design layout / local verification
        const mockItems = [
          { id: 1, review_text: "Pelayanan sangat cepat dan barang original!", sentiment: "Positif", confidence_score: 0.96, created_at: "2026-06-07T20:15:00" },
          { id: 2, review_text: "Lumayan untuk harga segini, tapi kurirnya lambat.", sentiment: "Netral", confidence_score: 0.72, created_at: "2026-06-07T19:30:00" },
          { id: 3, review_text: "Produk rusak saat sampai, saya sangat kecewa.", sentiment: "Negatif", confidence_score: 0.98, created_at: "2026-06-07T18:45:00" },
          { id: 4, review_text: "Bagus banget, pas dipake langsung pas.", sentiment: "Positif", confidence_score: 0.94, created_at: "2026-06-07T18:00:00" },
          { id: 5, review_text: "Biasa saja sih, tidak ada yang spesial.", sentiment: "Netral", confidence_score: 0.68, created_at: "2026-06-07T17:15:00" },
          { id: 6, review_text: "Bahan tipis sekali, tidak sesuai deskripsi produk.", sentiment: "Negatif", confidence_score: 0.89, created_at: "2026-06-07T16:30:00" },
          { id: 7, review_text: "Sangat puas belanja di toko ini, recommended seller!", sentiment: "Positif", confidence_score: 0.97, created_at: "2026-06-07T16:00:00" },
          { id: 8, review_text: "Paket rapi aman sentosa, barang ok berfungsi baik.", sentiment: "Positif", confidence_score: 0.92, created_at: "2026-06-07T15:15:00" },
        ];

        const filtered = mockItems.filter(item => 
          item.review_text.toLowerCase().includes(search.toLowerCase())
        );

        setData({
          items: filtered.slice((page - 1) * 10, page * 10),
          total: filtered.length,
          pages: Math.ceil(filtered.length / 10) || 1
        });
        setLoading(false);
      });
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] m-0">Riwayat Analisis</h2>
          <p className="text-xs text-[#64748B] mt-1">Lihat dan telusuri riwayat ulasan yang telah dianalisis sebelumnya.</p>
        </div>
      </div>

      {error && (
        <div className="bg-brand-warning/10 border border-brand-warning/20 p-4 rounded-medium text-xs font-semibold text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-warning" />
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-large shadow-card border border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[360px]">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-[#94A3B8]" />
          </span>
          <input
            type="text"
            placeholder="Cari ulasan..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>
        
        <div className="text-xs text-[#64748B] font-semibold">
          Menampilkan <span className="text-[#0F172A] font-bold">{data.items.length}</span> dari <span className="text-[#0F172A] font-bold">{data.total}</span> data
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-large shadow-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-[#F8FAFC]">
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[50%]">Ulasan</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[15%]">Sentimen</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[15%]">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[20%]">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
                  </td>
                </tr>
              ) : data.items.length > 0 ? (
                data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors duration-150">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0F172A] line-clamp-2">"{item.review_text}"</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          item.sentiment === 'Positif'
                            ? 'bg-brand-positive/10 text-brand-positive'
                            : item.sentiment === 'Negatif'
                            ? 'bg-brand-negative/10 text-brand-negative'
                            : 'bg-[#94A3B8]/10 text-[#64748B]'
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {(item.confidence_score * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#64748B]">
                      {new Date(item.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#64748B]">
                    Tidak ditemukan riwayat analisis yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {data.pages > 1 && (
          <div className="px-6 py-4 border-t border-brand-border flex items-center justify-between bg-[#F8FAFC]">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-2 border border-brand-border rounded-medium text-xs font-semibold text-[#64748B] hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: data.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-medium text-xs font-bold transition-all ${
                    page === i + 1
                      ? 'bg-brand-primary text-white'
                      : 'text-[#64748B] hover:bg-white border border-transparent hover:border-brand-border'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
              disabled={page === data.pages}
              className="flex items-center gap-1.5 px-3 py-2 border border-brand-border rounded-medium text-xs font-semibold text-[#64748B] hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
