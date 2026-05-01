from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nutrimind API", version="1.0.0")

# Permitir origens confiáveis (CORS)
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Servidor backend Nutrimind rodando em FastAPI"}

# Aqui incluiremos os routers futuramente
# app.include_router(usuarios.router, prefix="/api/usuarios", tags=["Usuarios"])
