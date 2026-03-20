import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Key, Trash2, Smartphone, Landmark } from 'lucide-react';

// ==========================================
// CONFIGURACIÓN CENTRAL (Edita aquí fácil)
// ==========================================
const CONFIG = {
  nombre: "SORTEOS DEL SUR",
  precio: 20,
  whatsapps: ['522285978004', '522281234567'], // Agrega los que quieras
  bancos: [
    { nombre: 'BBVA', titular: 'Jose Garcia', cuenta: '5204160401706093', clabe: '002840701219952024' },
    { nombre: 'Banamex', titular: 'Alberto P.', cuenta: '12345678', clabe: '000111222333444' }
  ],
  fotoPortada: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1000",
  pinAdmin: "1234",
  horasLimite: 3
};

export default function App() {
  const [boletos, setBoletos] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);

  // Inicializar 700 boletos
  useEffect(() => {
    const init = {};
    for (let i = 1; i <= 700; i++) init[i] = { estado: 'disponible', fecha: null };
    setBoletos(init);
  }, []);

  const toggleBoleto = (n) => {
    if (boletos[n].estado === 'vendido') return;
    setCarrito(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  };

  const enviarWhatsApp = () => {
    const randomWA = CONFIG.whatsapps[Math.floor(Math.random() * CONFIG.whatsapps.length)];
    const msg = `🎟 *${CONFIG.nombre}*\n¡Hola! Quiero apartar los boletos: ${carrito.join(', ')}\nTotal: $${carrito.length * CONFIG.precio}\n\nFavor de enviarme datos de pago.`;
    window.open(`https://wa.me/${randomWA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Cálculos de Balance
  const vendidos = Object.values(boletos).filter(b => b.estado === 'vendido').length;
  const apartados = Object.values(boletos).filter(b => b.estado === 'apartado').length;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      {/* Portada */}
      <div className="relative h-64 border-b-4 border-yellow-500 overflow-hidden flex items-center justify-center">
        <img src={CONFIG.fotoPortada} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <h1 className="relative z-10 text-6xl font-black text-yellow-500 text-center drop-shadow-lg">{CONFIG.nombre}</h1>
      </div>

      {/* Balance (Solo si eres admin o quieres verlo) */}
      <div className="p-4 grid grid-cols-2 gap-3 bg-neutral-900">
        <div className="bg-black p-4 rounded-xl border border-neutral-700">
          <p className="text-xs text-neutral-500 font-bold uppercase">Vendido</p>
          <p className="text-2xl font-black text-green-500">${vendidos * CONFIG.precio}</p>
        </div>
        <div className="bg-black p-4 rounded-xl border border-neutral-700">
          <p className="text-xs text-neutral-500 font-bold uppercase">Apartados</p>
          <p className="text-2xl font-black text-yellow-500">{apartados}</p>
        </div>
      </div>

      {/* Tablero */}
      <div className="p-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {Object.keys(boletos).map(n => (
          <div 
            key={n}
            onClick={() => toggleBoleto(Number(n))}
            className={`aspect-square rounded-lg flex items-center justify-center font-bold cursor-pointer border-2 transition-all ${
              carrito.includes(Number(n)) ? 'bg-yellow-500 text-black border-white scale-110 shadow-xl' :
              boletos[n].estado === 'vendido' ? 'bg-red-900 border-red-700 text-red-500 opacity-50' :
              'bg-neutral-800 border-transparent text-neutral-400'
            }`}
          >
            {String(n).padStart(3, '0')}
          </div>
        ))}
      </div>

      {/* Carrito Flotante */}
      {carrito.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-blue-900 border-t-4 border-yellow-500 flex justify-between items-center animate-bounce-in">
          <div>
            <p className="text-xs font-bold uppercase">Total ({carrito.length} boletos)</p>
            <p className="text-2xl font-black text-yellow-400">${carrito.length * CONFIG.precio}</p>
          </div>
          <button 
            onClick={enviarWhatsApp}
            className="bg-yellow-500 text-black px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            APARTAR POR WHATSAPP
          </button>
        </div>
      )}
    </div>
  );
}
