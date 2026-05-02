import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { carrito } = useContext(CartContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link 
            to="/" 
            className="text-2xl font-semibold tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
          >
            EMI
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path) 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CARRITO */}
            <Link 
              to="/carrito" 
              className="group relative flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-sm font-medium">
                Bolsa
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-gray-900 text-white text-[10px] font-semibold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-gray-900 p-2"
          >
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuAbierto ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden ${menuAbierto ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              onClick={() => setMenuAbierto(false)}
              className="block text-lg font-medium text-gray-900"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/carrito" 
            onClick={() => setMenuAbierto(false)}
            className="block text-lg font-medium text-gray-900"
          >
            Mi Bolsa ({totalItems})
          </Link>
        </div>
      </div>
    </nav>
  );
}