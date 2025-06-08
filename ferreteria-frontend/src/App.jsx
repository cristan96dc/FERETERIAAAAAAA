import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DjangoPage from './pages/DjangoPage';
import ProductosPage from './pages/ProductosPage';
import ProductoDetalle from './pages/ProductoDetalle'; 
import ProductoNuevo from './pages/ProductoNuevo';
import ProveedorNuevo from './pages/ProveedorNuevo';
import VentasPage from './pages/VentasPage';
import ConsultasPag from './pages/ConsultasPag';
import Sidebar from './components/Sidebar';
import EmitirFacturaPage from './pages/EmitirFacturaPage';

import './App.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar /> {/* Barra lateral a la izquierda */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/django" element={<DjangoPage />} /> {/* No se muestra en Sidebar */}
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} /> {/* Tampoco va en Sidebar */}
            <Route path="/productos/nuevo" element={<ProductoNuevo />} />
            <Route path="/proveedores/nuevo" element={<ProveedorNuevo />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/consultas-pag" element={<ConsultasPag />} />
              <Route path="/emitir" element={<EmitirFacturaPage />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
