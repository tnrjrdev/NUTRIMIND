from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Caminho para o banco de dados do Prisma
# No prisma: file:../dev.db
# A partir de python_backend, fica em ../dev.db
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "dev.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# connect_args={"check_same_thread": False} é necessário apenas para o SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependência do FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
