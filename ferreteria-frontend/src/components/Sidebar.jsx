import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Asegurate de tener react-icons instalado

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li><Link to="/" onClick={toggleSidebar}>Inicio</Link></li>
            <li><Link to="/productos" onClick={toggleSidebar}>Productos</Link></li>
            <li><Link to="/productos/nuevo" onClick={toggleSidebar}>Nuevo Producto</Link></li>
            <li><Link to="/proveedores/nuevo" onClick={toggleSidebar}>Nuevo Proveedor</Link></li>
            <li><Link to="/ventas" onClick={toggleSidebar}>Ventas</Link></li>
            <li><Link to="/consultas-pag" onClick={toggleSidebar}>Consultas</Link></li>
            <li><Link to="/emitir" onClick={toggleSidebar}>emitir</Link></li>

          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
