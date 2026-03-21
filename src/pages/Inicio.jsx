import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div className="bg-white">
      
      {/* SECCIÓN HERO (Presentación de Marca) 
          h-[calc(100vh-80px)]: Altura total de pantalla menos Navbar.
      */}
      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
        
        {/* IMAGEN DE FONDO (Utiliza una foto artística de tu colección)
            Usamos object-cover para que llene sin deformarse.
        */}
        <img 
          // Esta es una imagen de portada fija y segura
          src="https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=2000" // <--- Foto 1 Principal
          alt="Portada Colección EMI" 
          className="w-full h-full object-cover object-center animate-fadeInScale scale-105" 
        />
        
        {/* Superposición Oscura sutil (overlay) */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

        {/* CONTENIDO TEXTUAL CENTRADO */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-white text-xs md:text-sm font-black tracking-[0.4em] uppercase mb-4 animate-fadeInDown">
            Colección Exclusiva 2026
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-serif font-bold tracking-tight leading-none mb-10 animate-fadeInScale">
            La elegancia <br /> de lo simple
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed mb-12 animate-fadeInUp">
            Descubre piezas atemporales diseñadas para resaltar tu feminidad natural. Vestidos que cuentan historias, para cada momento de tu vida.
          </p>
          
          {/* BOTÓN DE ACCIÓN (Call to Action) */}
          <Link 
            to="/productos" 
            className="group relative bg-[#7A1F1F] text-white px-12 py-5 rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-all duration-500 shadow-xl shadow-[#7A1F1F]/20 active:scale-95 animate-fadeInUp"
          >
            Ver Colección
            {/* Pequeño destello de hover */}
            <span className="absolute inset-0 rounded-full border border-white/30 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700"></span>
          </Link>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Texto de Marca y Manifiesto (La de tu captura) */}
      <section className="max-w-7xl mx-auto py-24 px-6 text-left">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="text-[#7A1F1F] text-xs font-black uppercase tracking-[0.3em]">Nuestra Esencia</h2>
            <p className="text-4xl font-serif text-slate-900 max-w-2xl leading-tight">
              Diseño consciente para momentos inolvidables.
            </p>
            <p className="text-gray-500 max-w-xl leading-relaxed">
              En <b>EMI</b>, creemos que la moda debe ser una extensión de tu personalidad. Cada una de nuestras piezas es seleccionada y confeccionada pensando en la versatilidad y el impacto visual.
            </p>
            <Link 
              to="/nosotros" 
              className="inline-block text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#7A1F1F] hover:border-[#7A1F1F] transition-colors"
            >
              Conoce nuestra historia →
            </Link>
          </div>
          
          {/* LADO DERECHO: Grid de dos fotos que antes fallaban */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Foto 1 (La de la izquierda, que salía blanca) */}
            <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg translate-y-8 bg-gray-50">
              <img 
                // Usamos un enlace más robusto para que no vuelva a fallar
                src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800" // <--- Foto 2 (Izquierda)
                className="w-full h-full object-cover" 
                alt="Detalle de diseño conscious" 
              />
            </div>
            
            {/* Foto 2 (La de la derecha, que salía blanca) */}
            <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg bg-gray-50">
              <img 
                // Usamos otro enlace seguro para esta foto
                src="https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=800" // <--- Foto 3 (Derecha)
                className="w-full h-full object-cover" 
                alt="Versatilidad en cada prenda" 
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}