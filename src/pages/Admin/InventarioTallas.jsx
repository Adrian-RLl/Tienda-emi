import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function InventarioTallas({ onEdit }) {
  const [productos, setProductos] = useState([]);
  const [cambiosPendientes, setCambiosPendientes] = useState({});

  async function traerProductos() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProductos(data || []);
    setCambiosPendientes({});
  }

  useEffect(() => { traerProductos(); }, []);

  const manejarCambio = (id, columna, valor) => {
    // Actualizamos el estado visual local
    setProductos(productos.map(p => p.id === id ? { ...p, [columna]: valor === '' ? '' : parseFloat(valor) || 0 } : p));
    
    // Registramos el cambio pendiente
    setCambiosPendientes(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [columna]: valor === '' ? 0 : parseFloat(valor) || 0
      }
    }));
  };

  const guardarCambios = async (id) => {
    const cambios = cambiosPendientes[id];
    if (!cambios) return;

    const { error } = await supabase.from('products').update(cambios).eq('id', id);
    if (!error) {
      setCambiosPendientes(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      // Mensaje de éxito visual sin ser invasivo
      const btn = document.getElementById(`btn-guardar-${id}`);
      if (btn) {
        const text = btn.innerText;
        btn.innerText = "¡Guardado!";
        btn.classList.add("text-green-400");
        setTimeout(() => {
          btn.innerText = text;
          btn.classList.remove("text-green-400");
        }, 2000);
      }
    } else {
      alert("Error al guardar cambios.");
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto definitivamente?")) {
      await supabase.from('products').delete().eq('id', id);
      traerProductos();
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8 animate-fadeInScale">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Inventario</h1>
          <p className="text-zinc-500 text-sm">Control de stock y precios</p>
        </div>
        <div className="bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800 w-full md:w-auto flex items-center gap-3">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Buscar producto..." className="bg-transparent outline-none text-sm text-zinc-300 w-full md:w-64" />
        </div>
      </header>

      <div className="grid gap-4">
        {productos.map((p) => {
          const tieneCambios = !!cambiosPendientes[p.id];
          
          return (
          <div key={p.id} className="bg-zinc-900 rounded-2xl p-4 lg:p-6 border border-zinc-800/80 flex flex-col lg:flex-row lg:items-center gap-6 hover:border-zinc-700 transition-colors group">
            
            <div className="flex items-center gap-6 flex-1">
              <div className="w-20 h-28 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                <img src={p.imagen_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-1">{p.nombre}</h3>
                <div className="text-xs text-zinc-500 mb-3 font-mono">ID: {p.id}</div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm">S/</span>
                  <input 
                    type="number"
                    value={p.precio}
                    onChange={(e) => manejarCambio(p.id, 'precio', e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 w-24 text-white text-sm outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:border-l lg:border-zinc-800 lg:pl-8">
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  {['s', 'm', 'l'].map((t) => (
                    <div key={t} className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-500 uppercase text-center">{t}</label>
                      <input 
                        type="number"
                        value={p[`stock_${t}`]}
                        onChange={(e) => manejarCambio(p.id, `stock_${t}`, e.target.value)}
                        className="w-12 h-10 bg-zinc-950 border border-zinc-800 rounded-md text-center text-sm font-medium text-white focus:border-zinc-600 outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
                {tieneCambios && (
                  <button 
                    id={`btn-guardar-${p.id}`}
                    onClick={() => guardarCambios(p.id)}
                    className="text-xs font-medium bg-white text-zinc-900 py-1.5 rounded-md hover:bg-zinc-200 transition-colors mt-2 animate-fadeIn"
                  >
                    Guardar Cambios
                  </button>
                )}
              </div>
              
              <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
                <button onClick={() => onEdit(p)} className="flex-1 sm:flex-none text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-md transition-colors flex justify-center" title="Editar Galería y Textos">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button onClick={() => eliminarProducto(p.id)} className="flex-1 sm:flex-none text-zinc-400 hover:text-red-400 bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-md transition-colors flex justify-center" title="Eliminar Producto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            
          </div>
        )})}
      </div>
    </div>
  );
}