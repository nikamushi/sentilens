import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from app.database.connection import engine, Base
from app.api.endpoints import router
from app.ml.pipeline import load_pipeline

# Create DB tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up SentiLens API Server...")
    load_pipeline()
    yield

app = FastAPI(
    title="SentiLens API",
    description="API untuk analisis sentimen ulasan produk berbahasa Indonesia.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SentiLens API. Go to /docs for API documentation."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
