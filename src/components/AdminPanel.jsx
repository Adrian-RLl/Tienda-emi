import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [p, setP] = useState({ 
    nombre: '', precio: '', imagen_url: '', tallas: '', stock: '', descripcion: '' 
  });
  
  const [listaProductos, setListaProductos] = useState([]); 
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // Para saber si estamos editando o creando

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) console.error("Error al cargar:", error);
    else setListaProductos(data || []);
  };

  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tienda_emi');

    setCargando(true);
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dimwfjv9c/image/upload", { 
        method: "POST", body: formData 
      });
      const data = await res.json();
      if (data.secure_url) setP({ ...p, imagen_url: data.secure_url });
    } catch (error) {
      alert("Error al subir imagen");
    } finally {
      setCargando(false);
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    const datosProducto = {
      nombre: p.nombre,
      precio: parseFloat(p.precio),
      descripcion: p.descripcion,
      imagen_url: p.imagen_url,
      tallas: p.tallas,
      stock: parseInt(p.stock)
    };

    if (editandoId) {
      // MODO EDICIÓN: Update
      const { error } = await supabase.from('products').update(datosProducto).eq('id', editandoId);
      if (error) alert("Error al actualizar: " + error.message);
      else {
        alert("¡Producto actualizado!");
        setEditandoId(null);
      }
    } else {
      // MODO CREACIÓN: Insert
      const { error } = await supabase.from('products').insert([datosProducto]);
      if (error) alert("Error al guardar: " + error.message);
      else alert("¡Producto publicado!");
    }

    setP({ nombre: '', precio: '', imagen_url: '', tallas: '', stock: '', descripcion: '' });
    fetchProductos();
  };

  const prepararEdicion = (prod) => {
    setEditandoId(prod.id);
    setP({
      nombre: prod.nombre,
      precio: prod.precio,
      imagen_url: prod.imagen_url,
      tallas: prod.tallas,
      stock: prod.stock,
      descripcion: prod.descripcion
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ajustarStockRapido = async (id, nuevoStock) => {
    if (nuevoStock < 0) return;
    await supabase.from('products').update({ stock: nuevoStock }).eq('id', id);
    fetchProductos();
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro quieres borrar este producto?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProductos();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* FORMULARIO DINÁMICO */}
      <form onSubmit={guardarProducto} className={`p-8 rounded-3xl shadow-lg border mb-10 space-y-4 transition-colors ${editandoId ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6">{editandoId ? '📝 Editando Producto' : '🛍️ Añadir Nuevo Producto'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border rounded-xl" placeholder="Nombre" value={p.nombre} onChange={e => setP({...p, nombre: e.target.value})} required />
          <input className="p-3 border rounded-xl" placeholder="Precio (S/)" type="number" value={p.precio} onChange={e => setP({...p, precio: e.target.value})} required />
          <input className="p-3 border rounded-xl" placeholder="Tallas (ej: S, M, L)" value={p.tallas} onChange={e => setP({...p, tallas: e.target.value})} required />
          <input className="p-3 border rounded-xl" placeholder="Stock" type="number" value={p.stock} onChange={e => setP({...p, stock: e.target.value})} required />
        </div>
        
        <textarea className="w-full p-3 border rounded-xl" placeholder="Descripción" value={p.descripcion} onChange={e => setP({...p, descripcion: e.target.value})} required />
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-dashed border-2">
            <input type="file" onChange={subirImagen} className="text-sm" />
            {p.imagen_url && <img src={p.imagen_url} className="w-16 h-16 object-cover rounded-lg border" alt="preview" />}
            {cargando && <p className="text-blue-500 animate-bounce">Subiendo...</p>}
        </div>
        
        <div className="flex gap-2">
          <button type="submit" className={`flex-1 p-4 rounded-xl font-bold text-white transition ${editandoId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}>
            {editandoId ? 'Actualizar Cambios' : 'Publicar Producto'}
          </button>
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setP({ nombre: '', precio: '', imagen_url: '', tallas: '', stock: '', descripcion: '' }); }} className="bg-gray-300 px-6 rounded-xl font-bold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA DE INVENTARIO MEJORADA */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inventario Real</h2>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4">Producto</th>
              <th className="p-4 text-center">Tallas</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listaProductos.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <img src={prod.imagen_url} className="w-14 h-14 object-cover rounded-xl shadow-sm" alt="prod" />
                  <div>
                    <p className="font-bold text-gray-900">{prod.nombre}</p>
                    <p className="text-sm text-green-600 font-bold">S/{prod.precio}</p>
                  </div>
                </td>
                <td className="p-4 text-center text-sm font-medium text-gray-600">{prod.tallas}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => ajustarStockRapido(prod.id, prod.stock - 1)} className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 border">-</button>
                    <span className="font-bold w-6 text-center">{prod.stock}</span>
                    <button onClick={() => ajustarStockRapido(prod.id, prod.stock + 1)} className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 border">+</button>
                  </div>
                </td>
                <td className="p-4 text-center">
                  {prod.stock > 0 
                    ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">DISPONIBLE</span>
                    : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">SIN STOCK</span>
                  }
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => prepararEdicion(prod)} className="text-blue-500 hover:text-blue-700 text-xl" title="Editar">✏️</button>
                    <button onClick={() => eliminarProducto(prod.id)} className="text-red-400 hover:text-red-600 text-xl" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}