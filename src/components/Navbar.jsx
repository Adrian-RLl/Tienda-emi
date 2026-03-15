import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { carrito } = useContext(CartContext);

  return (
    <nav className="bg-[#7A1F1F] text-white p-2 m-1 rounded-3xl shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-serif tracking-tighter hover:opacity-90 transition">
          EMI
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-gray-200 transition">Inicio</Link>
          
          <Link 
            to="/carrito" 
            className="border border-white/30 px-4 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-2"
          >
            <span>Carrito</span>
            <span className="bg-white text-[#7A1F1F] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {carrito.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}