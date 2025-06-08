import React, { useState } from 'react';

const EmitirFacturaForm = () => {
  const [formData, setFormData] = useState({
    tipo_cbte: 6,
    punto_venta: 1,
    doc_tipo: 80,
    doc_nro: "20111111112",
    monto_neto: 100.00,
    tributo: 0.00,
    iva_21: 0.00,
    iva_105: 0.00,
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("monto") || name.includes("iva") || name.includes("tributo")
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/emitir-factura/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setResponse(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Emitir Factura</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Tipo Comprobante (1=A, 6=B, 11=C):</label>
          <input type="number" name="tipo_cbte" value={formData.tipo_cbte} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Punto de Venta:</label>
          <input type="number" name="punto_venta" value={formData.punto_venta} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Tipo Doc. (80 = CUIT):</label>
          <input type="number" name="doc_tipo" value={formData.doc_tipo} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Número de Documento:</label>
          <input type="text" name="doc_nro" value={formData.doc_nro} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label>Monto Neto:</label>
          <input type="number" name="monto_neto" value={formData.monto_neto} onChange={handleChange} className="w-full border p-2" step="0.01" />
        </div>

        <div>
          <label>Tributo:</label>
          <input type="number" name="tributo" value={formData.tributo} onChange={handleChange} className="w-full border p-2" step="0.01" />
        </div>

        <div>
          <label>IVA 21%:</label>
          <input type="number" name="iva_21" value={formData.iva_21} onChange={handleChange} className="w-full border p-2" step="0.01" />
        </div>

        <div>
          <label>IVA 10.5%:</label>
          <input type="number" name="iva_105" value={formData.iva_105} onChange={handleChange} className="w-full border p-2" step="0.01" />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? "Procesando..." : "Emitir Factura"}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold mb-2">Factura emitida con éxito</h3>
          <p>CAE: {response.cae}</p>
          <p>Vencimiento: {response.vencimiento}</p>
          <p>Número: {response.nro_factura}</p>
          <p>Total: ${response.imp_total}</p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded text-red-800">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}
    </div>
  );
};

export default EmitirFacturaForm;