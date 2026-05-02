# ─── MERGE SORT ────────────────────────────────────────────────────────────────

def merge_sort(libros: list, campo: str) -> list:
    """Ordena la lista de libros por `campo` usando Merge Sort."""
    if len(libros) <= 1:
        return libros

    mid = len(libros) // 2
    izquierda = merge_sort(libros[:mid], campo)
    derecha = merge_sort(libros[mid:], campo)
    return _merge(izquierda, derecha, campo)


def _merge(izq: list, der: list, campo: str) -> list:
    resultado = []
    i = j = 0
    while i < len(izq) and j < len(der):
        val_izq = izq[i][campo]
        val_der = der[j][campo]
        # Normalizar para comparación sin distinción de mayúsculas
        if isinstance(val_izq, str):
            val_izq = val_izq.lower()
            val_der = val_der.lower()
        if val_izq <= val_der:
            resultado.append(izq[i])
            i += 1
        else:
            resultado.append(der[j])
            j += 1
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado


# ─── BÚSQUEDA LINEAL ───────────────────────────────────────────────────────────

def busqueda_lineal(libros: list, texto: str) -> list:
    """Busca `texto` en título, autor, ISBN y categoría de cada libro."""
    texto = texto.lower()
    resultados = []
    for libro in libros:
        if (
            texto in libro["titulo"].lower()
            or texto in libro["autor"].lower()
            or texto in libro["isbn"].lower()
            or texto in libro["categoria"].lower()
        ):
            resultados.append(libro)
    return resultados


# ─── BÚSQUEDA BINARIA ──────────────────────────────────────────────────────────

def busqueda_binaria_isbn(libros: list, isbn: str):
    """Busca un libro por ISBN exacto. La lista debe estar ordenada por ISBN."""
    libros_ordenados = merge_sort(libros, "isbn")
    izq, der = 0, len(libros_ordenados) - 1
    while izq <= der:
        mid = (izq + der) // 2
        isbn_mid = libros_ordenados[mid]["isbn"]
        if isbn_mid == isbn:
            return libros_ordenados[mid]
        elif isbn_mid < isbn:
            izq = mid + 1
        else:
            der = mid - 1
    return None


# ─── ÁRBOL DE CATEGORÍAS ───────────────────────────────────────────────────────

def arbol_categorias() -> dict:
    """
    Retorna la jerarquía fija de categorías.
    En un sistema real esto podría venir de la base de datos.
    """
    return {
        "nombre": "Biblioteca",
        "hijos": [
            {
                "nombre": "Ingeniería",
                "hijos": [
                    {
                        "nombre": "Programación",
                        "hijos": [
                            {"nombre": "Desarrollo Web", "hijos": []},
                            {"nombre": "Algoritmos y Estructuras", "hijos": []},
                        ],
                    },
                    {
                        "nombre": "Bases de Datos",
                        "hijos": [
                            {"nombre": "SQL", "hijos": []},
                            {"nombre": "NoSQL", "hijos": []},
                        ],
                    },
                    {"nombre": "Redes", "hijos": []},
                ],
            },
            {
                "nombre": "Ciencias",
                "hijos": [
                    {"nombre": "Matemáticas", "hijos": []},
                    {"nombre": "Física", "hijos": []},
                    {"nombre": "Estadística", "hijos": []},
                ],
            },
            {
                "nombre": "Humanidades",
                "hijos": [
                    {"nombre": "Filosofía", "hijos": []},
                    {"nombre": "Historia", "hijos": []},
                ],
            },
        ],
    }


def contar_libros_categoria(nodo: dict, libros: list) -> dict:
    """
    RECURSIÓN: Recorre el árbol y cuenta cuántos libros hay en cada nodo.

    Caso base: nodo sin hijos → contar libros cuya categoría coincide exactamente.
    Llamada recursiva: procesar cada hijo y sumar sus conteos.

    Complejidad: O(n * m) donde n = libros, m = nodos del árbol.
    """
    nombre = nodo["nombre"]

    # Contar libros directamente en esta categoría
    conteo_directo = sum(
        1 for libro in libros if libro["categoria"].lower() == nombre.lower()
    )

    if not nodo["hijos"]:
        # CASO BASE: hoja del árbol
        return {"nombre": nombre, "conteo": conteo_directo, "hijos": []}

    # LLAMADA RECURSIVA: procesar hijos
    hijos_procesados = [
        contar_libros_categoria(hijo, libros) for hijo in nodo["hijos"]
    ]

    conteo_hijos = sum(h["conteo"] for h in hijos_procesados)

    return {
        "nombre": nombre,
        "conteo": conteo_directo + conteo_hijos,
        "hijos": hijos_procesados,
    }