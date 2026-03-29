import React from 'react';
import { Check, Leaf, Droplets, Sun } from 'lucide-react';

const Packages = ({ onSelect }) => {
  const data = [
    { 
      title: "Temel Bakım", price: "1.250", 
      icon: <Leaf size={24} />, 
      desc: "Mezar yerinin temiz ve düzenli kalması için gerekli olan standart bakım hizmeti.",
      features: [
        "Yabani ot temizliği ve çevre düzeni", 
        "Mermer ve taş yüzeylerin yıkanması", 
        "Eski ve kurumuş çiçeklerin toplanması",
        "Hizmet öncesi ve sonrası fotoğraflı rapor"
      ],
      isPopular: false
    },
    { 
      title: "Özenli Bakım", price: "2.400", 
      icon: <Droplets size={24} />, 
      desc: "Çiçeklendirme ve toprak bakımı içeren, her mevsim canlı kalan detaylı hizmet.",
      features: [
        "Temel Bakım paketindeki tüm hizmetler", 
        "Mevsimlik canlı çiçek dikimi", 
        "Toprak zenginleştirme ve gübreleme", 
        "Ayda 2 kez düzenli sulama",
        "WhatsApp üzerinden anlık durum bilgisi"
      ],
      isPopular: true
    },
    { 
      title: "Premium Koruma", price: "4.750", 
      icon: <Sun size={24} />, 
      desc: "Mermer onarımından özel gün ziyaretlerine kadar uzanan, tam kapsamlı bakım.",
      features: [
        "Özenli Bakım paketindeki tüm hizmetler", 
        "Mermer cilalama ve parlaklık koruma", 
        "Silinmiş mezar taşlarındaki yazıların boyanması", 
        "Özel günlerde (Bayram vb.) ekstra ziyaret"
      ],
      isPopular: false
    }
  ];

  return (
    <div id="packages-area" className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 scroll-mt-28">
      {data.map((pkg, idx) => (
        <div 
          key={idx} 
          className={`relative flex flex-col justify-between rounded-[3rem] p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl cursor-default ${
            pkg.isPopular 
              ? 'bg-[#134B36] text-[#F8F6F0] shadow-xl shadow-[#134B36]/30 md:scale-105 z-10' 
              : 'bg-white/80 backdrop-blur-md border border-[#134B36]/10 text-[#134B36] shadow-sm'
          }`}
        >
          {pkg.isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F8F6F0] text-[#134B36] text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-md animate-pulse">
              En Çok Tercih Edilen
            </div>
          )}

          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl transition-colors duration-500 ${pkg.isPopular ? 'bg-white/10' : 'bg-[#134B36]/5'}`}>
                {pkg.icon}
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold block mb-1">Başlangıç</span>
                <p className="text-3xl font-light">₺{pkg.price}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-serif mb-3">{pkg.title}</h3>
              <p className={`text-sm leading-relaxed ${pkg.isPopular ? 'text-[#F8F6F0]/80' : 'text-[#134B36]/70'}`}>
                {pkg.desc}
              </p>
            </div>

            <div className={`h-[1px] w-full ${pkg.isPopular ? 'bg-white/10' : 'bg-[#134B36]/10'}`} />

            <ul className="space-y-4">
              {pkg.features.map((f, i) => (
                <li key={i} className={`flex items-start gap-4 text-sm ${pkg.isPopular ? 'text-[#F8F6F0]/90' : 'text-[#134B36]/80'}`}>
                  <Check size={18} className={`mt-0.5 shrink-0 transition-transform duration-300 hover:scale-125 ${pkg.isPopular ? 'text-[#F8F6F0]' : 'text-[#134B36]'}`} /> 
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => onSelect(pkg)}
            className={`w-full mt-12 py-5 rounded-[1.8rem] font-bold text-sm tracking-wide transition-all active:scale-95 flex justify-center items-center gap-2 group ${
              pkg.isPopular 
                ? 'bg-[#F8F6F0] text-[#134B36] hover:bg-white shadow-lg' 
                : 'bg-[#134B36] text-[#F8F6F0] hover:bg-[#0B2E21] shadow-md hover:shadow-xl'
            }`}
          >
            Bu Hizmeti Seç
          </button>
        </div>
      ))}
    </div>
  );
};

export default Packages;