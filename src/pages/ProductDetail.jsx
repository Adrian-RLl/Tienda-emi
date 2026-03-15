import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/products';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CartContext);
  
  // Buscamos el producto
  const producto = productos.find((p) => p.id === parseInt(id));

  // Manejo de error si no existe
  if (!producto) return <div className="p-10 text-center">Producto no encontrado</div>;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Imagen del producto */}
        <div className="w-full md:w-1/2">
            <img src={producto.imagen} alt={producto.nombre} className="w-full rounded-2xl object-cover aspect-4/5" />
        </div>
        
        {/* Información y botones */}
        <div className="flex flex-col justify-center">
          {/* El '!' asegura que el color #2D2D2D se aplique siempre */}
          <h1 className="text-4xl font-serif text-[#2D2D2D] mb-4">{producto.nombre}</h1>
          <p className="text-3xl text-[#7A1F1F] font-bold mb-6">S/{producto.precio}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Este vestido ha sido seleccionado cuidadosamente para resaltar tu estilo con elegancia. 
            Calidad premium garantizada para que luzcas espectacular en cualquier ocasión.
          </p>
          
          <div className="flex gap-4">
            {/* Botón principal */}
            <button 
              onClick={() => agregarAlCarrito(producto)}
              className="flex-1 bg-[#7A1F1F] text-white py-4 rounded-xl font-bold hover:bg-[#5D1818] transition shadow-md"
            >
              Agregar al carrito
            </button>

            {/* Botón secundario */}
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-4 border border-[#7A1F1F] text-[#7A1F1F] rounded-xl font-bold hover:bg-[#FDFBF7] transition"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}