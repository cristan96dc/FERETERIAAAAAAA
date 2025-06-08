import React, { useState, useEffect } from 'react';

const ConsultasPag = () => {
  const [tipoConsulta, setTipoConsulta] = useState('ventas'); // 'ventas', 'facturas', 'ambas'
  const [ventas, setVentas] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setError(null);
    setCargando(true);

    const queryParams = new URLSearchParams();
    if (fechaDesde) queryParams.append('fecha_desde', fechaDesde);
    if (fechaHasta) queryParams.append('fecha_hasta', fechaHasta);

    try {
      if (tipoConsulta === 'ventas' || tipoConsulta === 'ambas') {
        const resVentas = await fetch(`http://localhost:8000/api/ventas/?${queryParams.toString()}`);
        if (!resVentas.ok) throw new Error('Error al cargar ventas');
        const dataVentas = await resVentas.json();
        setVentas(dataVentas);
      } else {
        setVentas([]); // limpiar si no se consulta ventas
      }

      if (tipoConsulta === 'facturas' || tipoConsulta === 'ambas') {
        const resFacturas = await fetch(`http://localhost:8000/api/facturas/?${queryParams.toString()}`);
        if (!resFacturas.ok) throw new Error('Error al cargar facturas');
        const dataFacturas = await resFacturas.json();
        setFacturas(dataFacturas);
      } else {
        setFacturas([]); // limpiar si no se consulta facturas
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      setVentas([]);
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Carga inicial solo ventas por defecto
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para renderizar filas dependiendo del tipo
  const renderVentas = () =>
    ventas.map((v) => (
      <tr key={`venta-${v.id}`}>
        <td>{v.id}</td>
        <td>{new Date(v.fecha_venta).toLocaleDateString()}</td>
        <td>${parseFloat(v.total_venta).toFixed(2)}</td>
        <td>{v.metodo_pago}</td>
      </tr>
    ));

  const renderFacturas = () =>
    facturas.map((f) => (
      <tr key={`factura-${f.id}`}>
        <td>{f.id}</td>
        <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
        <td>${parseFloat(f.total_factura).toFixed(2)}</td>
        <td>{f.tipo_factura}</td>
      </tr>
    ));

  return (
    <div className="contenedor">
      <style>{`
        .contenedor {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .filtros, .opciones {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: bold;
          color: #555;
        }
        select, input[type="date"] {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          min-width: 150px;
        }
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-end;
          min-width: 150px;
        }
        button:hover {
          background-color: #0056b3;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background-color: #fff;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f1f1f1;
          color: #333;
        }
        td {
          color: #555;
        }
        .error {
          color: red;
          margin-top: 10px;
          text-align: center;
          font-weight: bold;
        }
        @media (max-width: 600px) {
          .filtros, .opciones {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

      <h2>Consulta de Ventas y Facturas</h2>

      <div className="opciones">
        <label>
          Tipo de Consulta:
          <select value={tipoConsulta} onChange={(e) => setTipoConsulta(e.target.value)}>
            <option value="ventas">Ventas</option>
            <option value="facturas">Facturas</option>
            <option value="ambas">Ambas</option>
          </select>
        </label>
      </div>

      <div className="filtros">
        <label>
          Fecha Desde:
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </label>

        <label>
          Fecha Hasta:
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </label>

        <button onClick={cargarDatos} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {(tipoConsulta === 'ventas' || tipoConsulta === 'ambas') && (
        <>
          <h3>Ventas</h3>
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha Venta</th>
                <th>Total Venta</th>
                <th>Método de Pago</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length > 0 ? (
                renderVentas()
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No hay ventas para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {(tipoConsulta === 'facturas' || tipoConsulta === 'ambas') && (
        <>
          <h3>Facturas</h3>
          <table>
            <thead>
              <tr>
                <th>ID Factura</th>
                <th>Fecha Emisión</th>
                <th>Total Factura</th>
                <th>Tipo Factura</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length > 0 ? (
                renderFacturas()
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No hay facturas para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ConsultasPag;