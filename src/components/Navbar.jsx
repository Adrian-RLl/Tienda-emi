import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { carrito } = useContext(CartContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Función para saber si un link está activo
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' }, // Nueva sección
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO: Más elegante y espaciado */}
          <Link 
            to="/" 
            className="text-3xl font-serif font-bold tracking-[0.15em] text-[#2D2D2D] hover:opacity-70 transition-opacity"
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
                  className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#7A1F1F] ${
                    isActive(link.path) ? 'text-[#7A1F1F] border-b-2 border-[#7A1F1F] pb-1' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CARRITO: Diseño tipo cápsula */}
            <Link 
              to="/carrito" 
              className="group relative flex items-center gap-2 bg-[#F9F9F9] hover:bg-[#7A1F1F] px-5 py-2.5 rounded-full transition-all duration-500 border border-gray-100"
            >
              <svg 
                className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-[11px] font-black group-hover:text-white transition-colors uppercase tracking-widest">
                Carrito
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A1F1F] group-hover:bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-gray-800 p-2"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all"></div>
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all"></div>
            <div className="w-4 h-0.5 bg-current transition-all"></div>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div className={`md:hidden bg-white border-t border-gray-50 transition-all duration-500 overflow-hidden ${menuAbierto ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-8 py-10 space-y-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              onClick={() => setMenuAbierto(false)}
              className="block text-xl font-serif text-gray-800 border-b border-gray-50 pb-2"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/carrito" 
            onClick={() => setMenuAbierto(false)}
            className="block text-xl font-serif text-[#7A1F1F]"
          >
            Mi Bolsa ({totalItems})
          </Link>
        </div>
      </div>
    </nav>
  );
}