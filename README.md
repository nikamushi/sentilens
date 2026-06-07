# SentiLens

**Turning Reviews into Insights.**

Aplikasi analisis sentimen ulasan produk berbahasa Indonesia menggunakan NLP dan Machine Learning.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v3 |
| Backend | FastAPI + Uvicorn |
| Database | SQLite + SQLAlchemy |
| ML | TF-IDF + Logistic Regression |
| NLP | NLTK + Sastrawi |
| Model Storage | Joblib |

---

## Project Structure

```
sentilens/
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Analyze, History, Evaluation
│   │   ├── layouts/        # MainLayout (Sidebar + Content)
│   │   ├── services/       # API service (Axios)
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── database/       # DB connection
│   │   └── ml/             # Prediction pipeline
│   ├── models/             # Saved model artifacts
│   │   ├── sentiment_model.joblib
│   │   ├── tfidf_vectorizer.joblib
│   │   └── metrics.json
│   ├── train_model.py      # ML training script
│   ├── main.py             # FastAPI entry point
│   └── requirements.txt
│
└── docs/
    ├── PRD.md
    ├── Architecture.md
    ├── DesignSystem.md
    └── TASK.md
```

---

## Setup & Running

### Backend

```bash
cd sentilens/backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt

# Train the model (download dataset + train + save artifacts)
python train_model.py

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

API docs tersedia di: `http://localhost:8000/docs`

### Frontend

```bash
cd sentilens/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

App tersedia di: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/analyze` | Prediksi sentimen ulasan |
| GET | `/api/history` | Riwayat analisis (dengan search & pagination) |
| GET | `/api/dashboard` | Statistik ringkasan & tren |
| GET | `/api/evaluation` | Metrik evaluasi model |

---

## Features

- **Dashboard** — Ringkasan statistik, donut chart distribusi, area chart tren mingguan, aktivitas terbaru
- **Analyze** — Input ulasan, prediksi sentimen (Positif/Netral/Negatif), confidence score, explain prediction (kata kunci)
- **History** — Tabel riwayat dengan fitur pencarian dan paginasi
- **Evaluation** — Metrik model (Accuracy, Precision, Recall, F1-Score) dan visualisasi Confusion Matrix
