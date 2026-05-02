import { useState, useEffect } from "react";
import { getArbolCategorias } from "../api";

function NodoCategoria({ nodo, nivel = 0 }) {
  const [expandido, setExpandido] = useState(nivel < 2);
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;

  return (
    <li className="nodo">
      <div
        className={`nodo-header nivel-${nivel}`}
        onClick={() => tieneHijos && setExpandido(!expandido)}
        style={{ cursor: tieneHijos ? "pointer" : "default" }}
      >
        {tieneHijos && (
          <span className="icono-expand">{expandido ? "▾" : "▸"}</span>
        )}
        {!tieneHijos && <span className="icono-hoja">📄</span>}
        <span className="nodo-nombre">{nodo.nombre}</span>
        <span className="nodo-conteo">({nodo.conteo} libros)</span>
      </div>

      {tieneHijos && expandido && (
        <ul className="hijos">
          {nodo.hijos.map((hijo) => (
            <NodoCategoria key={hijo.nombre} nodo={hijo} nivel={nivel + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Categorias() {
  const [arbol, setArbol] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getArbolCategorias()
      .then(setArbol)
      .catch(() => setError("No se pudo cargar el árbol de categorías."));
  }, []);

  return (
    <div>
      <h2>Árbol de Categorías</h2>
      <p className="descripcion-algoritmo">
        <strong>Algoritmo recursivo:</strong> cada nodo muestra el total de libros
        que contiene, sumando recursivamente los de todas sus subcategorías.
        <br />
        <em>Complejidad: O(n × m)</em> donde n = libros, m = nodos del árbol.
      </p>

      {error && <div className="mensaje error">{error}</div>}

      {!arbol && !error && <p>Cargando árbol...</p>}

      {arbol && (
        <ul className="arbol">
          <NodoCategoria nodo={arbol} nivel={0} />
        </ul>
      )}
    </div>
  );
}