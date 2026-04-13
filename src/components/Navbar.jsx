import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User, X, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenAuth, isLoggedIn, onLogout }) => {
  const [isMobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileOpen]);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 right-0 z-[60] flex justify-center px-4 md:px-6 animate-float-down">
        <nav className="bg-[#134B36]/95 backdrop-blur-xl px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 shadow-2xl flex items-center justify-between w-full max-w-6xl">

          <Link to="/" className="text-[#F8F6F0] font-serif text-xl md:text-2xl tracking-[0.3em] font-bold cursor-pointer relative z-[70] hover:text-white transition-colors">
            VEFA
          </Link>

          {/* MASAÜSTÜ MENÜ EKLENTİSİ */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[#F8F6F0]/80 text-xs font-bold uppercase tracking-widest">
            <Link to="/hizmetler" className="hover:text-white transition-colors">Hizmetler</Link>
            <Link to="/surec" className="hover:text-white transition-colors">Süreç</Link>
            {/* YENİ: Bölgelerimiz (Altın Rengi Vurgulu) */}
            <Link to="/bolgelerimiz" className="text-[#C9A84C] hover:text-white transition-colors flex items-center gap-1.5">
              <MapPin size={14} /> Bölgelerimiz
            </Link>
            <Link to="/kurumsal" className="hover:text-white transition-colors">Kurumsal</Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6 relative z-[70]">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 md:gap-4">
                <span className="hidden md:block text-[#F8F6F0]/80 text-xs font-bold uppercase tracking-widest">
                  Profilim
                </span>
                <Link to="/hesabim" className="w-8 h-8 md:w-10 md:h-10 bg-[#F8F6F0] rounded-full flex items-center justify-center text-[#134B36] cursor-pointer hover:scale-105 transition-transform">
                  <User size={16} />
                </Link>
                <button onClick={onLogout} className="hidden md:block text-[#F8F6F0]/50 hover:text-white transition-colors ml-2">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => onOpenAuth('login')} className="text-[#F8F6F0] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">
                  Giriş
                </button>
                <button onClick={() => onOpenAuth('register')} className="bg-[#F8F6F0] text-[#134B36] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-md active:scale-95">
                  Kayıt Ol
                </button>
              </div>
            )}

            <button className="md:hidden text-[#F8F6F0] p-1 transition-transform duration-300 active:scale-90" onClick={() => setMobileOpen(!isMobileOpen)}>
              {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBİL MENÜ EKLENTİSİ */}
      <div className={`fixed inset-0 z-[50] bg-[#134B36] md:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isMobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>

        <div className="flex flex-col items-center gap-10 text-[#F8F6F0] text-xl font-bold uppercase tracking-widest w-full mt-8">
          <Link to="/hizmetler" onClick={handleLinkClick} className="hover:text-[#F8F6F0]/50 transition-colors w-full text-center py-2">Hizmetler</Link>
          <Link to="/surec" onClick={handleLinkClick} className="hover:text-[#F8F6F0]/50 transition-colors w-full text-center py-2">Süreç</Link>
          <Link to="/bolgelerimiz" onClick={handleLinkClick} className="text-[#C9A84C] hover:text-white transition-colors w-full text-center py-2 flex items-center justify-center gap-2">
            <MapPin size={20} /> Bölgelerimiz
          </Link>
          <Link to="/kurumsal" onClick={handleLinkClick} className="hover:text-[#F8F6F0]/50 transition-colors w-full text-center py-2">Kurumsal</Link>
        </div>

        <div className="flex flex-col items-center gap-6 w-full px-12 mt-12">
          {isLoggedIn ? (
            <button onClick={() => { onLogout(); handleLinkClick(); }} className="flex items-center justify-center gap-3 text-[#F8F6F0]/60 hover:text-white transition-colors w-full py-4 bg-white/5 rounded-full">
              <LogOut size={24} /> Çıkış Yap
            </button>
          ) : (
            <>
              <button onClick={() => { onOpenAuth('login'); handleLinkClick(); }} className="text-[#F8F6F0] text-lg font-bold uppercase tracking-widest hover:bg-white/10 w-full py-5 border border-white/20 rounded-full transition-all">
                Giriş Yap
              </button>
              <button onClick={() => { onOpenAuth('register'); handleLinkClick(); }} className="bg-[#F8F6F0] text-[#134B36] w-full py-5 rounded-full text-lg font-bold uppercase tracking-widest hover:bg-white shadow-xl transition-all active:scale-95">
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;