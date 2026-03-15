// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group"
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      <div className="overflow-hidden rounded-lg aspect-3/4">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      <div className="mt-4 px-2">
        <h2 className="text-[#2D2D2D] text-lg font-semibold">{producto.nombre}</h2>
        <p className="text-[#7A1F1F] font-bold text-xl mt-1">S/{producto.precio}</p>
        
        <button className="w-full mt-4 border border-[#7A1F1F] text-[#7A1F1F] py-2 rounded-lg hover:bg-[#7A1F1F] hover:text-white transition-all">
          Ver detalles
        </button>
      </div>
    </div>
  );
}