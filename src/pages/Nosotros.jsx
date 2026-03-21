import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* CABECERA: Enfoque en la Curaduría */}
      <div className="py-24 px-6 text-center bg-[#FBFBFB]">
        <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#7A1F1F] mb-4">Nuestra Identidad</h1>
        <p className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
          Conectando el Mundo <br /> con tu Estilo
        </p>
      </div>

      {/* SECCIÓN: LA HISTORIA (Importación con Propósito) */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-3xl font-serif text-slate-900 leading-tight">
              Moda Global, Esencia Local.
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              <b>EMI</b> nació con una visión clara: ser el puente entre las tendencias internacionales más exclusivas y la mujer que busca destacar. Actualmente, operamos como una <b>importadora especializada</b>, seleccionando cada pieza por su calidad y diseño único.
            </p>
            <p className="text-gray-600 leading-relaxed">
              No solo traemos ropa; traemos herramientas de <b>empoderamiento</b>. Sabemos que un vestido puede cambiar tu actitud, y por eso buscamos prendas que te hagan sentir imparable. Nuestra meta es clara: hoy importamos lo mejor del mundo, mañana crearemos nuestras propias piezas únicas para ti.
            </p>
            <div className="pt-4">
               <div className="flex items-center gap-4 text-[#7A1F1F]">
                  <div className="w-12 h-1px bg-[#7A1F1F]"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Ica, Perú</span>
               </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Selección de importación EMI" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: VISIÓN FUTURA (Lo que viene) */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">El Camino de EMI</h2>
          <p className="text-2xl md:text-3xl font-serif text-slate-800 italic">
            "Nuestra meta es evolucionar de la selección cuidadosa a la creación propia, manteniendo siempre el compromiso de hacerte brillar."
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl font-serif mb-10 text-slate-900">Descubre la selección de esta temporada</h2>
        <Link 
          to="/productos" 
          className="inline-block bg-[#7A1F1F] text-white px-14 py-5 rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-xl shadow-[#7A1F1F]/20"
        >
          Explorar Catálogo
        </Link>
      </section>
    </div>
  );
}