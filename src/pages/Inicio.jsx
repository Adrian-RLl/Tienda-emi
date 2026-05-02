import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div className="bg-white">
      
      {/* SECCIÓN HERO (Presentación de Marca) */}
      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
        
        <img 
          src="https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=2000"
          alt="Portada Colección EMI" 
          className="w-full h-full object-cover object-center animate-fadeInScale scale-100" 
        />
        
        {/* Superposición más sutil */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* CONTENIDO TEXTUAL CENTRADO */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase mb-6 animate-fadeInDown">
            Colección Exclusiva 2026
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8 animate-fadeInScale">
            La elegancia de lo simple
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed mb-10 animate-fadeInUp font-light">
            Descubre piezas atemporales diseñadas para resaltar tu feminidad natural. Vestidos que cuentan historias, para cada momento de tu vida.
          </p>
          
          {/* BOTÓN DE ACCIÓN */}
          <Link 
            to="/productos" 
            className="group relative bg-white text-gray-900 px-10 py-4 rounded-none font-medium text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 animate-fadeInUp"
          >
            Ver Colección
          </Link>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Texto de Marca y Manifiesto */}
      <section className="max-w-7xl mx-auto py-24 px-6 text-left">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h2 className="text-gray-500 text-sm font-medium uppercase tracking-[0.2em]">Nuestra Esencia</h2>
            <p className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-2xl leading-tight tracking-tight">
              Diseño consciente para momentos inolvidables.
            </p>
            <p className="text-gray-600 text-lg max-w-xl leading-relaxed font-light">
              En EMI, creemos que la moda debe ser una extensión de tu personalidad. Cada una de nuestras piezas es seleccionada y confeccionada pensando en la versatilidad y el impacto visual.
            </p>
            <Link 
              to="/nosotros" 
              className="inline-block text-sm font-medium uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Conoce nuestra historia
            </Link>
          </div>
          
          {/* LADO DERECHO: Grid de dos fotos */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="aspect-[3/4] overflow-hidden translate-y-12 bg-gray-50">
              <img 
                src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                alt="Detalle de diseño conscious" 
              />
            </div>
            
            <div className="aspect-[3/4] overflow-hidden bg-gray-50">
              <img 
                src="https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=800"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                alt="Versatilidad en cada prenda" 
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}