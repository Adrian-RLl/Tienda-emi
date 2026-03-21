import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error de acceso: " + error.message);
    } else {
      // Login exitoso, vamos al admin
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] px-4">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-serif text-center mb-8 text-[#2D2D2D]">Acceso Administrador</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7A1F1F] outline-none"
              placeholder="adm_aby@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7A1F1F] outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#7A1F1F] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Entrar al Panel
          </button>
        </div>
      </form>
    </div>
  );
}