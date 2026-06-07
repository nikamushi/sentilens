import datetime
from sqlalchemy import Column, Integer, Text, String, Float, DateTime
from app.database.connection import Base

class AnalysisModel(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    review_text = Column(Text, nullable=False)
    predicted_sentiment = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)
