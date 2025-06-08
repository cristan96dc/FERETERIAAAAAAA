import React from 'react';

import ConsultasPag from '../components/AlertaStock';

function App() {
  return (
    <div>
      <h1>Inventario</h1>
      <ConsultasPag umbral={5} /> {/* Puedes cambiar el umbral como quieras */}
      {/* Otros componentes */}
    </div>
  );
}

export default App;