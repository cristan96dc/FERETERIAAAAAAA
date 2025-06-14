import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token. El usuario no está autenticado.');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };

    fetch('http://localhost:8000/api/productos/', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Error en productos');
        return res.json();
      })
      .then(data => {
        setTodosProductos(data);
        setProductos(data.slice(0, 10));
      })
      .catch(error => console.error('Error al obtener productos:', error));

    fetch('http://localhost:8000/api/proveedores/', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Error en proveedores');
        return res.json();
      })
      .then(data => {
        const diccionario = {};
        data.forEach(p => {
          diccionario[p.id] = p.nombre;
        });
        setProveedores(diccionario);
      })
      .catch(error => console.error('Error al obtener proveedores:', error));
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setProductos(todosProductos.slice(0, 10));
    } else {
      const filtrados = todosProductos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductos(filtrados);
    }
  }, [busqueda, todosProductos]);

  const styles = {
  wrapper: {
    marginLeft: '130px', // espacio para sidebar
    paddingTop: '2rem',
  },
  container: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '6px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    maxWidth: '500px', // ➤ MÁS CHICA
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  input: {
    padding: '8px',
    marginBottom: '16px',
    width: '100%',
    fontSize: '1em',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85em',
  },
  thtd: {
    border: '1px solid #ccc',
    padding: '8px 10px',
    textAlign: 'left',
    backgroundColor: 'white',
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2>Listado de Productos</h2>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={styles.input}
        />
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
    </div>
  );
}

export default ProductosList;