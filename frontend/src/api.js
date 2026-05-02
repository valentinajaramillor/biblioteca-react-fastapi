const BASE = "http://localhost:8000";

export async function getLibros() {
  const res = await fetch(`${BASE}/libros`);
  return res.json();
}

export async function buscarLibros(texto) {
  const res = await fetch(`${BASE}/libros/buscar?texto=${encodeURIComponent(texto)}`);
  return res.json();
}

export async function ordenarLibros(campo) {
  const res = await fetch(`${BASE}/libros/ordenar?campo=${campo}&algoritmo=merge`);
  return res.json();
}

export async function crearLibro(datos) {
  const res = await fetch(`${BASE}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al crear libro");
  return res.json();
}

export async function actualizarLibro(id, datos) {
  const res = await fetch(`${BASE}/libros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al actualizar libro");
  return res.json();
}

export async function eliminarLibro(id) {
  const res = await fetch(`${BASE}/libros/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar libro");
  return res.json();
}

export async function getArbolCategorias() {
  const res = await fetch(`${BASE}/categorias/arbol`);
  return res.json();
}