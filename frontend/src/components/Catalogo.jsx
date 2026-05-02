import { useState, useEffect } from "react";
import { getLibros, buscarLibros, ordenarLibros, eliminarLibro } from "../api";

export default function Catalogo({ onEditar }) {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [campoOrden, setCampoOrden] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    try {
      const datos = await getLibros();
      setLibros(datos);
    } catch {
      mostrarMensaje("Error al cargar libros", "error");
    }
    setCargando(false);
  }

  async function handleBuscar(e) {
    const texto = e.target.value;
    setBusqueda(texto);
    setCampoOrden("");
    try {
      const datos = await buscarLibros(texto);
      setLibros(datos);
    } catch {
      mostrarMensaje("Error en la búsqueda", "error");
    }
  }

  async function handleOrdenar(e) {
    const campo = e.target.value;
    setCampoOrden(campo);
    setBusqueda("");
    if (!campo) {
      cargar();
      return;
    }
    try {
      const datos = await ordenarLibros(campo);
      setLibros(datos);
    } catch {
      mostrarMensaje("Error al ordenar", "error");
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este libro?")) return;
    try {
      await eliminarLibro(id);
      mostrarMensaje("Libro eliminado correctamente", "ok");
      cargar();
    } catch {
      mostrarMensaje("Error al eliminar", "error");
    }
  }

  function mostrarMensaje(texto, tipo) {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  }

  return (
    <div>
      <h2>Catálogo de Libros</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <div className="controles">
        <input
          type="text"
          placeholder="Buscar por título, autor, ISBN o categoría..."
          value={busqueda}
          onChange={handleBuscar}
          className="barra-busqueda"
        />

        <select value={campoOrden} onChange={handleOrdenar} className="selector-orden">
          <option value="">- Ordenar por -</option>
          <option value="titulo">Título (A–Z)</option>
          <option value="autor">Autor (A–Z)</option>
          <option value="anio">Año</option>
          <option value="disponibilidad">Disponibilidad</option>
        </select>
      </div>

      {cargando && <p>Cargando...</p>}

      {!cargando && libros.length === 0 && (
        <p className="vacio">No se encontraron libros.</p>
      )}

      {!cargando && libros.length > 0 && (
        <div className="tabla-wrapper">
          <table className="tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th>Año</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id}>
                  <td><strong>{libro.titulo}</strong></td>
                  <td>{libro.autor}</td>
                  <td><span className="badge">{libro.categoria}</span></td>
                  <td>{libro.anio}</td>
                  <td>
                    <span className={libro.disponibilidad ? "disponible" : "no-disponible"}>
                      {libro.disponibilidad ? "✓ Sí" : "✗ No"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-editar" onClick={() => onEditar(libro)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(libro.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="total">Total: {libros.length} libro(s)</p>
    </div>
  );
}