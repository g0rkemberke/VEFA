import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, PlusCircle } from 'lucide-react';

const MobileBottomNav = ({ onOpenAuth, isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleOrderClick = () => {
    navigate('/hizmetler');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate('/hesabim');
    } else {
      onOpenAuth('login');
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-[#134B36]/10 z-[90] pb-safe pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between pb-2">
        
        {/* Ana Sayfa */}
        <button 
          onClick={() => navigate('/')} 
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/') ? 'text-[#134B36]' : 'text-[#134B36]/40 hover:text-[#134B36]/70'}`}
        >
          <Home size={22} className={isActive('/') ? 'fill-[#134B36]/10' : ''} />
          <span className="text-[10px] font-bold">Ana Sayfa</span>
        </button>

        {/* Hizmetler */}
        <button 
          onClick={() => navigate('/hizmetler')} 
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/hizmetler') ? 'text-[#134B36]' : 'text-[#134B36]/40 hover:text-[#134B36]/70'}`}
        >
          <LayoutGrid size={22} className={isActive('/hizmetler') ? 'fill-[#134B36]/10' : ''} />
          <span className="text-[10px] font-bold">Hizmetler</span>
        </button>

        {/* Hızlı Sipariş (Ortadaki Belirgin Buton) */}
        <div className="relative -top-5">
          <button 
            onClick={handleOrderClick}
            className="w-14 h-14 bg-[#134B36] text-[#C9A84C] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(19,75,54,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-[#F8F6F0]"
          >
            <PlusCircle size={28} />
          </button>
        </div>

        {/* Süreç */}
        <button 
          onClick={() => navigate('/surec')} 
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/surec') ? 'text-[#134B36]' : 'text-[#134B36]/40 hover:text-[#134B36]/70'}`}
        >
          <span className="text-[20px] font-serif font-black leading-none mb-0.5">V</span>
          <span className="text-[10px] font-bold">Atölye</span>
        </button>

        {/* Profil */}
        <button 
          onClick={handleUserClick} 
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/hesabim') ? 'text-[#134B36]' : 'text-[#134B36]/40 hover:text-[#134B36]/70'}`}
        >
          <User size={22} className={isActive('/hesabim') ? 'fill-[#134B36]/10' : ''} />
          <span className="text-[10px] font-bold">Hesabım</span>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;