// src/context/CartContext.jsx
import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => [...prev, producto]);
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito }}>
      {children}
    </CartContext.Provider>
  );
};