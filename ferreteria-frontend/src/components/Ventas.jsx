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
  const [precioProducto, setPrecioProducto] = useState(null);
  const [ventasAcumuladas, setVentasAcumuladas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const buscadorRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  // Filtrar productos por búsqueda (por número de item o nombre)
  const productosFiltrados = productos.filter(p =>
    p.numero_item.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
    p.nombre_articulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Actualizar formData cuando selecciona un producto del dropdown
  const seleccionarProducto = (producto) => {
    setFormData(prev => {
      const cantidad = prev.cantidad_vendida || 1;
      const total = producto.precio_venta * cantidad;
      setPrecioProducto(producto.precio_venta);

      return {
        ...prev,
        producto_id: producto.id.toString(),
        total_venta: total.toFixed(2),
      };
    });
    setBusqueda(`${producto.numero_item} - ${producto.nombre_articulo}`);
    setMostrarDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'busqueda') {
      setBusqueda(value);
      setMostrarDropdown(true);
      // Si borra el input, limpia producto seleccionado y precio
      if (!value) {
        setFormData(prev => ({ ...prev, producto_id: '', total_venta: '' }));
        setPrecioProducto(null);
      }
      return;
    }

    setFormData(prev => {
      const nuevoForm = { ...prev, [name]: value };

      const productoSeleccionado = productos.find(p => p.id === parseInt(nuevoForm.producto_id));

      if (name === 'cantidad_vendida' && productoSeleccionado) {
        const total = productoSeleccionado.precio_venta * parseInt(value || 1);
        nuevoForm.total_venta = total.toFixed(2);
      }

      return nuevoForm;
    });
  };

  // Cerrar dropdown si hace click afuera
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

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
        setPrecioProducto(null);
        setBusqueda('');

        fetch(`http://localhost:8000/api/productos/${nuevaVenta.producto_id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad_disponible: nuevoStock }),
        });

        setVentasAcumuladas(prev => [
          ...prev,
          {
            ...data,
            nombre_producto: productoVend.nombre_articulo,
            numero_item: productoVend.numero_item,
            cantidad_vendida: nuevaVenta.cantidad_vendida,
            total_venta: nuevaVenta.total_venta,
            metodo_pago: nuevaVenta.metodo_pago,
          }
        ]);
      })
      .catch(err => console.error('Error al crear venta:', err));
  };

  const imprimirFactura = () => {
    window.print();
  };

  return (
    <div className="ventas-container">
      <h1 className="ventas-title">Registrar Venta</h1>

      {precioProducto !== null && (
        <div className="precio-info">
          <p><strong>Precio del producto:</strong> ${precioProducto}</p>
          <p><strong>Total estimado:</strong> ${formData.total_venta}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ventas-form">
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

        <div className="ventas-form-group" ref={buscadorRef} style={{ position: 'relative' }}>
          <label className="ventas-label">Buscar Producto:</label>
          <input
            type="text"
            name="busqueda"
            value={busqueda}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Buscar por número o nombre"
            className="ventas-input"
          />
          {mostrarDropdown && productosFiltrados.length > 0 && (
            <ul className="dropdown-list">
              {productosFiltrados.map(producto => (
                <li
                  key={producto.id}
                  onClick={() => seleccionarProducto(producto)}
                  className="dropdown-item"
                >
                  {producto.numero_item} - {producto.nombre_articulo}
                </li>
              ))}
            </ul>
          )}
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

      <h2>Ventas Acumuladas</h2>
      {ventasAcumuladas.length === 0 && <p>No hay ventas registradas aún.</p>}

      {ventasAcumuladas.length > 0 && (
        <div className="facturas-acumuladas">
          {ventasAcumuladas.map((venta, index) => (
            <div key={index} className="factura">
              <h3>Factura #{index + 1}</h3>
              <p><strong>Producto:</strong> {venta.numero_item} - {venta.nombre_producto}</p>
              <p><strong>Cantidad:</strong> {venta.cantidad_vendida}</p>
              <p><strong>Total:</strong> ${venta.total_venta}</p>
              <p><strong>Método de Pago:</strong> {venta.metodo_pago}</p>
            </div>
          ))}
          <button className="ventas-button" onClick={imprimirFactura}>Imprimir Todas las Facturas</button>
        </div>
      )}
    </div>
  );
}

export default Ventas;