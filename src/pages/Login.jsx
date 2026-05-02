import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error de acceso: " + error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 selection:bg-zinc-800 animate-fadeIn">
      <form 
        onSubmit={handleLogin} 
        className="bg-zinc-900 p-10 rounded-2xl w-full max-w-sm border border-zinc-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-wider text-white mb-2">EMI</h1>
          <p className="text-zinc-500 text-sm">Acceso Administrativo</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:border-zinc-500 outline-none transition-colors text-white text-sm"
              placeholder="admin@emi.com"
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:border-zinc-500 outline-none transition-colors text-white text-sm"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-zinc-900 py-3.5 mt-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </div>
      </form>
    </div>
  );
}