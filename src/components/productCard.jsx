import { useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  
  // Validación de stock proveniente de la base de datos
  const hayStock = producto.stock > 0;

  return (
    <div 
      // Permitimos que SIEMPRE sea clickeable para navegar
      className="bg-white p-3 rounded-xl border border-gray-100 transition-all duration-300 group cursor-pointer hover:shadow-lg relative"
      onClick={() => navigate(`/producto/${producto.id}`)} // <- ELIMINAMOS la validación de stock aquí
    >
      {/* Etiqueta de Agotado visual sobre la imagen */}
      {!hayStock && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
            AGOTADO
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg aspect-3/4 relative">
        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          // Si no hay stock, la imagen se ve más tenue
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!hayStock ? 'opacity-70 grayscale-[0.5]' : ''}`}
        />
      </div>

      <div className="mt-4 px-2">
        <h2 className="text-[#2D2D2D] text-lg font-semibold">{producto.nombre}</h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[#7A1F1F] font-bold text-xl">S/{producto.precio}</p>
          <span className="text-xs text-gray-400">Stock: {producto.stock}</span>
        </div>
        
        {/* Este botón es visual, la navegación real es en la tarjeta entera */}
        <button 
          className={`w-full mt-4 border py-2 rounded-lg transition-all font-bold ${
            hayStock 
              ? 'border-[#7A1F1F] text-[#7A1F1F] hover:bg-[#7A1F1F] hover:text-white' 
              : 'border-gray-300 text-gray-400 bg-gray-50'
          }`}
        >
          {hayStock ? 'Ver detalles' : 'Sin existencias'}
        </button>
      </div>
    </div>
  );
}