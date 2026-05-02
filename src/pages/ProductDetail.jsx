import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [fotoActiva, setFotoActiva] = useState(0); 
  const { agregarAlCarrito } = useContext(CartContext);

  useEffect(() => {
    async function fetchProducto() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setProducto(data);
      setLoading(false);
    }
    fetchProducto();
  }, [id]);

  if (loading || !producto) return null;

  const galeria = producto.imagenes_galeria && producto.imagenes_galeria.length > 0 
    ? producto.imagenes_galeria 
    : [producto.imagen_url];

  const siguienteFoto = () => setFotoActiva((prev) => (prev === galeria.length - 1 ? 0 : prev + 1));
  const anteriorFoto = () => setFotoActiva((prev) => (prev === 0 ? galeria.length - 1 : prev - 1));

  const stockTotal = (producto.stock_s || 0) + (producto.stock_m || 0) + (producto.stock_l || 0);
  const estaAgotado = stockTotal <= 0;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-12 px-4 md:px-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* LADO IZQUIERDO: CARRUSEL MULTIMEDIA */}
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-[3/4] md:h-[650px] overflow-hidden group bg-gray-50">
            <img 
              src={galeria[fotoActiva]} 
              alt={producto.nombre} 
              className={`w-full h-full object-cover transition-all duration-700 ${estaAgotado ? 'opacity-60' : ''}`} 
            />
            
            <Link 
              to="/productos" 
              className="absolute top-6 left-6 bg-white p-2.5 rounded-full text-gray-900 shadow-sm hover:scale-105 transition-transform z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>

            {/* Flechas de Navegación */}
            {galeria.length > 1 && (
              <>
                <button 
                  onClick={anteriorFoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={siguienteFoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-1.5 rounded-full text-xs text-gray-900 font-medium tracking-widest">
                  {fotoActiva + 1} / {galeria.length}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {galeria.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galeria.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  onClick={() => setFotoActiva(index)}
                  className={`w-20 h-24 object-cover cursor-pointer transition-all ${
                    fotoActiva === index ? 'opacity-100 ring-1 ring-gray-900' : 'opacity-40 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* LADO DERECHO: CONTENIDO */}
        <div className="flex flex-col justify-center py-6 md:py-12 space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              {producto.nombre}
            </h1>
            <p className="text-xl font-medium text-gray-600">S/ {producto.precio.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${estaAgotado ? 'bg-red-500' : 'bg-gray-900'} ${!estaAgotado && 'animate-pulse'}`}></span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {estaAgotado ? 'Agotado' : `Stock disponible: ${stockTotal}`}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light border-l border-gray-200 pl-4">
              {producto.descripcion || 'Elegancia y exclusividad en cada costura.'}
            </p>
          </div>

          {/* TALLAS */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-sm font-medium text-gray-900">Seleccionar Talla</p>
            </div>
            <div className="flex gap-3">
              {['S', 'M', 'L'].map((t) => {
                const tieneStock = producto[`stock_${t.toLowerCase()}`] > 0;
                return (
                  <button
                    key={t}
                    disabled={!tieneStock}
                    onClick={() => setTallaSeleccionada(t)}
                    className={`h-12 w-16 border text-sm font-medium transition-all duration-200 relative ${
                      !tieneStock
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      : tallaSeleccionada === t 
                        ? 'bg-gray-900 border-gray-900 text-white' 
                        : 'border-gray-200 text-gray-900 hover:border-gray-900'
                    }`}
                  >
                    {t}
                    {!tieneStock && (
                      <svg className="absolute inset-0 w-full h-full text-gray-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTÓN DE COMPRA */}
          <button 
            disabled={estaAgotado || !tallaSeleccionada}
            onClick={() => agregarAlCarrito({...producto, talla: tallaSeleccionada})}
            className={`w-full py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
              estaAgotado || !tallaSeleccionada
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            {estaAgotado 
              ? 'Agotado' 
              : !tallaSeleccionada 
                ? 'Seleccionar Talla' 
                : 'Añadir a la Bolsa'}
          </button>
        </div>
      </div>
    </div>
  );
}