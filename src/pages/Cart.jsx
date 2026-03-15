import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { carrito } = useContext(CartContext);
  
  // Calculamos el total
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl font-serif text-[#2D2D2D] mb-12 text-center">
          Tu Carrito
        </h1>
        
        {/* Lógica de Carrito Vacío o Lleno */}
        {carrito.length === 0 ? (
          // ESTRUCTURA PARA CARRITO VACÍO (Con Flexbox para evitar que choque)
          <div className="flex flex-col items-center justify-center pt-10 pb-20">
            <p className="text-[#2D2D2D] text-xl font-medium mb-10 text-center">
              Tu carrito está vacío, ¡busca algo elegante!
            </p>
            <Link 
              to="/" 
              className="bg-[#7A1F1F] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#5D1818] transition shadow-lg"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          // ESTRUCTURA PARA CARRITO CON PRODUCTOS
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="space-y-8">
              {carrito.map((prod, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-6">
                    <img src={prod.imagen} className="w-24 h-24 object-cover rounded-xl" alt={prod.nombre} />
                    <h2 className="text-[#2D2D2D] font-bold text-lg">{prod.nombre}</h2>
                  </div>
                  <p className="text-[#7A1F1F] font-bold text-xl">${prod.precio}</p>
                </div>
              ))}
            </div>

            {/* Resumen del total */}
            <div className="mt-10 border-t border-gray-200 pt-8 flex justify-between items-center">
              <span className="text-2xl font-bold text-[#2D2D2D]">Total</span>
              <span className="text-3xl font-bold text-[#7A1F1F]">
                ${total.toFixed(2)}
              </span>
            </div>
            
            {/* Botón de finalizar */}
            <button className="w-full mt-10 bg-[#2D2D2D] text-white py-4 rounded-xl font-bold hover:bg-black transition shadow-lg">
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}