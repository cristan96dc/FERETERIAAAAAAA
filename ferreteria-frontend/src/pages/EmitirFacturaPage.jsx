import React, { useState } from 'react';
import axios from 'axios';
import './EmitirFacturaPage.css';

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
    <div className="container">
      <h2 className="title">
        Emitir Factura
      </h2>

      <form onSubmit={handleSubmit} className="form">
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

        <button type="submit" className="btn-submit">
          Emitir
        </button>
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
  );
}

export default EmitirFacturaPage;