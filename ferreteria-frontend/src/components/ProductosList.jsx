import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState({});

  useEffect(() => {
    // Obtener productos
    fetch('http://localhost:8000/api/productos/')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));

    // Obtener proveedores
    fetch('http://localhost:8000/api/proveedores/')
  .then(res => res.json())
  .then(data => {
    const diccionario = {};
    data.forEach(p => {
      diccionario[p.id] = p.nombre; // 👈 este paso hace el "link" entre ID y nombre
    });
    setProveedores(diccionario);
  })
      .catch(error => console.error('Error al obtener proveedores:', error));
  }, []);

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '6px',
      boxShadow: '0 0 8px rgba(0,0,0,0.1)',
      maxWidth: '900px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '1em',
    },
    thtd: {
      border: '1px solid #ccc',
      padding: '10px 12px',
      textAlign: 'left',
    },
    th: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
    },
    link: {
      color: '#0073e6',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Listado de Productos</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thtd, ...styles.th }}>ID</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Nombre</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Precio</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Proveedor</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr
              key={producto.id}
              style={{
                backgroundColor: index % 2 === 1 ? '#fafafa' : 'transparent',
              }}
            >
              <td style={styles.thtd}>{producto.id}</td>
              <td style={styles.thtd}>{producto.nombre}</td>
              <td style={styles.thtd}>${producto.precio}</td>
              <td style={styles.thtd}>
  {proveedores[producto.proveedor] || 'Cargando...'}
</td>
              <td style={styles.thtd}>
                <Link to={`/productos/${producto.id}`} style={styles.link}>
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosList;