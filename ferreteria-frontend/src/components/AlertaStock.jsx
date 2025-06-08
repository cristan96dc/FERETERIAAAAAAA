import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AlertaStock = ({ umbral = 5 }) => {
  const [productosBajos, setProductosBajos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(response => {
        const productos = response.data;
        const bajos = productos.filter(
          producto => producto.cantidad_disponible < umbral
        );
        setProductosBajos(bajos);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, [umbral]);

  if (productosBajos.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#ff4d4f',
      color: '#fff',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      margin: '1rem auto',
      maxWidth: '600px'
    }}>
      <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>⚠️ Alerta de Bajo Stock</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productosBajos.map(producto => (
          <li key={producto.numero_item} style={{
            backgroundColor: '#fff',
            color: '#d60000',
            marginBottom: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '5px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{producto.numero_item} - {producto.nombre_articulo}</span>
            <span>{producto.cantidad_disponible} unidades</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertaStock;