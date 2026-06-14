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
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 tracking-tight font-serif">
            Nuestra Colección
          </h1>
          
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Buscar modelo..."
              className="w-full p-4 pl-12 bg-gray-50 border-none rounded-none focus:ring-1 focus:ring-gray-900 outline-none transition-all text-sm font-medium"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">No hay piezas disponibles actualmente.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {productos.map((item) => {
              const tallasSoportadas = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
              const totalTallas = tallasSoportadas.reduce((acc, t) => acc + (item[`stock_${t}`] || 0), 0);
              const productoSincronizado = { ...item, stock: totalTallas };

              return (
                <ProductCard key={item.id} producto={productoSincronizado} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}