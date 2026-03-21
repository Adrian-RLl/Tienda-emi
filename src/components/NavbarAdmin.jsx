import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Cierra sesión en Supabase y limpia el estado local
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-2xl border-b border-slate-700">
      <div className="flex items-center gap-4">
        {/* Indicador visual de que estás en modo Admin */}
        <span className="bg-[#7A1F1F] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white">
          Admin Mode
        </span>
        <Link to="/admin" className="text-xl font-serif font-bold hover:text-gray-300 transition">
          EMI MODAS
        </Link>
      </div>
      
      <div className="flex gap-8 items-center text-sm font-medium">
        {/* Enlaces de gestión interna */}
        <Link to="/admin" className="hover:text-blue-400 transition">
          Inventario y Stock
        </Link>
        
        {/* Enlace para previsualizar la tienda como un cliente */}
        <Link to="/" className="text-gray-400 hover:text-white transition italic">
          Ver Tienda Pública
        </Link>
        
        {/* Botón de salida segura */}
        <button 
          onClick={handleLogout}
          className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg border border-red-600/30 transition-all font-bold"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}