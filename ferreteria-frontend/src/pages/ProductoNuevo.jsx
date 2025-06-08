import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIPO_PRODUCTO_CHOICES } from '../utils/tiposProducto';

const ProductoNuevo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero_item: '',
    nombre_articulo: '',
    descripcion: '',
    precio_base: '',
    precio_venta: '',
    cantidad_disponible: '',
    proveedor: '',
  });

  const [proveedores, setProveedores] = useState([]);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [errorProveedores, setErrorProveedores] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/proveedores/')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar proveedores');
        return res.json();
      })
      .then(data => {
        setProveedores(data);
        setLoadingProveedores(false);
      })
      .catch(err => {
        setErrorProveedores(err.message);
        setLoadingProveedores(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosParaEnviar = {
      ...formData,
      precio_base: formData.precio_base === '' ? 0 : Number(formData.precio_base),
      precio_venta: formData.precio_venta === '' ? 0 : Number(formData.precio_venta),
      cantidad_disponible: formData.cantidad_disponible === '' ? 0 : Number(formData.cantidad_disponible),
      proveedor: formData.proveedor === '' ? null : Number(formData.proveedor),
    };

    fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaEnviar),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(JSON.stringify(err)); });
        }
        return res.json();
      })
      .then(data => {
        alert('Producto creado con éxito');
        navigate(`/productos/${data.id}`);
      })
      .catch(err => {
        console.error('Error creando producto:', err);
        alert('Error creando producto: ' + err.message);
      });
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 24px;
          background-color: #f9fafb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgb(255, 252, 252);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          text-align: center;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #374151;
        }
        input[type="text"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1.8px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          color:rgb(255, 255, 255);
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          resize: vertical;
        }
        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus,
        textarea:focus {
          border-color: #FFD700;
          outline: none;
          box-shadow: 0 0 5px rgba(168, 185, 16, 0.5);
        }
        textarea {
          min-height: 80px;
        }
        .error-message {
          color: #b91c1c;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .loading-message {
          color: #6b7280;
          font-style: italic;
          margin-bottom: 15px;
          text-align: center;
        }
        button {
          background-color: #FFD700;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.1rem;
          width: 100%;
          margin-top: 24px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #FFD700;
        }
      `}</style>

      <div className="container">
        <h1>Crear Producto Nuevo</h1>

        {loadingProveedores && <p className="loading-message">Cargando proveedores...</p>}
        {errorProveedores && <p className="error-message">Error: {errorProveedores}</p>}

        {!loadingProveedores && !errorProveedores && (
          <form onSubmit={handleSubmit}>

            <label htmlFor="numero_item">Número de artículo:</label>
            <input
              id="numero_item"
              type="text"
              name="numero_item"
              value={formData.numero_item}
              onChange={handleChange}
              required
            />

            <label htmlFor="nombre_articulo">Tipo de producto:</label>
            <select
              id="nombre_articulo"
              name="nombre_articulo"
              value={formData.nombre_articulo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo</option>
              {TIPO_PRODUCTO_CHOICES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <label htmlFor="proveedor">Proveedor:</label>
            <select
              id="proveedor"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
            >
              <option value="">Sin proveedor</option>
              {proveedores.map(prov => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>

            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <label htmlFor="precio_base">Precio base:</label>
            <input
              id="precio_base"
              type="number"
              name="precio_base"
              value={formData.precio_base}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <label htmlFor="precio_venta">Precio venta:</label>
            <input
              id="precio_venta"
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <label htmlFor="cantidad_disponible">Cantidad disponible:</label>
            <input
              id="cantidad_disponible"
              type="number"
              name="cantidad_disponible"
              value={formData.cantidad_disponible}
              onChange={handleChange}
              min="0"
            />

            <button type="submit">Crear Producto</button>
          </form>
        )}
      </div>
    </>
  );
};

export default ProductoNuevo;
