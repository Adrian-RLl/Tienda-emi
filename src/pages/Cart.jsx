import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  // Extraemos tus funciones específicas del context
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito } = useContext(CartContext);

  // Cálculo del total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Tu lógica de envío por WhatsApp mejorada con formato
  const enviarPorWhatsApp = () => {
    const resumen = carrito.map(item => 
      `• ${item.nombre} (Talla: ${item.talla} | Cant: ${item.cantidad}) - S/${(item.precio * item.cantidad).toFixed(2)}`
    ).join('\n');

    const mensaje = `¡Hola EMI! ✨ Quiero realizar este pedido:\n\n${resumen}\n\n*Total a pagar: S/${total.toFixed(2)}*`;
    
    const numeroWhatsApp = "51975038989"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (carrito.length === 0) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif mb-4">Tu bolsa está vacía</h2>
        <Link to="/productos" className="text-[#7A1F1F] font-bold border-b-2 border-[#7A1F1F] pb-1 hover:text-black hover:border-black transition-all">
          DESCUBRIR LA COLECCIÓN
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-10 text-slate-900 border-b border-gray-100 pb-6">Tu Bolsa de Compras</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
          <div className="lg:w-2/3 space-y-8">
            {carrito.map((item, index) => (
              <div key={`${item.id}-${item.talla}-${index}`} className="flex gap-6 border-b border-gray-50 pb-8 group">
                {/* Imagen del producto (usando la URL de tu base de datos) */}
                <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{item.nombre}</h3>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id, item.talla)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-medium">Talla: {item.talla}</p>
                    <p className="text-sm font-serif font-bold text-[#7A1F1F] mt-2">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>

                  {/* CONTROLES DE CANTIDAD (Tus funciones) */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50/50">
                      <button 
                        onClick={() => disminuirCantidad(item.id, item.talla)}
                        className="px-3 py-1 text-gray-500 hover:text-black font-bold"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                      <button 
                        onClick={() => aumentarCantidad(item.id, item.talla)}
                        className="px-3 py-1 text-gray-500 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: RESUMEN FIJO */}
          <div className="lg:w-1/3">
            <div className="bg-[#FBFBFB] rounded-3xl p-8 sticky top-28 border border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Resumen de pedido</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-slate-800">S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Gratis</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <span className="text-sm font-black uppercase">Total</span>
                  <span className="text-xl font-serif font-bold text-[#7A1F1F]">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* TU BOTÓN DE WHATSAPP INTEGRADO AL DISEÑO */}
              <button 
                onClick={enviarPorWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
              >
                Finalizar compra por WhatsApp
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </button>

              <Link to="/productos" className="block text-center mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                ← Continuar comprando
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}