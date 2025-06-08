// src/pages/ProductosPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td className="border p-2">{producto.id}</td>
              <td className="border p-2">{producto.nombre}</td>
              <td className="border p-2">${producto.precio}</td>
              <td className="border p-2">{producto.stock}</td>
              <td className="border p-2">
                <Link to={`/productos/${producto.id}`} className="text-blue-500 hover:underline">
                  Ver / Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosPage;
