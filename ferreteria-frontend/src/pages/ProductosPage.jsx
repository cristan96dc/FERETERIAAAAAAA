import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductosPage.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [criterio, setCriterio] = useState('general');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Obtener productos
    fetch('http://localhost:8000/api/productos/')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));

    // Obtener proveedores
    fetch('http://localhost:8000/api/proveedores/')
      .then(res => res.json())
      .then(data => {
        const mapProv = {};
        data.forEach(p => {
          mapProv[p.id] = p.nombre;
        });
        setProveedores(mapProv);
      })
      .catch(error => console.error('Error al obtener proveedores:', error));
  }, []);

  const productosFiltrados = productos.filter(producto => {
    const texto = busqueda.toLowerCase();

    if (criterio === 'general') {
      return (
        producto.numero_item?.toString().toLowerCase().includes(texto) ||
        producto.nombre_articulo?.toLowerCase().includes(texto) ||
        (proveedores[producto.proveedor]?.toLowerCase().includes(texto) || false)
      );
    } else {
      if (criterio === 'proveedor') {
        return proveedores[producto.proveedor]?.toLowerCase().includes(texto) || false;
      }
      const campo = producto[criterio];
      if (!campo) return false;
      return campo.toString().toLowerCase().includes(texto);
    }
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <div className="relative mb-6 border-b-2 border-gray-300 pb-3">
        <h1 className="text-3xl font-extrabold text-center text-black">
          📦 Lista de Productos
        </h1>
        <Link
          to="/productos/nuevo"
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'white',
            color: 'black',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          + Agregar producto
        </Link>
      </div>

      {/* Buscador */}
      <div className="buscador-productos" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="criterio">Buscar por:</label>
          <select
            id="criterio"
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
          >
            <option value="general">Búsqueda general</option>
            <option value="numero_item">Item</option>
            <option value="nombre_articulo">Nombre</option>
            <option value="proveedor">Proveedor</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="busqueda">Buscar:</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí lo que buscás..."
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-auto shadow-lg rounded-lg border border-gray-300 bg-white">
        <table className="productos-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Item</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Nombre</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Proveedor</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Precio Base</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Precio Venta</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Stock</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 italic py-4">
                  No hay productos disponibles.
                </td>
              </tr>
            ) : (
              productosFiltrados.map(producto => (
                <tr key={producto.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{producto.numero_item}</td>
                  <td style={{ padding: '8px' }}>{producto.nombre_articulo}</td>
                  <td style={{ padding: '8px' }}>
                    {proveedores[producto.proveedor] || 'No asignado'}
                  </td>
                  <td style={{ padding: '8px' }}>${producto.precio_base}</td>
                  <td style={{ padding: '8px' }}>${producto.precio_venta}</td>
                  <td style={{ padding: '8px' }}>{producto.cantidad_disponible}</td>
                  <td style={{ padding: '8px' }}>
                    <Link to={`/productos/${producto.id}`} className="link-editar">
                      Ver / Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosPage;