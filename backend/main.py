from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Libro, LibroCreate
from database import cargar_datos, guardar_datos
from algoritmos import merge_sort, busqueda_lineal, busqueda_binaria, arbol_categorias, contar_libros_categoria
from typing import Optional
import uuid

app = FastAPI(title="Biblioteca API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── CRUD ──────────────────────────────────────────────────────────────────────

@app.get("/libros")
def listar_libros():
    return cargar_datos()


@app.get("/libros/buscar")
def buscar_libros(texto: str = ""):
    libros = cargar_datos()
    if not texto:
        return libros
    # Búsqueda lineal por título, autor, ISBN o categoría
    return busqueda_lineal(libros, texto)


@app.get("/libros/ordenar")
def ordenar_libros(campo: str = "titulo", algoritmo: str = "merge"):
    libros = cargar_datos()
    campos_validos = ["titulo", "autor", "anio", "disponibilidad"]
    if campo not in campos_validos:
        raise HTTPException(status_code=400, detail=f"Campo inválido. Usa: {campos_validos}")
    return merge_sort(libros, campo)


@app.get("/libros/{libro_id}")
def obtener_libro(libro_id: str):
    libros = cargar_datos()
    for libro in libros:
        if libro["id"] == libro_id:
            return libro
    raise HTTPException(status_code=404, detail="Libro no encontrado")


@app.post("/libros", status_code=201)
def crear_libro(libro: LibroCreate):
    libros = cargar_datos()
    nuevo = libro.dict()
    nuevo["id"] = str(uuid.uuid4())
    libros.append(nuevo)
    guardar_datos(libros)
    return nuevo


@app.put("/libros/{libro_id}")
def actualizar_libro(libro_id: str, datos: LibroCreate):
    libros = cargar_datos()
    for i, libro in enumerate(libros):
        if libro["id"] == libro_id:
            libros[i] = {**datos.dict(), "id": libro_id}
            guardar_datos(libros)
            return libros[i]
    raise HTTPException(status_code=404, detail="Libro no encontrado")


@app.delete("/libros/{libro_id}")
def eliminar_libro(libro_id: str):
    libros = cargar_datos()
    nuevos = [l for l in libros if l["id"] != libro_id]
    if len(nuevos) == len(libros):
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    guardar_datos(nuevos)
    return {"mensaje": "Libro eliminado"}


# ─── CATEGORÍAS ────────────────────────────────────────────────────────────────

@app.get("/categorias/arbol")
def obtener_arbol():
    libros = cargar_datos()
    arbol = arbol_categorias()
    # Contar libros por categoría recursivamente
    resultado = contar_libros_categoria(arbol, libros)
    return resultado