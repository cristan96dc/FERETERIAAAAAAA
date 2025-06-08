import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TIPO_PRODUCTO_CHOICES } from '../utils/tiposProducto';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    numero_item: '',
    nombre_articulo: '',
    descripcion: '',
    precio_base: '',
    precio_venta: '',
    cantidad_disponible: '',
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/productos/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setFormData({
          numero_item: data.numero_item,
          nombre_articulo: data.nombre_articulo,
          descripcion: data.descripcion || '',
          precio_base: data.precio_base,
          precio_venta: data.precio_venta,
          cantidad_disponible: data.cantidad_disponible,
        });
      })
      .catch(err => console.error('Error al cargar producto:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    const datosParaEnviar = {
      ...formData,
      precio_base: formData.precio_base === '' ? 0 : Number(formData.precio_base),
      precio_venta: formData.precio_venta === '' ? 0 : Number(formData.precio_venta),
      cantidad_disponible: formData.cantidad_disponible === '' ? 0 : Number(formData.cantidad_disponible),
    };

    fetch(`http://localhost:8000/api/productos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosParaEnviar),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(JSON.stringify(errData));
          });
        }
        return res.json();
      })
      .then(data => {
        setProducto(data);
        setEditando(false);
      })
      .catch(err => {
        console.error('Error al guardar cambios:', err);
        alert('Error al guardar cambios: ' + err.message);
      });
  };

  const eliminarProducto = () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    fetch(`http://localhost:8000/api/productos/${id}/`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
          alert('Producto eliminado correctamente');
          navigate('/productos'); // redirige a la lista
        } else {
          throw new Error('Error al eliminar el producto');
        }
      })
      .catch(err => {
        console.error('Error al eliminar producto:', err);
        alert('No se pudo eliminar el producto: ' + err.message);
      });
  };

  const getNombreArticuloLabel = (value) => {
    const option = TIPO_PRODUCTO_CHOICES.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Estilos tipo Excel (igual que antes)
  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '6px',
      boxShadow: '0 0 8px rgba(238, 237, 238, 0.1)',
      maxWidth: '700px',
      margin: '20px auto',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      borderBottom: '1px solid #ccc',
      paddingBottom: '4px',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      marginBottom: '16px',
      fontSize: '1em',
      fontFamily: 'inherit',
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      marginBottom: '16px',
      fontSize: '1em',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '80px',
    },
    buttonPrimary: {
      backgroundColor: '#2b6cb0', // azul tipo Excel
      color: 'white',
      padding: '10px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '600',
      marginRight: '10px',
      transition: 'background-color 0.3s',
    },
    buttonPrimaryHover: {
      backgroundColor: '#2c5282',
    },
    buttonSecondary: {
      backgroundColor: '#a0aec0',
      color: 'white',
      padding: '10px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    buttonDanger: {
      backgroundColor: '#e53e3e', // rojo para eliminar
      color: 'white',
      padding: '10px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '600',
      marginLeft: '10px',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #ccc',
      padding: '10px 0',
    },
    infoLabel: {
      fontWeight: '600',
      width: '40%',
      color: '#555',
    },
    infoValue: {
      width: '60%',
      textAlign: 'left',
    },
    linkBack: {
      display: 'inline-block',
      marginTop: '20px',
      color: '#2b6cb0',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '600',
    },
  };

  if (!producto) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: '1.8em', marginBottom: '20px' }}>Detalle del Producto</h1>

      {editando ? (
        <>
          {/* formulario editar */}
          <label style={styles.label} htmlFor="numero_item">
            Número de artículo:
          </label>
          <input
            id="numero_item"
            type="text"
            name="numero_item"
            value={formData.numero_item}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="nombre_articulo">
            Tipo de producto:
          </label>
          <select
            id="nombre_articulo"
            name="nombre_articulo"
            value={formData.nombre_articulo}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Seleccione un tipo</option>
            {TIPO_PRODUCTO_CHOICES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label} htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />

          <label style={styles.label} htmlFor="precio_base">
            Precio base:
          </label>
          <input
            id="precio_base"
            type="number"
            name="precio_base"
            value={formData.precio_base}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="precio_venta">
            Precio venta:
          </label>
          <input
            id="precio_venta"
            type="number"
            name="precio_venta"
            value={formData.precio_venta}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="cantidad_disponible">
            Cantidad disponible:
          </label>
          <input
            id="cantidad_disponible"
            type="number"
            name="cantidad_disponible"
            value={formData.cantidad_disponible}
            onChange={handleChange}
            style={styles.input}
          />

          <div>
            <button onClick={guardarCambios} style={styles.buttonPrimary}>
              Guardar
            </button>
            <button onClick={() => setEditando(false)} style={styles.buttonSecondary}>
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          {/* vista detalle */}
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Número de artículo:</div>
            <div style={styles.infoValue}>{producto.numero_item}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Tipo de producto:</div>
            <div style={styles.infoValue}>{getNombreArticuloLabel(producto.nombre_articulo)}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Descripción:</div>
            <div style={styles.infoValue}>{producto.descripcion || 'Sin descripción'}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Precio base:</div>
            <div style={styles.infoValue}>${producto.precio_base}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Precio venta:</div>
            <div style={styles.infoValue}>${producto.precio_venta}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Cantidad disponible:</div>
            <div style={styles.infoValue}>{producto.cantidad_disponible}</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setEditando(true)}
              style={styles.buttonPrimary}
            >
              Editar
            </button>
            <button
              onClick={eliminarProducto}
              style={styles.buttonDanger}
            >
              Eliminar
            </button>
          </div>
        </>
      )}

      <Link to="/productos" style={styles.linkBack}>
        Volver
      </Link>
    </div>
  );
};

export default ProductoDetalle;