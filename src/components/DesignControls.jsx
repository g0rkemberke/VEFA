import React from 'react';
import { Palette, Layers, Flower, Maximize2, Wallet } from 'lucide-react';

const DesignControls = ({ design, setDesign }) => {
  // Dinamik fiyatların olduğu veri tabanı
  // Görkem, taban paket fiyatını App.js'de hesaplayıp buraya prop olarak da alabiliriz, 
  // şimdilik sadece farkları (+...) hesaplayacağız.
  const options = {
    marble: [
      { id: 'white', name: 'Beyaz Mermer', img: '/images/mermer-beyaz.jpg', price: 0 },
      { id: 'grey',  name: 'Gri Granit',   img: '/images/mermer-gri.jpg',   price: 300 },
      { id: 'black', name: 'Siyah Granit', img: '/images/mermer-siyah.jpg', price: 600 },
    ],
    headstone: [
      { id: 'classic', name: 'Klasik Yuvarlak' },
      { id: 'modern',  name: 'Modern Köşeli'   },
    ],
    flowers: [
      { id: 'none',     name: 'Sade (Toprak Yok)', price: 0 },
      { id: 'papatya',  name: 'Beyaz Papatya',     price: 150 },
      { id: 'menekse',  name: 'Menekşe Dikimi',    price: 300 }, // YENİ
      { id: 'lavanta',  name: 'Mor Lavanta',       price: 250 },
      { id: 'lale',     name: 'Lale (Dönemlik)',   price: 350 }, // YENİ
      { id: 'gul',      name: 'Kırmızı Gül',       price: 400 },
    ],
    size: [
      { id: 'small',  name: 'Küçük', dims: '60 × 100 cm', desc: 'Sade ve zarif' },
      { id: 'medium', name: 'Orta',  dims: '80 × 130 cm', desc: 'En çok tercih edilen', popular: true },
      { id: 'large',  name: 'Büyük', dims: '100 × 160 cm', desc: 'Anıtsal görünüm' },
    ],
  };

  const updateField = (field, value) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  // Dinamik Fiyat Farkı Hesaplama
  const calculateExtraCost = () => {
    let extra = 0;
    const selectedMarble = options.marble.find(m => m.id === design.marble);
    if (selectedMarble) extra += selectedMarble.price;

    const currentFlowers = Array.isArray(design.flowers) ? design.flowers : [design.flowers];
    currentFlowers.forEach(fId => {
      const selectedFlower = options.flowers.find(f => f.id === fId);
      if (selectedFlower) extra += selectedFlower.price;
    });

    return extra;
  };

  return (
    <div className="space-y-8 md:space-y-10 p-8 md:p-10 bg-white/70 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] border border-[#134B36]/10 shadow-xl shadow-[#134B36]/5 animate-in fade-in duration-1000 delay-300">

      {/* ── Mermer Seçimi ── */}
      <div className="space-y-4 md:space-y-5">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]/60 flex items-center gap-2">
          <Palette size={14} /> Mermer Rengi
        </label>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {options.marble.map(m => (
            <button
              key={m.id}
              onClick={() => updateField('marble', m.id)}
              className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 text-center relative ${
                design.marble === m.id
                  ? 'border-[#134B36] bg-[#134B36]/5 shadow-sm scale-105'
                  : 'border-[#134B36]/10 bg-white hover:border-[#134B36]/30'
              }`}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 shadow-inner bg-cover bg-center mb-1"
                style={{ backgroundImage: `url(${m.img})` }}
              />
              <span className={`text-[9px] md:text-[11px] font-bold ${design.marble === m.id ? 'text-[#134B36]' : 'text-[#134B36]/70'}`}>
                {m.name}
              </span>
              <span className={`text-[8px] md:text-[9px] font-black ${design.marble === m.id ? 'text-[#C9A84C]' : 'text-[#134B36]/40'}`}>
                {m.price === 0 ? 'STANDART' : `+${m.price} ₺`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Boyut Seçimi ── */}
      <div className="space-y-4 md:space-y-5">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]/60 flex items-center gap-2">
          <Maximize2 size={14} /> Mezar Boyutu
        </label>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {options.size.map(s => {
            const isActive = (design.size || 'medium') === s.id;
            const stoneH = s.id === 'small' ? 28 : s.id === 'medium' ? 38 : 50;
            const stoneW = s.id === 'small' ? 18 : s.id === 'medium' ? 24 : 30;
            return (
              <button
                key={s.id}
                onClick={() => updateField('size', s.id)}
                className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 text-center ${
                  isActive ? 'border-[#134B36] bg-[#134B36]/5 shadow-sm scale-105' : 'border-[#134B36]/10 bg-white hover:border-[#134B36]/30'
                }`}
              >
                {s.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#134B36] text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap">Popüler</span>}
                <div className="flex items-end justify-center h-14 mt-1">
                  <svg viewBox="0 0 40 60" style={{ width: stoneW, height: stoneH }}>
                    <rect x="4" y="22" width="32" height="34" rx="2" fill={isActive ? '#134B36' : '#134B36'} fillOpacity={isActive ? 0.18 : 0.07} stroke={isActive ? '#134B36' : '#134B36'} strokeWidth="1.5" strokeOpacity={isActive ? 0.6 : 0.2} />
                    <ellipse cx="20" cy="18" rx="14" ry="18" fill={isActive ? '#134B36' : '#134B36'} fillOpacity={isActive ? 0.18 : 0.07} stroke={isActive ? '#134B36' : '#134B36'} strokeWidth="1.5" strokeOpacity={isActive ? 0.6 : 0.2} />
                    <rect x="0" y="55" width="40" height="5" rx="1.5" fill={isActive ? '#134B36' : '#134B36'} fillOpacity={isActive ? 0.25 : 0.08} />
                  </svg>
                </div>
                <span className={`text-[10px] md:text-xs font-bold ${isActive ? 'text-[#134B36]' : 'text-[#134B36]/60'}`}>{s.name}</span>
                <span className={`text-[8px] md:text-[9px] font-semibold tabular-nums ${isActive ? 'text-[#134B36]/70' : 'text-[#134B36]/35'}`}>{s.dims}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Çiçeklendirme (Fiyatlı) ── */}
      <div className="space-y-4 md:space-y-5">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#134B36]/60 flex items-center gap-2">
          <Flower size={14} /> Toprak Havuzu Çiçeklendirmesi
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {options.flowers.map(f => {
            const selected = Array.isArray(design.flowers) ? design.flowers.includes(f.id) : design.flowers === f.id;
            const isNone   = f.id === 'none';
            const atMax    = Array.isArray(design.flowers) && design.flowers.length >= 3;

            const handleClick = () => {
              if (isNone) { updateField('flowers', []); return; }
              const current = Array.isArray(design.flowers) ? design.flowers : [];
              if (selected) {
                updateField('flowers', current.filter(id => id !== f.id));
              } else if (!atMax) {
                updateField('flowers', [...current, f.id]);
              }
            };

            const isDisabled   = !isNone && !selected && atMax;
            const isNoneActive = isNone && (!Array.isArray(design.flowers) || design.flowers.length === 0);

            return (
              <button
                key={f.id} onClick={handleClick} disabled={isDisabled}
                className={`w-full p-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  isDisabled
                    ? 'opacity-30 cursor-not-allowed border-[#134B36]/10 bg-white'
                    : (selected || isNoneActive)
                      ? 'border-[#134B36] bg-[#134B36]/5 shadow-sm scale-105'
                      : 'border-[#134B36]/10 bg-white hover:border-[#134B36]/30 hover:bg-[#F8F6F0]'
                }`}
              >
                <span className={`text-[11px] font-bold ${(selected || isNoneActive) ? 'text-[#134B36]' : 'text-[#134B36]/70'}`}>{f.name}</span>
                <span className={`text-[9px] font-black ${(selected || isNoneActive) ? 'text-[#C9A84C]' : 'text-[#134B36]/40'}`}>
                  {f.price === 0 ? 'STANDART' : `+${f.price} ₺`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FİYAT ÖZETİ EKRANI (YENİ) ── */}
      <div className="mt-8 bg-[#134B36] rounded-2xl p-5 md:p-6 text-white shadow-lg flex items-center justify-between transition-all">
         <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-full"><Wallet size={20} className="text-[#C9A84C]" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Tasarım Farkı Toplamı</p>
              <p className="text-xs text-white/40 mt-0.5">Paket fiyatına eklenecektir.</p>
            </div>
         </div>
         <div className="text-right">
            <span className="text-2xl md:text-3xl font-black text-[#C9A84C]">
              {calculateExtraCost() === 0 ? '0 ₺' : `+${calculateExtraCost()} ₺`}
            </span>
         </div>
      </div>

    </div>
  );
};

export default DesignControls;