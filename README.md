# SentiLens - Sentiment Analysis Platform

**Tagline:** *Turning Reviews into Insights.*

SentiLens adalah aplikasi web berbasis Natural Language Processing (NLP) yang digunakan untuk menganalisis sentimen ulasan produk berbahasa Indonesia. Sistem memanfaatkan teknik preprocessing teks, TF-IDF Vectorization, dan algoritma **Logistic Regression** untuk mengklasifikasikan ulasan ke dalam kategori **Positif**, **Netral**, atau **Negatif**.

## Problem Statement

Ulasan produk merupakan sumber informasi penting bagi pelanggan maupun penjual. Namun, jumlah ulasan yang terus bertambah membuat proses analisis secara manual menjadi tidak efisien. Diperlukan sebuah sistem yang mampu melakukan analisis sentimen secara otomatis sehingga opini pengguna dapat dipahami dengan cepat, akurat, dan terstruktur.

## Fitur Utama

### In Scope (MVP)
- **Dashboard**: Menampilkan ringkasan aplikasi, statistik sentimen, dan distribusi sentimen dengan Summary Cards dan Sentiment Distribution Chart
- **Sentiment Analysis**: Analisis ulasan produk real-time dengan Review Input Form, hasil sentimen, Confidence Score, dan Explain Prediction
- **Analysis History**: Menyimpan dan menampilkan riwayat analisis dengan fitur History Table dan Search History
- **Model Evaluation**: Menampilkan performa model Machine Learning (Accuracy, Precision, Recall, F1 Score, dan Confusion Matrix)
- **Keyword Extraction**: Menampilkan kata-kata yang paling berpengaruh terhadap hasil klasifikasi
- **Filtering & Search**: Fitur pencarian dan filter berdasarkan sentimen

### Out of Scope
- Login dan Register / Multi User / Role Management
- Upload Dataset oleh pengguna
- Scraping data secara real-time
- Export PDF
- Mobile Application
- Integrasi layanan AI eksternal
- Perbandingan banyak model Machine Learning

## Arsitektur Sistem

```
sentilens/
├── backend/               # FastAPI Backend Server
│   ├── app/
│   │   ├── api/          # API Endpoints
│   │   ├── database/     # Database Configuration
│   │   ├── ml/           # Machine Learning Pipeline
│   │   └── models/       # Database Models
│   ├── models/           # Trained ML Models
│   ├── main.py          # Application Entry Point
│   └── train_model.py   # Model Training Script
└── frontend/             # React Frontend
    └── src/
        ├── pages/        # Page Components
        ├── layouts/      # Layout Components
        └── services/     # API Service Layer
```

## Teknologi yang Digunakan

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit dan ORM
- **scikit-learn** - Machine Learning library
- **NLTK** - Natural Language Processing
- **Sastrawi** - Indonesian stemmer
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Machine Learning
- **Algorithm**: Logistic Regression
- **Feature Extraction**: TF-IDF Vectorizer
- **Model Storage**: Joblib
- **Model Performance**:
  - Accuracy: **87.75%**
  - Precision: **82.45%**
  - Recall: **87.99%**
  - F1-Score: **84.71%**

## Prerequisites

Pastikan sistem Anda telah menginstall:

- Python 3.8 atau lebih tinggi
- Node.js 16 atau lebih tinggi
- npm atau yarn package manager

## Instalasi dan Setup

### 1. Clone Repository

```bash
git clone https://github.com/nikamushi/sentilens.git
cd sentilens
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data (diperlukan untuk preprocessing)
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install
```

## Menjalankan Aplikasi

### Backend Server

```bash
cd backend
python main.py
```

Server akan berjalan di: `http://127.0.0.1:8000`

API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### Frontend Development Server

```bash
cd frontend
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

## NLP Pipeline

Sistem menggunakan pipeline NLP berikut untuk memproses teks:

```
Review Input
     ↓
Case Folding (lowercase normalization)
     ↓
Tokenizing (text splitting)
     ↓
Stopword Removal (remove common words)
     ↓
Stemming (Sastrawi - Indonesian stemmer)
     ↓
TF-IDF Vectorization (feature extraction)
     ↓
Logistic Regression (classification)
     ↓
Sentiment Prediction (Positif/Netral/Negatif)
```

## API Endpoints

### Base URL: `http://127.0.0.1:8000/api`

#### 1. Analyze Sentiment
```http
POST /api/analyze
Content-Type: application/json

{
  "review": "Produk sangat bagus dan berkualitas"
}
```

**Response:**
```json
{
  "sentiment": "Positif",
  "confidence": 0.91,
  "keywords": ["bagus", "berkualitas"]
}
```

#### 2. Get Analysis History
```http
GET /api/history?page=1&limit=10&search=bagus&sentiment=Positif
```

**Response:**
```json
{
  "items": [...],
  "total": 100,
  "pages": 10
}
```

#### 3. Get Dashboard Statistics
```http
GET /api/dashboard
```

**Response:**
```json
{
  "total_analyses": 500,
  "positive_count": 300,
  "neutral_count": 100,
  "negative_count": 100,
  "positive_rate": 60.0,
  "neutral_rate": 20.0,
  "negative_rate": 20.0,
  "recent_activity": [...],
  "trend_data": [...]
}
```

#### 4. Get Model Evaluation
```http
GET /api/evaluation
```

**Response:**
```json
{
  "accuracy": 0.8775,
  "precision": 0.8245,
  "recall": 0.8799,
  "f1_score": 0.8471,
  "confusion_matrix": {...}
}
```

## Training Model

Jika Anda ingin melatih ulang model dengan dataset baru:

1. Siapkan file dataset dalam format TSV dengan kolom `text` dan `label`
2. Letakkan file di `backend/train_preprocess.tsv`
3. Jalankan script training:

```bash
cd backend
python train_model.py
```

Model yang telah dilatih akan disimpan di folder `backend/models/`:
- `sentiment_model.joblib` - Model classifier
- `tfidf_vectorizer.joblib` - TF-IDF vectorizer
- `metrics.json` - Evaluation metrics

## Struktur Database

Aplikasi menggunakan **SQLite** database (`sentilens.db`) dengan skema:

**Table: analysis_history**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| review_text | Text | User Review |
| predicted_sentiment | String | Prediction Result (Positif/Netral/Negatif) |
| confidence_score | Float | Prediction Confidence |
| analyzed_at | DateTime | Analysis Timestamp |

## Fitur Frontend

### Navigation Structure
```
Dashboard
│
├── Analyze
├── History
└── Evaluation
```

### 1. Dashboard
**Purpose**: Menampilkan ringkasan aplikasi dan statistik sentimen

**Features**:
- Summary Cards
- Sentiment Distribution Chart (Pie/Donut Chart)
- Grafik tren 7 hari terakhir
- Aktivitas analisis terbaru

### 2. Analyze
**Purpose**: Melakukan analisis sentimen terhadap ulasan produk

**Features**:
- Review Input Form
- Analyze Button
- Sentiment Result (Positif/Netral/Negatif)
- Confidence Score
- Explain Prediction (kata-kata berpengaruh)

### 3. History
**Purpose**: Menampilkan riwayat analisis yang telah dilakukan

**Features**:
- History Table
- Search History
- Filter berdasarkan sentimen
- Pagination

### 4. Evaluation
**Purpose**: Menampilkan performa model Machine Learning

**Features**:
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

## Konfigurasi

### Backend Configuration (main.py)
- Server: `127.0.0.1:8000`
- CORS: Enabled untuk frontend localhost
- Auto-reload: Enabled untuk development
- API Documentation: `/docs` (Swagger UI)

### Frontend Configuration (vite.config.js)
- Port: `5173`
- Proxy: Dikonfigurasi untuk backend API

## Target Users

- Mahasiswa
- Dosen
- Peneliti
- Pengguna yang ingin memahami sentimen ulasan produk

## Dataset

### Dataset Type
Dataset Sentiment Analysis Bahasa Indonesia yang telah memiliki label sentimen.

### Sentiment Classes
- Positif
- Netral
- Negatif

### Dataset Preparation
- Data Cleaning
- Duplicate Removal
- Text Normalization
- Missing Value Handling
- Dataset Validation

## Architecture Style

### Frontend
- Multi-Page Web Application
- Dashboard-Based Navigation
- Component-Based Architecture

### Backend
- REST API Architecture
- Layered Architecture (API Layer, Service Layer, ML Layer, Data Layer)

### Database
- Relational Database (SQLite)

## Development Notes

### Code Quality
- Backend menggunakan type hints Python dengan Pydantic validation
- Frontend menggunakan React functional components
- Konsisten dengan best practices

### State Management
- React hooks untuk state local
- API calls menggunakan axios

### Styling
- TailwindCSS untuk styling
- Responsive design
- Dark mode compatible

## Security Considerations

### Input Validation
- Menggunakan Pydantic Validation
- Mencegah request dengan format tidak valid
- Minimum review length: 5 karakter

### Error Handling
- Standardized Error Response
- Global Exception Handler
- Proper HTTP status codes

### Data Protection
- Tidak menyimpan informasi sensitif pengguna
- Hanya menyimpan data analisis yang diperlukan

## Success Criteria

- Sistem berhasil mengklasifikasikan ulasan menjadi Positif, Netral, atau Negatif
- Pengguna dapat melakukan analisis sentimen secara real-time
- Confidence score ditampilkan pada hasil prediksi
- Riwayat analisis tersimpan dan dapat diakses kembali
- Evaluasi model dapat ditampilkan secara jelas
- Aplikasi berjalan dengan baik pada lingkungan lokal
- Waktu prediksi maksimal 3 detik

## Scalability Strategy

### Future Improvements
- PostgreSQL Migration
- Docker Containerization
- User Authentication & Multi User
- Batch Sentiment Analysis
- CSV Upload Support
- Model Comparison Feature
- Deep Learning Integration
- Export PDF
- Mobile Application

## Deployment Strategy

### Development Environment
- **Frontend**: React Development Server (Vite)
- **Backend**: FastAPI + Uvicorn
- **Database**: SQLite

### Production Environment (Planned)
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: PostgreSQL (Future Upgrade)

## Troubleshooting

### Backend Issues

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Error: NLTK data not found**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

**Error: Database locked**
- Pastikan hanya satu instance backend yang berjalan
- Restart aplikasi

### Frontend Issues

**Error: Cannot connect to backend**
- Pastikan backend server berjalan di port 8000
- Check CORS configuration

**Error: Dependencies not installed**
```bash
npm install
```

## Known Risks

### Dataset Quality
Dataset yang kurang bersih dapat menurunkan akurasi model.

### Class Imbalance
Distribusi kelas yang tidak seimbang dapat menyebabkan bias prediksi.

### Ambiguous Reviews
Beberapa ulasan dapat memiliki makna yang ambigu sehingga sulit diklasifikasikan secara tepat.

---

