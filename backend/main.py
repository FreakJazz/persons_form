from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import api_router
from app.core.config import settings
from app.db.database import engine
import os

app = FastAPI(
    title="Person Registration API",
    description="API para registro de personas y profesiones con arquitectura limpia",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear directorio de uploads si no existe
os.makedirs("uploads", exist_ok=True)

# Servir archivos estáticos (fotos)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir rutas de la API
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Person Registration API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
