import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
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

  const sinStock = producto.stock <= 0;

  return (
    // min-h-screen para que el fondo crema cubra todo
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center p-4 md:p-10">
      
      {/* max-w-6xl: permite que crezca en pantallas grandes.
        w-full: asegura que ocupe el ancho disponible en pantallas medianas.
        grid-cols-1 md:grid-cols-2: 1 columna en móvil, 2 en PC.
      */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        
        {/* LADO IZQUIERDO: IMAGEN 
            h-full y min-h-[400px] para que la imagen tenga presencia.
        */}
        <div className="relative h-[450px] md:h-[600px] lg:h-[700px] bg-gray-50">
          <img 
            src={producto.imagen_url} 
            alt={producto.nombre} 
            className={`w-full h-full object-cover ${sinStock ? 'grayscale opacity-50' : ''}`} 
          />
          <Link 
            to="/productos" 
            className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-800 hover:scale-110 transition shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </Link>
        </div>

        {/* LADO DERECHO: CONTENIDO
            p-8 md:p-12 para que no se vea apretado.
        */}
        <div className="flex flex-col justify-center p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-[#7A1F1F] text-xs font-black tracking-[0.2em] uppercase">Nueva Colección</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-none capitalize">
              {producto.nombre}
            </h1>
            <p className="text-3xl font-light text-slate-500">S/ {producto.precio.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${sinStock ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {sinStock ? 'Sin unidades' : `Disponibles: ${producto.stock}`}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base italic">
              "{producto.descripcion}"
            </p>
          </div>

          {/* TALLAS CON BOTONES MÁS GRANDES */}
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Selecciona Talla</p>
            <div className="flex gap-3">
              {['S', 'M', 'L'].map((t) => (
                <button
                  key={t}
                  disabled={sinStock}
                  onClick={() => setTallaSeleccionada(t)}
                  className={`h-12 w-14 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${
                    tallaSeleccionada === t 
                    ? 'bg-[#7A1F1F] border-[#7A1F1F] text-white shadow-lg' 
                    : 'border-gray-100 text-slate-400 hover:border-[#7A1F1F] hover:text-[#7A1F1F]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* BOTÓN DE COMPRA */}
          <button 
            disabled={sinStock}
            onClick={() => agregarAlCarrito({...producto, talla: tallaSeleccionada})}
            className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all duration-300 ${
              sinStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#7A1F1F] text-white hover:bg-black hover:shadow-2xl active:scale-95'
            }`}
          >
            {sinStock ? 'AGOTADO' : 'AÑADIR AL CARRITO'}
          </button>
        </div>
      </div>
    </div>
  );
}