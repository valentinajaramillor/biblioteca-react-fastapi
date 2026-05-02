import { useState } from "react";
import Catalogo from "./components/Catalogo";
import FormularioLibro from "./components/FormularioLibro";
import Categorias from "./components/Categorias";
import "./App.css";

export default function App() {
  const [vista, setVista] = useState("catalogo"); // catalogo | formulario | categorias
  const [libroEditar, setLibroEditar] = useState(null);

  const irACrear = () => {
    setLibroEditar(null);
    setVista("formulario");
  };

  const irAEditar = (libro) => {
    setLibroEditar(libro);
    setVista("formulario");
  };

  const irACatalogo = () => {
    setLibroEditar(null);
    setVista("catalogo");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Biblioteca Académica</h1>
        <nav>
          <button
            className={vista === "catalogo" ? "activo" : ""}
            onClick={irACatalogo}
          >
            Catálogo
          </button>
          <button
            className={vista === "formulario" ? "activo" : ""}
            onClick={irACrear}
          >
            + Nuevo Libro
          </button>
          <button
            className={vista === "categorias" ? "activo" : ""}
            onClick={() => setVista("categorias")}
          >
            Categorías
          </button>
        </nav>
      </header>

      <main className="contenido">
        {vista === "catalogo" && <Catalogo onEditar={irAEditar} />}
        {vista === "formulario" && (
          <FormularioLibro libro={libroEditar} onGuardado={irACatalogo} />
        )}
        {vista === "categorias" && <Categorias />}
      </main>
    </div>
  );
}