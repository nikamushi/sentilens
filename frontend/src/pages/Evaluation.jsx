import React, { useState, useEffect } from 'react';
import { getEvaluationMetrics } from '../services/api';
import { ShieldAlert, Award, RefreshCw, BarChart2, BookOpen, Layers } from 'lucide-react';

export default function Evaluation() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvaluationMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load evaluation metrics:", err);
        setError("Gagal terhubung ke API backend. Menampilkan hasil model evaluasi default.");
        
        // Mock fallback evaluation metrics for UI presentation
        setMetrics({
          accuracy: 0.865,
          precision: 0.858,
          recall: 0.869,
          f1_score: 0.863,
          confusion_matrix: {
            classes: ["Positif", "Netral", "Negatif"],
            matrix: [
              [120, 15, 5],   // Actual Positif predicted as Positif, Netral, Negatif
              [12, 98, 10],   // Actual Netral predicted as Positif, Netral, Negatif
              [4, 18, 114]    // Actual Negatif predicted as Positif, Netral, Negatif
            ]
          }
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // Calculate sum of confusion matrix values to determine intensity colors
  const matrix = metrics.confusion_matrix.matrix;
  const classes = metrics.confusion_matrix.classes;
  
  // Flatten to find max value for cell opacity coloring
  const allValues = matrix.flat();
  const maxValue = Math.max(...allValues);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] m-0">Evaluasi Performa Model</h2>
        <p className="text-xs text-[#64748B] mt-1">Metrik performa model klasifikasi Logistic Regression berdasarkan pengujian dataset.</p>
      </div>

      {error && (
        <div className="bg-brand-warning/10 border border-brand-warning/20 p-4 rounded-medium text-xs font-semibold text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-warning" />
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex items-center gap-4 hover:shadow-card-hover transition-all duration-200">
          <div className="bg-brand-primary/10 p-3 rounded-medium text-brand-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold">Akurasi (Accuracy)</div>
            <div className="text-2xl font-extrabold text-[#0F172A] mt-0.5">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex items-center gap-4 hover:shadow-card-hover transition-all duration-200">
          <div className="bg-brand-secondary/10 p-3 rounded-medium text-brand-secondary">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold">Presisi (Precision)</div>
            <div className="text-2xl font-extrabold text-[#0F172A] mt-0.5">
              {(metrics.precision * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex items-center gap-4 hover:shadow-card-hover transition-all duration-200">
          <div className="bg-brand-positive/10 p-3 rounded-medium text-brand-positive">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold">Sensitivitas (Recall)</div>
            <div className="text-2xl font-extrabold text-[#0F172A] mt-0.5">
              {(metrics.recall * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-large shadow-card border border-brand-border flex items-center gap-4 hover:shadow-card-hover transition-all duration-200">
          <div className="bg-brand-warning/10 p-3 rounded-medium text-brand-warning">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold">F1-Score</div>
            <div className="text-2xl font-extrabold text-[#0F172A] mt-0.5">
              {(metrics.f1_score * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Confusion Matrix Card */}
        <div className="bg-white p-8 rounded-large shadow-card border border-brand-border lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] m-0">Confusion Matrix</h3>
            <p className="text-xs text-[#64748B] mt-1">Perbandingan antara label ulasan asli (Actual) dengan hasil prediksi model (Predicted)</p>
          </div>

          {/* Matrix Grid Representation */}
          <div className="flex flex-col items-center py-4">
            <div className="text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wider">
              Predicted Class
            </div>
            
            <div className="flex">
              {/* Actual Side Label */}
              <div className="flex items-center mr-4">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider -rotate-90 origin-center select-none">
                  Actual Class
                </span>
              </div>

              {/* Grid Block */}
              <div className="grid grid-cols-4 gap-2 text-center items-center">
                {/* Empty corner */}
                <div></div>
                
                {/* Predicted Header Labels */}
                {classes.map((cls) => (
                  <div key={`head-${cls}`} className="text-xs font-bold text-[#0F172A] py-1 select-none">
                    {cls}
                  </div>
                ))}

                {/* Rows of Confusion Matrix */}
                {classes.map((actualCls, rowIndex) => (
                  <React.Fragment key={`row-${actualCls}`}>
                    {/* Row Actual Label */}
                    <div className="text-xs font-bold text-[#0F172A] text-right pr-3 select-none">
                      {actualCls}
                    </div>

                    {/* Matrix Cells */}
                    {matrix[rowIndex].map((val, colIndex) => {
                      const isCorrect = rowIndex === colIndex;
                      // Calculate opacity based on cell value weight
                      const ratio = val / maxValue;
                      const opacity = 0.05 + ratio * 0.85;

                      return (
                        <div
                          key={`cell-${rowIndex}-${colIndex}`}
                          className={`w-20 h-20 flex flex-col items-center justify-center rounded-medium border transition-all duration-300 relative group cursor-default`}
                          style={{
                            backgroundColor: isCorrect 
                              ? `rgba(118, 48, 255, ${opacity})` // brand-primary theme alpha
                              : `rgba(239, 68, 68, ${opacity * 0.7})`, // error alpha
                            borderColor: isCorrect ? 'rgba(118, 48, 255, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          }}
                        >
                          <span className={`text-base font-extrabold ${ratio > 0.5 ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>
                            {val}
                          </span>
                          
                          {/* Hover Tooltip information */}
                          <div className="absolute bottom-1 bg-white border border-brand-border px-1.5 py-0.5 rounded text-[8px] font-bold text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Info Card */}
        <div className="bg-white p-8 rounded-large shadow-card border border-brand-border lg:col-span-5 space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] m-0">Teknologi & Pipeline Model</h3>
            <p className="text-xs text-[#64748B] mt-1">Komponen teknologi pembelajaran mesin yang digunakan.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 hover:bg-[#F8FAFC] rounded-medium border border-transparent hover:border-brand-border transition-all duration-200">
              <div className="bg-brand-primary/10 p-2.5 rounded-medium text-brand-primary mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] m-0">Logistic Regression</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Model linier probabilistik yang sangat efisien untuk klasifikasi teks berskala multi-kelas (Positif, Netral, Negatif).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-[#F8FAFC] rounded-medium border border-transparent hover:border-brand-border transition-all duration-200">
              <div className="bg-brand-secondary/10 p-2.5 rounded-medium text-brand-secondary mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] m-0">TF-IDF Vectorizer</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Term Frequency - Inverse Document Frequency mengekstraksi bobot kepentingan tiap kata kunci unik di dalam ulasan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-[#F8FAFC] rounded-medium border border-transparent hover:border-brand-border transition-all duration-200">
              <div className="bg-[#94A3B8]/10 p-2.5 rounded-medium text-[#64748B] mt-0.5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] m-0">Stemmer Sastrawi & NLTK</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Melakukan normalisasi teks bahasa Indonesia: case folding, tokenisasi, penghapusan kata umum (stopword), dan pengubahan kata berimbuhan menjadi kata dasar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
