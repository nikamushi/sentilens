import os
import re
import json
import urllib.request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import joblib
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# Create models folder if not exist
os.makedirs('models', exist_ok=True)

# Sastrawi Setup
print("Initializing Sastrawi components...")
stopword_factory = StopWordRemoverFactory()
default_stopwords = set(stopword_factory.get_stop_words())

# Preserve negation/contrast words so model can understand context
NEGATION_WORDS = {'tidak', 'belum', 'tanpa', 'nggak', 'tapi', 'tetapi', 'bukan', 'jangan', 'kurang'}
CUSTOM_STOPWORDS = default_stopwords - NEGATION_WORDS

stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()

def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    # Case Folding
    text = text.lower()
    # Remove numbers & punctuation
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    # Remove stopwords word-by-word, preserving negations
    words = [w for w in text.split() if w not in CUSTOM_STOPWORDS]
    # Stemming per word
    stemmed = [stemmer.stem(w) for w in words]
    # Remove extra whitespaces
    return ' '.join(stemmed).strip()

def download_dataset():
    url = "https://raw.githubusercontent.com/IndoNLP/indonlu/master/dataset/smsa_doc-sentiment-prosa/train_preprocess.tsv"
    filepath = "train_preprocess.tsv"
    
    if not os.path.exists(filepath):
        print(f"Downloading dataset from {url}...")
        urllib.request.urlretrieve(url, filepath)
        print("Download complete.")
    else:
        print("Dataset already exists locally.")
    return filepath

def main():
    # 1. Download and Load Dataset
    filepath = download_dataset()
    
    print("Loading dataset...")
    # IndoNLU tsv has no header, columns are text, label
    df = pd.read_csv(filepath, sep='\t', names=['text', 'label'])
    
    # Keep only a subset for faster local execution during development if needed, 
    # but the full dataset is ~11k rows. Let's do the full dataset or clean/drop duplicates.
    print(f"Original dataset shape: {df.shape}")
    df.drop_duplicates(inplace=True)
    df.dropna(inplace=True)
    print(f"Cleaned dataset shape: {df.shape}")
    
    # IndoNLU labels: 'positive', 'neutral', 'negative'
    # Map them to Indo: 'Positif', 'Netral', 'Negatif'
    label_map = {
        'positive': 'Positif',
        'neutral': 'Netral',
        'negative': 'Negatif'
    }
    df['label'] = df['label'].map(label_map)
    
    # 2. Text Preprocessing
    print("Preprocessing texts (using multiprocessing)...", flush=True)
    from multiprocessing import Pool
    total = len(df)
    preprocessed_texts = []
    with Pool() as pool:
        for i, res in enumerate(pool.imap(preprocess_text, df['text'], chunksize=100)):
            preprocessed_texts.append(res)
            if (i + 1) % 1000 == 0 or (i + 1) == total:
                print(f"Processed {i + 1}/{total} rows...", flush=True)
    
    df['clean_text'] = preprocessed_texts
    
    # Drop rows that became empty after cleaning
    df = df[df['clean_text'] != ""]
    
    # 3. Split Dataset
    X_train, X_test, y_train, y_test = train_test_split(
        df['clean_text'], df['label'], test_size=0.2, random_state=42, stratify=df['label']
    )
    
    # 4. Feature Extraction (TF-IDF)
    print("Extracting features (TF-IDF)...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_vectorized = vectorizer.fit_transform(X_train)
    X_test_vectorized = vectorizer.transform(X_test)
    
    # 5. Train Model
    print("Training Logistic Regression model...")
    # class_weight='balanced' compensates for imbalanced dataset (Netral only ~10% of data)
    model = LogisticRegression(max_iter=1000, C=1.0, random_state=42, class_weight='balanced')
    model.fit(X_train_vectorized, y_train)
    
    # 6. Evaluate Model
    print("Evaluating model...")
    y_pred = model.predict(X_test_vectorized)
    
    accuracy = accuracy_score(y_test, y_pred)
    # Get precision, recall, f1
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='macro')
    
    # Get Confusion Matrix
    classes = ["Positif", "Netral", "Negatif"]
    cm = confusion_matrix(y_test, y_pred, labels=classes)
    
    metrics = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "confusion_matrix": {
            "classes": classes,
            "matrix": cm.tolist()
        }
    }
    
    print("\n--- Model Evaluation Results ---")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-Score: {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)
    
    # 7. Save Model & Vectorizer
    print("Saving artifacts to models/ directory...")
    joblib.dump(model, 'models/sentiment_model.joblib')
    joblib.dump(vectorizer, 'models/tfidf_vectorizer.joblib')
    
    with open('models/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("Model pipeline files saved successfully!")

if __name__ == "__main__":
    main()
