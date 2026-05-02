import json
import os

RUTA = os.path.join(os.path.dirname(__file__), "libros.json")


def cargar_datos():
    if not os.path.exists(RUTA):
        return []
    with open(RUTA, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_datos(libros: list):
    with open(RUTA, "w", encoding="utf-8") as f:
        json.dump(libros, f, ensure_ascii=False, indent=2)