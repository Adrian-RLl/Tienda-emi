import { useContext, useState, useEffect, useRef } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const tallasSoportadas = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
  const stockTotal = tallasSoportadas.reduce((acc, t) => acc + (producto[`stock_${t}`] || 0), 0);
  const estaAgotado = stockTotal <= 0;
  const isOferta = producto.precio_oferta && producto.precio_oferta < producto.precio;
  const porcentaje = isOferta 
    ? Math.round(((producto.precio - producto.precio_oferta) / producto.precio) * 100) 
    : 0;

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

            {isOferta && (
              <div className="absolute top-6 right-6 bg-amber-800 text-white px-4 py-1.5 text-xs font-semibold tracking-[0.15em] z-10 rounded-none shadow-sm uppercase">
                -{porcentaje}% OFF
              </div>
            )}

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
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight font-serif">
              {producto.nombre}
            </h1>
            <div className="flex items-center gap-4">
              {isOferta ? (
                <>
                  <p className="text-2xl font-bold text-red-600">S/ {producto.precio_oferta.toFixed(2)}</p>
                  <p className="text-lg font-medium text-gray-400 line-through">S/ {producto.precio.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-xl font-medium text-gray-600">S/ {producto.precio.toFixed(2)}</p>
              )}
            </div>
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
          <div className="space-y-4" ref={dropdownRef}>
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-900 tracking-wide">Seleccionar Talla</span>
            </div>
            
            <div className="relative w-full">
              <button
                type="button"
                disabled={estaAgotado}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full flex items-center justify-between border p-4 text-sm font-medium tracking-wide transition-all duration-300 ${
                  estaAgotado 
                    ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
                }`}
              >
                <span>
                  {estaAgotado 
                    ? 'No hay tallas disponibles' 
                    : tallaSeleccionada 
                      ? `Talla ${tallaSeleccionada} (${producto[`stock_${tallaSeleccionada.toLowerCase()}`]} disponible${producto[`stock_${tallaSeleccionada.toLowerCase()}`] !== 1 ? 's' : ''})`
                      : 'Selecciona una talla...'
                  }
                </span>
                {!estaAgotado && (
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {dropdownOpen && !estaAgotado && (
                <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto select-none animate-fadeIn">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    .filter((t) => (producto[`stock_${t.toLowerCase()}`] || 0) > 0)
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTallaSeleccionada(t);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                          tallaSeleccionada === t 
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'text-gray-900'
                        }`}
                      >
                        <span>Talla {t}</span>
                        <span className={`text-xs ${tallaSeleccionada === t ? 'text-gray-300' : 'text-gray-400'}`}>
                          {producto[`stock_${t.toLowerCase()}`]} disp.
                        </span>
                      </button>
                    ))
                  }
                </div>
              )}
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