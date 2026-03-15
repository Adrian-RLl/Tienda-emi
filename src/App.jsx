import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/productCard';
import { productos } from './data/products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart'; // 1. Importa tu nueva página

function Home() {
  return (
    // Cambiamos el fondo a nuestro crema elegante y damos más espacio
    <div className="bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-[#2D2D2D] mb-12 text-center">Nuestra Colección</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productos.map((item) => (
            <ProductCard key={item.id} producto={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} /> {/* 2. Nueva ruta */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;