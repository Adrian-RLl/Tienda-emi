import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { CartProvider } from './context/CartContext';


// Importación de Componentes y Páginas
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Productos from './pages/Productos';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Inicio from './pages/Inicio'; // <--- Importante: Debe existir src/pages/Inicio.jsx
import Nosotros from './pages/Nosotros';


/**
 * COMPONENTE: LayoutSelector
 * Decide qué Navbar mostrar según la URL actual.
 */
function LayoutSelector({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminPath ? <NavbarAdmin /> : <Navbar />}
      {children}
    </>
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

// NOTA: Se eliminó la función Home() que estaba aquí para usar el archivo Inicio.jsx

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Usamos bg-white para que combine con el nuevo diseño Premium */}
        <div className="min-h-screen bg-white">
          <LayoutSelector>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/nosotros" element={<Nosotros />} />

              {/* Ruta Protegida */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </LayoutSelector>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}