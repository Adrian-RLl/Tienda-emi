import { useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  const hayStock = producto.stock > 0;

  return (
    <div 
      className="group cursor-pointer flex flex-col"
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
        {!hayStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Agotado
            </span>
          </div>
        )}

        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hayStock ? 'opacity-60' : ''}`}
        />
        
        {/* Hover overlay simple */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col space-y-1">
        <h2 className="text-gray-900 text-sm font-medium">{producto.nombre}</h2>
        <p className="text-gray-500 text-sm">S/ {producto.precio.toFixed(2)}</p>
      </div>
    </div>
  );
}