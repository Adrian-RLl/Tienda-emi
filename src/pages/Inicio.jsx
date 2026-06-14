import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/productCard';

export default function Inicio() {
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);

  useEffect(() => {
    async function fetchDestacados() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (!error && data) {
          setDestacados(data);
        }
      } catch (err) {
        console.error("Error cargando destacados:", err);
      } finally {
        setLoadingDestacados(false);
      }
    }
    fetchDestacados();
  }, []);

  return (
    <div className="bg-white font-sans">
      
      {/* SECCIÓN HERO (Presentación de Marca) */}
      <div className="relative w-full h-[calc(100vh-80px)] min-h-[600px] overflow-hidden">
        
        <img 
          src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=2000"
          alt="Portada Colección EMI" 
          className="w-full h-full object-cover object-center animate-fadeInScale" 
        />
        
        {/* Gradiente asimétrico para asegurar la lectura del texto blanco en escritorio y móvil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 md:bg-gradient-to-r md:from-black/75 md:via-black/35 md:to-transparent"></div>

        {/* CONTENIDO TEXTUAL ALINEADO A LA IZQUIERDA EN DESKTOP */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-center items-start px-6 sm:px-12 md:px-20 lg:px-28 pb-16 md:pb-0 max-w-4xl">
          <span className="text-white/95 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4 md:mb-6 animate-fadeInDown">
            Colección Exclusiva 2026
          </span>
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 animate-fadeInScale max-w-2xl font-serif">
            La elegancia de lo simple
          </h1>
          <p className="text-white/80 text-sm md:text-lg max-w-xl leading-relaxed mb-8 md:mb-10 animate-fadeInUp font-light">
            Descubre piezas atemporales diseñadas para resaltar tu feminidad natural. Vestidos que cuentan historias, para cada momento de tu vida.
          </p>
          
          {/* BOTÓN DE ACCIÓN */}
          <Link 
            to="/productos" 
            className="group relative bg-white text-gray-900 px-8 py-3.5 md:px-10 md:py-4 rounded-none font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 animate-fadeInUp"
          >
            Ver Colección
          </Link>
        </div>
      </div>

      {/* SECCIÓN VALORES */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 text-center md:text-left">
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Puntos de Entrega y Envíos</h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Realizamos entregas en puntos céntricos de Ica y envíos seguros a todo el Perú mediante agencia Shalom.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Atención por WhatsApp</h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Nos conectamos de forma personalizada para ayudarte a confirmar tu talla ideal y coordinar el pago sin contratiempos.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Exclusividad</h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Seleccionamos colecciones en ediciones limitadas de alta calidad, garantizando un estilo único en cada ocasión.
            </p>
          </div>

        </div>
      </section>

      {/* SECCIÓN DESTACADOS DINÁMICOS */}
      {!loadingDestacados && destacados.length > 0 && (
        <section className="bg-white py-24 px-6 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-[0.2em]">Piezas Clave</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2 tracking-tight font-serif">Selección de la Semana</h2>
              </div>
              <Link 
                to="/productos" 
                className="text-sm font-semibold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
              >
                Ver Todo el Catálogo
              </Link>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {destacados.map((item) => {
                const totalTallas = (item.stock_s || 0) + (item.stock_m || 0) + (item.stock_l || 0) + (item.stock_xs || 0) + (item.stock_xl || 0) + (item.stock_xxl || 0);
                const productoSincronizado = { ...item, stock: totalTallas };
                return (
                  <ProductCard key={item.id} producto={productoSincronizado} />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN INFERIOR: Texto de Marca y Manifiesto */}
      <section className="max-w-7xl mx-auto py-28 px-6 text-left border-t border-gray-100/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-[0.2em]">Nuestra Esencia</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight font-serif">
              Diseño consciente para momentos únicos.
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
              En EMI, creemos que la moda debe ser una extensión de tu personalidad. Cada una de nuestras piezas es seleccionada buscando un balance perfecto entre comodidad, sofisticación y versatilidad.
            </p>
            <Link 
              to="/nosotros" 
              className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              Conoce nuestra historia
            </Link>
          </div>
          
          {/* LADO DERECHO: Grid de dos fotos con desfase elegante para escritorio */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 md:gap-10">
            <div className="aspect-[3/4] overflow-hidden shadow-md md:translate-y-8 bg-gray-50">
              <img 
                src="https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                alt="Elegancia en movimiento" 
              />
            </div>
            
            <div className="aspect-[3/4] overflow-hidden shadow-md md:-translate-y-8 bg-gray-50">
              <img 
                src="https://images.pexels.com/photos/3387577/pexels-photo-3387577.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                alt="Detalle de diseño consciente" 
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}