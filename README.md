# 📚 Biblioteca Académica

Sistema web para gestión y consulta del catálogo de una biblioteca universitaria. Permite registrar, buscar, ordenar y explorar libros académicos mediante una interfaz en React y una API en FastAPI.

---

## Tabla de contenido

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Endpoints de la API](#endpoints-de-la-api)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Informe: algoritmos y análisis de complejidad](#informe-algoritmos-y-análisis-de-complejidad)

---

## Descripción

La aplicación permite a estudiantes y docentes:

- Consultar el catálogo completo de libros académicos.
- Registrar, editar y eliminar libros.
- Buscar libros por título, autor, ISBN o categoría.
- Ordenar el catálogo por diferentes criterios usando algoritmos implementados explícitamente.
- Explorar la jerarquía de categorías en forma de árbol con conteo recursivo de libros.

La persistencia se maneja mediante un archivo `libros.json` en el backend, lo cual es suficiente para un prototipo académico y elimina la necesidad de instalar un motor de base de datos.

---

## Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Python | 3.13 |
| Backend | FastAPI | 0.115.12 |
| Backend | Uvicorn | 0.34.0 |
| Backend | Pydantic | 2.11.3 |
| Frontend | React | 18.2 |
| Frontend | Vite | 5.2 |
| Persistencia | JSON | - |

---

## Estructura del proyecto

```
biblioteca/
├── backend/
│   ├── main.py           # API REST con todos los endpoints
│   ├── models.py         # Modelos de datos con Pydantic
│   ├── database.py       # Lectura y escritura del archivo JSON
│   ├── algoritmos.py     # Merge Sort, Bubble Sort, búsqueda lineal/binaria, recursión
│   ├── libros.json       # Dataset con 25 libros académicos
│   └── requirements.txt  # Dependencias de Python
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx               # Punto de entrada de React
        ├── App.jsx                # Componente raíz y navegación
        ├── App.css                # Estilos globales
        ├── api.js                 # Funciones para consumir la API
        └── components/
            ├── Catalogo.jsx       # Tabla, búsqueda y ordenamiento
            ├── FormularioLibro.jsx # Registro y edición de libros
            └── Categorias.jsx     # Árbol interactivo de categorías
```

---

## Instalación y ejecución

### Requisitos previos

- Python 3.11 o superior → https://python.org
- Node.js 20 o superior → https://nodejs.org
- Git → https://git-scm.com

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn main:app --reload
```

El servidor queda disponible en `http://localhost:8000`.
La documentación interactiva de la API se puede consultar en `http://localhost:8000/docs`.

### Frontend

Abrir una segunda terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> Ambos servidores deben estar corriendo al mismo tiempo para que la aplicación funcione.

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/libros` | Lista todos los libros |
| GET | `/libros/{id}` | Obtiene un libro por ID |
| POST | `/libros` | Crea un nuevo libro |
| PUT | `/libros/{id}` | Actualiza un libro existente |
| DELETE | `/libros/{id}` | Elimina un libro |
| GET | `/libros/buscar?texto=...` | Búsqueda lineal por texto libre |
| GET | `/libros/ordenar?campo=...&algoritmo=...` | Ordena el catálogo |
| GET | `/categorias/arbol` | Retorna el árbol de categorías con conteos recursivos |

**Campos válidos para ordenar:** `titulo`, `autor`, `anio`, `disponibilidad`

**Algoritmos válidos:** `merge`, `bubble`

---

## Ejemplos de uso

### Buscar libros

```
GET /libros/buscar?texto=python
```

Retorna todos los libros cuyo título, autor, ISBN o categoría contiene la palabra "python".

### Ordenar por año con Merge Sort

```
GET /libros/ordenar?campo=anio&algoritmo=merge
```

### Ordenar por título con Bubble Sort

```
GET /libros/ordenar?campo=titulo&algoritmo=bubble
```

### Crear un libro

```
POST /libros
Content-Type: application/json

{
  "titulo": "El Arte de Programar",
  "autor": "Donald Knuth",
  "isbn": "978-0-201-03801-0",
  "anio": 1968,
  "categoria": "Algoritmos y Estructuras",
  "disponibilidad": true,
  "descripcion": "La obra más completa sobre algoritmos computacionales."
}
```

---

## Informe: algoritmos y análisis de complejidad

### Estructura de datos utilizada

Los libros se almacenan como una lista de diccionarios en Python, respaldada por un archivo `libros.json`. Esta estructura es adecuada para el volumen del prototipo (25–500 libros) porque permite recorrer, filtrar y ordenar sin overhead adicional. Las operaciones de lectura y escritura completa del archivo son O(n), lo cual es aceptable dado que no se requiere acceso concurrente.

El árbol de categorías se representa como un diccionario anidado donde cada nodo tiene `nombre` e `hijos`. Esta estructura refleja directamente la jerarquía y permite el recorrido recursivo de forma natural.

---

### Algoritmo 1 - Merge Sort

**Ubicación:** `backend/algoritmos.py` → funciones `merge_sort` y `_merge`

**Descripción:** Divide la lista de libros por la mitad de forma recursiva hasta llegar a sublistas de un elemento, luego las combina en orden mediante la función `_merge`, que usa dos punteros para intercalar los elementos comparando el campo indicado.

**Complejidad temporal:**
- Mejor caso: O(n log n)
- Caso promedio: O(n log n)
- Peor caso: O(n log n)

**Complejidad espacial:** O(n) por las sublistas auxiliares creadas en cada nivel.

**Por qué se eligió:** Merge Sort garantiza O(n log n) en todos los casos, a diferencia de Quick Sort que puede degradarse a O(n²) si los datos ya están ordenados o tienen muchos duplicados. Para un catálogo académico donde los datos pueden estar parcialmente ordenados, Merge Sort es la opción más predecible y confiable.

---

### Algoritmo 2 - Bubble Sort

**Ubicación:** `backend/algoritmos.py` → función `bubble_sort`

**Descripción:** Recorre la lista repetidamente comparando cada elemento con el siguiente. Si están en el orden incorrecto los intercambia. Cada pasada completa garantiza que el elemento más grande burbujea hasta su posición final, por lo que en cada iteración del ciclo externo se necesita revisar un elemento menos.

**Complejidad temporal:**
- Mejor caso: O(n²)
- Caso promedio: O(n²)
- Peor caso: O(n²)

**Complejidad espacial:** O(1) - ordena en sitio sin estructuras auxiliares.

**Comparación con Merge Sort:** Bubble Sort es más simple de implementar y entender, pero significativamente menos eficiente para listas grandes. Con 25 libros la diferencia no es perceptible, pero con 10.000 libros Merge Sort haría aproximadamente 133.000 operaciones y Bubble Sort haría hasta 100.000.000. Por eso Merge Sort es el algoritmo principal del sistema y Bubble Sort se ofrece como alternativa para ilustrar la diferencia en eficiencia.

---

### Algoritmo 3 - Búsqueda lineal

**Ubicación:** `backend/algoritmos.py` → función `busqueda_lineal`

**Descripción:** Recorre cada libro de la lista y verifica si el texto buscado aparece como subcadena en el título, autor, ISBN o categoría. Retorna todos los libros que coincidan.

**Complejidad temporal:** O(n) - cada libro se revisa exactamente una vez.

**Cuándo funciona correctamente:** Siempre, independientemente del orden de los datos. Es la única opción viable para búsqueda por texto libre en múltiples campos cuando la lista no está ordenada por ningún criterio fijo.

**Limitación:** No es eficiente para catálogos muy grandes (millones de registros). En ese caso se usarían índices de texto completo como los que ofrecen Elasticsearch o PostgreSQL. Para el volumen de este prototipo, O(n) es completamente adecuado.

---

### Algoritmo 4 - Búsqueda binaria

**Ubicación:** `backend/algoritmos.py` → función `busqueda_binaria_isbn`

**Descripción:** Ordena primero la lista por ISBN usando Merge Sort, luego aplica búsqueda binaria: compara el ISBN buscado con el elemento del medio y descarta la mitad de la lista en cada paso hasta encontrarlo o confirmar que no existe.

**Complejidad temporal:** O(log n) para la búsqueda, O(n log n) en total incluyendo el ordenamiento previo.

**Condición de uso:** Solo funciona correctamente cuando la lista está ordenada por el campo que se busca. Por eso se ordena primero dentro de la misma función. Está diseñada para búsqueda exacta por ISBN, no para búsqueda parcial por texto.

---

### Algoritmo 5 - Recorrido recursivo del árbol de categorías

**Ubicación:** `backend/algoritmos.py` → función `contar_libros_categoria`

**Descripción:** Recorre el árbol de categorías de forma recursiva para contar cuántos libros pertenecen a cada nodo, incluyendo los de sus subcategorías.

**Caso base:** Un nodo sin hijos (hoja del árbol). Se cuentan los libros cuya categoría coincide exactamente con el nombre del nodo y se retorna el resultado directamente.

**Llamada recursiva:** Para un nodo con hijos, se llama a la misma función sobre cada hijo, se suman sus conteos y se agrega el conteo de libros directos del nodo actual.

```
contar(Ingeniería)
├── contar(Programación)
│   ├── contar(Desarrollo Web)      → 3 libros  [caso base]
│   └── contar(Algoritmos)          → 2 libros  [caso base]
│   └── retorna 0 + 3 + 2 = 5
├── contar(Bases de Datos)
│   ├── contar(SQL)                 → 1 libro   [caso base]
│   └── contar(NoSQL)               → 1 libro   [caso base]
│   └── retorna 0 + 1 + 1 = 2
└── retorna 0 + 5 + 2 + 2 = 9
```

**Complejidad temporal:** O(n × m) donde n = número de libros y m = número de nodos del árbol. Por cada nodo se recorre la lista completa de libros para el conteo directo.

**Complejidad espacial:** O(p) donde p = profundidad máxima del árbol, por la pila de llamadas recursivas.

**Mejora posible:** Para escalar, se podría precalcular un diccionario de conteos por categoría en O(n) antes de recorrer el árbol, reduciendo la complejidad total a O(n + m).