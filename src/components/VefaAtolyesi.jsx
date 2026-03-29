import React from 'react';
import GraveVisualizer from './GraveVisualizer';
import DesignControls from './DesignControls';
import { Sparkles, ArrowRight, User, Calendar } from 'lucide-react';

const VefaAtolyesi = ({ graveDesign, setGraveDesign }) => {

  // Müşteriyi paketlere pürüzsüzce kaydıran fonksiyon (App.js'deki ID'yi kullanır)
  const handleScrollToPackages = () => {
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Eğer ID bulunamazsa, ekranın %80'i kadar aşağı kaydır.
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
      
      {/* BAŞLIK ALANI (Mevcut yapını koruduk) */}
      <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
         <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#134B36]/15 bg-white/60 backdrop-blur-md shadow-sm cursor-default transition-all hover:scale-105">
            <Sparkles className="text-[#1E6B4E]" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]">Kişiselleştirilmiş Tasarım</span>
         </div>
         <h2 className="text-4xl md:text-5xl font-serif text-[#134B36] leading-tight tracking-tight">Vefa Tasarım Atölyesi</h2>
         <p className="text-base text-[#134B36]/60 leading-relaxed px-4">
            Emanetlerinizin istirahatgahını dijital ortamda tasarlayın. Gerçek mermer dokusunu, taşı ve çiçekleri dilediğiniz gibi seçip anında önizleyin.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        
        {/* SOL TARAF: GÖRSELİZATÖR (7 kolonluk sticky alan) */}
        <div className="lg:col-span-7 lg:sticky lg:top-32 order-1 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="bg-gradient-to-b from-[#f8f6f0] to-white p-2 rounded-[3rem] shadow-2xl shadow-[#134B36]/5 border border-[#134B36]/10">
             <GraveVisualizer design={graveDesign} />
          </div>
          
          <div className="mt-8 p-6 md:p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#134B36]/10 shadow-sm flex items-start gap-4 text-xs text-[#134B36]/70 leading-relaxed">
             <div className="p-2 bg-[#134B36]/5 rounded-full shrink-0">
               <Sparkles size={18} className="text-[#134B36]"/>
             </div>
             <p className="mt-1 font-medium">
               Oluşturduğunuz tasarım, seçeceğiniz pakete entegre edilecektir. Çiçek dikimleri "Özenli Bakım" ve üzeri paketlerde standarttır.
             </p>
          </div>
        </div>

        {/* SAĞ TARAF: KONTROLLER VE BİLGİ FORMU (5 kolonluk alan) */}
        <div className="lg:col-span-5 order-2 lg:order-2 space-y-8">
          
          {/* Mezar Bilgileri Formu (Konum Alanı Buradan Kaldırıldı) */}
          <div className="bg-white rounded-3xl border border-[#134B36]/10 p-8 shadow-lg shadow-[#134B36]/5 space-y-4 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#134B36]"></div>
             <h3 className="font-serif text-[#134B36] text-xl mb-4">Mezar Bilgileri</h3>
             
             <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#134B36]/40 group-focus-within/input:text-[#C9A84C] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Merhumun Adı Soyadı" 
                  value={graveDesign?.name || ''} 
                  onChange={e => setGraveDesign({...graveDesign, name: e.target.value})} 
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] text-sm font-medium" 
                />
             </div>

             <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#134B36]/40 group-focus-within/input:text-[#C9A84C] transition-colors">
                  <Calendar size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Doğum - Ölüm (Örn: 1950 - 2026)" 
                  value={graveDesign?.date || ''} 
                  onChange={e => setGraveDesign({...graveDesign, date: e.target.value})} 
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F6F0] border border-transparent rounded-2xl outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-[#1a1c19] text-sm font-mono" 
                />
             </div>
          </div>

          {/* Orijinal DesignControls Bileşenin (Premium Düzenleme) */}
          <div className="bg-white rounded-3xl border border-[#134B36]/10 p-8 shadow-lg shadow-[#134B36]/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C]"></div>
             <DesignControls design={graveDesign} setDesign={setGraveDesign} />
          </div>
          
          {/* Devam Butonu (Smooth Scroll Tetikleyicisi) */}
          <div className="pt-4 border-t border-[#134B36]/10">
             <button 
               onClick={handleScrollToPackages}
               className="w-full py-6 bg-[#134B36] text-[#F8F6F0] rounded-[2rem] font-bold text-lg shadow-[0_10px_30px_rgba(19,75,54,0.3)] hover:bg-[#0B2E21] hover:shadow-[0_15px_40px_rgba(19,75,54,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 group/btn"
             >
                Tasarımı Onayla ve Paket Seç
                <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VefaAtolyesi;