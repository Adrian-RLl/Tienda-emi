import { useState } from 'react';
import Sidebar from './Admin/Sidebar';
import GestionProductos from './Admin/GestionProductos';
import InventarioTallas from './Admin/InventarioTallas';
import Ventas from './Admin/Ventas';

export default function Admin() {
  const [tabActual, setTabActual] = useState('productos');
  const [productoEditando, setProductoEditando] = useState(null);

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto);
    setTabActual('productos');
  };

  return (
    <div className="flex bg-zinc-950 min-h-screen text-zinc-300 selection:bg-zinc-800 font-sans">
      
      {/* 1. SIDEBAR */}
      <Sidebar tabActual={tabActual} setTabActual={setTabActual} />

      {/* 2. ÁREA DE CONTENIDO */}
      <main className="flex-1 p-8 lg:p-12 xl:p-16 transition-all duration-300 h-screen overflow-y-auto">
        
        {tabActual === 'productos' && (
          <div className="animate-fadeInScale max-w-5xl mx-auto">
             <GestionProductos 
               productoEditando={productoEditando} 
               setProductoEditando={setProductoEditando} 
             />
          </div>
        )}
        
        {tabActual === 'stock' && (
          <div className="animate-fadeInScale max-w-6xl mx-auto">
            <InventarioTallas 
              onEdit={iniciarEdicion}
            />
          </div>
        )}
        
        {tabActual === 'ventas' && (
          <Ventas />
        )}

      </main>
    </div>
  );
}