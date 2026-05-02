import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

export default function GestionProductos({ productoEditando, setProductoEditando }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' });
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (productoEditando) {
      setForm({
        nombre: productoEditando.nombre,
        descripcion: productoEditando.descripcion,
        precio: productoEditando.precio.toString(),
      });
      setImageUrls(productoEditando.imagenes_galeria || [productoEditando.imagen_url]);
      setCurrentIndex(0);
    } else {
      setForm({ nombre: '', descripcion: '', precio: '' });
      setImageUrls([]);
      setCurrentIndex(0);
    }
  }, [productoEditando]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const newUrls = [...imageUrls];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `vestidos/${fileName}`;

      try {
        const { error } = await supabase.storage
          .from('imagenes-productos')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('imagenes-productos')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      } catch (err) {
        console.error("Error al subir:", err);
      }
    }

    setImageUrls(newUrls);
    setLoading(false);
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));

  const handlePublicar = async () => {
    if (!form.nombre || !form.precio || imageUrls.length === 0) {
      alert("Por favor, completa los datos y sube al menos una imagen.");
      return;
    }

    setLoading(true);

    const productData = {
      nombre: form.nombre, 
      descripcion: form.descripcion, 
      precio: parseFloat(form.precio), 
      imagen_url: imageUrls[0], 
      imagenes_galeria: imageUrls, 
    };

    if (productoEditando) {
      const { error } = await supabase.from('products').update(productData).eq('id', productoEditando.id);
      if (!error) {
        setProductoEditando(null); 
      } else {
        alert("Error al actualizar.");
      }
    } else {
      const { error } = await supabase.from('products').insert([
        { ...productData, stock_s: 0, stock_m: 0, stock_l: 0 }
      ]);

      if (!error) {
        setForm({ nombre: '', descripcion: '', precio: '' });
        setImageUrls([]);
        setCurrentIndex(0);
      } else {
        alert("Error al guardar.");
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full text-zinc-100 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          {productoEditando ? "Editar Producto" : "Nuevo Producto"}
        </h1>
        <p className="text-zinc-500 text-sm">Gestiona la información y fotos del catálogo</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECCIÓN DETALLES */}
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Información General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Nombre del modelo</label>
                <input 
                  type="text" 
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-xl outline-none focus:border-zinc-500 transition-colors text-white text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Descripción</label>
                <textarea 
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-xl outline-none h-32 resize-none focus:border-zinc-500 transition-colors text-white text-sm" 
                />
              </div>
            </div>
          </section>

          {/* GALERÍA */}
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Fotografías</h3>
            
            <div className="relative flex items-center justify-center bg-zinc-950 rounded-xl min-h-[400px] overflow-hidden border border-zinc-800 group">
              {imageUrls.length > 0 ? (
                <>
                  <img src={imageUrls[currentIndex]} className="w-full h-[400px] object-contain transition-opacity duration-300" alt="Vista" />
                  
                  {imageUrls.length > 1 && (
                    <>
                      <button onClick={prevSlide} className="absolute left-4 bg-zinc-900/80 p-2.5 rounded-full hover:bg-zinc-800 transition-all text-white opacity-0 group-hover:opacity-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={nextSlide} className="absolute right-4 bg-zinc-900/80 p-2.5 rounded-full hover:bg-zinc-800 transition-all text-white opacity-0 group-hover:opacity-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <div className="absolute bottom-4 text-xs font-medium bg-zinc-900/80 px-3 py-1 rounded-full text-white backdrop-blur-sm">
                        {currentIndex + 1} / {imageUrls.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <label className="cursor-pointer text-center flex flex-col items-center p-8 w-full h-full justify-center hover:bg-zinc-900/50 transition-colors">
                  <svg className="w-8 h-8 text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-zinc-400">
                    {loading ? "Subiendo..." : "Haz clic para subir fotos"}
                  </span>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" multiple disabled={loading} />
                </label>
              )}
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {imageUrls.map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  onClick={() => setCurrentIndex(i)}
                  className={`w-16 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer transition-all ${currentIndex === i ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'}`}
                />
              ))}
              {imageUrls.length > 0 && (
                <label className="w-16 h-20 flex-shrink-0 flex items-center justify-center bg-zinc-950 rounded-lg border border-dashed border-zinc-700 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" multiple />
                </label>
              )}
            </div>
          </section>
        </div>

        {/* PANEL LATERAL */}
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Precio</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">S/</span>
              <input 
                type="number" 
                value={form.precio}
                onChange={(e) => setForm({...form, precio: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-zinc-500 transition-colors text-white text-lg font-medium" 
              />
            </div>
          </section>

          <button 
            onClick={handlePublicar}
            disabled={loading || imageUrls.length === 0}
            className="w-full bg-white text-zinc-900 py-4 rounded-xl font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : (productoEditando ? "Guardar Cambios" : "Publicar Producto")}
          </button>

          {productoEditando && (
            <button 
              onClick={() => setProductoEditando(null)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 py-3.5 rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </div>
    </div>
  );
}