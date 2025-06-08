import { useEffect, useState, useRef } from 'react';
import './ventas.css';

function Ventas() {
  const [formData, setFormData] = useState({
    total_venta: '',
    metodo_pago: 'EF',
    producto_id: '',
    cantidad_vendida: 1,
  });
  const [productos, setProductos] = useState([]);
  const [ventaFinal, setVentaFinal] = useState(null);
  const facturaRef = useRef();

  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaVenta = {
      total_venta: parseFloat(formData.total_venta),
      metodo_pago: formData.metodo_pago,
      producto_id: parseInt(formData.producto_id),
      cantidad_vendida: parseInt(formData.cantidad_vendida),
    };

    const productoVend = productos.find(p => p.id === nuevaVenta.producto_id);
    if (!productoVend) {
      alert('Producto no encontrado');
      return;
    }

    const nuevoStock = productoVend.cantidad_disponible - nuevaVenta.cantidad_vendida;
    if (nuevoStock < 0) {
      alert('No hay suficiente stock disponible.');
      return;
    }

    fetch('http://localhost:8000/api/ventas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaVenta),
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          total_venta: '',
          metodo_pago: 'EF',
          producto_id: '',
          cantidad_vendida: 1,
        });

        // Actualizar stock
        fetch(`http://localhost:8000/api/productos/${nuevaVenta.producto_id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad_disponible: nuevoStock }),
        });

        // Mostrar factura
        setVentaFinal({
          ...data,
          nombre_producto: productoVend.nombre_articulo,
          numero_item: productoVend.numero_item,
        });
      })
      .catch(err => console.error('Error al crear venta:', err));
  };

  const imprimirFactura = () => {
    window.print();
  };

  return (
    <div className="ventas-container">
      <h1 className="ventas-title">Registrar Venta</h1>

      <form onSubmit={handleSubmit} className="ventas-form">
        <div className="ventas-form-group">
          <label className="ventas-label">Total Venta:</label>
          <input
            type="number"
            name="total_venta"
            value={formData.total_venta}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="ventas-input"
          />
        </div>

        <div className="ventas-form-group">
          <label className="ventas-label">Método de Pago:</label>
          <select
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            required
            className="ventas-select"
          >
            <option value="EF">Efectivo</option>
            <option value="TR">Transferencia</option>
            <option value="TJ">Tarjeta</option>
          </select>
        </div>

        <div className="ventas-form-group">
          <label className="ventas-label">Producto:</label>
          <select
            name="producto_id"
            value={formData.producto_id}
            onChange={handleChange}
            required
            className="ventas-select"
          >
            <option value="">-- Selecciona un producto --</option>
            {productos.map(producto => (
              <option key={producto.id} value={producto.id}>
                {producto.numero_item} - {producto.nombre_articulo}
              </option>
            ))}
          </select>
        </div>

        <div className="ventas-form-group">
          <label className="ventas-label">Cantidad Vendida:</label>
          <input
            type="number"
            name="cantidad_vendida"
            value={formData.cantidad_vendida}
            onChange={handleChange}
            required
            min="1"
            className="ventas-input"
          />
        </div>

        <button type="submit" className="ventas-button">Registrar Venta</button>
      </form>

      {ventaFinal && (
        <div className="factura" ref={facturaRef}>
          <h2 className="factura-title">Factura</h2>
          <p><strong>Producto:</strong> {ventaFinal.numero_item} - {ventaFinal.nombre_producto}</p>
          <p><strong>Cantidad:</strong> {ventaFinal.cantidad_vendida}</p>
          <p><strong>Total:</strong> ${ventaFinal.total_venta}</p>
          <p><strong>Método de Pago:</strong> {ventaFinal.metodo_pago}</p>
          <button className="ventas-button" onClick={imprimirFactura}>Imprimir Factura</button>
        </div>
      )}
    </div>
  );
}

export default Ventas;