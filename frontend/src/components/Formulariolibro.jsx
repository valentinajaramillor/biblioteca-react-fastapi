import { useState, useEffect } from "react";
import { crearLibro, actualizarLibro } from "../api";

const CATEGORIAS = [
  "Algoritmos y Estructuras",
  "Programación",
  "Desarrollo Web",
  "Bases de Datos",
  "SQL",
  "NoSQL",
  "Redes",
  "Matemáticas",
  "Física",
  "Estadística",
  "Filosofía",
  "Historia",
];

const VACIO = {
  titulo: "",
  autor: "",
  isbn: "",
  anio: "",
  categoria: "",
  disponibilidad: true,
  descripcion: "",
};

export default function FormularioLibro({ libro, onGuardado }) {
  const [form, setForm] = useState(VACIO);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (libro) {
      setForm(libro);
    } else {
      setForm(VACIO);
    }
  }, [libro]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo || !form.autor || !form.isbn || !form.anio || !form.categoria) {
      setMensaje({ texto: "Todos los campos obligatorios deben estar completos.", tipo: "error" });
      return;
    }
    try {
      const datos = { ...form, anio: parseInt(form.anio) };
      if (libro) {
        await actualizarLibro(libro.id, datos);
        setMensaje({ texto: "Libro actualizado correctamente.", tipo: "ok" });
      } else {
        await crearLibro(datos);
        setMensaje({ texto: "Libro registrado correctamente.", tipo: "ok" });
        setForm(VACIO);
      }
      setTimeout(onGuardado, 1200);
    } catch {
      setMensaje({ texto: "Error al guardar el libro.", tipo: "error" });
    }
  }

  return (
    <div>
      <h2>{libro ? "Editar Libro" : "Registrar Nuevo Libro"}</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo">
          <label>Título *</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Autor *</label>
          <input name="autor" value={form.autor} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>ISBN *</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Año *</label>
          <input
            name="anio"
            type="number"
            min="1900"
            max="2099"
            value={form.anio}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Categoría *</label>
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="">— Seleccionar —</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="campo campo-check">
          <label>
            <input
              name="disponibilidad"
              type="checkbox"
              checked={form.disponibilidad}
              onChange={handleChange}
            />
            {" "}Disponible
          </label>
        </div>

        <div className="campo">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="botones-form">
          <button type="submit" className="btn-guardar">
            {libro ? "Actualizar" : "Registrar"}
          </button>
          <button type="button" className="btn-cancelar" onClick={onGuardado}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}