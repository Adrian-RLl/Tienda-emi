import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/productCard';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchProductos(termino) {
    let query = supabase.from('products').select('*');
    if (termino) {
      query = query.ilike('nombre', `%${termino}%`);
    }
    const { data } = await query;
    setProductos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProductos(busqueda);
  }, [busqueda]);

  if (loading) return null;

  return (
    // max-w-7xl: El ancho máximo para contener las 4 columnas cómodamente
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-serif text-[#2D2D2D] mb-8 text-center tracking-tight">
          Nuestro Catálogo
        </h1>
        
        {/* Barra de búsqueda compacta */}
        <div className="mb-14 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full max-w-sm p-3.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7A1F1F]/20 outline-none shadow-sm text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LÓGICA DEL GRID 
            grid-cols-2: 2 columnas en celulares.
            md:grid-cols-3: 3 columnas en tablets.
            lg:grid-cols-4: <--- EL CAMBIO: 4 COLUMNAS EN PC (Desktop).
            gap-6: Espaciado equilibrado para 4 columnas.
        */}
        {productos.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic">No hay piezas en la colección actual.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((item) => (
              <ProductCard key={item.id} producto={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}