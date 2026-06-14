import { useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  // Compute stock across sizes
  const tallasSoportadas = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
  const hayStock = tallasSoportadas.some(t => (producto[`stock_${t}`] || 0) > 0);
  
  const isOferta = producto.precio_oferta && producto.precio_oferta < producto.precio;
  const porcentaje = isOferta 
    ? Math.round(((producto.precio - producto.precio_oferta) / producto.precio) * 100) 
    : 0;

  return (
    <div 
      className="group cursor-pointer flex flex-col"
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
        {/* Etiquetas superpuestas */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {!hayStock && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Agotado
            </span>
          )}
          {isOferta && (
            <span className="bg-amber-800/90 backdrop-blur-sm text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
              -{porcentaje}% OFF
            </span>
          )}
        </div>

        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hayStock ? 'opacity-60' : ''}`}
        />
        
        {/* Hover overlay simple */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col space-y-1">
        <h2 className="text-gray-900 text-sm font-medium line-clamp-1">{producto.nombre}</h2>
        <div className="flex items-center gap-2">
          {isOferta ? (
            <>
              <span className="text-red-600 font-semibold text-sm">S/ {producto.precio_oferta.toFixed(2)}</span>
              <span className="text-gray-400 line-through text-xs">S/ {producto.precio.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">S/ {producto.precio.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}