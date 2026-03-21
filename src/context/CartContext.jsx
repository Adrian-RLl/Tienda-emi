import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  /**
   * FUNCIÓN: agregarAlCarrito
   * Ahora valida que no agregues más de lo que hay en stock.
   */
  const agregarAlCarrito = (producto) => {
    // 1. Bloqueo total si el producto de la BD ya viene con stock 0
    if (producto.stock <= 0) {
      alert("Lo sentimos, este producto se acaba de agotar.");
      return;
    }

    const existe = carrito.find(item => item.id === producto.id && item.talla === producto.talla);

    if (existe) {
      // 2. Validamos si al sumar 1 excedemos el stock disponible
      if (existe.cantidad >= producto.stock) {
        alert(`Solo quedan ${producto.stock} unidades disponibles de este vestido.`);
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

  /**
   * FUNCIÓN: aumentarCantidad
   * Compara la cantidad actual en el carrito con el stock máximo.
   */
  const aumentarCantidad = (id, talla) => {
    setCarrito(carrito.map(item => {
      if (item.id === id && item.talla === talla) {
        // Validamos el límite del stock antes de aumentar
        if (item.cantidad >= item.stock) {
          alert("Has alcanzado el límite de stock disponible.");
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

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      aumentarCantidad, 
      disminuirCantidad, 
      eliminarDelCarrito 
    }}>
      {children}
    </CartContext.Provider>
  );
};