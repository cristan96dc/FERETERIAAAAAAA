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
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import { isAuthenticated } from './auth';  // Importamos la función para chequear token

import './App.css';

function App() {
  const loggedIn = isAuthenticated();

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Solo mostramos Sidebar si está logueado */}
        {loggedIn && <Sidebar />}

        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/django"
              element={
                <ProtectedRoute>
                  <DjangoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <ProductosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos/:id"
              element={
                <ProtectedRoute>
                  <ProductoDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos/nuevo"
              element={
                <ProtectedRoute>
                  <ProductoNuevo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores/nuevo"
              element={
                <ProtectedRoute>
                  <ProveedorNuevo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <ProtectedRoute>
                  <VentasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultas-pag"
              element={
                <ProtectedRoute>
                  <ConsultasPag />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emitir"
              element={
                <ProtectedRoute>
                  <EmitirFacturaPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;