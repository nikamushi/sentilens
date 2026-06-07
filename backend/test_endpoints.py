import sys
import os
import unittest
from fastapi.testclient import TestClient

# Add current directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from main import app
from app.database.connection import SessionLocal, Base, engine
from app.models.analysis import AnalysisModel

class TestSentiLensAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Bind database tables for testing (uses same sentilens.db but we can test integrations)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)
        
    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Welcome to SentiLens API", response.json()["message"])

    def test_analyze_sentiment_positive(self):
        # Test analyzing positive review
        payload = {"review": "Barang sangat bagus, berkualitas tinggi dan pengiriman sangat cepat!"}
        response = self.client.post("/api/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("sentiment", data)
        self.assertIn("confidence", data)
        self.assertIn("keywords", data)
        self.assertEqual(data["sentiment"], "Positif")
        self.assertGreater(data["confidence"], 0.5)

    def test_analyze_sentiment_negative(self):
        # Test analyzing negative review
        payload = {"review": "Sangat kecewa sekali, barang rusak pas sampai dan respon penjual buruk."}
        response = self.client.post("/api/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("sentiment", data)
        self.assertEqual(data["sentiment"], "Negatif")
        self.assertGreater(data["confidence"], 0.5)

    def test_analyze_validation(self):
        # Test short review payload (validation error)
        payload = {"review": "abc"}
        response = self.client.post("/api/analyze", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_get_history(self):
        response = self.client.get("/api/history?page=1&limit=5")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("items", data)
        self.assertIn("total", data)
        self.assertIn("pages", data)
        self.assertTrue(isinstance(data["items"], list))

    def test_get_dashboard_statistics(self):
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_analyses", data)
        self.assertIn("positive_count", data)
        self.assertIn("neutral_count", data)
        self.assertIn("negative_count", data)
        self.assertIn("positive_rate", data)
        self.assertIn("neutral_rate", data)
        self.assertIn("negative_rate", data)
        self.assertIn("recent_activity", data)
        self.assertIn("trend_data", data)

    def test_get_evaluation_metrics(self):
        response = self.client.get("/api/evaluation")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("accuracy", data)
        self.assertIn("precision", data)
        self.assertIn("recall", data)
        self.assertIn("f1_score", data)
        self.assertIn("confusion_matrix", data)
        self.assertIn("matrix", data["confusion_matrix"])

if __name__ == "__main__":
    unittest.main()
