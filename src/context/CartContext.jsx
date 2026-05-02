import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    // 1. Obtenemos el stock real de la talla seleccionada
    const stockDeTalla = producto[`stock_${producto.talla.toLowerCase()}`] || 0;

    if (stockDeTalla <= 0) {
      alert("Lo sentimos, este producto se acaba de agotar en la talla seleccionada.");
      return;
    }

    const existe = carrito.find(item => item.id === producto.id && item.talla === producto.talla);

    if (existe) {
      // 2. Validamos si al sumar 1 excedemos el stock disponible de esa talla
      if (existe.cantidad >= stockDeTalla) {
        alert(`Solo quedan ${stockDeTalla} unidades disponibles de esta talla.`);
        return;
      }

      setCarrito(carrito.map(item => 
        item.id === producto.id && item.talla === producto.talla 
        ? { ...item, cantidad: item.cantidad + 1 } 
        : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const aumentarCantidad = (id, talla) => {
    setCarrito(carrito.map(item => {
      if (item.id === id && item.talla === talla) {
        const stockDeTalla = item[`stock_${item.talla.toLowerCase()}`] || 0;
        
        if (item.cantidad >= stockDeTalla) {
          alert("Has alcanzado el límite de stock disponible para esta talla.");
          return item; 
        }
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    }));
  };

  const disminuirCantidad = (id, talla) => {
    setCarrito(carrito.map(item => 
      item.id === id && item.talla === talla && item.cantidad > 1
      ? { ...item, cantidad: item.cantidad - 1 } 
      : item
    ).filter(item => item.cantidad > 0));
  };

  const eliminarDelCarrito = (id, talla) => {
    setCarrito(carrito.filter(item => !(item.id === id && item.talla === talla)));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      aumentarCantidad, 
      disminuirCantidad, 
      eliminarDelCarrito,
      vaciarCarrito
    }}>
      {children}
    </CartContext.Provider>
  );
};