import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { CartProvider } from './context/CartContext';

// Importación de Componentes y Páginas
import Navbar from './components/Navbar';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Productos from './pages/Productos';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';

/**
 * COMPONENTE: PublicLayout
 * Envuelve las rutas de clientes con el Navbar blanco y carrito.
 */
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
    </div>
  );
}

/**
 * COMPONENTE: ProtectedRoute
 * Bloquea el acceso a /admin si no hay una sesión activa.
 */
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; 
  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* GRUPO 1: RUTAS PÚBLICAS (Diseño Blanco) */}
          <Route path="/" element={<PublicLayout><Inicio /></PublicLayout>} />
          <Route path="/productos" element={<PublicLayout><Productos /></PublicLayout>} />
          <Route path="/producto/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/carrito" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/nosotros" element={<PublicLayout><Nosotros /></PublicLayout>} />
          
          {/* LOGIN: Sin Navbar para máxima limpieza */}
          <Route path="/login" element={<Login />} />

          {/* GRUPO 2: RUTA ADMIN (Diseño Dark - Sin Navbar General) */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin /> 
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}