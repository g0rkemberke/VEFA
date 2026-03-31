import React, { useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImg, afterImg }) => {
  // Slider'ın başlangıç pozisyonu tam orta (%50)
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="relative w-full h-56 md:h-64 bg-gray-100 overflow-hidden group select-none rounded-t-[2.5rem]">
      
      {/* ALT KATMAN: SONRASI (Temiz Mezar) */}
      <img
        src={afterImg}
        alt="Sonrası"
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      <span className="absolute top-4 right-4 bg-[#134B36] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-0">
        Sonrası
      </span>

      {/* ÜST KATMAN: ÖNCESİ (Kirli Mezar - Clip-Path ile kesiliyor) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImg}
          alt="Öncesi"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        <span className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
          Öncesi
        </span>
      </div>

      {/* MERKEZİ KAYDIRMA ÇİZGİSİ VE TUTAMAÇ */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-none z-10 transition-all duration-75"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        {/* Yuvarlak Tutamaç */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white text-[#134B36] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-2 border-[#134B36]/10 group-hover:scale-110 transition-transform">
          <ChevronsLeftRight size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* SİHİRLİ DOKUNMATİK ALAN (Görünmez Input) */}
      {/* Mobilde ve bilgisayarda kusursuz kaydırma hissi verir */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0"
      />
      
    </div>
  );
};

export default BeforeAfterSlider;