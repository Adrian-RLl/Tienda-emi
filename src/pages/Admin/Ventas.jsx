import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Ventas() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function traerPedidos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPedidos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    traerPedidos();
  }, []);

  const generarComprobante = (pedido) => {
    try {
      const doc = new jsPDF();
      const centro = 105;

      // Header (Centrado)
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("MODAS EMI", centro, 25, null, null, "center");

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      //doc.text("RUC: 20123456789", centro, 32, null, null, "center");
      doc.text("La Tinguiña, Ica, Perú", centro, 38, null, null, "center");

      // Separador
      doc.setDrawColor(200);
      doc.line(14, 45, 196, 45);

      // Título Comprobante y N° Orden (Centrado)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("COMPROBANTE DE PAGO", centro, 55, null, null, "center");

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const idCorto = pedido.id.split('-')[0].toUpperCase();
      doc.text(`N° Orden: #${idCorto}  |  Fecha: ${formatearFecha(pedido.created_at)}`, centro, 62, null, null, "center");

      // Datos del Cliente (Alineado a la izquierda)
      doc.setFont("helvetica", "bold");
      doc.text("Facturado a:", 14, 75);
      doc.setFont("helvetica", "normal");
      doc.text(`Nombre: ${pedido.nombre_cliente}`, 14, 82);

      let nextY = 88;
      if (pedido.dni_cliente) {
        doc.text(`DNI / CE: ${pedido.dni_cliente}`, 14, nextY);
        nextY += 6;
      }
      doc.text(`Teléfono: ${pedido.telefono_cliente}`, 14, nextY);
      nextY += 6;

      if (pedido.direccion_cliente) {
        doc.text(`Dirección: ${pedido.direccion_cliente}`, 14, nextY);
        nextY += 6;
      }
      if (pedido.referencia_cliente) {
        doc.text(`Referencia: ${pedido.referencia_cliente}`, 14, nextY);
        nextY += 6;
      }

      // Tabla de Items
      const tableColumn = ["Cant", "Descripción", "Talla", "P. Unit", "Subtotal"];
      const tableRows = [];

      if (pedido.order_items && pedido.order_items.length > 0) {
        pedido.order_items.forEach(item => {
          const row = [
            item.cantidad,
            item.nombre_producto,
            item.talla,
            `S/ ${item.precio_unitario.toFixed(2)}`,
            `S/ ${(item.precio_unitario * item.cantidad).toFixed(2)}`
          ];
          tableRows.push(row);
        });
      } else {
        tableRows.push(["-", "Sin items registrados", "-", "-", "-"]);
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: Math.max(102, nextY + 5),
        theme: 'grid',
        headStyles: { fillColor: [39, 39, 42], halign: 'center' },
        columnStyles: {
          0: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        alternateRowStyles: { fillColor: [250, 250, 250] }
      });

      // Total
      const finalY = doc.lastAutoTable?.finalY || 110;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`TOTAL PAGADO: S/ ${pedido.total.toFixed(2)}`, 196, finalY + 15, null, null, "right");

      // Footer
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text("¡Gracias por confiar en Modas EMI! ✨", centro, 280, null, null, "center");

      doc.save(`Comprobante_EMI_${idCorto}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Hubo un error al generar el PDF. Revisa la consola.");
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    if (nuevoEstado === 'Pagado') {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido && pedido.estado !== 'Pagado') {
        for (const item of pedido.order_items) {
          const { data: producto } = await supabase.from('products').select(`stock_${item.talla.toLowerCase()}`).eq('id', item.producto_id).single();

          if (producto) {
            const stockAnterior = producto[`stock_${item.talla.toLowerCase()}`] || 0;
            const nuevoStock = Math.max(0, stockAnterior - item.cantidad);

            await supabase.from('products').update({
              [`stock_${item.talla.toLowerCase()}`]: nuevoStock
            }).eq('id', item.producto_id);
          }
        }
      }
    }

    const { error } = await supabase.from('orders').update({ estado: nuevoEstado }).eq('id', id);
    if (!error) {
      traerPedidos();
      if (nuevoEstado === 'Pagado') {
        const pedidoObj = pedidos.find(p => p.id === id);
        if (window.confirm("Pedido marcado como PAGADO. ¿Deseas descargar el comprobante ahora?")) {
          generarComprobante(pedidoObj);
        }
      }
    } else {
      alert("Error al actualizar el estado del pedido.");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const [busqueda, setBusqueda] = useState('');

  const pedidosFiltrados = pedidos.filter(pedido => {
    const idCorto = pedido.id.split('-')[0].toUpperCase();
    const termino = busqueda.toLowerCase();
    return idCorto.toLowerCase().includes(termino) ||
      pedido.nombre_cliente.toLowerCase().includes(termino);
  });

  if (loading) {
    return <div className="text-zinc-500 animate-pulse p-10">Cargando historial de ventas...</div>;
  }

  return (
    <div className="p-4 md:p-10 animate-fadeInScale max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Historial de Ventas</h1>
          <p className="text-zinc-500 text-sm">Gestiona los pedidos y el estado de los pagos</p>
        </div>
        <div className="bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800 w-full md:w-auto flex items-center gap-3">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Buscar por código o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-transparent outline-none text-sm text-zinc-300 w-full md:w-64"
          />
        </div>
      </header>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-500">
            {busqueda ? "No se encontraron pedidos con esa búsqueda." : "Aún no hay pedidos registrados."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-white">Orden #{pedido.id.split('-')[0].toUpperCase()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${pedido.estado === 'Pendiente' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      pedido.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                      {pedido.estado}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{formatearFecha(pedido.created_at)}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {pedido.estado === 'Pendiente' && (
                    <>
                      <button
                        onClick={() => actualizarEstado(pedido.id, 'Pagado')}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-lg transition-colors border border-emerald-500/20"
                      >
                        Aprobar Pago
                      </button>
                      <button
                        onClick={() => actualizarEstado(pedido.id, 'Cancelado')}
                        className="flex-1 md:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {pedido.estado === 'Pagado' && (
                    <>
                      <button
                        onClick={() => generarComprobante(pedido)}
                        className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Comprobante
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/${pedido.telefono_cliente.replace(/\D/g, '')}`, '_blank')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Contactar
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 bg-zinc-900/50 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">Cliente</p>
                    <p className="text-sm text-zinc-300">{pedido.nombre_cliente}</p>
                    {pedido.dni_cliente && <p className="text-sm text-zinc-400">DNI: {pedido.dni_cliente}</p>}
                    <p className="text-sm text-zinc-400">Telf: {pedido.telefono_cliente}</p>
                  </div>
                  {(pedido.direccion_cliente || pedido.referencia_cliente) && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">Dirección de Envío</p>
                      {pedido.direccion_cliente && <p className="text-sm text-zinc-300">{pedido.direccion_cliente}</p>}
                      {pedido.referencia_cliente && <p className="text-sm text-zinc-400 italic">Ref: {pedido.referencia_cliente}</p>}
                    </div>
                  )}
                </div>

                <div className="flex-[2]">
                  <p className="text-xs font-medium text-zinc-500 mb-3">Artículos del Pedido</p>
                  <div className="space-y-3">
                    {pedido.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                        <div className="flex gap-3 items-center">
                          <span className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-400">{item.cantidad}x</span>
                          <span className="text-zinc-300">{item.nombre_producto}</span>
                          <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">Talla {item.talla}</span>
                        </div>
                        <span className="text-zinc-400 font-medium">S/ {(item.precio_unitario * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-end">
                    <span className="text-sm font-medium text-zinc-400">Total pagado</span>
                    <span className="text-xl font-semibold text-white">S/ {pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
