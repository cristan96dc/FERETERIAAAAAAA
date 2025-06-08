// src/components/ProductoDetalle.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/productos/${id}/`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/productos/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    })
      .then(res => res.json())
      .then(() => navigate('/productos'))
      .catch(err => console.error(err));
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2>Editar Producto #{id}</h2>
      <label>Nombre: <input name="nombre" value={producto.nombre} onChange={handleChange} /></label><br />
      <label>Precio: <input name="precio" type="number" value={producto.precio} onChange={handleChange} /></label><br />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default ProductoDetalle;
