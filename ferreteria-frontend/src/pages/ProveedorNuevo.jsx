import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProveedorNuevo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    cuit: '',
    direccion: '',
    comentarios: '',
    contacto2: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Agrupar los datos para que coincidan con el formato del backend
    const payload = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      telefono: formData.telefono,
      datos_extra: {
        cuit: formData.cuit,
        direccion: formData.direccion,
        comentarios: formData.comentarios,
        contacto2: formData.contacto2,
      },
    };

    fetch('http://localhost:8000/api/proveedores/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(JSON.stringify(err)); });
        return res.json();
      })
      .then(() => {
        alert('Proveedor creado correctamente');
        navigate('/productos/nuevo');
      })
      .catch(err => {
        console.error('Error creando proveedor:', err);
        alert('Error creando proveedor: ' + err.message);
      });
  };

  return (
    <div className="proveedor-form">
      <style>{`
        .proveedor-form {
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          background-color: white;
          color: #000;
          border: 1px solid #000;
        }

        .proveedor-form h1 {
          text-align: center;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #000;
        }

        .proveedor-form label {
          display: block;
          margin-bottom: 1rem;
        }

        .proveedor-form input,
        .proveedor-form textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #000;
          background-color: white;
          color: #000;
        }

        .proveedor-form textarea {
          resize: vertical;
        }

        .proveedor-form button {
          background-color: #2563eb;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .proveedor-form button:hover {
          background-color: #1e40af;
        }
      `}</style>

      <h1>Registrar Nuevo Proveedor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contacto:
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
          />
        </label>

        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </label>

        <label>
          CUIT:
          <input
            type="text"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
          />
        </label>

        <label>
          Dirección:
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </label>

        <label>
          Comentarios:
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <label>
          Contacto 2:
          <input
            type="text"
            name="contacto2"
            value={formData.contacto2}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Crear Proveedor</button>
      </form>
    </div>
  );
};

export default ProveedorNuevo;
