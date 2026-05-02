from pydantic import BaseModel
from typing import Optional


class LibroCreate(BaseModel):
    titulo: str
    autor: str
    isbn: str
    anio: int
    categoria: str
    disponibilidad: bool = True
    descripcion: Optional[str] = ""


class Libro(LibroCreate):
    id: str