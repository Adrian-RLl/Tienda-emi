import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Cart() {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, vaciarCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({ nombre: '', dni: '', telefono: '', detalleEntrega: '', referencia: '' });
  const [tipoEntrega, setTipoEntrega] = useState('Ica');
  const [metodoPago, setMetodoPago] = useState('Yape');
  const [procesando, setProcesando] = useState(false);
  
  // Estados para el Modal de Éxito
  const [pedidoCompletado, setPedidoCompletado] = useState(false);
  const [ordenInfo, setOrdenInfo] = useState({ id: '', linkWhatsApp: '' });

  const total = carrito.reduce((sum, item) => sum + ((item.precio_oferta || item.precio) * item.cantidad), 0);

  const handleProcesarPedido = async (e) => {
    e.preventDefault();
    if (!cliente.nombre || !cliente.telefono || !cliente.dni) {
      alert("Por favor, ingresa tu nombre, DNI y teléfono.");
      return;
    }
    
    setProcesando(true);

    try {
      // 0. VERIFICACIÓN DE STOCK EN TIEMPO REAL
      const idsProductos = carrito.map(item => item.id);
      const { data: productosBd, error: errorStock } = await supabase
        .from('products')
        .select('id, nombre, stock_xs, stock_s, stock_m, stock_l, stock_xl, stock_xxl')
        .in('id', idsProductos);

      if (errorStock) throw errorStock;

      for (const item of carrito) {
        const prodBd = productosBd.find(p => p.id === item.id);
        if (!prodBd) {
          alert(`El producto "${item.nombre}" ya no existe en el catálogo.`);
          setProcesando(false);
          return;
        }
        const stockDisponible = prodBd[`stock_${item.talla.toLowerCase()}`] || 0;
        if (item.cantidad > stockDisponible) {
          alert(`Lo sentimos, el stock disponible para "${item.nombre}" en talla ${item.talla} ha cambiado a ${stockDisponible} unidades. Por favor ajusta tu carrito.`);
          setProcesando(false);
          return;
        }
      }

      // 1. Crear la Orden
      const referenciaConPago = `[Pago: ${metodoPago}] ${cliente.referencia || ''}`.trim();
      const direccionCompleta = `[${tipoEntrega === 'Ica' ? 'Punto Ica' : 'Agencia Shalom'}] ${cliente.detalleEntrega || ''}`.trim();

      const { data: orden, error: errorOrden } = await supabase
        .from('orders')
        .insert([{
          nombre_cliente: cliente.nombre,
          dni_cliente: cliente.dni,
          telefono_cliente: cliente.telefono,
          direccion_cliente: direccionCompleta,
          referencia_cliente: referenciaConPago,
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
      const entregaTexto = tipoEntrega === 'Ica' ? `Punto en Ica: ${cliente.detalleEntrega}` : `Agencia Shalom: ${cliente.detalleEntrega}`;
      const refTexto = cliente.referencia ? ` (Ref: ${cliente.referencia})` : '';

      const mensaje = `¡Hola EMI! ✨ Acabo de registrar el pedido *#${idCorto}* en su web.\n\n` +
                      `*Cliente:* ${cliente.nombre}\n` +
                      `*DNI:* ${cliente.dni}\n` +
                      `*Entrega:* ${entregaTexto}${refTexto}\n` +
                      `*Método de Pago:* ${metodoPago}\n\n` +
                      `${resumen}\n\n*Total a pagar: S/${total.toFixed(2)}*\n\n` +
                      `Espero la confirmación para enviar el comprobante de pago.`;
      
      const numeroWhatsApp = "51975038989"; 
      const linkWa = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      
      setOrdenInfo({ id: idCorto, linkWhatsApp: linkWa });
      setPedidoCompletado(true);
      vaciarCarrito();
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert(`Error al procesar el pedido: ${error.message || JSON.stringify(error)}`);
    } finally {
      setProcesando(false);
    }
  };

  if (pedidoCompletado) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-3 font-serif tracking-tight">¡Pedido Confirmado!</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
          Tu orden <span className="font-semibold text-gray-900">#{ordenInfo.id}</span> ha sido registrada. Solo falta un paso para completarla.
        </p>
        
        <div className="space-y-4 w-full max-w-xs">
          <a 
            href={ordenInfo.linkWhatsApp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-4 px-6 text-sm font-medium uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Pagar por WhatsApp
          </a>
          <Link 
            to="/productos" 
            className="block w-full bg-white text-gray-900 border border-gray-200 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <svg className="w-20 h-20 text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-medium text-gray-900 mb-4 font-serif">Tu bolsa está vacía</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md font-light leading-relaxed">Parece que aún no has agregado ninguna prenda a tu bolsa. Descubre nuestras últimas piezas y encuentra tu nuevo favorito.</p>
        <Link to="/productos" className="bg-gray-900 text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-black transition-colors shadow-md">
          Explorar Colección
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-12 text-gray-900 border-b border-gray-100 pb-6 font-serif">Tu Bolsa</h1>
        
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">DNI / CE *</label>
                    <input 
                      required
                      type="text" 
                      pattern="[0-9]{8,9}"
                      maxLength="9"
                      title="Debe tener 8 o 9 dígitos numéricos"
                      value={cliente.dni}
                      onChange={(e) => setCliente({...cliente, dni: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp / Teléfono *</label>
                    <input 
                      required
                      type="tel" 
                      pattern="[0-9]{9}"
                      maxLength="9"
                      title="Debe tener exactamente 9 dígitos numéricos"
                      value={cliente.telefono}
                      onChange={(e) => setCliente({...cliente, telefono: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* MÉTODO DE ENTREGA */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Método de Entrega *</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <label className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${tipoEntrega === 'Ica' ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="entrega" value="Ica" className="sr-only" checked={tipoEntrega === 'Ica'} onChange={(e) => setTipoEntrega(e.target.value)} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-center">Punto de Entrega<br/>en Ica</span>
                    </label>
                    <label className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${tipoEntrega === 'Shalom' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="entrega" value="Shalom" className="sr-only" checked={tipoEntrega === 'Shalom'} onChange={(e) => setTipoEntrega(e.target.value)} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-center">Envío Agencia<br/>Shalom</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {tipoEntrega === 'Ica' ? 'Lugar preferido para la entrega en Ica *' : 'Datos y Ciudad de la Agencia Shalom *'}
                  </label>
                  <input 
                    required
                    type="text" 
                    value={cliente.detalleEntrega}
                    onChange={(e) => setCliente({...cliente, detalleEntrega: e.target.value})}
                    placeholder={tipoEntrega === 'Ica' ? 'Ej. Plaza de Armas, Quinde, etc.' : 'Ej. Agencia Shalom Cusco Centro'}
                    className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Indicaciones Adicionales (Opcional)</label>
                  <input 
                    type="text" 
                    value={cliente.referencia}
                    onChange={(e) => setCliente({...cliente, referencia: e.target.value})}
                    placeholder="Algún detalle adicional"
                    className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors text-sm"
                  />
                </div>

                {/* MÉTODO DE PAGO */}
                <div className="pt-4 pb-2">
                  <label className="block text-xs font-medium text-gray-500 mb-3">Método de Pago Preferido</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${metodoPago === 'Yape' ? 'border-purple-500 bg-purple-50/30 text-purple-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="pago" value="Yape" className="sr-only" checked={metodoPago === 'Yape'} onChange={(e) => setMetodoPago(e.target.value)} />
                      <span className="text-xs font-semibold uppercase tracking-wider mt-1">Yape</span>
                    </label>
                    <label className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${metodoPago === 'Plin' ? 'border-teal-500 bg-teal-50/30 text-teal-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="pago" value="Plin" className="sr-only" checked={metodoPago === 'Plin'} onChange={(e) => setMetodoPago(e.target.value)} />
                      <span className="text-xs font-semibold uppercase tracking-wider mt-1">Plin</span>
                    </label>
                    <label className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${metodoPago === 'Transferencia' ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="pago" value="Transferencia" className="sr-only" checked={metodoPago === 'Transferencia'} onChange={(e) => setMetodoPago(e.target.value)} />
                      <span className="text-xs font-semibold uppercase tracking-wider mt-1">Banco</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 mb-4">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Envío / Entrega</span>
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