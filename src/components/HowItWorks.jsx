import React from 'react';
import { Search, Flower2, HeartHandshake } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="text-[#134B36]" size={32} />,
      title: "1. Kabri Bulun",
      desc: "Sistemimizden veya talep formundan sevdiklerinizin istirahatgahını seçin."
    },
    {
      icon: <Flower2 className="text-[#134B36]" size={32} />,
      title: "2. Vefa Paketini Seçin",
      desc: "Sadece temizlik değil, çiçeklendirme ve manevi bakım içeren hizmetlerimizi inceleyin."
    },
    {
      icon: <HeartHandshake className="text-[#134B36]" size={32} />,
      title: "3. Huzurla Takip Edin",
      desc: "Her ziyaret sonrası detaylı, fotoğraflı ve şeffaf durum raporu alın."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif text-[#134B36]">Süreç Nasıl İşliyor?</h2>
        <div className="h-1 w-16 bg-[#134B36]/20 mx-auto mt-6 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
        {/* Bağlantı çizgisi (Sadece bilgisayarda görünür) */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-[#134B36]/10" />

        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-6 group relative z-10">
            <div className="w-24 h-24 bg-[#F8F6F0] shadow-sm border border-[#134B36]/10 rounded-full flex items-center justify-center transition-all duration-700 group-hover:shadow-xl group-hover:scale-110 group-hover:bg-white group-hover:border-[#134B36]/30">
              {step.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#134B36] mb-3">{step.title}</h3>
              <p className="text-sm text-[#134B36]/60 leading-relaxed px-4">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;