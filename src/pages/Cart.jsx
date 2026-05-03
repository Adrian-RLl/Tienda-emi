import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Cart() {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, vaciarCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({ nombre: '', dni: '', telefono: '', direccion: '', referencia: '' });
  const [procesando, setProcesando] = useState(false);

  const total = carrito.reduce((sum, item) => sum + ((item.precio_oferta || item.precio) * item.cantidad), 0);

  const handleProcesarPedido = async (e) => {
    e.preventDefault();
    if (!cliente.nombre || !cliente.telefono || !cliente.dni) {
      alert("Por favor, ingresa tu nombre, DNI y teléfono.");
      return;
    }
    
    setProcesando(true);

    try {
      // 1. Crear la Orden (Pendiente)
      const { data: orden, error: errorOrden } = await supabase
        .from('orders')
        .insert([{
          nombre_cliente: cliente.nombre,
          dni_cliente: cliente.dni,
          telefono_cliente: cliente.telefono,
          direccion_cliente: cliente.direccion,
          referencia_cliente: cliente.referencia,
          total: total,
          estado: 'Pendiente'
        }])
        .select()
        .single();

      if (errorOrden) throw errorOrden;

      // 2. Crear los Ítems de la Orden
      const itemsParaInsertar = carrito.map(item => ({
        order_id: orden.id,
        producto_id: item.id,
        nombre_producto: item.nombre,
        talla: item.talla,
        cantidad: item.cantidad,
        precio_unitario: item.precio_oferta || item.precio
      }));

      const { error: errorItems } = await supabase.from('order_items').insert(itemsParaInsertar);
      if (errorItems) throw errorItems;

      // 3. Generar mensaje de WhatsApp
      const resumen = carrito.map(item => {
        const precioUnitario = item.precio_oferta || item.precio;
        return `• ${item.nombre} (Talla: ${item.talla} | Cant: ${item.cantidad}) - S/${(precioUnitario * item.cantidad).toFixed(2)}`;
      }).join('\n');

      const idCorto = orden.id.split('-')[0].toUpperCase();
      const refTexto = cliente.referencia ? ` (Ref: ${cliente.referencia})` : '';
      const dirTexto = cliente.direccion ? `${cliente.direccion}${refTexto}` : 'Recojo en tienda';

      const mensaje = `¡Hola EMI! ✨ Acabo de registrar el pedido *#${idCorto}* en su web.\n\n` +
                      `*Cliente:* ${cliente.nombre}\n` +
                      `*DNI:* ${cliente.dni}\n` +
                      `*Envío a:* ${dirTexto}\n\n` +
                      `${resumen}\n\n*Total a pagar: S/${total.toFixed(2)}*\n\n` +
                      `Espero la confirmación para realizar el pago.`;
      
      const numeroWhatsApp = "51975038989"; 
      window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');

      // 4. Limpiar y redirigir
      vaciarCarrito();
      navigate('/productos');
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert(`Error de base de datos: ${error.message || JSON.stringify(error)}. \n\n¿Ejecutaste el script SQL para crear/actualizar la tabla?`);
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-6">Tu bolsa está vacía</h2>
        <Link to="/productos" className="text-sm font-medium uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-12 text-gray-900 border-b border-gray-100 pb-6">Tu Bolsa</h1>
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="lg:w-[55%] space-y-10">
            {carrito.map((item, index) => {
              const limiteStock = item[`stock_${item.talla.toLowerCase()}`] || 0;
              const alcanzoLimite = item.cantidad >= limiteStock;

              return (
                <div key={`${item.id}-${item.talla}-${index}`} className="flex gap-6 border-b border-gray-50 pb-8">
                  <div className="w-28 h-36 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-medium text-gray-900">{item.nombre}</h3>
                        <button 
                          onClick={() => eliminarDelCarrito(item.id, item.talla)}
                          className="text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Talla: {item.talla}</p>
                      <div className="mt-2">
                        {item.precio_oferta && item.precio_oferta < item.precio ? (
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-red-600">S/ {item.precio_oferta.toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through">S/ {item.precio.toFixed(2)}</span>
                          </div>
                        ) : (
                          <p className="text-base font-medium text-gray-900">S/ {item.precio.toFixed(2)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => disminuirCantidad(item.id, item.talla)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.cantidad}</span>
                        <button 
                          disabled={alcanzoLimite}
                          onClick={() => aumentarCantidad(item.id, item.talla)}
                          className={`w-10 h-10 flex items-center justify-center transition-colors ${alcanzoLimite ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          +
                        </button>
                      </div>
                      {alcanzoLimite && <span className="text-xs text-red-500 font-medium">Límite de stock</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHECKOUT FORM */}
          <div className="lg:w-[45%]">
            <div className="bg-gray-50 p-8 sticky top-28 rounded-xl border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Detalles de Envío</h2>
              
              <form onSubmit={handleProcesarPedido} className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombre Completo *</label>
                  <input 
                    required
                    type="text" 
                    value={cliente.nombre}
                    onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">DNI / CE *</label>
                    <input 
                      required
                      type="text" 
                      value={cliente.dni}
                      onChange={(e) => setCliente({...cliente, dni: e.target.value})}
                      className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp / Teléfono *</label>
                    <input 
                      required
                      type="tel" 
                      value={cliente.telefono}
                      onChange={(e) => setCliente({...cliente, telefono: e.target.value})}
                      className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Dirección de Envío (Opcional)</label>
                  <input 
                    type="text" 
                    value={cliente.direccion}
                    onChange={(e) => setCliente({...cliente, direccion: e.target.value})}
                    placeholder="Ej. Av. Principal 123, Distrito"
                    className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Referencia (Opcional)</label>
                  <input 
                    type="text" 
                    value={cliente.referencia}
                    onChange={(e) => setCliente({...cliente, referencia: e.target.value})}
                    placeholder="Ej. Al frente del parque, puerta verde"
                    className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>

                <div className="pt-8 mb-4">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-gray-900 text-xs text-right">Se coordinará por WhatsApp</span>
                  </div>
                  <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                    <span className="text-base font-medium text-gray-900">Total a Pagar</span>
                    <span className="text-2xl font-semibold text-gray-900">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={procesando}
                  className="w-full bg-gray-900 text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {procesando ? 'Procesando...' : 'Confirmar Pedido'}
                  {!procesando && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </form>

              <Link to="/productos" className="block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                ← Volver al catálogo
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}