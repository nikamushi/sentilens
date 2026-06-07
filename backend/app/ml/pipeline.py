import os
import re
import joblib
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# Initialize Sastrawi components
stopword_factory = StopWordRemoverFactory()
default_stopwords = set(stopword_factory.get_stop_words())

# Preserve negation/contrast words so model can understand context (must match train_model.py)
NEGATION_WORDS = {'tidak', 'belum', 'tanpa', 'nggak', 'tapi', 'tetapi', 'bukan', 'jangan', 'kurang'}
CUSTOM_STOPWORDS = default_stopwords - NEGATION_WORDS

stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()

_model = None
_vectorizer = None

def preprocess_text(text: str) -> str:
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
    return ' '.join(stemmed).strip()

def load_pipeline():
    global _model, _vectorizer
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models', 'sentiment_model.joblib')
    vectorizer_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models', 'tfidf_vectorizer.joblib')
    
    if os.path.exists(model_path) and os.path.exists(vectorizer_path):
        _model = joblib.load(model_path)
        _vectorizer = joblib.load(vectorizer_path)
        print("Model and Vectorizer loaded successfully.")
    else:
        print(f"Warning: Model paths not found: {model_path} or {vectorizer_path}")

def predict_sentiment(review_text: str):
    global _model, _vectorizer
    if _model is None or _vectorizer is None:
        load_pipeline()
        
    if _model is None or _vectorizer is None:
        # Fallback dummy if model not trained yet
        return "Netral", 0.5, ["model", "offline"]
        
    # Preprocess
    clean_text = preprocess_text(review_text)
    if not clean_text:
        return "Netral", 0.5, []
        
    # Transform
    vectorized_text = _vectorizer.transform([clean_text])
    
    # Predict probabilities
    probs = _model.predict_proba(vectorized_text)[0]
    classes = _model.classes_
    
    # Find max probability class
    max_idx = probs.argmax()
    predicted_sentiment = classes[max_idx]
    confidence_score = float(probs[max_idx])
    
    # Mixed/neutral sentiment heuristic:
    # If the model predicts Positif or Negatif, but the difference between Positif and Negatif is small (<= 20%),
    # it indicates mixed/neutral sentiment. We reclassify as Netral.
    try:
        class_list = list(classes)
        pos_idx = class_list.index('Positif')
        neg_idx = class_list.index('Negatif')
        net_idx = class_list.index('Netral')
        
        pos_prob = probs[pos_idx]
        neg_prob = probs[neg_idx]
        
        if abs(pos_prob - neg_prob) <= 0.20:
            predicted_sentiment = 'Netral'
            # Calibrate confidence based on closeness (smaller difference = higher neutral confidence)
            confidence_score = float(1.0 - abs(pos_prob - neg_prob))
    except (ValueError, IndexError):
        pass
    
    # Explain prediction (extract top keywords contributing to this sentiment class)
    feature_names = _vectorizer.get_feature_names_out()
    coefs = _model.coef_[max_idx]
    
    feature_indices = vectorized_text.nonzero()[1]
    tfidf_values = vectorized_text.toarray()[0]
    
    word_contributions = []
    for idx in feature_indices:
        word = feature_names[idx]
        score = tfidf_values[idx] * coefs[idx]
        if score > 0:  # Positive contribution to this class
            word_contributions.append((word, score))
            
    # Sort word contributions by weight
    word_contributions.sort(key=lambda x: x[1], reverse=True)
    keywords = [word for word, score in word_contributions[:5]]
    
    return predicted_sentiment, confidence_score, keywords
