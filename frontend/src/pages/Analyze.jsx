import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { analyzeSentiment } from '../services/api';
import { MessageSquare, Sparkles, Send, BrainCircuit, AlertCircle } from 'lucide-react';

export default function Analyze() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeSentiment(data.review);
      setResult(response);
    } catch (err) {
      console.error("Analysis API failed:", err);
      // Fallback fallback prediction for local testing/demo if backend is offline
      setError("Gagal terhubung ke API backend. Menampilkan hasil simulasi.");
      
      // Basic heuristic for simulation:
      const text = data.review.toLowerCase();
      let sentiment = "Netral";
      let confidence = 0.55;
      let keywords = [];

      const positiveWords = ["bagus", "cepat", "puas", "mantap", "original", "murah", "ramah", "recomended", "suka", "keren"];
      const negativeWords = ["kecewa", "rusak", "lambat", "jelek", "pecah", "kurang", "menyesal", "parah", "lama", "penipu"];

      let posCount = 0;
      let negCount = 0;

      positiveWords.forEach(w => {
        if (text.includes(w)) {
          posCount++;
          keywords.push(w);
        }
      });

      negativeWords.forEach(w => {
        if (text.includes(w)) {
          negCount++;
          keywords.push(w);
        }
      });

      if (posCount > negCount) {
        sentiment = "Positif";
        confidence = 0.75 + (posCount * 0.05);
      } else if (negCount > posCount) {
        sentiment = "Negatif";
        confidence = 0.80 + (negCount * 0.05);
      }

      if (confidence > 0.99) confidence = 0.99;

      setResult({
        sentiment,
        confidence,
        keywords: keywords.length > 0 ? keywords : ["ulasan", "produk"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] m-0">Analisis Sentimen Baru</h2>
        <p className="text-xs text-[#64748B] mt-1">Ketikkan ulasan produk Anda untuk mengetahui sentimen dan tingkat keyakinan model.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="bg-white p-8 rounded-large shadow-card border border-brand-border lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="review" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-primary" />
                Ulasan Produk
              </label>
              <textarea
                id="review"
                rows={6}
                placeholder="Ketik ulasan di sini (contoh: Produk sangat bagus, pengiriman super cepat dan packing rapi!)..."
                className={`w-full p-4 border rounded-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none transition-all ${
                  errors.review ? 'border-brand-negative ring-1 ring-brand-negative' : 'border-brand-border'
                }`}
                {...register('review', { 
                  required: 'Teks ulasan tidak boleh kosong', 
                  minLength: { value: 5, message: 'Teks ulasan minimal 5 karakter' } 
                })}
              />
              {errors.review && (
                <span className="text-xs text-brand-negative font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.review.message}
                </span>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => { reset(); setResult(null); setError(null); }}
                className="px-5 py-2.5 rounded-medium border border-brand-border text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-all"
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-medium bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-dark transition-all flex items-center gap-2 shadow-card"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analisis Sentimen
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-brand-warning/10 border border-brand-warning/30 p-4 rounded-medium text-xs font-semibold text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-warning" />
              {error}
            </div>
          )}
        </div>

        {/* Result Area Column */}
        <div className="lg:col-span-5 h-full">
          {result ? (
            <div className="bg-white p-8 rounded-large shadow-card border border-brand-border h-full flex flex-col justify-between space-y-8 animate-fadeIn">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-brand-border pb-4">
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 m-0">
                    <BrainCircuit className="w-5 h-5 text-brand-primary" />
                    Hasil Prediksi
                  </h3>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${
                      result.sentiment === 'Positif'
                        ? 'bg-brand-positive/10 text-brand-positive border border-brand-positive/20'
                        : result.sentiment === 'Negatif'
                        ? 'bg-brand-negative/10 text-brand-negative border border-brand-negative/20'
                        : 'bg-brand-neutral/10 text-[#64748B] border border-brand-neutral/20'
                    }`}
                  >
                    {result.sentiment}
                  </span>
                </div>

                {/* Confidence Score Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#64748B]">Tingkat Kepercayaan</span>
                    <span className="text-[#0F172A]">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.sentiment === 'Positif'
                          ? 'bg-brand-positive'
                          : result.sentiment === 'Negatif'
                          ? 'bg-brand-negative'
                          : 'bg-brand-neutral'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Explain Prediction Section */}
                <div className="space-y-3 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] m-0 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                      Kata Kunci Berpengaruh
                    </h4>
                    <p className="text-[10px] text-[#64748B] mt-0.5">Kata yang paling berkontribusi terhadap hasil klasifikasi ini</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords && result.keywords.length > 0 ? (
                      result.keywords.map((word, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-brand-bg border border-brand-border text-xs font-semibold text-[#0F172A] rounded-medium hover:border-brand-accent/50 transition-all cursor-default"
                        >
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#94A3B8] italic">Tidak ada kata kunci dominan.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#94A3B8] border-t border-brand-border pt-4 text-center font-medium">
                Prediksi dilakukan menggunakan model Logistic Regression + Preprocessing Bahasa Indonesia.
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-large shadow-card border border-brand-border border-dashed h-full flex flex-col items-center justify-center text-center min-h-[340px] px-6">
              <div className="bg-[#F1F5F9] p-4 rounded-full text-brand-neutral mb-4">
                <BrainCircuit className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] m-0">Menunggu Analisis</h3>
              <p className="text-xs text-[#64748B] mt-2 max-w-[240px] leading-relaxed">
                Tulis ulasan Anda pada form input di sebelah kiri, lalu tekan tombol "Analisis Sentimen" untuk melihat hasilnya di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
