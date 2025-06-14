import React, { useState } from 'react';
import axios from 'axios';

function EmitirFacturaPage() {
  const [formData, setFormData] = useState({
    tipo_cbte: 6,
    punto_venta: 1,
    doc_tipo: 80,
    doc_nro: "20111111112",
    monto_neto: 100.00,
    tributo: 0.00,
    iva_21: 21.00,
    iva_105: 0.00,
  });

  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRespuesta(null);

    try {
      const res = await axios.post('/emitir-factura/', formData);
      setRespuesta(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error desconocido");
    }
  };

  return (
    <>
      <style>{`
        .factura-container {
          max-width: 600px;
          margin: 40px auto;
          background: #f8f9fb;
          border-radius: 10px;
          padding: 30px 25px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .factura-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 25px;
        }
        .factura-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .label {
          margin-bottom: 6px;
          font-weight: 600;
          color: #444;
        }
        .input {
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .input:focus {
          border-color: #1976d2;
          outline: none;
        }
        .btn-submit {
          padding: 12px;
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-submit:hover {
          background: #1458a3;
        }
        .response {
          margin-top: 25px;
          padding: 15px;
          border-radius: 8px;
        }
        .response.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }
        .response.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }
        .response-title {
          font-weight: bold;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="factura-container">
        <h2 className="factura-title">Emitir Factura</h2>

        <form onSubmit={handleSubmit} className="factura-form">
          {[
            { label: 'Tipo Comprobante', name: 'tipo_cbte', type: 'number' },
            { label: 'Punto de Venta', name: 'punto_venta', type: 'number' },
            { label: 'Tipo Documento', name: 'doc_tipo', type: 'number' },
            { label: 'Nro Documento', name: 'doc_nro', type: 'text' },
            { label: 'Monto Neto', name: 'monto_neto', type: 'number', step: '0.01' },
            { label: 'Tributo', name: 'tributo', type: 'number', step: '0.01' },
            { label: 'IVA 21%', name: 'iva_21', type: 'number', step: '0.01' },
            { label: 'IVA 10.5%', name: 'iva_105', type: 'number', step: '0.01' },
          ].map(({ label, name, type, step }) => (
            <div key={name} className="form-group">
              <label className="label">{label}</label>
              <input
                name={name}
                type={type}
                step={step || undefined}
                value={formData[name]}
                onChange={handleChange}
                className="input"
              />
            </div>
          ))}

          <button type="submit" className="btn-submit">Emitir</button>
        </form>

        {respuesta && (
          <div className="response success">
            <p className="response-title">Factura emitida con éxito</p>
            <p>CAE: {respuesta.cae}</p>
            <p>Vencimiento: {respuesta.vencimiento}</p>
            <p>Número: {respuesta.nro_factura}</p>
            <p>Total: ${respuesta.imp_total}</p>
          </div>
        )}

        {error && (
          <div className="response error">
            <p className="response-title">Error: {error}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default EmitirFacturaPage;